;; ============================================
;; METRIC BOOSTER CONTRACT v2
;; ============================================
;; This contract is designed to facilitate granular on-chain activity
;; and metric optimization for the Predinex ecosystem.
;; It provides simple, low-gas functions to increment transaction counts
;; and log protocol engagement.
;; ============================================

(define-data-var counter uint u0)

;; @desc Increments the global pulse counter by 1.
;; This function serves as a minimal interaction point to signal active 
;; participation and generate on-chain event logs for indexing purposes.
;; @returns (ok bool): true on successful increment and logging
(define-public (pulse)
  (begin
    (var-set counter (+ (var-get counter) u1))
    (print { event: "pulse", caller: tx-sender, new-total: (var-get counter) })
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
    (var-set counter (+ (var-get counter) n))
    (print { event: "pulse-n", caller: tx-sender, amount: n, new-total: (var-get counter) })
    (ok true)
  )
)

;; @desc Retrieves the current aggregate pulse count from the contract.
;; @returns uint: The current value of the internal counter
(define-read-only (get-counter)
  (ok (var-get counter))
)
