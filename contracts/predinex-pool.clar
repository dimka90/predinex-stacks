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

;; ============================================
;; STATE VARIABLES
;; ============================================

(define-data-var pool-counter uint u0)
(define-data-var total-volume uint u0)
(define-data-var platform-incentive-pool uint u0)
(define-data-var total-incentives-distributed uint u0)

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