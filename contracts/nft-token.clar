;; NFT-like Token Contract for Stacks
;; Implements standard non-fungible token functionality

;; Constants
(define-constant CONTRACT-OWNER tx-sender)
(define-constant ERR-UNAUTHORIZED (err u401))
(define-constant ERR-NOT-FOUND (err u404))
(define-constant ERR-ALREADY-EXISTS (err u409))
(define-constant ERR-INVALID-TOKEN-ID (err u400))
(define-constant ERR-NOT-OWNER (err u403))
(define-constant ERR-TRANSFER-FAILED (err u500))
(define-constant ERR-INVALID-RECIPIENT (err u402))
(define-constant ERR-MINT-LIMIT-EXCEEDED (err u406))

;; NFT metadata
(define-constant TOKEN-NAME "PredinexNFT")
(define-constant TOKEN-SYMBOL "PNFT")
(define-constant BASE-URI "https://predinex.com/nft/")

;; Data variables
(define-data-var token-counter uint u0)
(define-data-var contract-uri (string-ascii 256) "https://predinex.com/contract")
(define-data-var max-supply uint u10000)
(define-data-var mint-price uint u1000000)

;; Data maps
(define-map token-owners uint principal)
(define-map token-approvals uint principal)
(define-map operator-approvals { owner: principal, operator: principal } bool)
(define-map token-metadata uint { name: (string-ascii 64), description: (string-ascii 256), image: (string-ascii 256) })
(define-map token-royalties uint { recipient: principal, percentage: uint })
(define-map whitelisted-minters principal bool)

;; NFT trait implementation
(define-non-fungible-token predinex-nft uint)

;; Mint new NFT
(define-public (mint (recipient principal) (name (string-ascii 64)) (description (string-ascii 256)) (image (string-ascii 256)))
  (let ((token-id (var-get token-counter)))
    (asserts! (or (is-eq tx-sender CONTRACT-OWNER) (default-to false (map-get? whitelisted-minters tx-sender))) ERR-UNAUTHORIZED)
    (asserts! (< token-id (var-get max-supply)) ERR-MINT-LIMIT-EXCEEDED)
    (asserts! (not (is-eq recipient 'SP000000000000000000002Q6VF78)) ERR-INVALID-RECIPIENT)
    
    (try! (nft-mint? predinex-nft token-id recipient))
    (map-set token-owners token-id recipient)
    (map-set token-metadata token-id { name: name, description: description, image: image })
    (var-set token-counter (+ token-id u1))
    (emit-transfer none recipient token-id)
    (ok token-id)
  )
)

;; Transfer NFT
(define-public (transfer (token-id uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) ERR-UNAUTHORIZED)
    (asserts! (is-eq (unwrap! (nft-get-owner? predinex-nft token-id) ERR-NOT-FOUND) sender) ERR-NOT-OWNER)
    
    (try! (nft-transfer? predinex-nft token-id sender recipient))
    (map-set token-owners token-id recipient)
    (map-delete token-approvals token-id)
    (emit-transfer (some sender) recipient token-id)
    (ok true)
  )
)

;; Transfer from (with approval)
(define-public (transfer-from (token-id uint) (owner principal) (recipient principal))
  (let ((approved (map-get? token-approvals token-id)))
    (asserts! (or 
      (is-eq tx-sender owner)
      (is-eq (some tx-sender) approved)
      (is-approved-for-all owner tx-sender)
    ) ERR-UNAUTHORIZED)
    (asserts! (is-eq (unwrap! (nft-get-owner? predinex-nft token-id) ERR-NOT-FOUND) owner) ERR-NOT-OWNER)
    
    (try! (nft-transfer? predinex-nft token-id owner recipient))
    (map-set token-owners token-id recipient)
    (map-delete token-approvals token-id)
    (emit-transfer (some owner) recipient token-id)
    (ok true)
  )
)

;; Approve spender for specific token
(define-public (approve (spender principal) (token-id uint))
  (let ((owner (unwrap! (nft-get-owner? predinex-nft token-id) ERR-NOT-FOUND)))
    (asserts! (is-eq tx-sender owner) ERR-NOT-OWNER)
    (map-set token-approvals token-id spender)
    (emit-approval owner spender token-id)
    (ok true)
  )
)

;; Set approval for all tokens
(define-public (set-approval-for-all (operator principal) (approved bool))
  (begin
    (map-set operator-approvals { owner: tx-sender, operator: operator } approved)
    (emit-approval-for-all tx-sender operator approved)
    (ok true)
  )
)

;; Helper function to check if operator is approved for all
(define-private (is-approved-for-all (owner principal) (operator principal))
  (default-to false (map-get? operator-approvals { owner: owner, operator: operator }))
)

;; Burn NFT
(define-public (burn (token-id uint))
  (let ((owner (unwrap! (nft-get-owner? predinex-nft token-id) ERR-NOT-FOUND)))
    (asserts! (is-eq tx-sender owner) ERR-NOT-OWNER)
    
    (try! (nft-burn? predinex-nft token-id owner))
    (map-delete token-owners token-id)
    (map-delete token-approvals token-id)
    (map-delete token-metadata token-id)
    (emit-transfer (some owner) 'SP000000000000000000002Q6VF78 token-id) ;; Zero address as to
    (ok true)
  )
)

;; Update contract URI (owner only)
(define-public (set-contract-uri (new-uri (string-ascii 256)))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-UNAUTHORIZED)
    (var-set contract-uri new-uri)
    (ok true)
  )
)

;; Batch mint multiple NFTs
(define-public (batch-mint (recipients (list 10 principal)) (names (list 10 (string-ascii 64))) (descriptions (list 10 (string-ascii 256))) (images (list 10 (string-ascii 256))))
  (let ((count (len recipients)))
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-UNAUTHORIZED)
    (asserts! (is-eq count (len names)) ERR-INVALID-TOKEN-ID)
    (asserts! (is-eq count (len descriptions)) ERR-INVALID-TOKEN-ID)
    (asserts! (is-eq count (len images)) ERR-INVALID-TOKEN-ID)
    
    (ok (map mint recipients names descriptions images))
  )
)

;; Safe transfer with data
(define-public (safe-transfer-from (token-id uint) (owner principal) (recipient principal) (data (buff 256)))
  (let ((approved (map-get? token-approvals token-id)))
    (asserts! (or 
      (is-eq tx-sender owner)
      (is-eq (some tx-sender) approved)
      (is-approved-for-all owner tx-sender)
    ) ERR-UNAUTHORIZED)
    (asserts! (is-eq (unwrap! (nft-get-owner? predinex-nft token-id) ERR-NOT-FOUND) owner) ERR-NOT-OWNER)
    
    (try! (nft-transfer? predinex-nft token-id owner recipient))
    (map-set token-owners token-id recipient)
    (map-delete token-approvals token-id)
    (emit-transfer (some owner) recipient token-id)
    (print { event: "safe-transfer", token-id: token-id, data: data })
    (ok true)
  )
)

;; Check if token exists
(define-read-only (token-exists (token-id uint))
  (is-some (nft-get-owner? predinex-nft token-id))
)

;; Get balance of owner (count of NFTs)
(define-read-only (balance-of (owner principal))
  (let ((total-supply (var-get token-counter)))
    (ok (fold count-owner-tokens (list u0 u1 u2 u3 u4 u5 u6 u7 u8 u9) { owner: owner, count: u0 }))
  )
)

;; Helper function for balance counting
(define-private (count-owner-tokens (token-id uint) (acc { owner: principal, count: uint }))
  (if (is-eq (nft-get-owner? predinex-nft token-id) (some (get owner acc)))
    { owner: (get owner acc), count: (+ (get count acc) u1) }
    acc
  )
)

;; Read-only functions

;; Get token owner
(define-read-only (get-owner (token-id uint))
  (ok (nft-get-owner? predinex-nft token-id))
)

;; Get approved spender for token
(define-read-only (get-approved (token-id uint))
  (ok (map-get? token-approvals token-id))
)

;; Check if operator is approved for all
(define-read-only (is-approved-for-all-read (owner principal) (operator principal))
  (ok (is-approved-for-all owner operator))
)

;; Get token metadata
(define-read-only (get-token-metadata (token-id uint))
  (ok (map-get? token-metadata token-id))
)

;; Get token URI
(define-read-only (get-token-uri (token-id uint))
  (ok (some (concat BASE-URI (int-to-ascii token-id))))
)

;; Get total supply
(define-read-only (get-total-supply)
  (ok (var-get token-counter))
)

;; Get contract URI
(define-read-only (get-contract-uri)
  (ok (var-get contract-uri))
)

;; Get token name
(define-read-only (get-name)
  (ok TOKEN-NAME)
)

;; Get token symbol
(define-read-only (get-symbol)
  (ok TOKEN-SYMBOL)
)

;; Events (using print for event emission)

;; Transfer event
(define-private (emit-transfer (from (optional principal)) (to principal) (token-id uint))
  (print { 
    event: "transfer", 
    from: from, 
    to: to, 
    token-id: token-id 
  })
)

;; Approval event
(define-private (emit-approval (owner principal) (approved principal) (token-id uint))
  (print { 
    event: "approval", 
    owner: owner, 
    approved: approved, 
    token-id: token-id 
  })
)

;; Approval for all event
(define-private (emit-approval-for-all (owner principal) (operator principal) (approved bool))
  (print { 
    event: "approval-for-all", 
    owner: owner, 
    operator: operator, 
    approved: approved 
  })
)

;; Paid mint function
(define-public (paid-mint (recipient principal) (name (string-ascii 64)) (description (string-ascii 256)) (image (string-ascii 256)))
  (let ((token-id (var-get token-counter))
        (price (var-get mint-price)))
    (asserts! (< token-id (var-get max-supply)) ERR-MINT-LIMIT-EXCEEDED)
    (asserts! (not (is-eq recipient 'SP000000000000000000002Q6VF78)) ERR-INVALID-RECIPIENT)
    
    (try! (stx-transfer? price tx-sender CONTRACT-OWNER))
    (try! (nft-mint? predinex-nft token-id recipient))
    (map-set token-owners token-id recipient)
    (map-set token-metadata token-id { name: name, description: description, image: image })
    (var-set token-counter (+ token-id u1))
    (emit-transfer none recipient token-id)
    (ok token-id)
  )
)
;; Set royalty for token
(define-public (set-token-royalty (token-id uint) (recipient principal) (percentage uint))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-UNAUTHORIZED)
    (asserts! (<= percentage u1000) ERR-INVALID-TOKEN-ID) ;; Max 10% royalty
    (asserts! (token-exists token-id) ERR-NOT-FOUND)
    (map-set token-royalties token-id { recipient: recipient, percentage: percentage })
    (ok true)
  )
)
;; Add to whitelist
(define-public (add-to-whitelist (minter principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-UNAUTHORIZED)
    (map-set whitelisted-minters minter true)
    (ok true)
  )
)

;; Remove from whitelist
(define-public (remove-from-whitelist (minter principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-UNAUTHORIZED)
    (map-delete whitelisted-minters minter)
    (ok true)
  )
)
;; Update mint price
(define-public (set-mint-price (new-price uint))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-UNAUTHORIZED)
    (var-set mint-price new-price)
    (ok true)
  )
)

;; Update max supply
(define-public (set-max-supply (new-max uint))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-UNAUTHORIZED)
    (asserts! (>= new-max (var-get token-counter)) ERR-INVALID-TOKEN-ID)
    (var-set max-supply new-max)
    (ok true)
  )
)
;; Freeze token metadata
(define-map frozen-metadata uint bool)

(define-public (freeze-metadata (token-id uint))
  (let ((owner (unwrap! (nft-get-owner? predinex-nft token-id) ERR-NOT-FOUND)))
    (asserts! (is-eq tx-sender owner) ERR-NOT-OWNER)
    (map-set frozen-metadata token-id true)
    (ok true)
  )
)

;; Update token metadata (if not frozen)
(define-public (update-token-metadata (token-id uint) (name (string-ascii 64)) (description (string-ascii 256)) (image (string-ascii 256)))
  (let ((owner (unwrap! (nft-get-owner? predinex-nft token-id) ERR-NOT-FOUND)))
    (asserts! (is-eq tx-sender owner) ERR-NOT-OWNER)
    (asserts! (not (default-to false (map-get? frozen-metadata token-id))) ERR-UNAUTHORIZED)
    (map-set token-metadata token-id { name: name, description: description, image: image })
    (ok true)
  )
)