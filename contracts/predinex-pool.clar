;; ============================================
;; PREDINEX POOL - PREDICTION MARKET CONTRACT
;; ============================================
;; A decentralized prediction market built on Stacks blockchain
;; Language: Clarity 4
;; ============================================

;; ============================================
;; CONSTANTS & ERROR CODES
;; ============================================

(define-constant CONTRACT-OWNER tx-sender)
(define-constant ERR-UNAUTHORIZED u401)
(define-constant ERR-INVALID-AMOUNT u400)
(define-constant ERR-POOL-NOT-FOUND u404)
(define-constant ERR-POOL-SETTLED u409)
(define-constant ERR-INVALID-OUTCOME u422)
(define-constant ERR-NOT-SETTLED u412)
(define-constant ERR-ALREADY-CLAIMED u410)
(define-constant ERR-NO-WINNINGS u411)
(define-constant ERR-POOL-NOT-EXPIRED u413)
(define-constant ERR-INVALID-TITLE u420)
(define-constant ERR-INVALID-DESCRIPTION u421)
(define-constant ERR-INVALID-DURATION u423)
(define-constant ERR-INSUFFICIENT-BALANCE u424)
(define-constant ERR-WITHDRAWAL-FAILED u425)
(define-constant ERR-INVALID-WITHDRAWAL u426)
(define-constant ERR-WITHDRAWAL-LOCKED u427)
(define-constant ERR-INSUFFICIENT-CONTRACT-BALANCE u428)
(define-constant ERR-NOT-POOL-CREATOR u429)
(define-constant ERR-INVALID-OUTCOME-COUNT u430)
(define-constant ERR-DISPUTE-PERIOD-EXPIRED u431)
(define-constant ERR-NO-DISPUTE-FOUND u432)
(define-constant ERR-DISPUTE-ALREADY-RESOLVED u433)

;; Oracle system error constants
(define-constant ERR-ORACLE-NOT-FOUND u430)
(define-constant ERR-ORACLE-INACTIVE u431)
(define-constant ERR-INVALID-DATA-TYPE u432)
(define-constant ERR-ORACLE-ALREADY-EXISTS u433)
(define-constant ERR-INSUFFICIENT-CONFIDENCE u434)
(define-constant ERR-ORACLE-SUBMISSION-NOT-FOUND u435)

;; Resolution system error constants
(define-constant ERR-RESOLUTION-CONFIG-NOT-FOUND u436)
(define-constant ERR-INVALID-RESOLUTION-CRITERIA u437)
(define-constant ERR-INSUFFICIENT-ORACLE-SOURCES u438)
(define-constant ERR-RESOLUTION-ALREADY-CONFIGURED u439)
(define-constant ERR-AUTOMATED-RESOLUTION-FAILED u440)

;; Dispute system error constants
(define-constant ERR-DISPUTE-NOT-FOUND u441)
(define-constant ERR-DISPUTE-WINDOW-CLOSED u442)
(define-constant ERR-INSUFFICIENT-DISPUTE-BOND u443)
(define-constant ERR-ALREADY-VOTED u444)
(define-constant ERR-INVALID-DISPUTE_REASON u446)

;; Fallback resolution error constants
(define-constant ERR-FALLBACK-NOT-TRIGGERED u447)
(define-constant ERR-MANUAL-SETTLEMENT-DISABLED u448)
(define-constant ERR-MAX-RETRIES-NOT-REACHED u449)

;; Liquidity incentive error constants
(define-constant ERR-INSUFFICIENT-INCENTIVE-POOL u450)
(define-constant ERR-INVALID-INCENTIVE-CONFIG u451)
(define-constant ERR-INCENTIVE-ALREADY-CLAIMED u452)
(define-constant ERR-NOT-ELIGIBLE-FOR-INCENTIVE u453)
(define-constant ERR-CREATOR-FUND-INSUFFICIENT u454)
(define-constant ERR-INCENTIVE-POOL-EMPTY u455)

(define-constant FEE-PERCENT u2) ;; 2% fee
(define-constant MIN-BET-AMOUNT u10000) ;; 0.01 STX in microstacks
(define-constant WITHDRAWAL-DELAY u10)
(define-constant EARLY-BETTOR-WINDOW u50)
(define-constant EARLY-BETTOR-BONUS-PERCENT u5)

;; Liquidity incentive constants
(define-constant LIQUIDITY-EARLY-WINDOW-BLOCKS u144)
(define-constant LIQUIDITY-EARLY-BONUS-PERCENT u10)
(define-constant LIQUIDITY-MARKET-MAKER-THRESHOLD-LOW u20)
(define-constant LIQUIDITY-MARKET-MAKER-THRESHOLD-HIGH u30)
(define-constant LIQUIDITY-MARKET-MAKER-BONUS-HIGH u15)
(define-constant LIQUIDITY-MARKET-MAKER-BONUS-LOW u10)
(define-constant LIQUIDITY-MIN-BET-FOR-INCENTIVES u10000)
(define-constant LIQUIDITY-CREATOR-MAX-BONUS-PERCENT u25)

;; Resolution and fee constants
(define-constant RESOLUTION-FEE-PERCENT u5)
(define-constant DISPUTE-BOND-PERCENT u5)
(define-constant DISPUTE-WINDOW-BLOCKS u1008)

;; ============================================
;; DATA STRUCTURES
;; ============================================

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

(define-map user-bets
  { pool-id: uint, user: principal }
  {
    amount-a: uint,
    amount-b: uint,
    total-bet: uint,
    first-bet-block: uint
  }
)

(define-map claims
  { pool-id: uint, user: principal }
  bool
)

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

(define-map user-incentive-stats
  { user: principal }
  {
    total-early-bettor-bonus: uint,
    total-market-maker-bonus: uint,
    pools-with-bonuses: uint,
    last-bonus-claim: uint
  }
)

(define-map pool-incentive-funds
  { pool-id: uint }
  {
    creator-contribution: uint,
    platform-allocation: uint,
    total-distributed: uint,
    remaining-balance: uint
  }
)

;; Oracle system data structures
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

(define-map oracle-address-to-id
  { provider-address: principal }
  uint
)

(define-map oracle-data-types
  { provider-id: uint, data-type: (string-ascii 32) }
  bool
)

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

(define-map dispute-votes
  { dispute-id: uint, voter: principal }
  {
    vote: bool,
    voting-power: uint,
    voted-at: uint
  }
)

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

(define-map oracle-fee-claims
  { provider-id: uint, pool-id: uint }
  {
    fee-amount: uint,
    is-claimed: bool,
    claimed-at: (optional uint)
  }
)

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

(define-map admins
  { admin: principal }
  bool
)

;; ============================================
;; STATE VARIABLES
;; ============================================

(define-data-var pool-counter uint u0)
(define-data-var total-volume uint u0)
(define-data-var platform-incentive-pool uint u0)
(define-data-var total-incentives-distributed uint u0)
(define-data-var oracle-provider-counter uint u0)
(define-data-var oracle-submission-counter uint u0)
(define-data-var resolution-attempt-counter uint u0)
(define-data-var dispute-counter uint u0)

;; ============================================
;; PRIVATE FUNCTIONS
;; ============================================

(define-private (update-early-bettor-status (pool-id uint) (user principal) (amount uint))
  (match (map-get? pools { pool-id: pool-id })
    pool (let ((within-window (<= burn-block-height (+ (get created-at pool) EARLY-BETTOR-WINDOW))))
           (if within-window
               (let ((status (default-to 
                               { is-early-bettor: false, early-bet-amount: u0, is-market-maker: false, market-maker-amount: u0, total-bonus-earned: u0, bonus-claimed: false } 
                               (map-get? user-incentive-status { pool-id: pool-id, user: user }))))
                 (map-set user-incentive-status 
                   { pool-id: pool-id, user: user }
                   (merge status { is-early-bettor: true, early-bet-amount: (+ (get early-bet-amount status) amount) })
                 )
                 true
               )
               false
           )
         )
    false
  )
)

(define-private (calculate-market-balance-ratio (pool-id uint))
  (match (map-get? pools { pool-id: pool-id })
    pool (let (
           (total-a (get total-a pool))
           (total-b (get total-b pool))
         )
           (if (and (> total-a u0) (> total-b u0))
               (if (> total-a total-b)
                   (/ (* total-b u100) total-a)
                   (/ (* total-a u100) total-b)
               )
               u0
           )
         )
    u0
  )
)

(define-private (update-market-maker-status (pool-id uint) (user principal) (outcome uint) (amount uint))
  (match (map-get? pools { pool-id: pool-id })
    pool (let (
           (ratio-before (calculate-market-balance-ratio pool-id))
           (total-a (get total-a pool))
           (total-b (get total-b pool))
           (new-total-a (if (is-eq outcome u0) (+ total-a amount) total-a))
           (new-total-b (if (is-eq outcome u1) (+ total-b amount) total-b))
           (ratio-after (if (and (> new-total-a u0) (> new-total-b u0))
                            (if (> new-total-a new-total-b)
                                (/ (* new-total-b u100) new-total-a)
                                (/ (* new-total-a u100) new-total-b)
                            )
                            u0
                        ))
         )
           (if (> ratio-after ratio-before)
               (let ((status (default-to 
                               { is-early-bettor: false, early-bet-amount: u0, is-market-maker: false, market-maker-amount: u0, total-bonus-earned: u0, bonus-claimed: false } 
                               (map-get? user-incentive-status { pool-id: pool-id, user: user }))))
                 (map-set user-incentive-status 
                   { pool-id: pool-id, user: user }
                   (merge status { is-market-maker: true, market-maker-amount: (+ (get market-maker-amount status) amount) })
                 )
                 true
               )
               false
           )
         )
    false
  )
)

(define-private (calculate-early-bettor-bonus (pool-id uint) (user principal) (base-share uint))
  (match (map-get? user-incentive-status { pool-id: pool-id, user: user })
    status (if (get is-early-bettor status)
               (/ (* base-share LIQUIDITY-EARLY-BONUS-PERCENT) u100)
               u0
           )
    u0
  )
)

(define-private (calculate-market-maker-bonus (pool-id uint) (user principal) (outcome uint) (base-share uint))
  (match (map-get? user-incentive-status { pool-id: pool-id, user: user })
    status (if (get is-market-maker status)
               (let ((ratio (calculate-market-balance-ratio pool-id)))
                 (if (< ratio LIQUIDITY-MARKET-MAKER-THRESHOLD-LOW)
                     (/ (* base-share LIQUIDITY-MARKET-MAKER-BONUS-HIGH) u100)
                     (if (< ratio LIQUIDITY-MARKET-MAKER-THRESHOLD-HIGH)
                         (/ (* base-share LIQUIDITY-MARKET-MAKER-BONUS-LOW) u100)
                         u0
                     )
                 )
               )
               u0
           )
    u0
  )
)

(define-read-only (is-admin (user principal))
  (default-to false (map-get? admins { admin: user }))
)

(define-read-only (get-provider-id-by-address (provider-address principal))
  (map-get? oracle-address-to-id { provider-address: provider-address })
)

(define-read-only (get-provider-details (provider-id uint))
  (map-get? oracle-providers { provider-id: provider-id })
)

(define-private (oracle-supports-data-type (provider-id uint) (data-type (string-ascii 32)))
  (default-to false (map-get? oracle-data-types { provider-id: provider-id, data-type: data-type }))
)

(define-private (validate-single-oracle (oracle-id uint) (is-valid bool))
  (if is-valid
    (match (map-get? oracle-providers { provider-id: oracle-id })
      provider (get is-active provider)
      false
    )
    false
  )
)

(define-private (validate-oracle-sources (oracle-sources (list 5 uint)))
  (fold validate-single-oracle oracle-sources true)
)

;; ============================================
;; CORE FUNCTIONS - PHASE 1
;; ============================================

;; Create a new prediction pool
(define-public (create-pool (title (string-ascii 256)) (description (string-ascii 512)) (outcome-a (string-ascii 128)) (outcome-b (string-ascii 128)) (duration uint))
  (let ((pool-id (var-get pool-counter)))
    (if (and 
          (> (len title) u0) (<= (len title) u256)
          (> (len description) u0) (<= (len description) u512)
          (> (len outcome-a) u0) (<= (len outcome-a) u128)
          (> (len outcome-b) u0) (<= (len outcome-b) u128)
          (> duration u0)
        )
        (begin
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
        (err ERR-INVALID-TITLE)
    )
  )
)

;; Place a bet on a pool
(define-public (place-bet (pool-id uint) (outcome uint) (amount uint))
  (match (map-get? pools { pool-id: pool-id })
    pool (if (and 
               (not (get settled pool))
               (or (is-eq outcome u0) (is-eq outcome u1))
               (>= amount MIN-BET-AMOUNT)
               (< burn-block-height (get expiry pool))
             )
             (let ((pool-principal (as-contract tx-sender)))
               (match (stx-transfer? amount tx-sender pool-principal)
                 success (begin
                   ;; Update pool totals
                   (map-set pools 
                     { pool-id: pool-id } 
                     (if (is-eq outcome u0)
                         (merge pool { total-a: (+ (get total-a pool) amount) })
                         (merge pool { total-b: (+ (get total-b pool) amount) })
                     )
                   )
                   ;; Update user bet
                   (let ((user-bet (default-to 
                                     { amount-a: u0, amount-b: u0, total-bet: u0, first-bet-block: burn-block-height } 
                                     (map-get? user-bets { pool-id: pool-id, user: tx-sender }))))
                     (map-set user-bets
                       { pool-id: pool-id, user: tx-sender }
                       (if (is-eq outcome u0)
                         (merge user-bet { amount-a: (+ (get amount-a user-bet) amount), total-bet: (+ (get total-bet user-bet) amount) })
                         (merge user-bet { amount-b: (+ (get amount-b user-bet) amount), total-bet: (+ (get total-bet user-bet) amount) })
                       )
                     )
                   )
                   (let (
                     (is-early (update-early-bettor-status pool-id tx-sender amount))
                     (is-mm (update-market-maker-status pool-id tx-sender outcome amount))
                   )
                     (var-set total-volume (+ (var-get total-volume) amount))
                     (ok { early-bettor: is-early, market-maker: is-mm })
                   )
                 )
                 error (err error)
               )
             )
             (err ERR-INVALID-OUTCOME)
         )
    (err ERR-POOL-NOT-FOUND)
  )
)

;; Settle a pool
(define-public (settle-pool (pool-id uint) (winning-outcome uint))
  (match (map-get? pools { pool-id: pool-id })
    pool (if (is-eq tx-sender (get creator pool))
             (if (not (get settled pool))
                 (if (or (is-eq winning-outcome u0) (is-eq winning-outcome u1))
                     (let (
                       (total-pool-balance (+ (get total-a pool) (get total-b pool)))
                       (fee (/ (* total-pool-balance FEE-PERCENT) u100))
                     )
                       (match (if (> fee u0) (as-contract (stx-transfer? fee tx-sender CONTRACT-OWNER)) (ok true))
                         success (begin
                           (map-set pools
                             { pool-id: pool-id }
                             (merge pool { settled: true, winning-outcome: (some winning-outcome), settled-at: (some burn-block-height) })
                           )
                           (ok true)
                         )
                         error (err error)
                       )
                     )
                     (err ERR-INVALID-OUTCOME)
                 )
                 (err ERR-POOL-SETTLED)
             )
             (err ERR-UNAUTHORIZED)
         )
    (err ERR-POOL-NOT-FOUND)
  )
)

;; Claim winnings
(define-public (claim-winnings (pool-id uint))
  (match (map-get? pools { pool-id: pool-id })
    pool (match (map-get? user-bets { pool-id: pool-id, user: tx-sender })
      user-bet (match (get winning-outcome pool)
        winning-outcome (if (get settled pool)
            (if (is-none (map-get? claims { pool-id: pool-id, user: tx-sender }))
                (let
                  (
                    (user-winning-bet (if (is-eq winning-outcome u0) (get amount-a user-bet) (get amount-b user-bet)))
                    (pool-winning-total (if (is-eq winning-outcome u0) (get total-a pool) (get total-b pool)))
                    (total-pool-balance (+ (get total-a pool) (get total-b pool)))
                    (fee (/ (* total-pool-balance FEE-PERCENT) u100))
                    (net-pool-balance (- total-pool-balance fee))
                  )
                  (if (and (> user-winning-bet u0) (> pool-winning-total u0))
                      (let
                        (
                          (base-share (/ (* user-winning-bet net-pool-balance) pool-winning-total))
                          (early-bonus (calculate-early-bettor-bonus pool-id tx-sender base-share))
                          (mm-bonus (calculate-market-maker-bonus pool-id tx-sender winning-outcome base-share))
                          (total-liquidity-bonus (+ early-bonus mm-bonus))
                          (total-payout (+ base-share total-liquidity-bonus))
                        )
                        (match (as-contract (stx-transfer? total-payout tx-sender tx-sender))
                          success (begin
                            (if (> total-liquidity-bonus u0)
                                (let ((stats (default-to 
                                               { total-early-bettor-bonus: u0, total-market-maker-bonus: u0, pools-with-bonuses: u0, last-bonus-claim: u0 } 
                                               (map-get? user-incentive-stats { user: tx-sender }))))
                                  (begin
                                    (map-set user-incentive-stats 
                                      { user: tx-sender }
                                      {
                                        total-early-bettor-bonus: (+ (get total-early-bettor-bonus stats) early-bonus),
                                        total-market-maker-bonus: (+ (get total-market-maker-bonus stats) mm-bonus),
                                        pools-with-bonuses: (+ (get pools-with-bonuses stats) u1),
                                        last-bonus-claim: burn-block-height
                                      }
                                    )
                                    (match (map-get? user-incentive-status { pool-id: pool-id, user: tx-sender })
                                      status (map-set user-incentive-status 
                                               { pool-id: pool-id, user: tx-sender }
                                               (merge status { total-bonus-earned: total-liquidity-bonus, bonus-claimed: true })
                                             )
                                      true
                                    )
                                  )
                                )
                                true
                            )
                            (map-set claims { pool-id: pool-id, user: tx-sender } true)
                            (ok total-payout)
                          )
                          error (err error)
                        )
                      )
                      (err ERR-NO-WINNINGS)
                  )
                )
                (err ERR-ALREADY-CLAIMED)
            )
            (err ERR-NOT-SETTLED)
        )
        (err ERR-NOT-SETTLED)
      )
      (err ERR-NO-WINNINGS)
    )
    (err ERR-POOL-NOT-FOUND)
  )
)

;; ============================================
;; ORACLE SYSTEM FUNCTIONS
;; ============================================

(define-private (register-data-type-for-provider (data-type (string-ascii 32)) (provider-id uint))
  (begin
    (map-insert oracle-data-types
      { provider-id: provider-id, data-type: data-type }
      true
    )
    provider-id
  )
)

(define-public (register-oracle-provider (provider-address principal) (supported-data-types (list 10 (string-ascii 32))))
  (let ((provider-id (var-get oracle-provider-counter)))
    (if (or (is-eq tx-sender CONTRACT-OWNER) (is-admin tx-sender))
        (if (is-none (get-provider-id-by-address provider-address))
            (begin
              (map-insert oracle-providers
                { provider-id: provider-id }
                {
                  provider-address: provider-address,
                  reliability-score: u100,
                  total-resolutions: u0,
                  successful-resolutions: u0,
                  average-response-time: u0,
                  is-active: true,
                  registered-at: burn-block-height,
                  last-activity: burn-block-height
                }
              )
              (map-insert oracle-address-to-id { provider-address: provider-address } provider-id)
              (fold register-data-type-for-provider supported-data-types provider-id)
              (var-set oracle-provider-counter (+ provider-id u1))
              (ok provider-id)
            )
            (err ERR-ORACLE-ALREADY-EXISTS)
        )
        (err ERR-UNAUTHORIZED)
    )
  )
)

(define-public (deactivate-oracle-provider (provider-id uint))
  (match (map-get? oracle-providers { provider-id: provider-id })
    provider (if (or (is-eq tx-sender CONTRACT-OWNER) (is-admin tx-sender))
                 (begin
                   (map-set oracle-providers { provider-id: provider-id } (merge provider { is-active: false }))
                   (ok true)
                 )
                 (err ERR-UNAUTHORIZED))
    (err ERR-ORACLE-NOT-FOUND)
  )
)

(define-public (reactivate-oracle-provider (provider-id uint))
  (match (map-get? oracle-providers { provider-id: provider-id })
    provider (if (or (is-eq tx-sender CONTRACT-OWNER) (is-admin tx-sender))
                 (begin
                   (map-set oracle-providers { provider-id: provider-id } (merge provider { is-active: true, last-activity: burn-block-height }))
                   (ok true)
                 )
                 (err ERR-UNAUTHORIZED))
    (err ERR-ORACLE-NOT-FOUND)
  )
)

(define-public (submit-oracle-data (pool-id uint) (data-value (string-ascii 256)) (data-type (string-ascii 32)) (confidence-score uint))
  (match (get-provider-id-by-address tx-sender)
    provider-id (match (map-get? oracle-providers { provider-id: provider-id })
      provider (let ((submission-id (var-get oracle-submission-counter)))
                 (if (get is-active provider)
                     (if (oracle-supports-data-type provider-id data-type)
                         (if (<= confidence-score u100)
                             (match (map-get? pools { pool-id: pool-id })
                               pool (begin
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
                                 (var-set oracle-submission-counter (+ submission-id u1))
                                 (ok submission-id)
                               )
                               (err ERR-POOL-NOT-FOUND)
                             )
                             (err ERR-INSUFFICIENT-CONFIDENCE)
                         )
                         (err ERR-INVALID-DATA-TYPE)
                     )
                     (err ERR-ORACLE-INACTIVE)
                 )
               )
      (err ERR-ORACLE-NOT-FOUND)
    )
    (err ERR-ORACLE-NOT-FOUND)
  )
)

(define-public (configure-pool-resolution 
  (pool-id uint) 
  (oracle-sources (list 5 uint)) 
  (resolution-criteria (string-ascii 512))
  (criteria-type (string-ascii 32))
  (threshold-value (optional uint))
  (logical-operator (string-ascii 8))
  (retry-attempts uint))
  (match (map-get? pools { pool-id: pool-id })
    pool (if (is-eq tx-sender (get creator pool))
             (match (map-get? resolution-configs { pool-id: pool-id })
               config (err ERR-RESOLUTION-ALREADY-CONFIGURED)
               (if (and 
                    (> (len oracle-sources) u0)
                    (validate-oracle-sources oracle-sources)
                    (> (len resolution-criteria) u0)
                    (> (len criteria-type) u0)
                    (or (is-eq logical-operator "AND") (is-eq logical-operator "OR"))
                   )
                   (let (
                     (total-pool-value (+ (get total-a pool) (get total-b pool)))
                     (resolution-fee (/ (* total-pool-value u5) u1000))
                   )
                     (begin
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
                   (err ERR-INVALID-RESOLUTION-CRITERIA)
               )
             )
             (err ERR-UNAUTHORIZED)
         )
    (err ERR-POOL-NOT-FOUND)
  )
)

(define-public (attempt-automated-resolution (pool-id uint))
  (match (map-get? pools { pool-id: pool-id })
    pool (match (map-get? resolution-configs { pool-id: pool-id })
      config (let ((attempt-id (var-get resolution-attempt-counter)))
               (if (and 
                    (> burn-block-height (get expiry pool))
                    (not (get settled pool))
                    (get is-automated config)
                   )
                   (let ((oracle-sources (get oracle-sources config)))
                     (if (> (len oracle-sources) u0)
                         (let ((outcome (mod (unwrap-panic (element-at oracle-sources u0)) u2)))
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
                           (match (settle-pool pool-id outcome)
                             success (begin
                               (var-set resolution-attempt-counter (+ attempt-id u1))
                               (ok outcome)
                             )
                             error (err error)
                           )
                         )
                         (begin
                           (map-insert resolution-attempts
                             { pool-id: pool-id, attempt-id: attempt-id }
                             {
                               attempted-at: burn-block-height,
                               oracle-data-used: (list),
                               result: none,
                               failure-reason: (some "No oracle sources"),
                               is-successful: false
                             }
                           )
                           (var-set resolution-attempt-counter (+ attempt-id u1))
                           (err ERR-AUTOMATED-RESOLUTION-FAILED)
                         )
                     )
                   )
                   (err ERR-AUTOMATED-RESOLUTION-FAILED)
               )
             )
      (err ERR-RESOLUTION-CONFIG-NOT-FOUND)
    )
    (err ERR-POOL-NOT-FOUND)
  )
)

;; Dispute functions
(define-public (create-dispute (pool-id uint) (dispute-reason (string-ascii 512)) (evidence-hash (optional (buff 32))))
  (match (map-get? pools { pool-id: pool-id })
    pool (if (get settled pool)
             (if (> (len dispute-reason) u0)
                 (let (
                   (dispute-id (var-get dispute-counter))
                   (total-pool-value (+ (get total-a pool) (get total-b pool)))
                   (dispute-bond (/ (* total-pool-value u5) u100))
                 )
                   (if (>= (stx-get-balance tx-sender) dispute-bond)
                       (match (stx-transfer? dispute-bond tx-sender (as-contract tx-sender))
                         success (begin
                           (map-insert pool-disputes
                             { dispute-id: dispute-id }
                             {
                               pool-id: pool-id,
                               disputer: tx-sender,
                               dispute-bond: dispute-bond,
                               dispute-reason: dispute-reason,
                               evidence-hash: evidence-hash,
                               voting-deadline: (+ burn-block-height u1008),
                               votes-for: u0,
                               votes-against: u0,
                               status: "active",
                               resolution: none,
                               created-at: burn-block-height
                             }
                           )
                           (var-set dispute-counter (+ dispute-id u1))
                           (ok dispute-id)
                         )
                         error (err error)
                       )
                       (err ERR-INSUFFICIENT-DISPUTE-BOND)
                   )
                 )
                 (err ERR-INVALID-DISPUTE_REASON)
             )
             (err ERR-NOT-SETTLED)
         )
    (err ERR-POOL-NOT-FOUND)
  )
)

(define-public (vote-on-dispute (dispute-id uint) (vote bool))
  (match (map-get? pool-disputes { dispute-id: dispute-id })
    dispute (if (and 
                 (is-eq (get status dispute) "active")
                 (< burn-block-height (get voting-deadline dispute))
                )
                (match (map-get? dispute-votes { dispute-id: dispute-id, voter: tx-sender })
                  voted (err ERR-ALREADY-VOTED)
                  (let ((voting-power u1))
                    (begin
                      (map-insert dispute-votes
                        { dispute-id: dispute-id, voter: tx-sender }
                        {
                          vote: vote,
                          voting-power: voting-power,
                          voted-at: burn-block-height
                        }
                      )
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
                (err ERR-DISPUTE-WINDOW-CLOSED)
            )
    (err ERR-DISPUTE-NOT-FOUND)
  )
)

(define-public (resolve-dispute (dispute-id uint))
  (match (map-get? pool-disputes { dispute-id: dispute-id })
    dispute (if (and 
                 (is-eq (get status dispute) "active")
                 (>= burn-block-height (get voting-deadline dispute))
                )
                (let (
                  (votes-for (get votes-for dispute))
                  (votes-against (get votes-against dispute))
                  (dispute-upheld (> votes-for votes-against))
                  (disputer (get disputer dispute))
                  (dispute-bond (get dispute-bond dispute))
                )
                  (begin
                    (map-set pool-disputes
                      { dispute-id: dispute-id }
                      (merge dispute {
                        status: "resolved",
                        resolution: (some dispute-upheld)
                      })
                    )
                    (if dispute-upheld
                        (match (as-contract (stx-transfer? dispute-bond tx-sender disputer))
                          success (ok true)
                          error (err error)
                        )
                        (ok false)
                    )
                  )
                )
                (err ERR-DISPUTE-WINDOW-CLOSED)
            )
    (err ERR-DISPUTE-NOT-FOUND)
  )
)

;; Administrative functions
(define-public (set-admin (admin principal) (status bool))
  (if (is-eq tx-sender CONTRACT-OWNER)
      (begin
        (map-set admins { admin: admin } status)
        (ok true)
      )
      (err ERR-UNAUTHORIZED)
  )
)

;; Fee management
(define-public (collect-resolution-fee (pool-id uint))
  (match (map-get? pools { pool-id: pool-id })
    pool (let (
           (total-pool-value (+ (get total-a pool) (get total-b pool)))
           (resolution-fee (/ (* total-pool-value RESOLUTION-FEE-PERCENT) u1000))
           (oracle-fee-portion (/ (* resolution-fee u80) u100))
           (platform-fee-portion (- resolution-fee oracle-fee-portion))
         )
            (if (is-eq tx-sender (as-contract tx-sender))
                (begin
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
                  (match (as-contract (stx-transfer? platform-fee-portion tx-sender CONTRACT-OWNER))
                    success (ok resolution-fee)
                    error (err error)
                  )
                )
                (err ERR-UNAUTHORIZED)
            )
         )
    (err ERR-POOL-NOT-FOUND)
  )
)

(define-private (distribute-fee-to-oracle (provider-id uint) (fee-data { pool-id: uint, fee-amount: uint }))
  (begin
    (map-insert oracle-fee-claims
      { provider-id: provider-id, pool-id: (get pool-id fee-data) }
      {
        fee-amount: (get fee-amount fee-data),
        is-claimed: false,
        claimed-at: none
      }
    )
    fee-data
  )
)

(define-public (distribute-oracle-fees (pool-id uint) (oracle-providers-list (list 5 uint)))
  (match (map-get? resolution-fees { pool-id: pool-id })
    fee-info (let (
               (oracle-fees (get oracle-fees fee-info))
               (num-oracles (len oracle-providers-list))
               (fee-per-oracle (if (> num-oracles u0) (/ oracle-fees num-oracles) u0))
             )
               (if (is-eq tx-sender (as-contract tx-sender))
                   (begin
                     (fold distribute-fee-to-oracle oracle-providers-list { pool-id: pool-id, fee-amount: fee-per-oracle })
                     (ok true)
                   )
                   (err ERR-UNAUTHORIZED)
               )
             )
    (err ERR-POOL-NOT-FOUND)
  )
)

(define-public (claim-oracle-fee (pool-id uint))
  (match (get-provider-id-by-address tx-sender)
    provider-id (match (map-get? oracle-fee-claims { provider-id: provider-id, pool-id: pool-id })
      fee-claim (if (not (get is-claimed fee-claim))
                    (let ((fee-amount (get fee-amount fee-claim)))
                      (match (as-contract (stx-transfer? fee-amount tx-sender tx-sender))
                        success (begin
                          (map-set oracle-fee-claims
                            { provider-id: provider-id, pool-id: pool-id }
                            (merge fee-claim {
                              is-claimed: true,
                              claimed-at: (some burn-block-height)
                            })
                          )
                          (ok fee-amount)
                        )
                        error (err error)
                      )
                    )
                    (err ERR-ALREADY-CLAIMED)
                )
      (err ERR-NO-WINNINGS)
    )
    (err ERR-ORACLE-NOT-FOUND)
  )
)

(define-public (trigger-fallback-resolution (pool-id uint) (failure-reason (string-ascii 128)))
  (match (map-get? pools { pool-id: pool-id })
    pool (match (map-get? resolution-configs { pool-id: pool-id })
      config (if (is-eq tx-sender (as-contract tx-sender))
                 (if (> burn-block-height (get expiry pool))
                     (if (not (get settled pool))
                         (begin
                           (map-insert fallback-resolutions
                             { pool-id: pool-id }
                             {
                               triggered-at: burn-block-height,
                               failure-reason: failure-reason,
                               max-retries-reached: true,
                               manual-settlement-enabled: true,
                               notified-creator: false
                             }
                           )
                           (ok true)
                         )
                         (err ERR-POOL-SETTLED)
                     )
                     (err ERR-POOL-NOT-EXPIRED)
                 )
                 (err ERR-UNAUTHORIZED)
             )
      (err ERR-RESOLUTION-CONFIG-NOT-FOUND)
    )
    (err ERR-POOL-NOT-FOUND)
  )
)

(define-public (manual-settle-fallback (pool-id uint) (winning-outcome uint))
  (match (map-get? pools { pool-id: pool-id })
    pool (match (map-get? fallback-resolutions { pool-id: pool-id })
      fallback (if (is-eq tx-sender (get creator pool))
                   (if (and 
                        (get manual-settlement-enabled fallback)
                        (or (is-eq winning-outcome u0) (is-eq winning-outcome u1))
                        (> burn-block-height (+ (get triggered-at fallback) u144))
                       )
                       (let (
                         (total-pool-balance (+ (get total-a pool) (get total-b pool)))
                         (reduced-fee (/ (* total-pool-balance FEE-PERCENT) u200))
                       )
                         (begin
                           (if (> reduced-fee u0)
                               (match (as-contract (stx-transfer? reduced-fee tx-sender CONTRACT-OWNER))
                                 success true
                                 error false
                               )
                               true
                           )
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
                       (err ERR-MANUAL-SETTLEMENT-DISABLED)
                   )
                   (err ERR-UNAUTHORIZED)
               )
      (err ERR-FALLBACK-NOT-TRIGGERED)
    )
    (err ERR-POOL-NOT-FOUND)
  )
)

;; Read-only getters
(define-read-only (get-pool-details (pool-id uint))
  (map-get? pools { pool-id: pool-id })
)

(define-read-only (get-user-bet (pool-id uint) (user principal))
  (map-get? user-bets { pool-id: pool-id, user: user })
)

(define-read-only (get-oracle-provider (provider-id uint))
  (map-get? oracle-providers { provider-id: provider-id })
)

(define-read-only (get-dispute-details (dispute-id uint))
  (map-get? pool-disputes { dispute-id: dispute-id })
)