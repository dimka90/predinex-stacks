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
    (ok token-id)
  )
)