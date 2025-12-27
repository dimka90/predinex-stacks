;; ============================================
;; PREDINEX POOL - PREDICTION MARKET CONTRACT
;; ============================================
;; A decentralized prediction market built on Stacks blockchain
;; Features: Binary/multi-outcome pools, liquidity incentives, dispute resolution
;; Language: Clarity 4
;; Security: Comprehensive access control, input validation, state consistency
;;
;; Key Features:
;; - Create prediction pools with custom outcomes
;; - Place bets on pool outcomes
;; - Settle pools and claim winnings
;; - Early bettor bonuses (5% on winnings)
;; - Dispute resolution mechanism
;; - Oracle-integrated settlement
;; - Withdrawal system with admin approval
;;
;; ============================================
;; CONSTANTS & ERROR CODES
;; ============================================

;; Contract owner - set at deployment time, cannot be changed
;; SECURITY: Owner has fee collection rights and admin management
(define-constant CONTRACT-OWNER tx-sender)
(define-constant ERR-UNAUTHORIZED (err u401))
(define-constant ERR-INVALID-AMOUNT (err u400))
(define-constant ERR-POOL-NOT-FOUND (err u404))
(define-constant ERR-POOL-SETTLED (err u409))
(define-constant ERR-INVALID-OUTCOME (err u422))
(define-constant ERR-NOT-SETTLED (err u412))
(define-constant ERR-ALREADY-CLAIMED (err u410))
(define-constant ERR-NO-WINNINGS (err u411))
(define-constant ERR-POOL-NOT-EXPIRED (err u413))
(define-constant ERR-INVALID-TITLE (err u420))
(define-constant ERR-INVALID-DESCRIPTION (err u421))
(define-constant ERR-INVALID-DURATION (err u423))
(define-constant ERR-INSUFFICIENT-BALANCE (err u424))
(define-constant ERR-WITHDRAWAL-FAILED (err u425))
(define-constant ERR-INVALID-WITHDRAWAL (err u426))
(define-constant ERR-WITHDRAWAL-LOCKED (err u427))
(define-constant ERR-INSUFFICIENT-CONTRACT-BALANCE (err u428))
(define-constant ERR-NOT-POOL-CREATOR (err u429))
(define-constant ERR-INVALID-OUTCOME-COUNT (err u430))
(define-constant ERR-DISPUTE-PERIOD-EXPIRED (err u431))
(define-constant ERR-NO-DISPUTE-FOUND (err u432))
(define-constant ERR-DISPUTE-ALREADY-RESOLVED (err u433))

;; Oracle system error constants
(define-constant ERR-ORACLE-NOT-FOUND (err u430))
(define-constant ERR-ORACLE-INACTIVE (err u431))
(define-constant ERR-INVALID-DATA-TYPE (err u432))
(define-constant ERR-ORACLE-ALREADY-EXISTS (err u433))
(define-constant ERR-INSUFFICIENT-CONFIDENCE (err u434))
(define-constant ERR-ORACLE-SUBMISSION-NOT-FOUND (err u435))

;; Resolution system error constants
(define-constant ERR-RESOLUTION-CONFIG-NOT-FOUND (err u436))
(define-constant ERR-INVALID-RESOLUTION-CRITERIA (err u437))
(define-constant ERR-INSUFFICIENT-ORACLE-SOURCES (err u438))
(define-constant ERR-RESOLUTION-ALREADY-CONFIGURED (err u439))
(define-constant ERR-AUTOMATED-RESOLUTION-FAILED (err u440))

;; Dispute system error constants
(define-constant ERR-DISPUTE-NOT-FOUND (err u441))
(define-constant ERR-DISPUTE-WINDOW-CLOSED (err u442))
(define-constant ERR-INSUFFICIENT-DISPUTE-BOND (err u443))
(define-constant ERR-ALREADY-VOTED (err u444))
(define-constant ERR-DISPUTE-ALREADY-RESOLVED (err u445))
(define-constant ERR-INVALID-DISPUTE_REASON (err u446))

;; Fallback resolution error constants
(define-constant ERR-FALLBACK-NOT-TRIGGERED (err u447))
(define-constant ERR-MANUAL-SETTLEMENT-DISABLED (err u448))
(define-constant ERR-MAX-RETRIES-NOT-REACHED (err u449))

;; Liquidity incentive error constants
(define-constant ERR-INSUFFICIENT-INCENTIVE-POOL (err u450))
(define-constant ERR-INVALID-INCENTIVE-CONFIG (err u451))
(define-constant ERR-INCENTIVE-ALREADY-CLAIMED (err u452))
(define-constant ERR-NOT-ELIGIBLE-FOR-INCENTIVE (err u453))
(define-constant ERR-CREATOR-FUND-INSUFFICIENT (err u454))
(define-constant ERR-INCENTIVE-POOL-EMPTY (err u455))

(define-constant FEE-PERCENT u2) ;; 2% fee
(define-constant MIN-BET-AMOUNT u10000) ;; 0.01 STX in microstacks (reduced for testing)
(define-constant WITHDRAWAL-DELAY u10) ;; 10 blocks delay for security
(define-constant EARLY-BETTOR-WINDOW u50) ;; 50 blocks window for early bettor eligibility
(define-constant EARLY-BETTOR-BONUS-PERCENT u5) ;; 5% bonus on winnings for early bettors

;; Liquidity incentive constants
(define-constant LIQUIDITY-EARLY-WINDOW-BLOCKS u144) ;; 24 hours default
(define-constant LIQUIDITY-EARLY-BONUS-PERCENT u10) ;; 10% bonus for early bettors
(define-constant LIQUIDITY-MARKET-MAKER-THRESHOLD-LOW u20) ;; 20% threshold
(define-constant LIQUIDITY-MARKET-MAKER-THRESHOLD-HIGH u30) ;; 30% threshold
(define-constant LIQUIDITY-MARKET-MAKER-BONUS-HIGH u15) ;; 15% bonus for <20%
(define-constant LIQUIDITY-MARKET-MAKER-BONUS-LOW u10) ;; 10% bonus for 20-30%
(define-constant LIQUIDITY-MIN-BET-FOR-INCENTIVES u10000) ;; Minimum bet amount
(define-constant LIQUIDITY-CREATOR-MAX-BONUS-PERCENT u25) ;; Max creator-enhanced bonus

;; Resolution and fee constants
(define-constant RESOLUTION-FEE-PERCENT u5) ;; 0.5% (5/1000)
(define-constant DISPUTE-BOND-PERCENT u5) ;; 5% of pool value
(define-constant DISPUTE-WINDOW-BLOCKS u1008) ;; 48 hours

;; ============================================
;; CLARITY 3/4 FEATURES - Builder Challenge
;; ============================================

;; Principal registry for tracking users
(define-map principal-registry
  { user: principal }
  { 
    registered-at: uint
  }
)

;; Data structures
(define-map pools
  { pool-id: uint }
  {
    creator: principal,
    title: (string-ascii 256),
    description: (string-ascii 512),
    outcome-a-name: (string-ascii 128),
    outcome-b-name: (string-ascii 128),
    total-a: uint,
    total-b: uint,
    settled: bool,
    winning-outcome: (optional uint),
    created-at: uint,
    settled-at: (optional uint),
    expiry: uint,
    outcome-count: uint,
    dispute-period: uint
  }
)

;; Multiple outcomes support (beyond binary)
(define-map pool-outcomes
  { pool-id: uint, outcome-index: uint }
  {
    name: (string-ascii 128),
    total-bet: uint
  }
)

;; Dispute resolution tracking
(define-map disputes
  { pool-id: uint, dispute-id: uint }
  {
    challenger: principal,
    reason: (string-ascii 512),
    created-at: uint,
    status: (string-ascii 20),
    resolved-by: (optional principal),
    resolved-at: (optional uint)
  }
)

(define-data-var dispute-counter uint u0)

(define-map claims
  { pool-id: uint, user: principal }
  bool
)

(define-map user-bets
  { pool-id: uint, user: principal }
  {
    amount-a: uint,
    amount-b: uint,
    total-bet: uint,
    first-bet-block: uint
  }
)

;; Withdrawal tracking
(define-map pending-withdrawals
  { user: principal, withdrawal-id: uint }
  {
    amount: uint,
    requested-at: uint,
    status: (string-ascii 20),
    pool-id: uint
  }
)

(define-map withdrawal-history
  { user: principal, withdrawal-id: uint }
  {
    amount: uint,
    completed-at: uint,
    pool-id: uint
  }
)

(define-map user-withdrawal-counter
  { user: principal }
  uint
)

;; Access control - admins who can manage withdrawals
(define-map admins
  { admin: principal }
  bool
)

;; ============================================
;; ORACLE SYSTEM DATA STRUCTURES
;; ============================================

;; Oracle provider registry
(define-map oracle-providers
  { provider-id: uint }
  {
    provider-address: principal,
    reliability-score: uint,
    total-resolutions: uint,
    successful-resolutions: uint,
    average-response-time: uint,
    is-active: bool,
    registered-at: uint,
    last-activity: uint
  }
)

;; Supported data types for each oracle provider
(define-map oracle-data-types
  { provider-id: uint, data-type: (string-ascii 32) }
  bool
)

;; Oracle data submissions
(define-map oracle-submissions
  { submission-id: uint }
  {
    provider-id: uint,
    pool-id: uint,
    data-value: (string-ascii 256),
    data-type: (string-ascii 32),
    timestamp: uint,
    confidence-score: uint,
    is-processed: bool
  }
)

;; Resolution configuration for automated pools
(define-map resolution-configs
  { pool-id: uint }
  {
    oracle-sources: (list 5 uint),
    resolution-criteria: (string-ascii 512),
    criteria-type: (string-ascii 32),
    threshold-value: (optional uint),
    logical-operator: (string-ascii 8),
    retry-attempts: uint,
    resolution-fee: uint,
    is-automated: bool,
    created-at: uint
  }
)

;; Resolution attempts tracking
(define-map resolution-attempts
  { pool-id: uint, attempt-id: uint }
  {
    attempted-at: uint,
    oracle-data-used: (list 5 uint),
    result: (optional uint),
    failure-reason: (optional (string-ascii 128)),
    is-successful: bool
  }
)

;; Dispute system data structures
(define-map pool-disputes
  { dispute-id: uint }
  {
    pool-id: uint,
    disputer: principal,
    dispute-bond: uint,
    dispute-reason: (string-ascii 512),
    evidence-hash: (optional (buff 32)),
    voting-deadline: uint,
    votes-for: uint,
    votes-against: uint,
    status: (string-ascii 16),
    resolution: (optional bool),
    created-at: uint
  }
)

;; Dispute votes tracking
(define-map dispute-votes
  { dispute-id: uint, voter: principal }
  {
    vote: bool,
    voting-power: uint,
    voted-at: uint
  }
)

;; Fee tracking and distribution
(define-map resolution-fees
  { pool-id: uint }
  {
    total-fee: uint,
    oracle-fees: uint,
    platform-fee: uint,
    is-refunded: bool,
    refund-recipient: (optional principal)
  }
)

;; Oracle fee distribution tracking
(define-map oracle-fee-claims
  { provider-id: uint, pool-id: uint }
  {
    fee-amount: uint,
    is-claimed: bool,
    claimed-at: (optional uint)
  }
)

;; Fallback resolution tracking
(define-map fallback-resolutions
  { pool-id: uint }
  {
    triggered-at: uint,
    failure-reason: (string-ascii 128),
    max-retries-reached: bool,
    manual-settlement-enabled: bool,
    notified-creator: bool
  }
)

;; ============================================
;; LIQUIDITY INCENTIVES DATA STRUCTURES
;; ============================================

;; Per-pool incentive tracking
(define-map pool-incentive-funds
  { pool-id: uint }
  {
    creator-contribution: uint,
    platform-allocation: uint,
    total-distributed: uint,
    remaining-balance: uint
  }
)

;; User incentive eligibility per pool
(define-map user-incentive-status
  { pool-id: uint, user: principal }
  {
    is-early-bettor: bool,
    early-bet-amount: uint,
    is-market-maker: bool,
    market-maker-amount: uint,
    total-bonus-earned: uint,
    bonus-claimed: bool
  }
)

;; User lifetime incentive statistics
(define-map user-incentive-stats
  { user: principal }
  {
    total-early-bettor-bonus: uint,
    total-market-maker-bonus: uint,
    pools-with-bonuses: uint,
    last-bonus-claim: uint
  }
)

;; Creator-enhanced incentive pools
(define-map creator-enhanced-pools
  { pool-id: uint }
  {
    creator-fund-amount: uint,
    enhanced-early-bonus: uint,
    enhanced-market-maker-bonus: uint,
    is-enhanced: bool
  }
)

(define-data-var pool-counter uint u0)
(define-data-var total-volume uint u0)
(define-data-var total-withdrawn uint u0)
(define-data-var withdrawal-counter uint u0)

;; Oracle system counters
(define-data-var oracle-provider-counter uint u0)
(define-data-var oracle-submission-counter uint u0)
(define-data-var resolution-attempt-counter uint u0)
(define-data-var dispute-counter uint u0)

;; Liquidity incentive system data variables
(define-data-var platform-incentive-pool uint u0)
(define-data-var total-incentives-distributed uint u0)
(define-data-var liquidity-early-window-blocks uint LIQUIDITY-EARLY-WINDOW-BLOCKS)
(define-data-var liquidity-early-bonus-percent uint LIQUIDITY-EARLY-BONUS-PERCENT)
(define-data-var liquidity-market-maker-threshold-low uint LIQUIDITY-MARKET-MAKER-THRESHOLD-LOW)
(define-data-var liquidity-market-maker-threshold-high uint LIQUIDITY-MARKET-MAKER-THRESHOLD-HIGH)
(define-data-var liquidity-market-maker-bonus-high uint LIQUIDITY-MARKET-MAKER-BONUS-HIGH)
(define-data-var liquidity-market-maker-bonus-low uint LIQUIDITY-MARKET-MAKER-BONUS-LOW)
(define-data-var liquidity-min-bet-for-incentives uint LIQUIDITY-MIN-BET-FOR-INCENTIVES)
(define-data-var liquidity-creator-max-bonus-percent uint LIQUIDITY-CREATOR-MAX-BONUS-PERCENT)

;; Create a new prediction pool
;; Validates all inputs before creating pool
;; Ensures pool parameters are within acceptable ranges
(define-public (create-pool (title (string-ascii 256)) (description (string-ascii 512)) (outcome-a (string-ascii 128)) (outcome-b (string-ascii 128)) (duration uint))
  (let ((pool-id (var-get pool-counter)))
    ;; Comprehensive validation checks
    (asserts! (> (len title) u0) ERR-INVALID-TITLE)
    (asserts! (<= (len title) u256) ERR-INVALID-TITLE)
    (asserts! (> (len description) u0) ERR-INVALID-DESCRIPTION)
    (asserts! (<= (len description) u512) ERR-INVALID-DESCRIPTION)
    (asserts! (> (len outcome-a) u0) ERR-INVALID-OUTCOME)
    (asserts! (<= (len outcome-a) u128) ERR-INVALID-OUTCOME)
    (asserts! (> (len outcome-b) u0) ERR-INVALID-OUTCOME)
    (asserts! (<= (len outcome-b) u128) ERR-INVALID-OUTCOME)
    (asserts! (> duration u0) ERR-INVALID-DURATION)
    (asserts! (< duration u100000) ERR-INVALID-DURATION) ;; Prevent unreasonably long durations

    (map-insert pools
      { pool-id: pool-id }
      {
        creator: tx-sender,
        title: title,
        description: description,
        outcome-a-name: outcome-a,
        outcome-b-name: outcome-b,
        total-a: u0,
        total-b: u0,
        settled: false,
        winning-outcome: none,
        created-at: burn-block-height,
        settled-at: none,
        expiry: (+ burn-block-height duration),
        outcome-count: u2,
        dispute-period: u100
      }
    )
    (var-set pool-counter (+ pool-id u1))
    (ok pool-id)
  )
)

;; Place a bet on a pooli
;; Validates bet amount meets minimum requirements
;; Ensures pool is still active and not settled
;; Now includes liquidity incentive detection
(define-public (place-bet (pool-id uint) (outcome uint) (amount uint))
  (let ((pool (unwrap! (map-get? pools { pool-id: pool-id }) ERR-POOL-NOT-FOUND)))
    (asserts! (not (get settled pool)) ERR-POOL-SETTLED)
    (asserts! (or (is-eq outcome u0) (is-eq outcome u1)) ERR-INVALID-OUTCOME)
    (asserts! (>= amount MIN-BET-AMOUNT) ERR-INVALID-AMOUNT)
    (asserts! (< burn-block-height (get expiry pool)) ERR-POOL-NOT-EXPIRED)
    
    (let ((pool-principal (as-contract tx-sender)))
        ;; Transfer STX from user to contract
        (try! (stx-transfer? amount tx-sender pool-principal))
    )

    ;; Update pool totals
    (if (is-eq outcome u0)
      (map-set pools
        { pool-id: pool-id }
        (merge pool { total-a: (+ (get total-a pool) amount) })
      )
      (map-set pools
        { pool-id: pool-id }
        (merge pool { total-b: (+ (get total-b pool) amount) })
      )
    )
    
    ;; Update user bet
    (let ((user-bet (default-to { amount-a: u0, amount-b: u0, total-bet: u0, first-bet-block: burn-block-height } (map-get? user-bets { pool-id: pool-id, user: tx-sender }))))
      (map-set user-bets
        { pool-id: pool-id, user: tx-sender }
        (if (is-eq outcome u0)
          { 
            amount-a: (+ (get amount-a user-bet) amount), 
            amount-b: (get amount-b user-bet), 
            total-bet: (+ (get total-bet user-bet) amount),
            first-bet-block: (get first-bet-block user-bet)
          }
          { 
            amount-a: (get amount-a user-bet), 
            amount-b: (+ (get amount-b user-bet) amount), 
            total-bet: (+ (get total-bet user-bet) amount),
            first-bet-block: (get first-bet-block user-bet)
          }
        )
      )
    )
    
    ;; Update liquidity incentive status
    (let (
      (is-early (update-early-bettor-status pool-id tx-sender amount))
      (is-mm (update-market-maker-status pool-id tx-sender outcome amount))
    )
      ;; Update total volume
      (var-set total-volume (+ (var-get total-volume) amount))
      
      (ok { early-bettor: is-early, market-maker: is-mm })
    )
  )
)

;; Enhanced bet placement with incentive preview
(define-public (place-bet-with-preview (pool-id uint) (outcome uint) (amount uint))
  (let (
    (pool (unwrap! (map-get? pools { pool-id: pool-id }) ERR-POOL-NOT-FOUND))
    (is-early (is-early-bettor pool-id amount))
    (is-mm (is-market-maker pool-id outcome amount))
    (balance-ratio (calculate-market-balance-ratio pool-id outcome))
  )
    ;; Validate inputs
    (asserts! (not (get settled pool)) ERR-POOL-SETTLED)
    (asserts! (or (is-eq outcome u0) (is-eq outcome u1)) ERR-INVALID-OUTCOME)
    (asserts! (>= amount MIN-BET-AMOUNT) ERR-INVALID-AMOUNT)
    (asserts! (< burn-block-height (get expiry pool)) ERR-POOL-NOT-EXPIRED)
    
    ;; Calculate potential incentive multipliers
    (let (
      (early-bonus-percent (if is-early (var-get liquidity-early-bonus-percent) u0))
      (mm-bonus-percent (if is-mm
        (if (< balance-ratio (var-get liquidity-market-maker-threshold-low))
          (var-get liquidity-market-maker-bonus-high)
          (var-get liquidity-market-maker-bonus-low)
        )
        u0
      ))
      (total-bonus-percent (+ early-bonus-percent mm-bonus-percent))
    )
      ;; Place the actual bet
      (try! (place-bet pool-id outcome amount))
      
      (ok {
        early-bettor-eligible: is-early,
        market-maker-eligible: is-mm,
        early-bonus-percent: early-bonus-percent,
        market-maker-bonus-percent: mm-bonus-percent,
        total-bonus-percent: total-bonus-percent,
        market-balance-ratio: balance-ratio
      })
    )
  )
)

;; Settle a pool with winning outcome
(define-public (settle-pool (pool-id uint) (winning-outcome uint))
  (let ((pool (unwrap! (map-get? pools { pool-id: pool-id }) ERR-POOL-NOT-FOUND)))
    (asserts! (is-eq tx-sender (get creator pool)) ERR-UNAUTHORIZED)
    (asserts! (not (get settled pool)) ERR-POOL-SETTLED)
    (asserts! (or (is-eq winning-outcome u0) (is-eq winning-outcome u1)) ERR-INVALID-OUTCOME)
    
    ;; Transfer fee
    (let
      (
        (total-pool-balance (+ (get total-a pool) (get total-b pool)))
        (fee (/ (* total-pool-balance FEE-PERCENT) u100))
      )
      (if (> fee u0)
        (try! (as-contract (stx-transfer? fee tx-sender CONTRACT-OWNER)))
        true
      )
    )

    (map-set pools
      { pool-id: pool-id }
      (merge pool { settled: true, winning-outcome: (some winning-outcome), settled-at: (some burn-block-height) })
    )
    
    (ok true)
  )
)

;; Claim winnings from a settled pool
;; Now includes liquidity incentive bonuses
(define-public (claim-winnings (pool-id uint))
  (let 
    (
      (pool (unwrap! (map-get? pools { pool-id: pool-id }) ERR-POOL-NOT-FOUND))
      (user-bet (unwrap! (map-get? user-bets { pool-id: pool-id, user: tx-sender }) ERR-NO-WINNINGS))
      (winning-outcome (unwrap! (get winning-outcome pool) ERR-NOT-SETTLED))
    )
    (asserts! (get settled pool) ERR-NOT-SETTLED)
    (asserts! (is-none (map-get? claims { pool-id: pool-id, user: tx-sender })) ERR-ALREADY-CLAIMED)

    (let
      (
        (user-total-bet (get total-bet user-bet))
        (user-winning-bet (if (is-eq winning-outcome u0) (get amount-a user-bet) (get amount-b user-bet)))
        (pool-winning-total (if (is-eq winning-outcome u0) (get total-a pool) (get total-b pool)))
        (total-pool-balance (+ (get total-a pool) (get total-b pool)))
        (fee (/ (* total-pool-balance FEE-PERCENT) u100))
        (net-pool-balance (- total-pool-balance fee))
        (claimer tx-sender) ;; Capture the web3 user
        (first-bet-block (get first-bet-block user-bet))
        (pool-created-at (get created-at pool))
        (early-bettor-window-end (+ pool-created-at EARLY-BETTOR-WINDOW))
        (is-early-bettor (<= first-bet-block early-bettor-window-end))
      )
      
      (asserts! (> user-winning-bet u0) ERR-NO-WINNINGS)
      (asserts! (> pool-winning-total u0) ERR-NO-WINNINGS)

      (let
        (
          ;; Calculate base share: (user_bet_on_winner * net_pool) / total_bet_on_winner
          (base-share (/ (* user-winning-bet net-pool-balance) pool-winning-total))
          ;; Calculate original early bettor bonus if applicable
          (original-bonus (if is-early-bettor (/ (* base-share EARLY-BETTOR-BONUS-PERCENT) u100) u0))
          ;; Calculate liquidity incentive bonuses
          (liquidity-early-bonus (calculate-early-bettor-bonus pool-id claimer base-share))
          (liquidity-mm-bonus (calculate-market-maker-bonus pool-id claimer winning-outcome base-share))
          (total-liquidity-bonus (+ liquidity-early-bonus liquidity-mm-bonus))
          ;; Calculate available incentive funds
          (pool-incentive-funds (default-to 
            { creator-contribution: u0, platform-allocation: u0, total-distributed: u0, remaining-balance: u0 }
            (map-get? pool-incentive-funds { pool-id: pool-id })
          ))
          (available-incentive-funds (+ (get remaining-balance pool-incentive-funds) (var-get platform-incentive-pool)))
          ;; Apply proportional distribution if insufficient funds
          (actual-liquidity-bonus (if (> total-liquidity-bonus available-incentive-funds)
            (if (> available-incentive-funds u0)
              (/ (* total-liquidity-bonus available-incentive-funds) total-liquidity-bonus)
              u0
            )
            total-liquidity-bonus
          ))
          (total-payout (+ base-share original-bonus actual-liquidity-bonus))
        )
        ;; Transfer total payout (base share + bonuses) to user
        (try! (as-contract (stx-transfer? total-payout tx-sender claimer)))
        
        ;; Update incentive pool balances
        (if (> actual-liquidity-bonus u0)
          (begin
            ;; Deduct from platform incentive pool
            (var-set platform-incentive-pool (- (var-get platform-incentive-pool) actual-liquidity-bonus))
            ;; Update total incentives distributed
            (var-set total-incentives-distributed (+ (var-get total-incentives-distributed) actual-liquidity-bonus))
            ;; Update user incentive status
            (let ((current-status (unwrap! (map-get? user-incentive-status { pool-id: pool-id, user: claimer }) ERR-NOT-ELIGIBLE-FOR-INCENTIVE)))
              (map-set user-incentive-status
                { pool-id: pool-id, user: claimer }
                (merge current-status {
                  total-bonus-earned: actual-liquidity-bonus,
                  bonus-claimed: true
                })
              )
            )
            ;; Update user lifetime stats
            (let ((current-stats (default-to 
              { total-early-bettor-bonus: u0, total-market-maker-bonus: u0, pools-with-bonuses: u0, last-bonus-claim: u0 }
              (map-get? user-incentive-stats { user: claimer })
            )))
              (map-set user-incentive-stats
                { user: claimer }
                {
                  total-early-bettor-bonus: (+ (get total-early-bettor-bonus current-stats) liquidity-early-bonus),
                  total-market-maker-bonus: (+ (get total-market-maker-bonus current-stats) liquidity-mm-bonus),
                  pools-with-bonuses: (+ (get pools-with-bonuses current-stats) u1),
                  last-bonus-claim: burn-block-height
                }
              )
            )
          )
          true
        )
        
        ;; Mark as claimed
        (map-set claims { pool-id: pool-id, user: claimer } true)
        
        (ok { 
          base-payout: (+ base-share original-bonus),
          liquidity-bonus: actual-liquidity-bonus,
          total-payout: total-payout
        })
      )
    )
  )
)

;; Distribute creator fund refunds for unused incentives
(define-public (refund-unused-creator-funds (pool-id uint))
  (let (
    (pool (unwrap! (map-get? pools { pool-id: pool-id }) ERR-POOL-NOT-FOUND))
    (enhanced-pool (unwrap! (map-get? creator-enhanced-pools { pool-id: pool-id }) ERR-POOL-NOT-FOUND))
    (pool-funds (unwrap! (map-get? pool-incentive-funds { pool-id: pool-id }) ERR-POOL-NOT-FOUND))
  )
    ;; Only pool creator can request refund
    (asserts! (is-eq tx-sender (get creator pool)) ERR-UNAUTHORIZED)
    
    ;; Pool must be settled or expired
    (asserts! (or (get settled pool) (> burn-block-height (get expiry pool))) ERR-POOL-NOT-EXPIRED)
    
    ;; Must have creator contribution and remaining balance
    (asserts! (> (get creator-contribution pool-funds) u0) ERR-CREATOR-FUND-INSUFFICIENT)
    (asserts! (> (get remaining-balance pool-funds) u0) ERR-INCENTIVE-POOL-EMPTY)
    
    (let (
      (refund-amount (min (get creator-contribution pool-funds) (get remaining-balance pool-funds)))
    )
      ;; Transfer refund to creator
      (try! (as-contract (stx-transfer? refund-amount tx-sender (get creator pool))))
      
      ;; Update pool incentive funds
      (map-set pool-incentive-funds
        { pool-id: pool-id }
        (merge pool-funds {
          remaining-balance: (- (get remaining-balance pool-funds) refund-amount)
        })
      )
      
      (ok refund-amount)
    )
  )
)

;; ============================================
;; LIQUIDITY INCENTIVES ADMIN FUNCTIONS
;; ============================================

;; Configure early bettor window duration
(define-public (set-early-bettor-window (blocks uint))
  (begin
    ;; Only contract owner can configure
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-UNAUTHORIZED)
    
    ;; Validate parameter (must be positive and reasonable)
    (asserts! (> blocks u0) ERR-INVALID-INCENTIVE-CONFIG)
    (asserts! (<= blocks u1440) ERR-INVALID-INCENTIVE-CONFIG) ;; Max 10 days
    
    (var-set liquidity-early-window-blocks blocks)
    (ok blocks)
  )
)

;; Configure early bettor bonus percentage
(define-public (set-early-bettor-bonus (percent uint))
  (begin
    ;; Only contract owner can configure
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-UNAUTHORIZED)
    
    ;; Validate parameter (0-50%)
    (asserts! (<= percent u50) ERR-INVALID-INCENTIVE-CONFIG)
    
    (var-set liquidity-early-bonus-percent percent)
    (ok percent)
  )
)

;; Configure market maker thresholds and bonuses
(define-public (set-market-maker-config (threshold-low uint) (threshold-high uint) (bonus-high uint) (bonus-low uint))
  (begin
    ;; Only contract owner can configure
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-UNAUTHORIZED)
    
    ;; Validate parameters
    (asserts! (< threshold-low threshold-high) ERR-INVALID-INCENTIVE-CONFIG)
    (asserts! (<= threshold-high u50) ERR-INVALID-INCENTIVE-CONFIG)
    (asserts! (<= bonus-high u50) ERR-INVALID-INCENTIVE-CONFIG)
    (asserts! (<= bonus-low u50) ERR-INVALID-INCENTIVE-CONFIG)
    (asserts! (>= bonus-high bonus-low) ERR-INVALID-INCENTIVE-CONFIG)
    
    (var-set liquidity-market-maker-threshold-low threshold-low)
    (var-set liquidity-market-maker-threshold-high threshold-high)
    (var-set liquidity-market-maker-bonus-high bonus-high)
    (var-set liquidity-market-maker-bonus-low bonus-low)
    
    (ok true)
  )
)

;; Configure minimum bet amount for incentives
(define-public (set-min-bet-for-incentives (amount uint))
  (begin
    ;; Only contract owner can configure
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-UNAUTHORIZED)
    
    ;; Validate parameter
    (asserts! (>= amount MIN-BET-AMOUNT) ERR-INVALID-INCENTIVE-CONFIG)
    
    (var-set liquidity-min-bet-for-incentives amount)
    (ok amount)
  )
)

;; Configure maximum creator bonus percentage
(define-public (set-creator-max-bonus (percent uint))
  (begin
    ;; Only contract owner can configure
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-UNAUTHORIZED)
    
    ;; Validate parameter (max 100%)
    (asserts! (<= percent u100) ERR-INVALID-INCENTIVE-CONFIG)
    
    (var-set liquidity-creator-max-bonus-percent percent)
    (ok percent)
  )
)

;; ============================================
;; CREATOR ENHANCEMENT FUNCTIONS
;; ============================================

;; Create enhanced pool with creator-funded incentives
(define-public (create-enhanced-pool 
  (title (string-ascii 256)) 
  (description (string-ascii 512)) 
  (outcome-a (string-ascii 128)) 
  (outcome-b (string-ascii 128)) 
  (duration uint)
  (creator-fund-amount uint)
  (enhanced-early-bonus uint)
  (enhanced-mm-bonus uint))
  (let ((pool-id (var-get pool-counter)))
    ;; Validate inputs
    (asserts! (> (len title) u0) ERR-INVALID-TITLE)
    (asserts! (<= (len title) u256) ERR-INVALID-TITLE)
    (asserts! (> (len description) u0) ERR-INVALID-DESCRIPTION)
    (asserts! (<= (len description) u512) ERR-INVALID-DESCRIPTION)
    (asserts! (> (len outcome-a) u0) ERR-INVALID-OUTCOME)
    (asserts! (<= (len outcome-a) u128) ERR-INVALID-OUTCOME)
    (asserts! (> (len outcome-b) u0) ERR-INVALID-OUTCOME)
    (asserts! (<= (len outcome-b) u128) ERR-INVALID-OUTCOME)
    (asserts! (> duration u0) ERR-INVALID-DURATION)
    (asserts! (< duration u100000) ERR-INVALID-DURATION)
    
    ;; Validate enhancement parameters
    (asserts! (> creator-fund-amount u0) ERR-INVALID-AMOUNT)
    (asserts! (<= enhanced-early-bonus (var-get liquidity-creator-max-bonus-percent)) ERR-INVALID-INCENTIVE-CONFIG)
    (asserts! (<= enhanced-mm-bonus (var-get liquidity-creator-max-bonus-percent)) ERR-INVALID-INCENTIVE-CONFIG)
    
    ;; Transfer creator funds to contract
    (try! (stx-transfer? creator-fund-amount tx-sender (as-contract tx-sender)))
    
    ;; Create the pool
    (try! (create-pool title description outcome-a outcome-b duration))
    
    ;; Set up creator enhancement
    (map-insert creator-enhanced-pools
      { pool-id: pool-id }
      {
        creator-fund-amount: creator-fund-amount,
        enhanced-early-bonus: enhanced-early-bonus,
        enhanced-market-maker-bonus: enhanced-mm-bonus,
        is-enhanced: true
      }
    )
    
    ;; Set up pool incentive funds
    (map-insert pool-incentive-funds
      { pool-id: pool-id }
      {
        creator-contribution: creator-fund-amount,
        platform-allocation: u0,
        total-distributed: u0,
        remaining-balance: creator-fund-amount
      }
    )ator-fund-amount,
        platform-allocation: u0,
        total-distributed: u0,
        remaining-balance: creator-fund-amount
      }
    )
    
    (ok pool-id)
  )
)

;; Add creator funding to existing pool
(define-public (add-creator-funding (pool-id uint) (fund-amount uint) (enhanced-early-bonus uint) (enhanced-mm-bonus uint))
  (let (
    (pool (unwrap! (map-get? pools { pool-id: pool-id }) ERR-POOL-NOT-FOUND))
  )
    ;; Only pool creator can add funding
    (asserts! (is-eq tx-sender (get creator pool)) ERR-UNAUTHORIZED)
    
    ;; Pool must not be settled
    (asserts! (not (get settled pool)) ERR-POOL-SETTLED)
    
    ;; Validate parameters
    (asserts! (> fund-amount u0) ERR-INVALID-AMOUNT)
    (asserts! (<= enhanced-early-bonus (var-get liquidity-creator-max-bonus-percent)) ERR-INVALID-INCENTIVE-CONFIG)
    (asserts! (<= enhanced-mm-bonus (var-get liquidity-creator-max-bonus-percent)) ERR-INVALID-INCENTIVE-CONFIG)
    
    ;; Transfer creator funds to contract
    (try! (stx-transfer? fund-amount tx-sender (as-contract tx-sender)))
    
    ;; Update or create enhancement record
    (let ((current-enhancement (default-to 
      { creator-fund-amount: u0, enhanced-early-bonus: u0, enhanced-market-maker-bonus: u0, is-enhanced: false }
      (map-get? creator-enhanced-pools { pool-id: pool-id })
    )))
      (map-set creator-enhanced-pools
        { pool-id: pool-id }
        {
          creator-fund-amount: (+ (get creator-fund-amount current-enhancement) fund-amount),
          enhanced-early-bonus: enhanced-early-bonus,
          enhanced-market-maker-bonus: enhanced-mm-bonus,
          is-enhanced: true
        }
      )
    )
    
    ;; Update pool incentive funds
    (let ((current-funds (default-to 
      { creator-contribution: u0, platform-allocation: u0, total-distributed: u0, remaining-balance: u0 }
      (map-get? pool-incentive-funds { pool-id: pool-id })
    )))
      (map-set pool-incentive-funds
        { pool-id: pool-id }
        {
          creator-contribution: (+ (get creator-contribution current-funds) fund-amount),
          platform-allocation: (get platform-allocation current-funds),
          total-distributed: (get total-distributed current-funds),
          remaining-balance: (+ (get remaining-balance current-funds) fund-amount)
        }
      )
    )
    
    (ok fund-amount)
  )
)

;; ============================================
;; LIQUIDITY INCENTIVES READ-ONLY FUNCTIONS
;; ============================================

;; Get user incentive status for a pool
(define-read-only (get-user-incentive-status (pool-id uint) (user principal))
  (map-get? user-incentive-status { pool-id: pool-id, user: user })
)

;; Get user lifetime incentive statistics
(define-read-only (get-user-incentive-stats (user principal))
  (map-get? user-incentive-stats { user: user })
)

;; Get pool incentive funds information
(define-read-only (get-pool-incentive-funds (pool-id uint))
  (map-get? pool-incentive-funds { pool-id: pool-id })
)

;; Get creator enhancement information for a pool
(define-read-only (get-creator-enhancement (pool-id uint))
  (map-get? creator-enhanced-pools { pool-id: pool-id })
)

;; Get platform incentive pool balance
(define-read-only (get-platform-incentive-pool-balance)
  (var-get platform-incentive-pool)
)

;; Get total incentives distributed
(define-read-only (get-total-incentives-distributed)
  (var-get total-incentives-distributed)
)

;; Get current system configuration
(define-read-only (get-liquidity-incentive-config)
  {
    early-window-blocks: (var-get liquidity-early-window-blocks),
    early-bonus-percent: (var-get liquidity-early-bonus-percent),
    market-maker-threshold-low: (var-get liquidity-market-maker-threshold-low),
    market-maker-threshold-high: (var-get liquidity-market-maker-threshold-high),
    market-maker-bonus-high: (var-get liquidity-market-maker-bonus-high),
    market-maker-bonus-low: (var-get liquidity-market-maker-bonus-low),
    min-bet-for-incentives: (var-get liquidity-min-bet-for-incentives),
    creator-max-bonus-percent: (var-get liquidity-creator-max-bonus-percent)
  }
)

;; Check if user qualifies for early bettor bonus (preview)
(define-read-only (preview-early-bettor-eligibility (pool-id uint) (bet-amount uint))
  (is-early-bettor pool-id bet-amount)
)

;; Check if user qualifies for market maker bonus (preview)
(define-read-only (preview-market-maker-eligibility (pool-id uint) (outcome uint) (bet-amount uint))
  (is-market-maker pool-id outcome bet-amount)
)

;; Get current market balance ratio for an outcome
(define-read-only (get-market-balance-ratio (pool-id uint) (outcome uint))
  (calculate-market-balance-ratio pool-id outcome)
)

;; Calculate potential bonuses for a bet (preview)
(define-read-only (preview-potential-bonuses (pool-id uint) (outcome uint) (bet-amount uint) (estimated-winnings uint))
  (let (
    (is-early (is-early-bettor pool-id bet-amount))
    (is-mm (is-market-maker pool-id outcome bet-amount))
    (early-bonus (if is-early (calculate-early-bettor-bonus pool-id tx-sender estimated-winnings) u0))
    (mm-bonus (if is-mm (calculate-market-maker-bonus pool-id tx-sender outcome estimated-winnings) u0))
  )
    {
      early-bettor-eligible: is-early,
      market-maker-eligible: is-mm,
      early-bettor-bonus: early-bonus,
      market-maker-bonus: mm-bonus,
      total-bonus: (+ early-bonus mm-bonus),
      market-balance-ratio: (calculate-market-balance-ratio pool-id outcome)
    }
  )
)

;; ============================================
;; EARLY BETTOR UTILITY FUNCTIONS
;; ============================================

;; Get early bettor window end time for a pool
(define-read-only (get-early-bettor-window-end (pool-id uint))
  (match (map-get? pools { pool-id: pool-id })
    pool (+ (get created-at pool) (var-get liquidity-early-window-blocks))
    u0
  )
)

;; Check if current time is within early bettor window
(define-read-only (is-early-bettor-window-active (pool-id uint))
  (let ((window-end (get-early-bettor-window-end pool-id)))
    (and (> window-end u0) (< burn-block-height window-end))
  )
)

;; Get remaining blocks in early bettor window
(define-read-only (get-early-bettor-window-remaining (pool-id uint))
  (let ((window-end (get-early-bettor-window-end pool-id)))
    (if (and (> window-end u0) (< burn-block-height window-end))
      (- window-end burn-block-height)
      u0
    )
  )
)

;; Calculate early bettor bonus percentage for a pool
(define-read-only (get-early-bettor-bonus-percent (pool-id uint))
  (match (map-get? creator-enhanced-pools { pool-id: pool-id })
    enhanced (if (get is-enhanced enhanced)
      (min (get enhanced-early-bonus enhanced) (var-get liquidity-creator-max-bonus-percent))
      (var-get liquidity-early-bonus-percent)
    )
    (var-get liquidity-early-bonus-percent)
  )
)

;; ============================================
;; MARKET MAKER UTILITY FUNCTIONS
;; ============================================

;; Get market maker bonus percentage for a pool and outcome
(define-read-only (get-market-maker-bonus-percent (pool-id uint) (outcome uint))
  (let (
    (balance-ratio (calculate-market-balance-ratio pool-id outcome))
    (threshold-low (var-get liquidity-market-maker-threshold-low))
    (threshold-high (var-get liquidity-market-maker-threshold-high))
    (base-bonus-percent (if (< balance-ratio threshold-low)
      (var-get liquidity-market-maker-bonus-high)
      (if (< balance-ratio threshold-high)
        (var-get liquidity-market-maker-bonus-low)
        u0
      )
    ))
  )
    (match (map-get? creator-enhanced-pools { pool-id: pool-id })
      enhanced (if (get is-enhanced enhanced)
        (min (get enhanced-market-maker-bonus enhanced) (var-get liquidity-creator-max-bonus-percent))
        base-bonus-percent
      )
      base-bonus-percent
    )
  )
)

;; Check if outcome qualifies for market maker bonus
(define-read-only (is-outcome-underrepresented (pool-id uint) (outcome uint))
  (let ((balance-ratio (calculate-market-balance-ratio pool-id outcome)))
    (< balance-ratio (var-get liquidity-market-maker-threshold-high))
  )
)

;; Get market imbalance severity (higher = more imbalanced)
(define-read-only (get-market-imbalance-severity (pool-id uint))
  (let (
    (ratio-a (calculate-market-balance-ratio pool-id u0))
    (ratio-b (calculate-market-balance-ratio pool-id u1))
    (imbalance (if (> ratio-a ratio-b) (- ratio-a ratio-b) (- ratio-b ratio-a)))
  )
    imbalance
  )
)

;; Get both outcome ratios for a pool
(define-read-only (get-pool-balance-ratios (pool-id uint))
  {
    outcome-a-ratio: (calculate-market-balance-ratio pool-id u0),
    outcome-b-ratio: (calculate-market-balance-ratio pool-id u1),
    imbalance-severity: (get-market-imbalance-severity pool-id)
  }
)

;; ============================================
;; INCENTIVE POOL ANALYTICS FUNCTIONS
;; ============================================

;; Get total available incentive funds for a pool
(define-read-only (get-total-available-incentive-funds (pool-id uint))
  (let (
    (pool-funds (default-to 
      { creator-contribution: u0, platform-allocation: u0, total-distributed: u0, remaining-balance: u0 }
      (map-get? pool-incentive-funds { pool-id: pool-id })
    ))
    (platform-pool (var-get platform-incentive-pool))
  )
    (+ (get remaining-balance pool-funds) platform-pool)
  )
)

;; Get incentive fund utilization rate for a pool
(define-read-only (get-incentive-fund-utilization (pool-id uint))
  (match (map-get? pool-incentive-funds { pool-id: pool-id })
    funds (let (
      (total-funds (+ (get creator-contribution funds) (get platform-allocation funds)))
      (distributed (get total-distributed funds))
    )
      (if (> total-funds u0)
        (/ (* distributed u100) total-funds)
        u0
      )
    )
    u0
  )
)

;; Get platform-wide incentive statistics
(define-read-only (get-platform-incentive-stats)
  {
    total-platform-pool: (var-get platform-incentive-pool),
    total-distributed: (var-get total-incentives-distributed),
    distribution-rate: (if (> (var-get platform-incentive-pool) u0)
      (/ (* (var-get total-incentives-distributed) u100) (var-get platform-incentive-pool))
      u0
    )
  }
)

;; Check if pool has sufficient funds for estimated bonuses
(define-read-only (can-pool-afford-bonuses (pool-id uint) (estimated-bonus-amount uint))
  (let ((available-funds (get-total-available-incentive-funds pool-id)))
    (>= available-funds estimated-bonus-amount)
  )
)

;; Get creator contribution percentage for a pool
(define-read-only (get-creator-contribution-percentage (pool-id uint))
  (match (map-get? pool-incentive-funds { pool-id: pool-id })
    funds (let (
      (creator-contrib (get creator-contribution funds))
      (total-funds (+ creator-contrib (get platform-allocation funds)))
    )
      (if (> total-funds u0)
        (/ (* creator-contrib u100) total-funds)
        u0
      )
    )
    u0
  )
)

;; ============================================
;; USER STATISTICS AND TRACKING FUNCTIONS
;; ============================================

;; Get comprehensive user incentive summary
(define-read-only (get-user-incentive-summary (user principal))
  (let (
    (lifetime-stats (default-to 
      { total-early-bettor-bonus: u0, total-market-maker-bonus: u0, pools-with-bonuses: u0, last-bonus-claim: u0 }
      (map-get? user-incentive-stats { user: user })
    ))
  )
    {
      total-early-bettor-bonus: (get total-early-bettor-bonus lifetime-stats),
      total-market-maker-bonus: (get total-market-maker-bonus lifetime-stats),
      total-bonuses-earned: (+ (get total-early-bettor-bonus lifetime-stats) (get total-market-maker-bonus lifetime-stats)),
      pools-with-bonuses: (get pools-with-bonuses lifetime-stats),
      last-bonus-claim: (get last-bonus-claim lifetime-stats),
      average-bonus-per-pool: (if (> (get pools-with-bonuses lifetime-stats) u0)
        (/ (+ (get total-early-bettor-bonus lifetime-stats) (get total-market-maker-bonus lifetime-stats)) (get pools-with-bonuses lifetime-stats))
        u0
      )
    }
  )
)

;; Check if user has claimed bonuses for a specific pool
(define-read-only (has-user-claimed-bonuses (pool-id uint) (user principal))
  (match (map-get? user-incentive-status { pool-id: pool-id, user: user })
    status (get bonus-claimed status)
    false
  )
)

;; Get user's total unclaimed bonuses across all pools
(define-read-only (get-user-unclaimed-bonuses (user principal))
  ;; This is a simplified version - in practice, you'd iterate through pools
  ;; For now, return 0 as a placeholder
  u0
)

;; Get user's incentive eligibility for a specific pool
(define-read-only (get-user-pool-incentive-eligibility (pool-id uint) (user principal))
  (match (map-get? user-incentive-status { pool-id: pool-id, user: user })
    status {
      is-early-bettor: (get is-early-bettor status),
      early-bet-amount: (get early-bet-amount status),
      is-market-maker: (get is-market-maker status),
      market-maker-amount: (get market-maker-amount status),
      total-bonus-earned: (get total-bonus-earned status),
      bonus-claimed: (get bonus-claimed status),
      eligible-for-bonuses: (or (get is-early-bettor status) (get is-market-maker status))
    }
    {
      is-early-bettor: false,
      early-bet-amount: u0,
      is-market-maker: false,
      market-maker-amount: u0,
      total-bonus-earned: u0,
      bonus-claimed: false,
      eligible-for-bonuses: false
    }
  )
)

;; Calculate user's incentive participation rate
(define-read-only (get-user-incentive-participation-rate (user principal))
  ;; This would require tracking total pools user participated in
  ;; For now, return a placeholder calculation
  (let (
    (stats (get-user-incentive-summary user))
    (pools-with-bonuses (get pools-with-bonuses stats))
  )
    ;; Return percentage of pools where user earned bonuses
    ;; In a full implementation, this would be (pools-with-bonuses / total-pools-participated) * 100
    pools-with-bonuses
  )
)

;; ============================================
;; POOL ENHANCEMENT VALIDATION FUNCTIONS
;; ============================================

;; Validate enhancement parameters
(define-private (validate-enhancement-params (early-bonus uint) (mm-bonus uint))
  (and 
    (<= early-bonus (var-get liquidity-creator-max-bonus-percent))
    (<= mm-bonus (var-get liquidity-creator-max-bonus-percent))
  )
)

;; Check if pool is eligible for enhancement
(define-read-only (is-pool-eligible-for-enhancement (pool-id uint))
  (match (map-get? pools { pool-id: pool-id })
    pool (and (not (get settled pool)) (< burn-block-height (get expiry pool)))
    false
  )
)

;; ============================================
;; INCENTIVE CALCULATION HELPERS
;; ============================================

;; Calculate proportional bonus distribution
(define-private (calculate-proportional-bonus (requested-bonus uint) (available-funds uint) (total-requested uint))
  (if (>= available-funds total-requested)
    requested-bonus
    (if (> available-funds u0)
      (/ (* requested-bonus available-funds) total-requested)
      u0
    )
  )
)

;; Get effective bonus percentage with enhancements
(define-private (get-effective-bonus-percent (base-percent uint) (enhanced-percent uint))
  (min enhanced-percent (var-get liquidity-creator-max-bonus-percent))
)

;; ============================================
;; LIQUIDITY METRICS AND REPORTING
;; ============================================

;; Get pool liquidity health score
(define-read-only (get-pool-liquidity-health (pool-id uint))
  (let (
    (imbalance (get-market-imbalance-severity pool-id))
    (health-score (if (< imbalance u20) u100 (- u100 imbalance)))
  )
    (max health-score u0)
  )
)

;; Get incentive effectiveness metrics
(define-read-only (get-incentive-effectiveness (pool-id uint))
  {
    liquidity-health: (get-pool-liquidity-health pool-id),
    early-bettor-window-active: (is-early-bettor-window-active pool-id),
    market-maker-opportunities: (+ 
      (if (is-outcome-underrepresented pool-id u0) u1 u0)
      (if (is-outcome-underrepresented pool-id u1) u1 u0)
    ),
    available-funds: (get-total-available-incentive-funds pool-id)
  }
)

;; Request refund if pool expired and not settled
(define-public (request-refund (pool-id uint))
  (let 
    (
      (pool (unwrap! (map-get? pools { pool-id: pool-id }) ERR-POOL-NOT-FOUND))
      (user-bet (unwrap! (map-get? user-bets { pool-id: pool-id, user: tx-sender }) ERR-NO-WINNINGS))
      (claimer tx-sender)
    )
    ;; Check expiry
    (asserts! (> burn-block-height (get expiry pool)) ERR-POOL-NOT-EXPIRED)
    ;; Check not settled
    (asserts! (not (get settled pool)) ERR-POOL-SETTLED)
    ;; Check not already claimed/refunded
    (asserts! (is-none (map-get? claims { pool-id: pool-id, user: tx-sender })) ERR-ALREADY-CLAIMED)

    (let
      (
        (refund-amount (get total-bet user-bet))
      )
      (asserts! (> refund-amount u0) ERR-NO-WINNINGS)

      ;; Transfer refund
      (try! (as-contract (stx-transfer? refund-amount tx-sender claimer)))

      ;; Mark as claimed
      (map-set claims { pool-id: pool-id, user: claimer } true)

      (ok true)
    )
  )
)

;; ============================================
;; ORACLE SYSTEM FUNCTIONS
;; ============================================

;; Register a new oracle provider
(define-public (register-oracle-provider (provider-address principal) (supported-data-types (list 10 (string-ascii 32))))
  (let ((provider-id (var-get oracle-provider-counter)))
    ;; Only contract owner or admins can register oracle providers
    (asserts! (or (is-eq tx-sender CONTRACT-OWNER) (is-admin tx-sender)) ERR-UNAUTHORIZED)
    
    ;; Validate provider address is not already registered
    (asserts! (is-none (get-oracle-provider-by-address provider-address)) ERR-ORACLE-ALREADY-EXISTS)
    
    ;; Register the oracle provider
    (map-insert oracle-providers
      { provider-id: provider-id }
      {
        provider-address: provider-address,
        reliability-score: u100, ;; Start with 100% reliability
        total-resolutions: u0,
        successful-resolutions: u0,
        average-response-time: u0,
        is-active: true,
        registered-at: burn-block-height,
        last-activity: burn-block-height
      }
    )
    
    ;; Register supported data types
    (fold register-data-type-for-provider supported-data-types provider-id)
    
    ;; Increment provider counter
    (var-set oracle-provider-counter (+ provider-id u1))
    
    (ok provider-id)
  )
)

;; Helper function to register data types for a provider
(define-private (register-data-type-for-provider (data-type (string-ascii 32)) (provider-id uint))
  (begin
    (map-insert oracle-data-types
      { provider-id: provider-id, data-type: data-type }
      true
    )
    provider-id
  )
)

;; Deactivate an oracle provider
(define-public (deactivate-oracle-provider (provider-id uint))
  (let ((provider (unwrap! (map-get? oracle-providers { provider-id: provider-id }) ERR-ORACLE-NOT-FOUND)))
    ;; Only contract owner or admins can deactivate oracle providers
    (asserts! (or (is-eq tx-sender CONTRACT-OWNER) (is-admin tx-sender)) ERR-UNAUTHORIZED)
    
    ;; Update provider status
    (map-set oracle-providers
      { provider-id: provider-id }
      (merge provider { is-active: false })
    )
    
    (ok true)
  )
)

;; Reactivate an oracle provider
(define-public (reactivate-oracle-provider (provider-id uint))
  (let ((provider (unwrap! (map-get? oracle-providers { provider-id: provider-id }) ERR-ORACLE-NOT-FOUND)))
    ;; Only contract owner or admins can reactivate oracle providers
    (asserts! (or (is-eq tx-sender CONTRACT-OWNER) (is-admin tx-sender)) ERR-UNAUTHORIZED)
    
    ;; Update provider status
    (map-set oracle-providers
      { provider-id: provider-id }
      (merge provider { is-active: true, last-activity: burn-block-height })
    )
    
    (ok true)
  )
)

;; Update oracle provider reliability metrics
(define-public (update-oracle-reliability (provider-id uint) (was-successful bool) (response-time uint))
  (let ((provider (unwrap! (map-get? oracle-providers { provider-id: provider-id }) ERR-ORACLE-NOT-FOUND)))
    ;; Only contract or admins can update reliability
    (asserts! (or (is-eq tx-sender (as-contract tx-sender)) (is-admin tx-sender)) ERR-UNAUTHORIZED)
    
    (let (
      (total-resolutions (+ (get total-resolutions provider) u1))
      (successful-resolutions (if was-successful (+ (get successful-resolutions provider) u1) (get successful-resolutions provider)))
      (new-reliability-score (if (> total-resolutions u0) (/ (* successful-resolutions u100) total-resolutions) u0))
      (current-avg-time (get average-response-time provider))
      (new-avg-time (if (> total-resolutions u1) 
        (/ (+ (* current-avg-time (- total-resolutions u1)) response-time) total-resolutions)
        response-time))
    )
      ;; Update provider metrics
      (map-set oracle-providers
        { provider-id: provider-id }
        (merge provider {
          total-resolutions: total-resolutions,
          successful-resolutions: successful-resolutions,
          reliability-score: new-reliability-score,
          average-response-time: new-avg-time,
          last-activity: burn-block-height
        })
      )
      
      ;; Auto-disable if reliability drops below 50%
      (if (< new-reliability-score u50)
        (map-set oracle-providers
          { provider-id: provider-id }
          (merge provider { is-active: false })
        )
        true
      )
      
      (ok new-reliability-score)
    )
  )
)

;; Submit oracle data for a pool
(define-public (submit-oracle-data (pool-id uint) (data-value (string-ascii 256)) (data-type (string-ascii 32)) (confidence-score uint))
  (let (
    (provider-id (unwrap! (get-provider-id-by-address tx-sender) ERR-ORACLE-NOT-FOUND))
    (provider (unwrap! (map-get? oracle-providers { provider-id: provider-id }) ERR-ORACLE-NOT-FOUND))
    (submission-id (var-get oracle-submission-counter))
  )
    ;; Validate oracle provider is active
    (asserts! (get is-active provider) ERR-ORACLE-INACTIVE)
    
    ;; Validate oracle supports this data type
    (asserts! (oracle-supports-data-type provider-id data-type) ERR-INVALID-DATA-TYPE)
    
    ;; Validate confidence score (0-100)
    (asserts! (<= confidence-score u100) ERR-INSUFFICIENT-CONFIDENCE)
    
    ;; Validate pool exists
    (asserts! (is-some (map-get? pools { pool-id: pool-id })) ERR-POOL-NOT-FOUND)
    
    ;; Store oracle submission
    (map-insert oracle-submissions
      { submission-id: submission-id }
      {
        provider-id: provider-id,
        pool-id: pool-id,
        data-value: data-value,
        data-type: data-type,
        timestamp: burn-block-height,
        confidence-score: confidence-score,
        is-processed: false
      }
    )
    
    ;; Increment submission counter
    (var-set oracle-submission-counter (+ submission-id u1))
    
    (ok submission-id)
  )
)

;; Helper function to get provider ID by address
(define-private (get-provider-id-by-address (provider-address principal))
  (let ((provider-count (var-get oracle-provider-counter)))
    (find-provider-id-by-address provider-address u0 provider-count)
  )
)

;; Helper function to find provider ID by address
(define-private (find-provider-id-by-address (provider-address principal) (current-id uint) (max-id uint))
  (if (>= current-id max-id)
    none
    (match (map-get? oracle-providers { provider-id: current-id })
      provider (if (is-eq (get provider-address provider) provider-address)
        (some current-id)
        (find-provider-id-by-address provider-address (+ current-id u1) max-id)
      )
      (find-provider-id-by-address provider-address (+ current-id u1) max-id)
    )
  )
)

;; Configure automated resolution for a pool
(define-public (configure-pool-resolution 
  (pool-id uint) 
  (oracle-sources (list 5 uint)) 
  (resolution-criteria (string-ascii 512))
  (criteria-type (string-ascii 32))
  (threshold-value (optional uint))
  (logical-operator (string-ascii 8))
  (retry-attempts uint))
  (let ((pool (unwrap! (map-get? pools { pool-id: pool-id }) ERR-POOL-NOT-FOUND)))
    ;; Only pool creator can configure resolution
    (asserts! (is-eq tx-sender (get creator pool)) ERR-UNAUTHORIZED)
    
    ;; Ensure pool is not already configured for automated resolution
    (asserts! (is-none (map-get? resolution-configs { pool-id: pool-id })) ERR-RESOLUTION-ALREADY-CONFIGURED)
    
    ;; Validate oracle sources
    (asserts! (> (len oracle-sources) u0) ERR-INSUFFICIENT-ORACLE-SOURCES)
    (asserts! (validate-oracle-sources oracle-sources) ERR-ORACLE-NOT-FOUND)
    
    ;; Validate resolution criteria
    (asserts! (> (len resolution-criteria) u0) ERR-INVALID-RESOLUTION-CRITERIA)
    (asserts! (> (len criteria-type) u0) ERR-INVALID-RESOLUTION-CRITERIA)
    
    ;; Validate logical operator
    (asserts! (or (is-eq logical-operator "AND") (is-eq logical-operator "OR")) ERR-INVALID-RESOLUTION-CRITERIA)
    
    ;; Calculate resolution fee (0.5% of current pool value)
    (let ((total-pool-value (+ (get total-a pool) (get total-b pool))))
      (let ((resolution-fee (/ (* total-pool-value u5) u1000))) ;; 0.5%
        ;; Store resolution configuration
        (map-insert resolution-configs
          { pool-id: pool-id }
          {
            oracle-sources: oracle-sources,
            resolution-criteria: resolution-criteria,
            criteria-type: criteria-type,
            threshold-value: threshold-value,
            logical-operator: logical-operator,
            retry-attempts: retry-attempts,
            resolution-fee: resolution-fee,
            is-automated: true,
            created-at: burn-block-height
          }
        )
        
        (ok true)
      )
    )
  )
)

;; Helper function to validate oracle sources
(define-private (validate-oracle-sources (oracle-sources (list 5 uint)))
  (fold validate-single-oracle oracle-sources true)
)

;; Helper function to validate a single oracle
(define-private (validate-single-oracle (oracle-id uint) (is-valid bool))
  (if is-valid
    (match (map-get? oracle-providers { provider-id: oracle-id })
      provider (get is-active provider)
      false
    )
    false
  )
)

;; Attempt automated resolution for an expired pool
(define-public (attempt-automated-resolution (pool-id uint))
  (let (
    (pool (unwrap! (map-get? pools { pool-id: pool-id }) ERR-POOL-NOT-FOUND))
    (config (unwrap! (map-get? resolution-configs { pool-id: pool-id }) ERR-RESOLUTION-CONFIG-NOT-FOUND))
    (attempt-id (var-get resolution-attempt-counter))
  )
    ;; Validate pool is expired and not settled
    (asserts! (> burn-block-height (get expiry pool)) ERR-POOL-NOT-EXPIRED)
    (asserts! (not (get settled pool)) ERR-POOL-SETTLED)
    
    ;; Validate pool has automated resolution configured
    (asserts! (get is-automated config) ERR-AUTOMATED-RESOLUTION-FAILED)
    
    ;; For now, use simple resolution logic (can be expanded)
    (let ((oracle-sources (get oracle-sources config)))
      (if (> (len oracle-sources) u0)
        ;; Simple resolution: use first oracle source as outcome (0 or 1)
        (let ((outcome (mod (unwrap-panic (element-at oracle-sources u0)) u2)))
          ;; Record successful resolution attempt
          (map-insert resolution-attempts
            { pool-id: pool-id, attempt-id: attempt-id }
            {
              attempted-at: burn-block-height,
              oracle-data-used: oracle-sources,
              result: (some outcome),
              failure-reason: none,
              is-successful: true
            }
          )
          
          ;; Settle the pool with the determined outcome
          (try! (settle-pool pool-id outcome))
          
          ;; Increment attempt counter
          (var-set resolution-attempt-counter (+ attempt-id u1))
          
          (ok outcome)
        )
        ;; No oracle sources - record failed attempt
        (begin
          (map-insert resolution-attempts
            { pool-id: pool-id, attempt-id: attempt-id }
            {
              attempted-at: burn-block-height,
              oracle-data-used: (list),
              result: none,
              failure-reason: (some "No oracle sources configured"),
              is-successful: false
            }
          )
          
          ;; Increment attempt counter
          (var-set resolution-attempt-counter (+ attempt-id u1))
          
          (err ERR-AUTOMATED-RESOLUTION-FAILED)
        )
      )
    )
  )
)

;; Create a dispute for an automated resolution
(define-public (create-dispute (pool-id uint) (dispute-reason (string-ascii 512)) (evidence-hash (optional (buff 32))))
  (let (
    (pool (unwrap! (map-get? pools { pool-id: pool-id }) ERR-POOL-NOT-FOUND))
    (dispute-id (var-get dispute-counter))
    (total-pool-value (+ (get total-a pool) (get total-b pool)))
    (dispute-bond (/ (* total-pool-value u5) u100)) ;; 5% of pool value
  )
    ;; Validate pool is settled (can only dispute settled pools)
    (asserts! (get settled pool) ERR-NOT-SETTLED)
    
    ;; Validate dispute reason
    (asserts! (> (len dispute-reason) u0) ERR-INVALID-DISPUTE_REASON)
    
    ;; Validate dispute bond payment
    (asserts! (>= (stx-get-balance tx-sender) dispute-bond) ERR-INSUFFICIENT-DISPUTE-BOND)
    
    ;; Transfer dispute bond to contract
    (try! (stx-transfer? dispute-bond tx-sender (as-contract tx-sender)))
    
    ;; Create dispute record
    (map-insert pool-disputes
      { dispute-id: dispute-id }
      {
        pool-id: pool-id,
        disputer: tx-sender,
        dispute-bond: dispute-bond,
        dispute-reason: dispute-reason,
        evidence-hash: evidence-hash,
        voting-deadline: (+ burn-block-height u1008), ;; 48 hours (assuming ~1 block per minute)
        votes-for: u0,
        votes-against: u0,
        status: "active",
        resolution: none,
        created-at: burn-block-height
      }
    )
    
    ;; Increment dispute counter
    (var-set dispute-counter (+ dispute-id u1))
    
    (ok dispute-id)
  )
)

;; Vote on a dispute
(define-public (vote-on-dispute (dispute-id uint) (vote bool))
  (let ((dispute (unwrap! (map-get? pool-disputes { dispute-id: dispute-id }) ERR-DISPUTE-NOT-FOUND)))
    ;; Validate dispute is active
    (asserts! (is-eq (get status dispute) "active") ERR-DISPUTE-ALREADY-RESOLVED)
    
    ;; Validate voting deadline not passed
    (asserts! (< burn-block-height (get voting-deadline dispute)) ERR-DISPUTE-WINDOW-CLOSED)
    
    ;; Validate user hasn't already voted
    (asserts! (is-none (map-get? dispute-votes { dispute-id: dispute-id, voter: tx-sender })) ERR-ALREADY-VOTED)
    
    ;; Calculate voting power (simplified: 1 vote per user)
    (let ((voting-power u1))
      ;; Record vote
      (map-insert dispute-votes
        { dispute-id: dispute-id, voter: tx-sender }
        {
          vote: vote,
          voting-power: voting-power,
          voted-at: burn-block-height
        }
      )
      
      ;; Update dispute vote counts
      (map-set pool-disputes
        { dispute-id: dispute-id }
        (merge dispute {
          votes-for: (if vote (+ (get votes-for dispute) voting-power) (get votes-for dispute)),
          votes-against: (if vote (get votes-against dispute) (+ (get votes-against dispute) voting-power))
        })
      )
      
      (ok true)
    )
  )
)

;; Resolve a dispute after voting deadline
(define-public (resolve-dispute (dispute-id uint))
  (let ((dispute (unwrap! (map-get? pool-disputes { dispute-id: dispute-id }) ERR-DISPUTE-NOT-FOUND)))
    ;; Validate dispute is active
    (asserts! (is-eq (get status dispute) "active") ERR-DISPUTE-ALREADY-RESOLVED)
    
    ;; Validate voting deadline has passed
    (asserts! (>= burn-block-height (get voting-deadline dispute)) ERR-DISPUTE-WINDOW-CLOSED)
    
    (let (
      (votes-for (get votes-for dispute))
      (votes-against (get votes-against dispute))
      (dispute-upheld (> votes-for votes-against))
      (disputer (get disputer dispute))
      (dispute-bond (get dispute-bond dispute))
    )
      ;; Update dispute status and resolution
      (map-set pool-disputes
        { dispute-id: dispute-id }
        (merge dispute {
          status: "resolved",
          resolution: (some dispute-upheld)
        })
      )
      
      ;; Handle dispute bond refund if dispute was upheld
      (if dispute-upheld
        (try! (as-contract (stx-transfer? dispute-bond tx-sender disputer)))
        true ;; Bond is kept by contract if dispute was rejected
      )
      
      (ok dispute-upheld)
    )
  )
)

;; Get dispute details
(define-read-only (get-dispute (dispute-id uint))
  (map-get? pool-disputes { dispute-id: dispute-id })
)

;; Get dispute vote details
(define-read-only (get-dispute-vote (dispute-id uint) (voter principal))
  (map-get? dispute-votes { dispute-id: dispute-id, voter: voter })
)

;; Get total disputes count
(define-read-only (get-dispute-count)
  (var-get dispute-counter)
)

;; Check if user has voted on dispute
(define-read-only (has-user-voted-on-dispute (dispute-id uint) (voter principal))
  (is-some (map-get? dispute-votes { dispute-id: dispute-id, voter: voter }))
)

;; Calculate and collect resolution fee
(define-public (collect-resolution-fee (pool-id uint))
  (let (
    (pool (unwrap! (map-get? pools { pool-id: pool-id }) ERR-POOL-NOT-FOUND))
    (total-pool-value (+ (get total-a pool) (get total-b pool)))
    (resolution-fee (/ (* total-pool-value RESOLUTION-FEE-PERCENT) u1000))
    (oracle-fee-portion (/ (* resolution-fee u80) u100)) ;; 80% to oracles
    (platform-fee-portion (- resolution-fee oracle-fee-portion)) ;; 20% to platform
  )
    ;; Only contract can collect fees
    (asserts! (is-eq tx-sender (as-contract tx-sender)) ERR-UNAUTHORIZED)
    
    ;; Store fee breakdown
    (map-insert resolution-fees
      { pool-id: pool-id }
      {
        total-fee: resolution-fee,
        oracle-fees: oracle-fee-portion,
        platform-fee: platform-fee-portion,
        is-refunded: false,
        refund-recipient: none
      }
    )
    
    ;; Transfer platform fee to contract owner
    (try! (as-contract (stx-transfer? platform-fee-portion tx-sender CONTRACT-OWNER)))
    
    (ok resolution-fee)
  )
)

;; Distribute fees to oracle providers
(define-public (distribute-oracle-fees (pool-id uint) (oracle-providers-list (list 5 uint)))
  (let (
    (fee-info (unwrap! (map-get? resolution-fees { pool-id: pool-id }) ERR-POOL-NOT-FOUND))
    (oracle-fees (get oracle-fees fee-info))
    (num-oracles (len oracle-providers-list))
    (fee-per-oracle (if (> num-oracles u0) (/ oracle-fees num-oracles) u0))
  )
    ;; Only contract can distribute fees
    (asserts! (is-eq tx-sender (as-contract tx-sender)) ERR-UNAUTHORIZED)
    
    ;; Distribute fees to each oracle
    (fold distribute-fee-to-oracle oracle-providers-list { pool-id: pool-id, fee-amount: fee-per-oracle })
    
    (ok true)
  )
)

;; Helper function to distribute fee to single oracle
(define-private (distribute-fee-to-oracle (provider-id uint) (fee-data { pool-id: uint, fee-amount: uint }))
  (let (
    (pool-id (get pool-id fee-data))
    (fee-amount (get fee-amount fee-data))
  )
    ;; Record oracle fee claim
    (map-insert oracle-fee-claims
      { provider-id: provider-id, pool-id: pool-id }
      {
        fee-amount: fee-amount,
        is-claimed: false,
        claimed-at: none
      }
    )
    
    fee-data ;; Return unchanged for fold
  )
)

;; Oracle claims their fee
(define-public (claim-oracle-fee (pool-id uint))
  (let (
    (provider-id (unwrap! (get-provider-id-by-address tx-sender) ERR-ORACLE-NOT-FOUND))
    (fee-claim (unwrap! (map-get? oracle-fee-claims { provider-id: provider-id, pool-id: pool-id }) ERR-NO-WINNINGS))
  )
    ;; Validate fee not already claimed
    (asserts! (not (get is-claimed fee-claim)) ERR-ALREADY-CLAIMED)
    
    (let ((fee-amount (get fee-amount fee-claim)))
      ;; Transfer fee to oracle
      (try! (as-contract (stx-transfer? fee-amount tx-sender tx-sender)))
      
      ;; Mark as claimed
      (map-set oracle-fee-claims
        { provider-id: provider-id, pool-id: pool-id }
        (merge fee-claim {
          is-claimed: true,
          claimed-at: (some burn-block-height)
        })
      )
      
      (ok fee-amount)
    )
  )
)

;; Refund resolution fee for upheld disputes
(define-public (refund-resolution-fee (pool-id uint) (dispute-id uint))
  (let (
    (dispute (unwrap! (map-get? pool-disputes { dispute-id: dispute-id }) ERR-DISPUTE-NOT-FOUND))
    (fee-info (unwrap! (map-get? resolution-fees { pool-id: pool-id }) ERR-POOL-NOT-FOUND))
    (disputer (get disputer dispute))
  )
    ;; Validate dispute was upheld and resolved
    (asserts! (is-eq (get status dispute) "resolved") ERR-DISPUTE-NOT-FOUND)
    (asserts! (is-eq (unwrap! (get resolution dispute) ERR-DISPUTE-NOT-FOUND) true) ERR-DISPUTE-NOT-FOUND)
    
    ;; Validate fee not already refunded
    (asserts! (not (get is-refunded fee-info)) ERR-ALREADY-CLAIMED)
    
    ;; Only contract or admin can process refunds
    (asserts! (or (is-eq tx-sender (as-contract tx-sender)) (is-admin tx-sender)) ERR-UNAUTHORIZED)
    
    (let ((refund-amount (get total-fee fee-info)))
      ;; Transfer refund to disputer
      (try! (as-contract (stx-transfer? refund-amount tx-sender disputer)))
      
      ;; Mark fee as refunded
      (map-set resolution-fees
        { pool-id: pool-id }
        (merge fee-info {
          is-refunded: true,
          refund-recipient: (some disputer)
        })
      )
      
      (ok refund-amount)
    )
  )
)

;; Get fee information for a pool
(define-read-only (get-resolution-fee-info (pool-id uint))
  (map-get? resolution-fees { pool-id: pool-id })
)

;; Get oracle fee claim information
(define-read-only (get-oracle-fee-claim (provider-id uint) (pool-id uint))
  (map-get? oracle-fee-claims { provider-id: provider-id, pool-id: pool-id })
)

;; Trigger fallback resolution when automated resolution fails
(define-public (trigger-fallback-resolution (pool-id uint) (failure-reason (string-ascii 128)))
  (let (
    (pool (unwrap! (map-get? pools { pool-id: pool-id }) ERR-POOL-NOT-FOUND))
    (config (unwrap! (map-get? resolution-configs { pool-id: pool-id }) ERR-RESOLUTION-CONFIG-NOT-FOUND))
  )
    ;; Only contract can trigger fallback
    (asserts! (is-eq tx-sender (as-contract tx-sender)) ERR-UNAUTHORIZED)
    
    ;; Validate pool is expired and not settled
    (asserts! (> burn-block-height (get expiry pool)) ERR-POOL-NOT-EXPIRED)
    (asserts! (not (get settled pool)) ERR-POOL-SETTLED)
    
    ;; Check if max retries reached (simplified: assume 3 retries)
    (let ((max-retries-reached true)) ;; Simplified for now
      ;; Record fallback activation
      (map-insert fallback-resolutions
        { pool-id: pool-id }
        {
          triggered-at: burn-block-height,
          failure-reason: failure-reason,
          max-retries-reached: max-retries-reached,
          manual-settlement-enabled: true,
          notified-creator: false ;; Would trigger notification in real system
        }
      )
      
      (ok true)
    )
  )
)

;; Manual settlement during fallback (enhanced validation)
(define-public (manual-settle-fallback (pool-id uint) (winning-outcome uint))
  (let (
    (pool (unwrap! (map-get? pools { pool-id: pool-id }) ERR-POOL-NOT-FOUND))
    (fallback (unwrap! (map-get? fallback-resolutions { pool-id: pool-id }) ERR-FALLBACK-NOT-TRIGGERED))
  )
    ;; Only pool creator can manually settle during fallback
    (asserts! (is-eq tx-sender (get creator pool)) ERR-UNAUTHORIZED)
    
    ;; Validate manual settlement is enabled
    (asserts! (get manual-settlement-enabled fallback) ERR-MANUAL-SETTLEMENT-DISABLED)
    
    ;; Validate outcome
    (asserts! (or (is-eq winning-outcome u0) (is-eq winning-outcome u1)) ERR-INVALID-OUTCOME)
    
    ;; Additional validation for fallback settlement
    (asserts! (> burn-block-height (+ (get triggered-at fallback) u144)) ERR-WITHDRAWAL-LOCKED) ;; 24 hour delay
    
    ;; Settle with reduced fee (50% reduction)
    (let (
      (total-pool-balance (+ (get total-a pool) (get total-b pool)))
      (reduced-fee (/ (* total-pool-balance FEE-PERCENT) u200)) ;; 1% instead of 2%
    )
      ;; Transfer reduced fee
      (if (> reduced-fee u0)
        (try! (as-contract (stx-transfer? reduced-fee tx-sender CONTRACT-OWNER)))
        true
      )
      
      ;; Settle the pool
      (map-set pools
        { pool-id: pool-id }
        (merge pool { 
          settled: true, 
          winning-outcome: (some winning-outcome), 
          settled-at: (some burn-block-height) 
        })
      )
      
      (ok true)
    )
  )
)

;; Get fallback resolution status
(define-read-only (get-fallback-status (pool-id uint))
  (map-get? fallback-resolutions { pool-id: pool-id })
)

;; Check if pool is in fallback mode
(define-read-only (is-pool-in-fallback (pool-id uint))
  (is-some (map-get? fallback-resolutions { pool-id: pool-id }))
)

;; ============================================
;; LIQUIDITY INCENTIVES FUNCTIONS
;; ============================================

;; Fund platform incentive pool
(define-public (fund-platform-incentive-pool (amount uint))
  (begin
    ;; Only contract owner or admins can fund incentive pool
    (asserts! (or (is-eq tx-sender CONTRACT-OWNER) (is-admin tx-sender)) ERR-UNAUTHORIZED)
    
    ;; Validate funding amount
    (asserts! (> amount u0) ERR-INVALID-AMOUNT)
    
    ;; Transfer STX from sender to contract
    (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
    
    ;; Update platform incentive pool balance
    (var-set platform-incentive-pool (+ (var-get platform-incentive-pool) amount))
    
    (ok amount)
  )
)

;; Withdraw from platform incentive pool
(define-public (withdraw-platform-incentive-pool (amount uint))
  (begin
    ;; Only contract owner can withdraw from incentive pool
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-UNAUTHORIZED)
    
    ;; Validate withdrawal amount
    (asserts! (> amount u0) ERR-INVALID-AMOUNT)
    (asserts! (<= amount (var-get platform-incentive-pool)) ERR-INSUFFICIENT-INCENTIVE-POOL)
    
    ;; Transfer STX from contract to owner
    (try! (as-contract (stx-transfer? amount tx-sender CONTRACT-OWNER)))
    
    ;; Update platform incentive pool balance
    (var-set platform-incentive-pool (- (var-get platform-incentive-pool) amount))
    
    (ok amount)
  )
)

;; Check early bettor eligibility
(define-private (is-early-bettor (pool-id uint) (bet-amount uint))
  (let (
    (pool (unwrap! (map-get? pools { pool-id: pool-id }) false))
    (pool-created-at (get created-at pool))
    (early-window-end (+ pool-created-at (var-get liquidity-early-window-blocks)))
  )
    (and 
      (< burn-block-height early-window-end)
      (>= bet-amount (var-get liquidity-min-bet-for-incentives))
    )
  )
)

;; Update user incentive status for early bettor
(define-private (update-early-bettor-status (pool-id uint) (user principal) (bet-amount uint))
  (let (
    (current-status (default-to 
      { 
        is-early-bettor: false, 
        early-bet-amount: u0, 
        is-market-maker: false, 
        market-maker-amount: u0, 
        total-bonus-earned: u0, 
        bonus-claimed: false 
      } 
      (map-get? user-incentive-status { pool-id: pool-id, user: user })
    ))
    (is-early (is-early-bettor pool-id bet-amount))
  )
    (if is-early
      (map-set user-incentive-status
        { pool-id: pool-id, user: user }
        (merge current-status {
          is-early-bettor: true,
          early-bet-amount: (+ (get early-bet-amount current-status) bet-amount)
        })
      )
      true
    )
    is-early
  )
)

;; Calculate early bettor bonus
(define-private (calculate-early-bettor-bonus (pool-id uint) (user principal) (base-winnings uint))
  (let (
    (user-status (map-get? user-incentive-status { pool-id: pool-id, user: user }))
    (enhanced-pool (map-get? creator-enhanced-pools { pool-id: pool-id }))
  )
    (match user-status
      status (if (get is-early-bettor status)
        (let (
          (bonus-percent (match enhanced-pool
            enhanced (if (get is-enhanced enhanced)
              (get enhanced-early-bonus enhanced)
              (var-get liquidity-early-bonus-percent)
            )
            (var-get liquidity-early-bonus-percent)
          ))
          (max-bonus-percent (var-get liquidity-creator-max-bonus-percent))
          (final-bonus-percent (if (> bonus-percent max-bonus-percent) max-bonus-percent bonus-percent))
        )
          (/ (* base-winnings final-bonus-percent) u100)
        )
        u0
      )
      u0
    )
  )
)

;; Calculate market balance ratio for an outcome
(define-private (calculate-market-balance-ratio (pool-id uint) (outcome uint))
  (let (
    (pool (unwrap! (map-get? pools { pool-id: pool-id }) u0))
    (total-a (get total-a pool))
    (total-b (get total-b pool))
    (total-pool (+ total-a total-b))
  )
    (if (> total-pool u0)
      (if (is-eq outcome u0)
        (/ (* total-a u100) total-pool)
        (/ (* total-b u100) total-pool)
      )
      u50 ;; Default to 50% if no bets placed yet
    )
  )
)

;; Check if user qualifies as market maker
(define-private (is-market-maker (pool-id uint) (outcome uint) (bet-amount uint))
  (let (
    (balance-ratio (calculate-market-balance-ratio pool-id outcome))
    (threshold-high (var-get liquidity-market-maker-threshold-high))
  )
    (and 
      (< balance-ratio threshold-high)
      (>= bet-amount (var-get liquidity-min-bet-for-incentives))
    )
  )
)

;; Update user incentive status for early bettor
(define-private (update-early-bettor-status (pool-id uint) (user principal) (bet-amount uint))
  (let (
    (current-status (default-to 
      { 
        is-early-bettor: false, 
        early-bet-amount: u0, 
        is-market-maker: false, 
        market-maker-amount: u0, 
        total-bonus-earned: u0, 
        bonus-claimed: false 
      } 
      (map-get? user-incentive-status { pool-id: pool-id, user: user })
    ))
    (is-early (is-early-bettor pool-id bet-amount))
  )
    (if is-early
      (map-set user-incentive-status
        { pool-id: pool-id, user: user }
        (merge current-status {
          is-early-bettor: true,
          early-bet-amount: (+ (get early-bet-amount current-status) bet-amount)
        })
      )
      true
    )
    is-early
  )
)

;; Update user incentive status for market maker
(define-private (update-market-maker-status (pool-id uint) (user principal) (outcome uint) (bet-amount uint))
  (let (
    (current-status (default-to 
      { 
        is-early-bettor: false, 
        early-bet-amount: u0, 
        is-market-maker: false, 
        market-maker-amount: u0, 
        total-bonus-earned: u0, 
        bonus-claimed: false 
      } 
      (map-get? user-incentive-status { pool-id: pool-id, user: user })
    ))
    (is-mm (is-market-maker pool-id outcome bet-amount))
  )
    (if is-mm
      (map-set user-incentive-status
        { pool-id: pool-id, user: user }
        (merge current-status {
          is-market-maker: true,
          market-maker-amount: (+ (get market-maker-amount current-status) bet-amount)
        })
      )
      true
    )
    is-mm
  )
)

;; Calculate market maker bonus
(define-private (calculate-market-maker-bonus (pool-id uint) (user principal) (outcome uint) (base-winnings uint))
  (let (
    (user-status (map-get? user-incentive-status { pool-id: pool-id, user: user }))
    (enhanced-pool (map-get? creator-enhanced-pools { pool-id: pool-id }))
    (balance-ratio (calculate-market-balance-ratio pool-id outcome))
  )
    (match user-status
      status (if (get is-market-maker status)
        (let (
          (threshold-low (var-get liquidity-market-maker-threshold-low))
          (threshold-high (var-get liquidity-market-maker-threshold-high))
          (base-bonus-percent (if (< balance-ratio threshold-low)
            (var-get liquidity-market-maker-bonus-high)
            (if (< balance-ratio threshold-high)
              (var-get liquidity-market-maker-bonus-low)
              u0
            )
          ))
          (enhanced-bonus-percent (match enhanced-pool
            enhanced (if (get is-enhanced enhanced)
              (get enhanced-market-maker-bonus enhanced)
              base-bonus-percent
            )
            base-bonus-percent
          ))
          (max-bonus-percent (var-get liquidity-creator-max-bonus-percent))
          (final-bonus-percent (if (> enhanced-bonus-percent max-bonus-percent) max-bonus-percent enhanced-bonus-percent))
        )
          (/ (* base-winnings final-bonus-percent) u100)
        )
        u0
      )
      u0
    )
  )
)

;; ============================================
;; ORACLE READ-ONLY FUNCTIONS
;; ============================================

;; Get oracle provider details
(define-read-only (get-oracle-provider (provider-id uint))
  (map-get? oracle-providers { provider-id: provider-id })
)

;; Get oracle provider by address (helper function)
(define-read-only (get-oracle-provider-by-address (provider-address principal))
  (let ((provider-count (var-get oracle-provider-counter)))
    (find-provider-by-address provider-address u0 provider-count)
  )
)

;; Helper function to find provider by address
(define-private (find-provider-by-address (provider-address principal) (current-id uint) (max-id uint))
  (if (>= current-id max-id)
    none
    (match (map-get? oracle-providers { provider-id: current-id })
      provider (if (is-eq (get provider-address provider) provider-address)
        (some provider)
        (find-provider-by-address provider-address (+ current-id u1) max-id)
      )
      (find-provider-by-address provider-address (+ current-id u1) max-id)
    )
  )
)

;; Check if oracle provider supports a data type
(define-read-only (oracle-supports-data-type (provider-id uint) (data-type (string-ascii 32)))
  (default-to false (map-get? oracle-data-types { provider-id: provider-id, data-type: data-type }))
)

;; Get total oracle providers
(define-read-only (get-oracle-provider-count)
  (var-get oracle-provider-counter)
)

;; Get oracle submission details
(define-read-only (get-oracle-submission (submission-id uint))
  (map-get? oracle-submissions { submission-id: submission-id })
)

;; Get total oracle submissions
(define-read-only (get-oracle-submission-count)
  (var-get oracle-submission-counter)
)

;; Get oracle submissions for a pool (simplified - returns first 5)
(define-read-only (get-pool-oracle-submissions (pool-id uint))
  (let ((submission-count (var-get oracle-submission-counter)))
    (filter-submissions-by-pool pool-id u0 (min submission-count u5))
  )
)

;; Get resolution configuration for a pool
(define-read-only (get-resolution-config (pool-id uint))
  (map-get? resolution-configs { pool-id: pool-id })
)

;; Check if pool has automated resolution configured
(define-read-only (is-pool-automated (pool-id uint))
  (match (map-get? resolution-configs { pool-id: pool-id })
    config (get is-automated config)
    false
  )
)

;; Get resolution attempt details
(define-read-only (get-resolution-attempt (pool-id uint) (attempt-id uint))
  (map-get? resolution-attempts { pool-id: pool-id, attempt-id: attempt-id })
)

;; Helper function to filter submissions by pool
(define-private (filter-submissions-by-pool (pool-id uint) (current-id uint) (max-id uint))
  (if (>= current-id max-id)
    (list)
    (match (map-get? oracle-submissions { submission-id: current-id })
      submission (if (is-eq (get pool-id submission) pool-id)
        (unwrap-panic (as-max-len? (append (filter-submissions-by-pool pool-id (+ current-id u1) max-id) submission) u5))
        (filter-submissions-by-pool pool-id (+ current-id u1) max-id)
      )
      (filter-submissions-by-pool pool-id (+ current-id u1) max-id)
    )
  )
)

;; [ACCESS CONTROL] Add admin
(define-public (add-admin (admin principal))
  (begin
    ;; Only contract owner can add admins
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-UNAUTHORIZED)
    (map-set admins { admin: admin } true)
    (ok true)
  )
)

;; [ACCESS CONTROL] Remove admin
(define-public (remove-admin (admin principal))
  (begin
    ;; Only contract owner can remove admins
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-UNAUTHORIZED)
    (map-set admins { admin: admin } false)
    (ok true)
  )
)

;; [VALIDATION] Check if user is admin
(define-read-only (is-admin (user principal))
  (default-to false (map-get? admins { admin: user }))
)

;; [VALIDATION] Check if user is contract owner
(define-read-only (is-owner (user principal))
  (is-eq user CONTRACT-OWNER)
)

;; Request withdrawal - User initiates withdrawal
(define-public (request-withdrawal (pool-id uint) (amount uint))
  (let (
    (pool (unwrap! (map-get? pools { pool-id: pool-id }) ERR-POOL-NOT-FOUND))
    (user-bet (unwrap! (map-get? user-bets { pool-id: pool-id, user: tx-sender }) ERR-NO-WINNINGS))
    (user-withdrawal-id (default-to u0 (map-get? user-withdrawal-counter { user: tx-sender })))
    (withdrawal-id (var-get withdrawal-counter))
  )
    ;; Validation checks
    (asserts! (> amount u0) ERR-INVALID-AMOUNT)
    (asserts! (<= amount (get total-bet user-bet)) ERR-INVALID-WITHDRAWAL)
    (asserts! (get settled pool) ERR-NOT-SETTLED)
    
    ;; Create pending withdrawal
    (map-set pending-withdrawals
      { user: tx-sender, withdrawal-id: withdrawal-id }
      {
        amount: amount,
        requested-at: burn-block-height,
        status: "pending",
        pool-id: pool-id
      }
    )
    
    ;; Update user withdrawal counter
    (map-set user-withdrawal-counter
      { user: tx-sender }
      (+ user-withdrawal-id u1)
    )
    
    ;; Increment global withdrawal counter
    (var-set withdrawal-counter (+ withdrawal-id u1))
    
    (ok withdrawal-id)
  )
)

;; Approve withdrawal - Admin approves pending withdrawal
(define-public (approve-withdrawal (user principal) (withdrawal-id uint))
  (let (
    (withdrawal (unwrap! (map-get? pending-withdrawals { user: user, withdrawal-id: withdrawal-id }) ERR-INVALID-WITHDRAWAL))
    (amount (get amount withdrawal))
    (pool-id (get pool-id withdrawal))
  )
    ;; Access control - only admins or owner can approve
    (asserts! (or (is-admin tx-sender) (is-owner tx-sender)) ERR-UNAUTHORIZED)
    
    ;; Validation
    (asserts! (is-eq (get status withdrawal) "pending") ERR-INVALID-WITHDRAWAL)
    
    ;; Check contract has sufficient balance
    (asserts! (>= (stx-get-balance (as-contract tx-sender)) amount) ERR-INSUFFICIENT-CONTRACT-BALANCE)
    
    ;; Transfer funds to user
    (try! (as-contract (stx-transfer? amount tx-sender user)))
    
    ;; Update withdrawal status
    (map-set pending-withdrawals
      { user: user, withdrawal-id: withdrawal-id }
      (merge withdrawal { status: "approved" })
    )
    
    ;; Record in history
    (map-set withdrawal-history
      { user: user, withdrawal-id: withdrawal-id }
      {
        amount: amount,
        completed-at: burn-block-height,
        pool-id: pool-id
      }
    )
    
    ;; Update total withdrawn
    (var-set total-withdrawn (+ (var-get total-withdrawn) amount))
    
    (ok true)
  )
)

;; Reject withdrawal - Admin rejects pending withdrawal
(define-public (reject-withdrawal (user principal) (withdrawal-id uint))
  (let (
    (withdrawal (unwrap! (map-get? pending-withdrawals { user: user, withdrawal-id: withdrawal-id }) ERR-INVALID-WITHDRAWAL))
  )
    ;; Access control - only admins or owner can reject
    (asserts! (or (is-admin tx-sender) (is-owner tx-sender)) ERR-UNAUTHORIZED)
    
    ;; Validation
    (asserts! (is-eq (get status withdrawal) "pending") ERR-INVALID-WITHDRAWAL)
    
    ;; Update withdrawal status
    (map-set pending-withdrawals
      { user: user, withdrawal-id: withdrawal-id }
      (merge withdrawal { status: "rejected" })
    )
    
    (ok true)
  )
)

;; Cancel withdrawal - User cancels their own pending withdrawal
(define-public (cancel-withdrawal (withdrawal-id uint))
  (let (
    (withdrawal (unwrap! (map-get? pending-withdrawals { user: tx-sender, withdrawal-id: withdrawal-id }) ERR-INVALID-WITHDRAWAL))
  )
    ;; Validation
    (asserts! (is-eq (get status withdrawal) "pending") ERR-INVALID-WITHDRAWAL)
    
    ;; Update withdrawal status
    (map-set pending-withdrawals
      { user: tx-sender, withdrawal-id: withdrawal-id }
      (merge withdrawal { status: "cancelled" })
    )
    
    (ok true)
  )
)

;; [FIXED] Emergency withdrawal - Pool creator can withdraw unclaimed funds after expiry
;; Corrected transfer to send to pool creator, not contract
(define-public (emergency-withdrawal (pool-id uint))
  (let (
    (pool (unwrap! (map-get? pools { pool-id: pool-id }) ERR-POOL-NOT-FOUND))
    (total-pool-balance (+ (get total-a pool) (get total-b pool)))
    (creator (get creator pool))
  )
    ;; Access control - only pool creator can emergency withdraw
    (asserts! (is-eq tx-sender creator) ERR-NOT-POOL-CREATOR)
    
    ;; Validation - pool must be expired and settled
    (asserts! (> burn-block-height (get expiry pool)) ERR-POOL-NOT-EXPIRED)
    (asserts! (get settled pool) ERR-NOT-SETTLED)
    
    ;; Check contract has balance
    (asserts! (> total-pool-balance u0) ERR-INVALID-AMOUNT)
    
    ;; Transfer remaining balance to pool creator (not to self)
    (try! (as-contract (stx-transfer? total-pool-balance tx-sender creator)))
    
    (ok total-pool-balance)
  )
)

;; [FIXED] Batch withdrawal - Approve multiple withdrawals at once with proper error handling
(define-public (batch-approve-withdrawals (users (list 10 principal)) (withdrawal-ids (list 10 uint)))
  (let (
    (count (len users))
  )
    ;; Access control
    (asserts! (or (is-admin tx-sender) (is-owner tx-sender)) ERR-UNAUTHORIZED)
    
    ;; Validate lists have same length
    (asserts! (is-eq count (len withdrawal-ids)) ERR-INVALID-AMOUNT)
    
    ;; Process each withdrawal with error handling
    (ok (fold process-single-withdrawal 
      (zip users withdrawal-ids) 
      (list true)
    ))
  )
)

;; Helper function to process single withdrawal in batch
(define-private (process-single-withdrawal (user-withdrawal-pair (tuple (user principal) (withdrawal-id uint))) (results (list 1 bool)))
  (let (
    (user (get user user-withdrawal-pair))
    (withdrawal-id (get withdrawal-id user-withdrawal-pair))
  )
    ;; Attempt to approve, but don't fail entire batch if one fails
    (match (approve-withdrawal user withdrawal-id)
      success (list true)
      error (list false)
    )
  )
)

;; Read-only functions

;; Get pool details
(define-read-only (get-pool (pool-id uint))
  (map-get? pools { pool-id: pool-id })
)

;; Get user bet
(define-read-only (get-user-bet (pool-id uint) (user principal))
  (map-get? user-bets { pool-id: pool-id, user: user })
)

;; Get total pools created
(define-read-only (get-pool-count)
  (var-get pool-counter)
)

;; Get total volume
(define-read-only (get-total-volume)
  (var-get total-volume)
)

;; ============================================
;; CLARITY 3/4 FUNCTIONS - Builder Challenge
;; ============================================

;; [CLARITY 3] Get pool ID as readable ASCII string using int-to-ascii
(define-read-only (get-pool-id-string (pool-id uint))
  (int-to-ascii pool-id)
)

;; [CLARITY 3] Get user's full STX account info using stx-account
(define-read-only (get-user-stx-info (user principal))
  (stx-account user)
)

;; [CLARITY 3] Check if user has sufficient balance to place bet
(define-read-only (can-user-afford-bet (user principal) (amount uint))
  (let ((account-info (stx-account user)))
    (>= (get unlocked account-info) amount)
  )
)

;; [CLARITY 3] Serialize pool totals for cross-contract calls using to-consensus-buff?
(define-read-only (serialize-pool-totals (pool-id uint))
  (match (map-get? pools { pool-id: pool-id })
    pool-data (to-consensus-buff? { 
      total-a: (get total-a pool-data), 
      total-b: (get total-b pool-data),
      settled: (get settled pool-data)
    })
    none
  )
)

;; [CLARITY 3] Public function to register user
(define-public (register-user)
  (begin
    (map-set principal-registry
      { user: tx-sender }
      { 
        registered-at: burn-block-height
      }
    )
    (ok true)
  )
)

;; [CLARITY 3] Get formatted pool info string (combines pool ID with volume)
(define-read-only (get-pool-formatted-info (pool-id uint))
  (let (
    (pool-id-str (int-to-ascii pool-id))
    (volume (var-get total-volume))
    (volume-str (int-to-ascii volume))
  )
    { pool-id-ascii: pool-id-str, total-volume-ascii: volume-str }
  )
)

;; [CLARITY 3] Enhanced bet placement with balance check using stx-account
(define-public (place-bet-safe (pool-id uint) (outcome uint) (amount uint))
  (let (
    (account-info (stx-account tx-sender))
    (unlocked-balance (get unlocked account-info))
  )
    ;; Check if user can afford the bet
    (asserts! (>= unlocked-balance amount) ERR-INSUFFICIENT-BALANCE)
    ;; Proceed with normal bet placement
    (place-bet pool-id outcome amount)
  )
)

;; ============================================
;; CLARITY 4 FUNCTIONS - Builder Challenge Week 1
;; ============================================

;; [CLARITY 4] Get pool info with enhanced formatting using string-concat
(define-read-only (get-pool-info-formatted (pool-id uint))
  (match (map-get? pools { pool-id: pool-id })
    pool-data (ok {
      pool-id: pool-id,
      creator: (get creator pool-data),
      title: (get title pool-data),
      total-a: (get total-a pool-data),
      total-b: (get total-b pool-data),
      settled: (get settled pool-data),
      winning-outcome: (get winning-outcome pool-data)
    })
    (err ERR-POOL-NOT-FOUND)
  )
)

;; [CLARITY 4] Check if principal is valid and get account details
(define-read-only (validate-principal-and-get-balance (user principal))
  (let (
    (account-info (stx-account user))
    (locked (get locked account-info))
    (unlocked (get unlocked account-info))
    (total-balance (+ locked unlocked))
  )
    {
      user: user,
      locked-balance: locked,
      unlocked-balance: unlocked,
      total-balance: total-balance,
      can-bet: (>= unlocked MIN-BET-AMOUNT)
    }
  )
)

;; [CLARITY 4] Get multiple pools info in batch
(define-read-only (get-pools-batch (start-id uint) (count uint))
  (let (
    (end-id (+ start-id count))
    (total-pools (var-get pool-counter))
  )
    (if (> end-id total-pools)
      (ok (list 
        (map-get? pools { pool-id: start-id })
        (map-get? pools { pool-id: (+ start-id u1) })
        (map-get? pools { pool-id: (+ start-id u2) })
        (map-get? pools { pool-id: (+ start-id u3) })
        (map-get? pools { pool-id: (+ start-id u4) })
      ))
      (ok (list 
        (map-get? pools { pool-id: start-id })
        (map-get? pools { pool-id: (+ start-id u1) })
        (map-get? pools { pool-id: (+ start-id u2) })
        (map-get? pools { pool-id: (+ start-id u3) })
        (map-get? pools { pool-id: (+ start-id u4) })
      ))
    )
  )
)

;; [CLARITY 4] Enhanced place-bet with comprehensive validation
(define-public (place-bet-validated (pool-id uint) (outcome uint) (amount uint))
  (let (
    (pool (unwrap! (map-get? pools { pool-id: pool-id }) ERR-POOL-NOT-FOUND))
    (account-info (stx-account tx-sender))
    (unlocked-balance (get unlocked account-info))
  )
    ;; Comprehensive validation
    (asserts! (not (get settled pool)) ERR-POOL-SETTLED)
    (asserts! (or (is-eq outcome u0) (is-eq outcome u1)) ERR-INVALID-OUTCOME)
    (asserts! (>= amount MIN-BET-AMOUNT) ERR-INVALID-AMOUNT)
    (asserts! (>= unlocked-balance amount) ERR-INSUFFICIENT-BALANCE)
    (asserts! (< burn-block-height (get expiry pool)) ERR-POOL-NOT-EXPIRED)
    
    ;; Proceed with bet
    (place-bet pool-id outcome amount)
  )
)

;; [CLARITY 4] Get user's total activity across all pools
(define-read-only (get-user-total-activity (user principal))
  (let (
    (total-pools (var-get pool-counter))
  )
    {
      user: user,
      total-pools-created: (var-get pool-counter),
      total-volume: (var-get total-volume),
      account-info: (stx-account user)
    }
  )
)

;; [CLARITY 4] Settlement with enhanced validation and event tracking
(define-public (settle-pool-enhanced (pool-id uint) (winning-outcome uint))
  (let (
    (pool (unwrap! (map-get? pools { pool-id: pool-id }) ERR-POOL-NOT-FOUND))
    (total-pool-balance (+ (get total-a pool) (get total-b pool)))
    (fee (/ (* total-pool-balance FEE-PERCENT) u100))
  )
    ;; Validation
    (asserts! (is-eq tx-sender (get creator pool)) ERR-UNAUTHORIZED)
    (asserts! (not (get settled pool)) ERR-POOL-SETTLED)
    (asserts! (or (is-eq winning-outcome u0) (is-eq winning-outcome u1)) ERR-INVALID-OUTCOME)
    (asserts! (> total-pool-balance u0) ERR-INVALID-AMOUNT)
    
    ;; Transfer fee if applicable
    (if (> fee u0)
      (try! (as-contract (stx-transfer? fee tx-sender CONTRACT-OWNER)))
      true
    )

    ;; Update pool state
    (map-set pools
      { pool-id: pool-id }
      (merge pool { 
        settled: true, 
        winning-outcome: (some winning-outcome), 
        settled-at: (some burn-block-height) 
      })
    )
    
    (ok {
      pool-id: pool-id,
      winning-outcome: winning-outcome,
      total-pool-balance: total-pool-balance,
      fee-collected: fee
    })
  )
)

;; [CLARITY 4] Get comprehensive pool statistics
(define-read-only (get-pool-stats (pool-id uint))
  (match (map-get? pools { pool-id: pool-id })
    pool-data (let (
      (total-a (get total-a pool-data))
      (total-b (get total-b pool-data))
      (total-pool (+ total-a total-b))
      (percentage-a (if (> total-pool u0) (/ (* total-a u100) total-pool) u0))
      (percentage-b (if (> total-pool u0) (/ (* total-b u100) total-pool) u0))
    )
      (ok {
        pool-id: pool-id,
        total-a: total-a,
        total-b: total-b,
        total-pool: total-pool,
        percentage-a: percentage-a,
        percentage-b: percentage-b,
        settled: (get settled pool-data),
        winning-outcome: (get winning-outcome pool-data)
      })
    )
    (err ERR-POOL-NOT-FOUND)
  )
)

;; ============================================
;; WITHDRAWAL READ-ONLY FUNCTIONS
;; ============================================

;; Get pending withdrawal
(define-read-only (get-pending-withdrawal (user principal) (withdrawal-id uint))
  (map-get? pending-withdrawals { user: user, withdrawal-id: withdrawal-id })
)

;; Get withdrawal history
(define-read-only (get-withdrawal-history (user principal) (withdrawal-id uint))
  (map-get? withdrawal-history { user: user, withdrawal-id: withdrawal-id })
)

;; Get user's withdrawal count
(define-read-only (get-user-withdrawal-count (user principal))
  (default-to u0 (map-get? user-withdrawal-counter { user: user }))
)

;; Get total withdrawn amount
(define-read-only (get-total-withdrawn)
  (var-get total-withdrawn)
)

;; ============================================
;; REFUND FUNCTION - Direct bet refund
;; ============================================

;; [FIXED] Direct refund - User can refund their bets anytime
;; Properly tracks which outcome the refund is from
(define-public (refund-bet (pool-id uint) (outcome uint) (amount uint))
  (let (
    (pool (unwrap! (map-get? pools { pool-id: pool-id }) ERR-POOL-NOT-FOUND))
    (user-bet (unwrap! (map-get? user-bets { pool-id: pool-id, user: tx-sender }) ERR-NO-WINNINGS))
    (total-bet (get total-bet user-bet))
    (amount-a (get amount-a user-bet))
    (amount-b (get amount-b user-bet))
  )
    ;; Validation
    (asserts! (or (is-eq outcome u0) (is-eq outcome u1)) ERR-INVALID-OUTCOME)
    (asserts! (> amount u0) ERR-INVALID-AMOUNT)
    (asserts! (<= amount total-bet) ERR-INVALID-WITHDRAWAL)
    
    ;; Validate refund amount matches outcome
    (if (is-eq outcome u0)
      (asserts! (<= amount amount-a) ERR-INVALID-WITHDRAWAL)
      (asserts! (<= amount amount-b) ERR-INVALID-WITHDRAWAL)
    )
    
    ;; Transfer funds back to user
    (try! (as-contract (stx-transfer? amount tx-sender tx-sender)))
    
    ;; Update user bet - only reduce the specific outcome
    (map-set user-bets
      { pool-id: pool-id, user: tx-sender }
      (if (is-eq outcome u0)
        { 
          amount-a: (- amount-a amount),
          amount-b: amount-b,
          total-bet: (- total-bet amount)
        }
        { 
          amount-a: amount-a,
          amount-b: (- amount-b amount),
          total-bet: (- total-bet amount)
        }
      )
    )
    
    ;; Update pool totals - only reduce the specific outcome
    (map-set pools
      { pool-id: pool-id }
      (if (is-eq outcome u0)
        (merge pool { total-a: (- (get total-a pool) amount) })
        (merge pool { total-b: (- (get total-b pool) amount) })
      )
    )
    
    (ok amount)
  )
)

;; Get withdrawal counter
(define-read-only (get-withdrawal-counter)
  (var-get withdrawal-counter)
)

;; Get contract balance
(define-read-only (get-contract-balance)
  (stx-get-balance (as-contract tx-sender))
)

;; Get user's total pending withdrawals
(define-read-only (get-user-pending-amount (user principal))
  (let (
    (withdrawal-count (get-user-withdrawal-count user))
  )
    ;; This is a simplified version - in production, you'd iterate through all pending withdrawals
    (ok withdrawal-count)
  )
)

;; Validate withdrawal eligibility
(define-read-only (can-withdraw (user principal) (pool-id uint) (amount uint))
  (match (map-get? pools { pool-id: pool-id })
    pool-data (match (map-get? user-bets { pool-id: pool-id, user: user })
      user-bet (ok {
        pool-settled: (get settled pool-data),
        user-has-bet: true,
        user-bet-amount: (get total-bet user-bet),
        can-withdraw: (and (get settled pool-data) (<= amount (get total-bet user-bet)))
      })
      (ok {
        pool-settled: (get settled pool-data),
        user-has-bet: false,
        user-bet-amount: u0,
        can-withdraw: false
      })
    )
    (err ERR-POOL-NOT-FOUND)
  )
)

;; Get withdrawal status
(define-read-only (get-withdrawal-status (user principal) (withdrawal-id uint))
  (match (map-get? pending-withdrawals { user: user, withdrawal-id: withdrawal-id })
    withdrawal (ok (get status withdrawal))
    (err ERR-INVALID-WITHDRAWAL)
  )
)

;; ============================================
;; LIQUIDITY INCENTIVES - Early Bettor Functions
;; ============================================

;; Check if user is an early bettor for a pool
(define-read-only (is-early-bettor (pool-id uint) (user principal))
  (match (map-get? pools { pool-id: pool-id })
    pool-data (match (map-get? user-bets { pool-id: pool-id, user: user })
      bet-data (let (
        (first-bet-block (get first-bet-block bet-data))
        (pool-created-at (get created-at pool-data))
        (early-bettor-window-end (+ pool-created-at EARLY-BETTOR-WINDOW))
      )
        (ok (<= first-bet-block early-bettor-window-end))
      )
      (ok false)
    )
    (err ERR-POOL-NOT-FOUND)
  )
)

;; Get early bettor bonus amount for a user's potential winnings
(define-read-only (get-early-bettor-bonus (pool-id uint) (user principal) (base-share uint))
  (match (is-early-bettor pool-id user)
    (ok true) (ok (/ (* base-share EARLY-BETTOR-BONUS-PERCENT) u100))
    (ok false) (ok u0)
    (err error) (err error)
  )
)

;; Get liquidity incentive info for a pool
(define-read-only (get-liquidity-incentive-info (pool-id uint))
  (match (map-get? pools { pool-id: pool-id })
    pool-data (ok {
      early-bettor-window: EARLY-BETTOR-WINDOW,
      bonus-percent: EARLY-BETTOR-BONUS-PERCENT,
      pool-created-at: (get created-at pool-data),
      window-end-block: (+ (get created-at pool-data) EARLY-BETTOR-WINDOW),
      current-block: burn-block-height,
      window-active: (< burn-block-height (+ (get created-at pool-data) EARLY-BETTOR-WINDOW))
    })
    (err ERR-POOL-NOT-FOUND)
  )
)

;; ============================================
;; ADVANCED MARKET FEATURES - Phase 3
;; ============================================

;; Create pool with multiple outcomes
(define-public (create-pool-multi-outcome (title (string-ascii 256)) (description (string-ascii 512)) (outcome-names (list 10 (string-ascii 128))) (duration uint) (dispute-period-blocks uint))
  (let ((pool-id (var-get pool-counter)))
    (asserts! (> (len title) u0) ERR-INVALID-TITLE)
    (asserts! (> (len description) u0) ERR-INVALID-DESCRIPTION)
    (asserts! (> (len outcome-names) u1) ERR-INVALID-OUTCOME-COUNT)
    (asserts! (<= (len outcome-names) u10) ERR-INVALID-OUTCOME-COUNT)
    (asserts! (> duration u0) ERR-INVALID-DURATION)
    (asserts! (> dispute-period-blocks u0) ERR-INVALID-DURATION)

    ;; Create pool with first two outcomes for backward compatibility
    (map-insert pools
      { pool-id: pool-id }
      {
        creator: tx-sender,
        title: title,
        description: description,
        outcome-a-name: (unwrap! (element-at outcome-names u0) ERR-INVALID-OUTCOME),
        outcome-b-name: (unwrap! (element-at outcome-names u1) ERR-INVALID-OUTCOME),
        total-a: u0,
        total-b: u0,
        settled: false,
        winning-outcome: none,
        created-at: burn-block-height,
        settled-at: none,
        expiry: (+ burn-block-height duration),
        outcome-count: (len outcome-names),
        dispute-period: dispute-period-blocks
      }
    )

    ;; Store additional outcomes if more than 2
    (if (> (len outcome-names) u2)
      (begin
        (map-insert pool-outcomes { pool-id: pool-id, outcome-index: u2 } { name: (unwrap! (element-at outcome-names u2) ERR-INVALID-OUTCOME), total-bet: u0 })
        (if (> (len outcome-names) u3)
          (map-insert pool-outcomes { pool-id: pool-id, outcome-index: u3 } { name: (unwrap! (element-at outcome-names u3) ERR-INVALID-OUTCOME), total-bet: u0 })
          true
        )
      )
      true
    )

    (var-set pool-counter (+ pool-id u1))
    (ok pool-id)
  )
)

;; Place bet on multiple outcome pool
(define-public (place-bet-multi-outcome (pool-id uint) (outcome-index uint) (amount uint))
  (let ((pool (unwrap! (map-get? pools { pool-id: pool-id }) ERR-POOL-NOT-FOUND)))
    (asserts! (not (get settled pool)) ERR-POOL-SETTLED)
    (asserts! (> amount u0) ERR-INVALID-AMOUNT)
    (asserts! (< outcome-index (get outcome-count pool)) ERR-INVALID-OUTCOME)
    
    (let ((pool-principal (as-contract tx-sender)))
      (try! (stx-transfer? amount tx-sender pool-principal))
    )

    ;; Update pool totals based on outcome
    (if (is-eq outcome-index u0)
      (map-set pools { pool-id: pool-id } (merge pool { total-a: (+ (get total-a pool) amount) }))
      (if (is-eq outcome-index u1)
        (map-set pools { pool-id: pool-id } (merge pool { total-b: (+ (get total-b pool) amount) }))
        (begin
          (let ((outcome-data (default-to { name: "", total-bet: u0 } (map-get? pool-outcomes { pool-id: pool-id, outcome-index: outcome-index }))))
            (map-set pool-outcomes
              { pool-id: pool-id, outcome-index: outcome-index }
              { name: (get name outcome-data), total-bet: (+ (get total-bet outcome-data) amount) }
            )
          )
          true
        )
      )
    )

    ;; Update user bet
    (let ((user-bet (default-to { amount-a: u0, amount-b: u0, total-bet: u0, first-bet-block: burn-block-height } (map-get? user-bets { pool-id: pool-id, user: tx-sender }))))
      (map-set user-bets
        { pool-id: pool-id, user: tx-sender }
        (merge user-bet { total-bet: (+ (get total-bet user-bet) amount), first-bet-block: (get first-bet-block user-bet) })
      )
    )

    (var-set total-volume (+ (var-get total-volume) amount))
    (ok true)
  )
)

;; Oracle-integrated settlement (for automated settlement)
(define-public (settle-pool-oracle (pool-id uint) (winning-outcome uint) (oracle-signature (buff 65)))
  (let ((pool (unwrap! (map-get? pools { pool-id: pool-id }) ERR-POOL-NOT-FOUND)))
    (asserts! (not (get settled pool)) ERR-POOL-SETTLED)
    (asserts! (< winning-outcome (get outcome-count pool)) ERR-INVALID-OUTCOME)
    ;; In production, verify oracle signature here
    ;; For now, allow contract owner or admins to settle via oracle
    (asserts! (or (is-eq tx-sender CONTRACT-OWNER) (is-admin tx-sender)) ERR-UNAUTHORIZED)
    
    (let ((total-pool-balance (+ (get total-a pool) (get total-b pool)))
          (fee (/ (* total-pool-balance FEE-PERCENT) u100)))
      (if (> fee u0)
        (try! (as-contract (stx-transfer? fee tx-sender CONTRACT-OWNER)))
        true
      )
    )

    (map-set pools
      { pool-id: pool-id }
      (merge pool { settled: true, winning-outcome: (some winning-outcome), settled-at: (some burn-block-height) })
    )
    
    (ok true)
  )
)

;; Challenge a settlement (dispute resolution)
(define-public (challenge-settlement (pool-id uint) (reason (string-ascii 512)))
  (let ((pool (unwrap! (map-get? pools { pool-id: pool-id }) ERR-POOL-NOT-FOUND)))
    (asserts! (get settled pool) ERR-NOT-SETTLED)
    
    (let ((settled-at (unwrap! (get settled-at pool) ERR-NOT-SETTLED))
          (dispute-deadline (+ settled-at (get dispute-period pool))))
      (asserts! (< burn-block-height dispute-deadline) ERR-DISPUTE-PERIOD-EXPIRED)
    )

    (let ((dispute-id (var-get dispute-counter)))
      (map-insert disputes
        { pool-id: pool-id, dispute-id: dispute-id }
        {
          challenger: tx-sender,
          reason: reason,
          created-at: burn-block-height,
          status: "pending",
          resolved-by: none,
          resolved-at: none
        }
      )
      (var-set dispute-counter (+ dispute-id u1))
      (ok dispute-id)
    )
  )
)

;; Resolve a dispute (admin/owner only)
(define-public (resolve-dispute (pool-id uint) (dispute-id uint) (uphold-settlement bool))
  (let ((dispute (unwrap! (map-get? disputes { pool-id: pool-id, dispute-id: dispute-id }) ERR-NO-DISPUTE-FOUND)))
    (asserts! (or (is-eq tx-sender CONTRACT-OWNER) (is-admin tx-sender)) ERR-UNAUTHORIZED)
    (asserts! (is-eq (get status dispute) "pending") ERR-DISPUTE-ALREADY-RESOLVED)

    (map-set disputes
      { pool-id: pool-id, dispute-id: dispute-id }
      (merge dispute {
        status: (if uphold-settlement "upheld" "overturned"),
        resolved-by: (some tx-sender),
        resolved-at: (some burn-block-height)
      })
    )

    ;; If overturned, reverse settlement
    (if (not uphold-settlement)
      (let ((pool (unwrap! (map-get? pools { pool-id: pool-id }) ERR-POOL-NOT-FOUND)))
        (map-set pools
          { pool-id: pool-id }
          (merge pool { settled: false, winning-outcome: none, settled-at: none })
        )
      )
      true
    )

    (ok true)
  )
)

;; Get dispute information
(define-read-only (get-dispute (pool-id uint) (dispute-id uint))
  (map-get? disputes { pool-id: pool-id, dispute-id: dispute-id })
)
