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

;; Transfer tokens from sender to recipient
(define-public (transfer (amount uint) (recipient principal))
  (let ((sender tx-sender))
    (asserts! (> amount u0) ERR-INVALID-AMOUNT)
    (asserts! (not (is-eq sender recipient)) ERR-INVALID-RECIPIENT)
    (asserts! (>= (get-balance sender) amount) ERR-INSUFFICIENT-BALANCE)
    
    (try! (ft-transfer? predinex-token amount sender recipient))
    (update-balance sender (- (get-balance sender) amount))
    (update-balance recipient (+ (get-balance recipient) amount))
    (emit-transfer sender recipient amount)
    (ok true)
  )
)

;; Helper function to update balance
(define-private (update-balance (user principal) (new-balance uint))
  (map-set balances user new-balance)
)

;; Approve spender to transfer tokens on behalf of owner
(define-public (approve (spender principal) (amount uint))
  (let ((owner tx-sender))
    (asserts! (not (is-eq owner spender)) ERR-INVALID-RECIPIENT)
    (map-set allowances { owner: owner, spender: spender } amount)
    (emit-approval owner spender amount)
    (ok true)
  )
)

;; Transfer tokens from owner to recipient using allowance
(define-public (transfer-from (owner principal) (recipient principal) (amount uint))
  (let ((spender tx-sender))
    (asserts! (> amount u0) ERR-INVALID-AMOUNT)
    (asserts! (not (is-eq owner recipient)) ERR-INVALID-RECIPIENT)
    (asserts! (>= (get-balance owner) amount) ERR-INSUFFICIENT-BALANCE)
    (asserts! (>= (get-allowance owner spender) amount) ERR-INSUFFICIENT-ALLOWANCE)
    
    (try! (ft-transfer? predinex-token amount owner recipient))
    (update-balance owner (- (get-balance owner) amount))
    (update-balance recipient (+ (get-balance recipient) amount))
    (update-allowance owner spender (- (get-allowance owner spender) amount))
    (emit-transfer owner recipient amount)
    (ok true)
  )
)

;; Helper function to update allowance
(define-private (update-allowance (owner principal) (spender principal) (new-allowance uint))
  (map-set allowances { owner: owner, spender: spender } new-allowance)
)

;; Mint new tokens (only owner)
(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-UNAUTHORIZED)
    (asserts! (> amount u0) ERR-INVALID-AMOUNT)
    
    (try! (ft-mint? predinex-token amount recipient))
    (var-set total-supply (+ (var-get total-supply) amount))
    (update-balance recipient (+ (get-balance recipient) amount))
    (emit-transfer 'SP000000000000000000002Q6VF78 recipient amount) ;; Zero address as from
    (ok true)
  )
)

;; Burn tokens from sender's balance
(define-public (burn (amount uint))
  (let ((sender tx-sender))
    (asserts! (> amount u0) ERR-INVALID-AMOUNT)
    (asserts! (>= (get-balance sender) amount) ERR-INSUFFICIENT-BALANCE)
    
    (try! (ft-burn? predinex-token amount sender))
    (var-set total-supply (- (var-get total-supply) amount))
    (update-balance sender (- (get-balance sender) amount))
    (emit-transfer sender 'SP000000000000000000002Q6VF78 amount) ;; Zero address as to
    (ok true)
  )
)

;; Read-only functions

;; Get token name
(define-read-only (get-name)
  (ok TOKEN-NAME)
)

;; Get token symbol
(define-read-only (get-symbol)
  (ok TOKEN-SYMBOL)
)

;; Get token decimals
(define-read-only (get-decimals)
  (ok TOKEN-DECIMALS)
)

;; Get token URI
(define-read-only (get-token-uri)
  (ok (some TOKEN-URI))
)

;; Get total supply
(define-read-only (get-total-supply)
  (ok (var-get total-supply))
)

;; Get balance of a user
(define-read-only (get-balance (user principal))
  (default-to u0 (map-get? balances user))
)

;; Get allowance between owner and spender
(define-read-only (get-allowance (owner principal) (spender principal))
  (default-to u0 (map-get? allowances { owner: owner, spender: spender }))
)

;; Events (using print for event emission)

;; Transfer event
(define-private (emit-transfer (from principal) (to principal) (amount uint))
  (print { 
    event: "transfer", 
    from: from, 
    to: to, 
    amount: amount 
  })
)

;; Approval event
(define-private (emit-approval (owner principal) (spender principal) (amount uint))
  (print { 
    event: "approval", 
    owner: owner, 
    spender: spender, 
    amount: amount 
  })
)