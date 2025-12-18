;; ERC20-like Token Contract for Stacks
;; Implements standard fungible token functionality

;; Constants
(define-constant CONTRACT-OWNER tx-sender)
(define-constant ERR-UNAUTHORIZED (err u401))
(define-constant ERR-INSUFFICIENT-BALANCE (err u402))
(define-constant ERR-INVALID-AMOUNT (err u403))
(define-constant ERR-INVALID-RECIPIENT (err u404))
(define-constant ERR-INSUFFICIENT-ALLOWANCE (err u405))

;; Token metadata
(define-constant TOKEN-NAME "PredinexToken")
(define-constant TOKEN-SYMBOL "PDX")
(define-constant TOKEN-DECIMALS u6)
(define-constant TOKEN-URI "https://predinex.com/token")

;; Data variables
(define-data-var total-supply uint u0)

;; Data maps
(define-map balances principal uint)
(define-map allowances { owner: principal, spender: principal } uint)

;; Token trait implementation
(define-fungible-token predinex-token)

;; Initialize token with initial supply
(define-public (initialize (initial-supply uint))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-UNAUTHORIZED)
    (asserts! (is-eq (var-get total-supply) u0) ERR-UNAUTHORIZED) ;; Can only initialize once
    (try! (ft-mint? predinex-token initial-supply CONTRACT-OWNER))
    (var-set total-supply initial-supply)
    (map-set balances CONTRACT-OWNER initial-supply)
    (ok true)
  )
)