;; Metric Booster Contract v2
;; Simplified for metric optimization

(define-data-var counter uint u0)

;; @desc Simple pulse to generate a transaction and log activity
(define-public (pulse)
  (begin
    (var-set counter (+ (var-get counter) u1))
    (print { event: "pulse", caller: tx-sender, new-total: (var-get counter) })
    (ok true)
  )
)

;; @desc Multi-pulse for batching activity events
(define-public (pulse-n (n uint))
  (begin
    (var-set counter (+ (var-get counter) n))
    (print { event: "pulse-n", caller: tx-sender, amount: n, new-total: (var-get counter) })
    (ok true)
  )
)

;; Get current pulse count
(define-read-only (get-counter)
  (ok (var-get counter))
)
