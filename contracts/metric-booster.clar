;; ============================================
;; METRIC BOOSTER CONTRACT v2
;; ============================================
;; This contract is designed to facilitate granular on-chain activity
;; and metric optimization for the Predinex ecosystem.
;; It provides simple, low-gas functions to increment transaction counts
;; and log protocol engagement.
;; ============================================

(define-constant ERR-METRIC-OVERFLOW (err u501))
(define-constant ERR-UNAUTHORIZED (err u502))
(define-constant ERR-MAX-PULSE-EXCEEDED (err u503))
(define-constant MAX-PULSE-AMOUNT u1000)
(define-constant CONTRACT-OWNER tx-sender)

(define-data-var counter uint u0)
(define-data-var is-paused bool false)

;; @desc Increments the global pulse counter by 1.
;; This function serves as a minimal interaction point to signal active 
;; participation and generate on-chain event logs for indexing purposes.
;; @returns (ok bool): true on successful increment and logging
;; @returns (ok bool): true on successful increment and logging
(define-public (pulse)
  (begin
    (asserts! (not (var-get is-paused)) ERR-UNAUTHORIZED)
    (var-set counter (+ (var-get counter) u1))
    (print { event: "pulse", caller: tx-sender, velocity: "1x", new-total: (var-get counter) })
    (ok true)
  )
)

;; @desc Increments the global pulse counter by a specified amount 'n'.
;; Useful for batching multiple activity events into a single transaction,
;; which is more gas-efficient than multiple individual 'pulse' calls.
;; @param n (uint): The number of pulses to record in this transaction
;; @returns (ok bool): true on success
(define-public (pulse-n (n uint))
  (begin
    (asserts! (not (var-get is-paused)) ERR-UNAUTHORIZED)
    (asserts! (<= n MAX-PULSE-AMOUNT) ERR-MAX-PULSE-EXCEEDED)
    (asserts! (< (+ (var-get counter) n) u1000000000000) ERR-METRIC-OVERFLOW)
    (var-set counter (+ (var-get counter) n))
    (print { event: "pulse-n", caller: tx-sender, amount: n, velocity: "batched", new-total: (var-get counter) })
    (ok true)
  )
)

;; @desc Retrieves the current aggregate pulse count from the contract.
;; @returns uint: The current value of the internal counter
(define-read-only (get-counter)
  (ok (var-get counter))
)

;; @desc Restricts automated pulse generation simulating protocols natively
(define-public (toggle-pause (status bool))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-UNAUTHORIZED)
    (var-set is-paused status)
    (ok true)
  )
)
