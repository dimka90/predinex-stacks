;; Liquidity Incentives Contract for Predinex
;; Manages on-chain tracking and distribution of incentive bonuses
;; Rewards early bettors, volume contributors, and loyal participants

;; Constants
(define-constant CONTRACT-OWNER tx-sender)
(define-constant ERR-UNAUTHORIZED (err u401))
(define-constant ERR-INVALID-AMOUNT (err u400))
(define-constant ERR-POOL-NOT-FOUND (err u404))
(define-constant ERR-INCENTIVE-NOT-FOUND (err u405))
(define-constant ERR-ALREADY-CLAIMED (err u410))
(define-constant ERR-INSUFFICIENT-BALANCE (err u424))
(define-constant ERR-INVALID-CONFIG (err u422))
(define-constant ERR-CLAIM-WINDOW-CLOSED (err u413))
(define-constant ERR-INVALID-POOL-STATE (err u414))
(define-constant ERR-INCENTIVE-DISABLED (err u415))
(define-constant ERR-MINIMUM-BET-NOT-MET (err u416))
(define-constant ERR-MAXIMUM-CLAIMS-EXCEEDED (err u417))

;; Incentive configuration constants
(define-constant EARLY-BIRD-BONUS-PERCENT u5) ;; 5% bonus for first bettors
(define-constant EARLY-BIRD-THRESHOLD u10) ;; First 10 bettors
(define-constant VOLUME-BONUS-PERCENT u2) ;; 2% bonus when threshold reached
(define-constant VOLUME-THRESHOLD u1000000) ;; 1000 STX in microstacks
(define-constant REFERRAL-BONUS-PERCENT u2) ;; 2% referral bonus
(define-constant LOYALTY-BONUS-PERCENT u5) ;; 0.5% per previous bet, max 5%
(define-constant MAX-BONUS-PER-BET u100000000) ;; Max 100 STX bonus
(define-constant CLAIM-WINDOW-BLOCKS u2016) ;; 2 weeks to claim incentives
(define-constant MINIMUM-BET-AMOUNT u1000000) ;; 1 STX minimum bet for incentives
(define-constant MAX-CLAIMS-PER-USER u50) ;; Maximum claims per user per pool
(define-constant BONUS-MULTIPLIER-CAP u10) ;; Maximum bonus multiplier
(define-constant STREAK-BONUS-THRESHOLD u5) ;; Consecutive bets for streak bonus

;; Data structures
(define-map incentive-configs
  { pool-id: uint }
  {
    early-bird-enabled: bool,
    volume-bonus-enabled: bool,
    referral-enabled: bool,
    loyalty-enabled: bool,
    total-incentives-allocated: uint,
    total-incentives-claimed: uint,
    created-at: uint
  }
)

(define-map user-incentives
  { pool-id: uint, user: principal, incentive-type: (string-ascii 32) }
  {
    amount: uint,
    status: (string-ascii 16),
    earned-at: uint,
    claimed-at: (optional uint),
    claim-deadline: uint,
    bonus-multiplier: uint,
    streak-count: uint,
    is-premium: bool
  }
)

(define-map pool-bet-tracking
  { pool-id: uint, user: principal }
  {
    bet-count: uint,
    total-bet-amount: uint,
    first-bet-at: uint,
    last-bet-at: uint,
    consecutive-bets: uint,
    highest-bet: uint,
    average-bet: uint,
    claims-count: uint
  }
)

(define-map pool-incentive-stats
  { pool-id: uint }
  {
    total-early-bird-bonuses: uint,
    total-volume-bonuses: uint,
    total-referral-bonuses: uint,
    total-loyalty-bonuses: uint,
    total-bettors-rewarded: uint,
    early-bird-count: uint,
    streak-bonuses-awarded: uint,
    premium-bonuses-awarded: uint,
    average-bonus-amount: uint,
    peak-activity-block: uint
  }
)

(define-map referral-tracking
  { referrer: principal, referred-user: principal, pool-id: uint }
  {
    referral-amount: uint,
    bonus-earned: uint,
    claimed: bool,
    referral-tier: uint,
    bonus-multiplier: uint,
    created-at: uint
  }
)

(define-map user-loyalty-history
  { user: principal }
  {
    total-pools-participated: uint,
    total-bets-placed: uint,
    total-incentives-earned: uint,
    total-incentives-claimed: uint
  }
)

;; Data variables
(define-data-var total-incentives-distributed uint u0)
(define-data-var total-incentives-claimed uint u0)
(define-data-var active-pools-with-incentives uint u0)
(define-data-var contract-balance uint u0)
(define-data-var total-unique-users uint u0)
(define-data-var highest-single-bonus uint u0)
(define-data-var contract-paused bool false)
(define-data-var emergency-mode bool false)

;; Initialize incentive configuration for a pool
(define-public (initialize-pool-incentives (pool-id uint))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-UNAUTHORIZED)
    (asserts! (not (var-get contract-paused)) ERR-INVALID-POOL-STATE)
    (asserts! (> pool-id u0) ERR-INVALID-AMOUNT)
    
    (map-insert incentive-configs
      { pool-id: pool-id }
      {
        early-bird-enabled: true,
        volume-bonus-enabled: true,
        referral-enabled: true,
        loyalty-enabled: true,
        total-incentives-allocated: u0,
        total-incentives-claimed: u0,
        created-at: burn-block-height
      }
    )
    
    (var-set active-pools-with-incentives (+ (var-get active-pools-with-incentives) u1))
    (ok pool-id)
  )
)

;; Record a bet and calculate early bird bonus
(define-public (record-bet-and-calculate-early-bird (pool-id uint) (user principal) (bet-amount uint))
  (let (
    (config (unwrap! (map-get? incentive-configs { pool-id: pool-id }) ERR-POOL-NOT-FOUND))
    (bet-tracking (default-to 
      { bet-count: u0, total-bet-amount: u0, first-bet-at: burn-block-height, last-bet-at: burn-block-height }
      (map-get? pool-bet-tracking { pool-id: pool-id, user: user })
    ))
    (current-bet-count (get bet-count bet-tracking))
    (new-bet-count (+ current-bet-count u1))
  )
    ;; Validate inputs
    (asserts! (get early-bird-enabled config) ERR-INVALID-CONFIG)
    (asserts! (> bet-amount u0) ERR-INVALID-AMOUNT)
    
    ;; Update bet tracking
    (map-set pool-bet-tracking
      { pool-id: pool-id, user: user }
      {
        bet-count: new-bet-count,
        total-bet-amount: (+ (get total-bet-amount bet-tracking) bet-amount),
        first-bet-at: (get first-bet-at bet-tracking),
        last-bet-at: burn-block-height
      }
    )
    
    ;; Calculate early bird bonus if eligible
    (if (and (get early-bird-enabled config) (<= new-bet-count EARLY-BIRD-THRESHOLD))
      (let ((early-bird-bonus (calculate-early-bird-bonus bet-amount)))
        (if (> early-bird-bonus u0)
          (begin
            (map-insert user-incentives
              { pool-id: pool-id, user: user, incentive-type: "early-bird" }
              {
                amount: early-bird-bonus,
                status: "pending",
                earned-at: burn-block-height,
                claimed-at: none,
                claim-deadline: (+ burn-block-height CLAIM-WINDOW-BLOCKS)
              }
            )
            (update-pool-stats pool-id "early-bird" early-bird-bonus)
            (ok early-bird-bonus)
          )
          (ok u0)
        )
      )
      (ok u0)
    )
  )
)

;; Calculate and award volume bonus when threshold is reached
(define-public (award-volume-bonus (pool-id uint) (user principal) (current-pool-volume uint))
  (let (
    (config (unwrap! (map-get? incentive-configs { pool-id: pool-id }) ERR-POOL-NOT-FOUND))
    (bet-tracking (unwrap! (map-get? pool-bet-tracking { pool-id: pool-id, user: user }) ERR-POOL-NOT-FOUND))
  )
    ;; Validate volume bonus is enabled and threshold reached
    (asserts! (get volume-bonus-enabled config) ERR-INVALID-CONFIG)
    (asserts! (>= current-pool-volume VOLUME-THRESHOLD) ERR-INVALID-AMOUNT)
    
    ;; Check if user already claimed volume bonus for this pool
    (asserts! (is-none (map-get? user-incentives { pool-id: pool-id, user: user, incentive-type: "volume" })) ERR-ALREADY-CLAIMED)
    
    (let ((volume-bonus (calculate-volume-bonus (get total-bet-amount bet-tracking))))
      (if (> volume-bonus u0)
        (begin
          (map-insert user-incentives
            { pool-id: pool-id, user: user, incentive-type: "volume" }
            {
              amount: volume-bonus,
              status: "pending",
              earned-at: burn-block-height,
              claimed-at: none,
              claim-deadline: (+ burn-block-height CLAIM-WINDOW-BLOCKS)
            }
          )
          (update-pool-stats pool-id "volume" volume-bonus)
          (ok volume-bonus)
        )
        (ok u0)
      )
    )
  )
)

;; Award referral bonus when referred user places bet
(define-public (award-referral-bonus (referrer principal) (referred-user principal) (pool-id uint) (referred-bet-amount uint))
  (let (
    (config (unwrap! (map-get? incentive-configs { pool-id: pool-id }) ERR-POOL-NOT-FOUND))
  )
    ;; Validate referral is enabled
    (asserts! (get referral-enabled config) ERR-INVALID-CONFIG)
    (asserts! (not (is-eq referrer referred-user)) ERR-INVALID-AMOUNT)
    (asserts! (> referred-bet-amount u0) ERR-INVALID-AMOUNT)
    
    (let ((referral-bonus (calculate-referral-bonus referred-bet-amount)))
      (if (> referral-bonus u0)
        (begin
          ;; Record referral tracking
          (map-insert referral-tracking
            { referrer: referrer, referred-user: referred-user, pool-id: pool-id }
            {
              referral-amount: referred-bet-amount,
              bonus-earned: referral-bonus,
              claimed: false
            }
          )
          
          ;; Award bonus to referrer
          (map-insert user-incentives
            { pool-id: pool-id, user: referrer, incentive-type: "referral" }
            {
              amount: referral-bonus,
              status: "pending",
              earned-at: burn-block-height,
              claimed-at: none,
              claim-deadline: (+ burn-block-height CLAIM-WINDOW-BLOCKS)
            }
          )
          
          (update-pool-stats pool-id "referral" referral-bonus)
          (ok referral-bonus)
        )
        (ok u0)
      )
    )
  )
)

;; Award loyalty bonus for repeat bettors
(define-public (award-loyalty-bonus (pool-id uint) (user principal) (current-bet-amount uint))
  (let (
    (config (unwrap! (map-get? incentive-configs { pool-id: pool-id }) ERR-POOL-NOT-FOUND))
    (loyalty-history (default-to 
      { total-pools-participated: u0, total-bets-placed: u0, total-incentives-earned: u0, total-incentives-claimed: u0 }
      (map-get? user-loyalty-history { user: user })
    ))
    (previous-bets (get total-bets-placed loyalty-history))
  )
    ;; Validate loyalty bonus is enabled
    (asserts! (get loyalty-enabled config) ERR-INVALID-CONFIG)
    (asserts! (> previous-bets u0) ERR-INVALID-AMOUNT)
    
    ;; Check if user already claimed loyalty bonus for this pool
    (asserts! (is-none (map-get? user-incentives { pool-id: pool-id, user: user, incentive-type: "loyalty" })) ERR-ALREADY-CLAIMED)
    
    (let ((loyalty-bonus (calculate-loyalty-bonus current-bet-amount previous-bets)))
      (if (> loyalty-bonus u0)
        (begin
          (map-insert user-incentives
            { pool-id: pool-id, user: user, incentive-type: "loyalty" }
            {
              amount: loyalty-bonus,
              status: "pending",
              earned-at: burn-block-height,
              claimed-at: none,
              claim-deadline: (+ burn-block-height CLAIM-WINDOW-BLOCKS)
            }
          )
          
          (update-pool-stats pool-id "loyalty" loyalty-bonus)
          (ok loyalty-bonus)
        )
        (ok u0)
      )
    )
  )
)

;; Claim pending incentive bonus
(define-public (claim-incentive (pool-id uint) (incentive-type (string-ascii 32)))
  (let (
    (incentive (unwrap! 
      (map-get? user-incentives { pool-id: pool-id, user: tx-sender, incentive-type: incentive-type })
      ERR-INCENTIVE-NOT-FOUND
    ))
  )
    ;; Validate incentive is pending
    (asserts! (is-eq (get status incentive) "pending") ERR-ALREADY-CLAIMED)
    
    ;; Validate claim window is still open
    (asserts! (< burn-block-height (get claim-deadline incentive)) ERR-CLAIM-WINDOW-CLOSED)
    
    ;; Validate contract has sufficient balance
    (asserts! (>= (var-get contract-balance) (get amount incentive)) ERR-INSUFFICIENT-BALANCE)
    
    (let ((claim-amount (get amount incentive)))
      ;; Update incentive status
      (map-set user-incentives
        { pool-id: pool-id, user: tx-sender, incentive-type: incentive-type }
        (merge incentive {
          status: "claimed",
          claimed-at: (some burn-block-height)
        })
      )
      
      ;; Update contract balance
      (var-set contract-balance (- (var-get contract-balance) claim-amount))
      
      ;; Update total claimed
      (var-set total-incentives-claimed (+ (var-get total-incentives-claimed) claim-amount))
      
      ;; Update pool stats
      (let ((config (unwrap! (map-get? incentive-configs { pool-id: pool-id }) ERR-POOL-NOT-FOUND)))
        (map-set incentive-configs
          { pool-id: pool-id }
          (merge config {
            total-incentives-claimed: (+ (get total-incentives-claimed config) claim-amount)
          })
        )
      )
      
      ;; Transfer STX to user (simulated - in production would use stx-transfer?)
      (ok claim-amount)
    )
  )
)

;; Deposit funds into contract for incentive distribution
(define-public (deposit-incentive-funds (amount uint))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-UNAUTHORIZED)
    (asserts! (> amount u0) ERR-INVALID-AMOUNT)
    
    ;; Update contract balance
    (var-set contract-balance (+ (var-get contract-balance) amount))
    
    (ok amount)
  )
)

;; Withdraw unclaimed incentives (owner only)
(define-public (withdraw-unclaimed-incentives (amount uint))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-UNAUTHORIZED)
    (asserts! (> amount u0) ERR-INVALID-AMOUNT)
    (asserts! (>= (var-get contract-balance) amount) ERR-INSUFFICIENT-BALANCE)
    
    ;; Update contract balance
    (var-set contract-balance (- (var-get contract-balance) amount))
    
    (ok amount)
  )
)

;; Helper functions

;; Calculate early bird bonus
(define-private (calculate-early-bird-bonus (bet-amount uint))
  (let ((bonus (/ (* bet-amount EARLY-BIRD-BONUS-PERCENT) u100)))
    (if (> bonus MAX-BONUS-PER-BET)
      MAX-BONUS-PER-BET
      bonus
    )
  )
)

;; Calculate volume bonus
(define-private (calculate-volume-bonus (user-bet-amount uint))
  (let ((bonus (/ (* user-bet-amount VOLUME-BONUS-PERCENT) u100)))
    (if (> bonus MAX-BONUS-PER-BET)
      MAX-BONUS-PER-BET
      bonus
    )
  )
)

;; Calculate referral bonus
(define-private (calculate-referral-bonus (referred-bet-amount uint))
  (let ((bonus (/ (* referred-bet-amount REFERRAL-BONUS-PERCENT) u100)))
    (if (> bonus MAX-BONUS-PER-BET)
      MAX-BONUS-PER-BET
      bonus
    )
  )
)

;; Calculate loyalty bonus (0.5% per previous bet, max 5%)
(define-private (calculate-loyalty-bonus (current-bet-amount uint) (previous-bets uint))
  (let (
    (bonus-percent (if (> previous-bets u10) u5 (/ (* previous-bets u5) u10)))
    (bonus (/ (* current-bet-amount bonus-percent) u100))
  )
    (if (> bonus MAX-BONUS-PER-BET)
      MAX-BONUS-PER-BET
      bonus
    )
  )
)

;; Update pool statistics
(define-private (update-pool-stats (pool-id uint) (bonus-type (string-ascii 32)) (bonus-amount uint))
  (let (
    (stats (default-to 
      { total-early-bird-bonuses: u0, total-volume-bonuses: u0, total-referral-bonuses: u0, total-loyalty-bonuses: u0, total-bettors-rewarded: u0, early-bird-count: u0 }
      (map-get? pool-incentive-stats { pool-id: pool-id })
    ))
  )
    (if (is-eq bonus-type "early-bird")
      (map-set pool-incentive-stats
        { pool-id: pool-id }
        (merge stats {
          total-early-bird-bonuses: (+ (get total-early-bird-bonuses stats) bonus-amount),
          early-bird-count: (+ (get early-bird-count stats) u1)
        })
      )
      (if (is-eq bonus-type "volume")
        (map-set pool-incentive-stats
          { pool-id: pool-id }
          (merge stats {
            total-volume-bonuses: (+ (get total-volume-bonuses stats) bonus-amount)
          })
        )
        (if (is-eq bonus-type "referral")
          (map-set pool-incentive-stats
            { pool-id: pool-id }
            (merge stats {
              total-referral-bonuses: (+ (get total-referral-bonuses stats) bonus-amount)
            })
          )
          (map-set pool-incentive-stats
            { pool-id: pool-id }
            (merge stats {
              total-loyalty-bonuses: (+ (get total-loyalty-bonuses stats) bonus-amount)
            })
          )
        )
      )
    )
  )
)

;; Read-only functions

;; Get incentive configuration for a pool
(define-read-only (get-pool-incentive-config (pool-id uint))
  (map-get? incentive-configs { pool-id: pool-id })
)

;; Get user's pending incentive
(define-read-only (get-user-incentive (pool-id uint) (user principal) (incentive-type (string-ascii 32)))
  (map-get? user-incentives { pool-id: pool-id, user: user, incentive-type: incentive-type })
)

;; Get pool incentive statistics
(define-read-only (get-pool-incentive-stats (pool-id uint))
  (map-get? pool-incentive-stats { pool-id: pool-id })
)

;; Get user's bet tracking
(define-read-only (get-user-bet-tracking (pool-id uint) (user principal))
  (map-get? pool-bet-tracking { pool-id: pool-id, user: user })
)

;; Get user's loyalty history
(define-read-only (get-user-loyalty-history (user principal))
  (map-get? user-loyalty-history { user: user })
)

;; Get total incentives distributed
(define-read-only (get-total-incentives-distributed)
  (var-get total-incentives-distributed)
)

;; Get total incentives claimed
(define-read-only (get-total-incentives-claimed)
  (var-get total-incentives-claimed)
)

;; Get contract balance
(define-read-only (get-contract-balance)
  (var-get contract-balance)
)

;; Get active pools with incentives
(define-read-only (get-active-pools-count)
  (var-get active-pools-with-incentives)
)

;; Calculate total pending incentives for a user across all types
(define-read-only (get-user-total-pending-incentives (pool-id uint) (user principal))
  (let (
    (early-bird (default-to u0 (match (map-get? user-incentives { pool-id: pool-id, user: user, incentive-type: "early-bird" })
      incentive (if (is-eq (get status incentive) "pending") (get amount incentive) u0)
      u0
    )))
    (volume (default-to u0 (match (map-get? user-incentives { pool-id: pool-id, user: user, incentive-type: "volume" })
      incentive (if (is-eq (get status incentive) "pending") (get amount incentive) u0)
      u0
    )))
    (referral (default-to u0 (match (map-get? user-incentives { pool-id: pool-id, user: user, incentive-type: "referral" })
      incentive (if (is-eq (get status incentive) "pending") (get amount incentive) u0)
      u0
    )))
    (loyalty (default-to u0 (match (map-get? user-incentives { pool-id: pool-id, user: user, incentive-type: "loyalty" })
      incentive (if (is-eq (get status incentive) "pending") (get amount incentive) u0)
      u0
    )))
  )
    (+ early-bird volume referral loyalty)
  )
)

;; [ENHANCEMENT] Pool incentive configuration validation
(define-read-only (validate-pool-incentive-config (pool-id uint))
  (match (map-get? incentive-configs { pool-id: pool-id })
    config (ok {
      is-configured: true,
      early-bird-enabled: (get early-bird-enabled config),
      volume-bonus-enabled: (get volume-bonus-enabled config),
      referral-enabled: (get referral-enabled config),
      loyalty-enabled: (get loyalty-enabled config)
    })
    (err ERR-POOL-NOT-FOUND)
  )
)

;; [ENHANCEMENT] Check if user is eligible for early bird bonus
(define-read-only (is-early-bird-eligible (pool-id uint) (user principal))
  (match (map-get? pool-bet-tracking { pool-id: pool-id, user: user })
    bet-tracking (let ((bet-count (get bet-count bet-tracking)))
      (and (<= bet-count EARLY-BIRD-THRESHOLD) (> bet-count u0))
    )
    false
  )
)

;; [ENHANCEMENT] Check if user qualifies for volume bonus
(define-read-only (is-volume-bonus-eligible (pool-id uint) (user principal) (pool-volume uint))
  (and
    (>= pool-volume VOLUME-THRESHOLD)
    (is-none (map-get? user-incentives { pool-id: pool-id, user: user, incentive-type: "volume" }))
  )
)

;; [ENHANCEMENT] Check if referral bonus can be awarded
(define-read-only (can-award-referral-bonus (referrer principal) (referred-user principal) (pool-id uint))
  (and
    (not (is-eq referrer referred-user))
    (is-none (map-get? referral-tracking { referrer: referrer, referred-user: referred-user, pool-id: pool-id }))
  )
)

;; [ENHANCEMENT] Check if user qualifies for loyalty bonus
(define-read-only (is-loyalty-bonus-eligible (pool-id uint) (user principal))
  (match (map-get? user-loyalty-history { user: user })
    history (> (get total-bets-placed history) u0)
    false
  )
)

;; [ENHANCEMENT] Check if incentive claim window is still open
(define-read-only (is-claim-window-open (pool-id uint) (user principal) (incentive-type (string-ascii 32)))
  (match (map-get? user-incentives { pool-id: pool-id, user: user, incentive-type: incentive-type })
    incentive (< burn-block-height (get claim-deadline incentive))
    false
  )
)

;; [ENHANCEMENT] Calculate total incentives allocated for a pool
(define-read-only (get-pool-total-incentives-allocated (pool-id uint))
  (match (map-get? incentive-configs { pool-id: pool-id })
    config (get total-incentives-allocated config)
    u0
  )
)

;; [ENHANCEMENT] Calculate incentive claim rate for a pool
(define-read-only (get-pool-claim-rate (pool-id uint))
  (match (map-get? incentive-configs { pool-id: pool-id })
    config (let (
      (allocated (get total-incentives-allocated config))
      (claimed (get total-incentives-claimed config))
    )
      (if (> allocated u0)
        (/ (* claimed u100) allocated)
        u0
      )
    )
    u0
  )
)

;; [ENHANCEMENT] Get comprehensive incentive summary for user
(define-read-only (get-user-incentive-summary (pool-id uint) (user principal))
  (let (
    (early-bird (map-get? user-incentives { pool-id: pool-id, user: user, incentive-type: "early-bird" }))
    (volume (map-get? user-incentives { pool-id: pool-id, user: user, incentive-type: "volume" }))
    (referral (map-get? user-incentives { pool-id: pool-id, user: user, incentive-type: "referral" }))
    (loyalty (map-get? user-incentives { pool-id: pool-id, user: user, incentive-type: "loyalty" }))
  )
    {
      has-early-bird: (is-some early-bird),
      has-volume: (is-some volume),
      has-referral: (is-some referral),
      has-loyalty: (is-some loyalty),
      total-pending: (get-user-total-pending-incentives pool-id user)
    }
  )
)

;; [ENHANCEMENT] Get detailed breakdown of incentives by type for pool
(define-read-only (get-pool-incentive-breakdown (pool-id uint))
  (match (map-get? pool-incentive-stats { pool-id: pool-id })
    stats {
      early-bird-total: (get total-early-bird-bonuses stats),
      volume-total: (get total-volume-bonuses stats),
      referral-total: (get total-referral-bonuses stats),
      loyalty-total: (get total-loyalty-bonuses stats),
      total-bettors-rewarded: (get total-bettors-rewarded stats),
      early-bird-count: (get early-bird-count stats)
    }
    {
      early-bird-total: u0,
      volume-total: u0,
      referral-total: u0,
      loyalty-total: u0,
      total-bettors-rewarded: u0,
      early-bird-count: u0
    }
  )
)

;; [ENHANCEMENT] Get referral tracking information
(define-read-only (get-referral-info (referrer principal) (referred-user principal) (pool-id uint))
  (map-get? referral-tracking { referrer: referrer, referred-user: referred-user, pool-id: pool-id })
)

;; [ENHANCEMENT] Count total successful referrals for a user
(define-read-only (get-user-referral-count (referrer principal))
  (let ((loyalty-history (map-get? user-loyalty-history { user: referrer })))
    (match loyalty-history
      history (get total-pools-participated history)
      u0
    )
  )
)

;; [ENHANCEMENT] Check if incentive has expired
(define-read-only (has-incentive-expired (pool-id uint) (user principal) (incentive-type (string-ascii 32)))
  (match (map-get? user-incentives { pool-id: pool-id, user: user, incentive-type: incentive-type })
    incentive (>= burn-block-height (get claim-deadline incentive))
    false
  )
)

;; [ENHANCEMENT] Get contract health metrics
(define-read-only (get-contract-health)
  {
    total-distributed: (var-get total-incentives-distributed),
    total-claimed: (var-get total-incentives-claimed),
    current-balance: (var-get contract-balance),
    active-pools: (var-get active-pools-with-incentives),
    available-for-claims: (var-get contract-balance)
  }
)

;; [ENHANCEMENT] Calculate incentive distribution efficiency
(define-read-only (get-incentive-efficiency)
  (let (
    (distributed (var-get total-incentives-distributed))
    (claimed (var-get total-incentives-claimed))
  )
    (if (> distributed u0)
      (/ (* claimed u100) distributed)
      u0
    )
  )
)

;; [ENHANCEMENT] Get pool participation metrics
(define-read-only (get-pool-participation-rate (pool-id uint))
  (match (map-get? pool-incentive-stats { pool-id: pool-id })
    stats {
      total-rewarded: (get total-bettors-rewarded stats),
      early-bird-count: (get early-bird-count stats),
      participation-score: (if (> (get total-bettors-rewarded stats) u0) u100 u0)
    }
    {
      total-rewarded: u0,
      early-bird-count: u0,
      participation-score: u0
    }
  )
)

;; [ENHANCEMENT] Get distribution of bonuses by type
(define-read-only (get-bonus-type-distribution (pool-id uint))
  (match (map-get? pool-incentive-stats { pool-id: pool-id })
    stats (let (
      (total (+ (+ (+ (get total-early-bird-bonuses stats) (get total-volume-bonuses stats)) (get total-referral-bonuses stats)) (get total-loyalty-bonuses stats)))
    )
      {
        early-bird-percent: (if (> total u0) (/ (* (get total-early-bird-bonuses stats) u100) total) u0),
        volume-percent: (if (> total u0) (/ (* (get total-volume-bonuses stats) u100) total) u0),
        referral-percent: (if (> total u0) (/ (* (get total-referral-bonuses stats) u100) total) u0),
        loyalty-percent: (if (> total u0) (/ (* (get total-loyalty-bonuses stats) u100) total) u0)
      }
    )
    {
      early-bird-percent: u0,
      volume-percent: u0,
      referral-percent: u0,
      loyalty-percent: u0
    }
  )
)

;; [ENHANCEMENT] Get user's complete incentive history
(define-read-only (get-user-incentive-history (user principal))
  (match (map-get? user-loyalty-history { user: user })
    history {
      pools-participated: (get total-pools-participated history),
      total-bets: (get total-bets-placed history),
      total-earned: (get total-incentives-earned history),
      total-claimed: (get total-incentives-claimed history),
      pending-amount: (- (get total-incentives-earned history) (get total-incentives-claimed history))
    }
    {
      pools-participated: u0,
      total-bets: u0,
      total-earned: u0,
      total-claimed: u0,
      pending-amount: u0
    }
  )
)

;; [ENHANCEMENT] Calculate return on investment for incentives
(define-read-only (calculate-incentive-roi (user-total-bet uint) (total-incentives-earned uint))
  (if (> user-total-bet u0)
    (/ (* total-incentives-earned u100) user-total-bet)
    u0
  )
)

;; [ENHANCEMENT] Get pool incentive utilization rate
(define-read-only (get-pool-incentive-utilization (pool-id uint))
  (match (map-get? incentive-configs { pool-id: pool-id })
    config (let (
      (allocated (get total-incentives-allocated config))
      (claimed (get total-incentives-claimed config))
    )
      {
        allocated: allocated,
        claimed: claimed,
        remaining: (if (>= allocated claimed) (- allocated claimed) u0),
        utilization-percent: (if (> allocated u0) (/ (* claimed u100) allocated) u0)
      }
    )
    {
      allocated: u0,
      claimed: u0,
      remaining: u0,
      utilization-percent: u0
    }
  )
)

;; [ENHANCEMENT] Validate bonus amount against cap
(define-read-only (is-bonus-within-cap (bonus-amount uint))
  (<= bonus-amount MAX-BONUS-PER-BET)
)

;; [ENHANCEMENT] Audit incentive configuration for compliance
(define-read-only (audit-pool-incentive-config (pool-id uint))
  (match (map-get? incentive-configs { pool-id: pool-id })
    config {
      pool-id: pool-id,
      all-incentives-enabled: (and (and (get early-bird-enabled config) (get volume-bonus-enabled config)) (and (get referral-enabled config) (get loyalty-enabled config))),
      total-allocated: (get total-incentives-allocated config),
      total-claimed: (get total-incentives-claimed config),
      config-created-at: (get created-at config)
    }
    {
      pool-id: pool-id,
      all-incentives-enabled: false,
      total-allocated: u0,
      total-claimed: u0,
      config-created-at: u0
    }
  )
)

;; [ENHANCEMENT] Generate system-wide incentive report
(define-read-only (get-system-incentive-report)
  {
    total-distributed: (var-get total-incentives-distributed),
    total-claimed: (var-get total-incentives-claimed),
    contract-balance: (var-get contract-balance),
    active-pools: (var-get active-pools-with-incentives),
    system-efficiency: (get-incentive-efficiency),
    contract-health: (get-contract-health)
  }
)
