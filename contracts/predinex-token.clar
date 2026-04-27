(define-fungible-token predinex-token)
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u101))
(define-constant err-zero-amount (err u102))
(define-data-var token-uri (optional (string-utf8 256)) none)

;; SIP-010 Standard Functions
(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    (asserts! (is-eq tx-sender sender) err-not-token-owner)
    (asserts! (> amount u0) err-zero-amount)
    (try! (ft-transfer? predinex-token amount sender recipient))
    (match memo to-print (print to-print) 0x)
    (ok true)))

(define-read-only (get-name)
  (ok "Predinex Token"))

(define-read-only (get-symbol)
  (ok "PDNX"))

(define-read-only (get-decimals)
  (ok u6))

(define-read-only (get-balance (who principal))
  (ok (ft-get-balance predinex-token who)))

(define-read-only (get-total-supply)
  (ok (ft-get-supply predinex-token)))

(define-read-only (get-token-uri)
  (ok (var-get token-uri)))
