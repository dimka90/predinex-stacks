
;; Predinex Staking V1
;; Focus: Proof of Stake and Yield Distribution simulation.

(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-INSUFFICIENT-FUNDS (err u101))

(define-data-var total-staked uint u0)
(define-map stakes principal uint)

;; Public Functions

(define-public (stake (amount uint))
    (let
        (
            (current-stake (default-to u0 (map-get? stakes tx-sender)))
        )
        (map-set stakes tx-sender (+ current-stake amount))
        (var-set total-staked (+ (var-get total-staked) amount))
        (ok true)
    )
)

(define-public (unstake (amount uint))
    (let
        (
            (current-stake (default-to u0 (map-get? stakes tx-sender)))
        )
        (asserts! (>= current-stake amount) ERR-INSUFFICIENT-FUNDS)
        (map-set stakes tx-sender (- current-stake amount))
        (var-set total-staked (- (var-get total-staked) amount))
        (ok true)
    )
)

;; Read-only Functions

(define-read-only (get-stake (user principal))
    (ok (default-to u0 (map-get? stakes user)))
)

(define-read-only (get-total-staked)
    (ok (var-get total-staked))
)
