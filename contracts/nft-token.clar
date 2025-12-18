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

;; NFT metadata
(define-constant TOKEN-NAME "PredinexNFT")
(define-constant TOKEN-SYMBOL "PNFT")
(define-constant BASE-URI "https://predinex.com/nft/")

;; Data variables
(define-data-var token-counter uint u0)
(define-data-var contract-uri (string-ascii 256) "https://predinex.com/contract")

;; Data maps
(define-map token-owners uint principal)
(define-map token-approvals uint principal)
(define-map operator-approvals { owner: principal, operator: principal } bool)
(define-map token-metadata uint { name: (string-ascii 64), description: (string-ascii 256), image: (string-ascii 256) })

;; NFT trait implementation
(define-non-fungible-token predinex-nft uint)

;; Mint new NFT
(define-public (mint (recipient principal) (name (string-ascii 64)) (description (string-ascii 256)) (image (string-ascii 256)))
  (let ((token-id (var-get token-counter)))
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-UNAUTHORIZED)
    
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