;; Predinex Cross-Chain Oracle Registry
;; Version: 1.0.0
;; Institutional Grade

(define-constant ERR-NOT-AUTHORIZED (err u1001))
(define-constant ERR-ORACLE-EXISTS (err u1002))
(define-constant ERR-ORACLE-NOT-FOUND (err u1003))

(define-data-var contract-owner principal tx-sender)

(define-map oracles
    principal
    {
        name: (string-ascii 64),
        endpoint: (string-ascii 256),
        reputation: uint,
        active: bool,
        last-seen: uint
    }
)

;; Register a new oracle
(define-public (register-oracle (name (string-ascii 64)) (endpoint (string-ascii 256)))
    (let
        ((oracle-data (map-get? oracles tx-sender)))
        (asserts! (is-none oracle-data) ERR-ORACLE-EXISTS)
        (ok (map-set oracles tx-sender {
            name: name,
            endpoint: endpoint,
            reputation: u100,
            active: true,
            last-seen: block-height
        }))
    )
)

;; Update reputation (Only Owner)
(define-public (update-reputation (oracle principal) (score uint))
    (let
        ((oracle-data (unwrap! (map-get? oracles oracle) ERR-ORACLE-NOT-FOUND)))
        (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED)
        (ok (map-set oracles oracle (merge oracle-data { reputation: score })))
    )
)
;; Increment 1
;; Increment 2
