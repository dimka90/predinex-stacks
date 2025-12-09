;; Predinex Pool - Prediction Market on Stacks
;; A simple prediction pool contract for binary outcomes

;; Constants
(define-constant CONTRACT-OWNER tx-sender)
(define-constant ERR-UNAUTHORIZED (err u401))
(define-constant ERR-INVALID-AMOUNT (err u400))
(define-constant ERR-POOL-NOT-FOUND (err u404))
(define-constant ERR-POOL-SETTLED (err u409))
(define-constant ERR-INVALID-OUTCOME (err u422))

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
    settled-at: (optional uint)
  }
)

(define-map user-bets
  { pool-id: uint, user: principal }
  {
    amount-a: uint,
    amount-b: uint,
    total-bet: uint
  }
)

(define-data-var pool-counter uint u0)
(define-data-var total-volume uint u0)

;; Create a new prediction pool
(define-public (create-pool (title (string-ascii 256)) (description (string-ascii 512)) (outcome-a (string-ascii 128)) (outcome-b (string-ascii 128)))
  (let ((pool-id (var-get pool-counter)))
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
        settled-at: none
      }
    )
    (var-set pool-counter (+ pool-id u1))
    (ok pool-id)
  )
)

;; Place a bet on a pool
(define-public (place-bet (pool-id uint) (outcome uint) (amount uint))
  (let ((pool (unwrap! (map-get? pools { pool-id: pool-id }) ERR-POOL-NOT-FOUND)))
    (asserts! (not (get settled pool)) ERR-POOL-SETTLED)
    (asserts! (or (is-eq outcome u0) (is-eq outcome u1)) ERR-INVALID-OUTCOME)
    (asserts! (> amount u0) ERR-INVALID-AMOUNT)
    
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
    (let ((user-bet (default-to { amount-a: u0, amount-b: u0, total-bet: u0 } (map-get? user-bets { pool-id: pool-id, user: tx-sender }))))
      (map-set user-bets
        { pool-id: pool-id, user: tx-sender }
        (if (is-eq outcome u0)
          { amount-a: (+ (get amount-a user-bet) amount), amount-b: (get amount-b user-bet), total-bet: (+ (get total-bet user-bet) amount) }
          { amount-a: (get amount-a user-bet), amount-b: (+ (get amount-b user-bet) amount), total-bet: (+ (get total-bet user-bet) amount) }
        )
      )
    )
    
    ;; Update total volume
    (var-set total-volume (+ (var-get total-volume) amount))
    
    (ok true)
  )
)

;; Settle a pool with winning outcome
(define-public (settle-pool (pool-id uint) (winning-outcome uint))
  (let ((pool (unwrap! (map-get? pools { pool-id: pool-id }) ERR-POOL-NOT-FOUND)))
    (asserts! (is-eq tx-sender (get creator pool)) ERR-UNAUTHORIZED)
    (asserts! (not (get settled pool)) ERR-POOL-SETTLED)
    (asserts! (or (is-eq winning-outcome u0) (is-eq winning-outcome u1)) ERR-INVALID-OUTCOME)
    
    (map-set pools
      { pool-id: pool-id }
      (merge pool { settled: true, winning-outcome: (some winning-outcome), settled-at: (some burn-block-height) })
    )
    
    (ok true)
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
