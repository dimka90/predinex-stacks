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
;; Royalty system
(define-map token-royalties uint { creator: principal, percentage: uint })
(define-data-var default-royalty-percentage uint u250) ;; 2.5%

;; Set royalty for token
(define-public (set-token-royalty (token-id uint) (creator principal) (percentage uint))
  (let ((owner (unwrap! (nft-get-owner? predinex-nft token-id) ERR-NOT-FOUND)))
    (asserts! (is-eq tx-sender owner) ERR-NOT-OWNER)
    (asserts! (<= percentage u1000) ERR-INVALID-TOKEN-ID) ;; Max 10%
    (map-set token-royalties token-id { creator: creator, percentage: percentage })
    (ok true)
  )
)

;; Get royalty info
(define-read-only (get-royalty-info (token-id uint) (sale-price uint))
  (match (map-get? token-royalties token-id)
    royalty (ok { 
      creator: (get creator royalty), 
      amount: (/ (* sale-price (get percentage royalty)) u10000) 
    })
    (ok { 
      creator: CONTRACT-OWNER, 
      amount: (/ (* sale-price (var-get default-royalty-percentage)) u10000) 
    })
  )
)
;; Marketplace functionality
(define-map listings uint { seller: principal, price: uint, listed-at: uint })
(define-map offers { token-id: uint, buyer: principal } { amount: uint, expires-at: uint })

;; List NFT for sale
(define-public (list-for-sale (token-id uint) (price uint))
  (let ((owner (unwrap! (nft-get-owner? predinex-nft token-id) ERR-NOT-FOUND)))
    (asserts! (is-eq tx-sender owner) ERR-NOT-OWNER)
    (asserts! (> price u0) ERR-INVALID-TOKEN-ID)
    (map-set listings token-id { seller: owner, price: price, listed-at: burn-block-height })
    (ok true)
  )
)

;; Buy listed NFT
(define-public (buy-nft (token-id uint))
  (let (
    (listing (unwrap! (map-get? listings token-id) ERR-NOT-FOUND))
    (seller (get seller listing))
    (price (get price listing))
    (royalty-info (unwrap-panic (get-royalty-info token-id price)))
  )
    (try! (stx-transfer? price tx-sender seller))
    (try! (nft-transfer? predinex-nft token-id seller tx-sender))
    (map-delete listings token-id)
    (map-set token-owners token-id tx-sender)
    (ok true)
  )
)
;; Rarity and traits system
(define-map token-traits uint (list 10 { trait-type: (string-ascii 32), value: (string-ascii 64) }))
(define-map token-rarity uint { rarity-score: uint, rank: uint })

;; Set token traits
(define-public (set-token-traits (token-id uint) (traits (list 10 { trait-type: (string-ascii 32), value: (string-ascii 64) })))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-UNAUTHORIZED)
    (asserts! (token-exists token-id) ERR-NOT-FOUND)
    (map-set token-traits token-id traits)
    (ok true)
  )
)

;; Calculate and set rarity
(define-public (set-token-rarity (token-id uint) (rarity-score uint) (rank uint))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-UNAUTHORIZED)
    (asserts! (token-exists token-id) ERR-NOT-FOUND)
    (map-set token-rarity token-id { rarity-score: rarity-score, rank: rank })
    (ok true)
  )
)

;; Get token traits
(define-read-only (get-token-traits (token-id uint))
  (ok (map-get? token-traits token-id))
)

;; Get token rarity
(define-read-only (get-token-rarity (token-id uint))
  (ok (map-get? token-rarity token-id))
)
;; NFT staking system
(define-map staked-nfts uint { staker: principal, staked-at: uint, rewards-earned: uint })
(define-data-var staking-enabled bool true)
(define-data-var daily-reward-rate uint u100) ;; 100 micro-STX per day

;; Stake NFT
(define-public (stake-nft (token-id uint))
  (let ((owner (unwrap! (nft-get-owner? predinex-nft token-id) ERR-NOT-FOUND)))
    (asserts! (is-eq tx-sender owner) ERR-NOT-OWNER)
    (asserts! (var-get staking-enabled) ERR-UNAUTHORIZED)
    (asserts! (is-none (map-get? staked-nfts token-id)) ERR-ALREADY-EXISTS)
    
    (map-set staked-nfts token-id { 
      staker: owner, 
      staked-at: burn-block-height, 
      rewards-earned: u0 
    })
    (ok true)
  )
)

;; Unstake NFT and claim rewards
(define-public (unstake-nft (token-id uint))
  (let (
    (stake-info (unwrap! (map-get? staked-nfts token-id) ERR-NOT-FOUND))
    (staker (get staker stake-info))
  )
    (asserts! (is-eq tx-sender staker) ERR-NOT-OWNER)
    
    (let (
      (blocks-staked (- burn-block-height (get staked-at stake-info)))
      (rewards (/ (* blocks-staked (var-get daily-reward-rate)) u144)) ;; Assuming 144 blocks per day
    )
      (map-delete staked-nfts token-id)
      (try! (as-contract (stx-transfer? rewards tx-sender staker)))
      (ok rewards)
    )
  )
)

;; Get staking info
(define-read-only (get-staking-info (token-id uint))
  (ok (map-get? staked-nfts token-id))
)
;; Collection and series management
(define-map collections uint { name: (string-ascii 64), creator: principal, max-supply: uint, current-supply: uint })
(define-map token-collections uint uint) ;; token-id -> collection-id
(define-data-var collection-counter uint u0)

;; Create new collection
(define-public (create-collection (name (string-ascii 64)) (max-supply uint))
  (let ((collection-id (var-get collection-counter)))
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-UNAUTHORIZED)
    (asserts! (> max-supply u0) ERR-INVALID-TOKEN-ID)
    
    (map-set collections collection-id {
      name: name,
      creator: tx-sender,
      max-supply: max-supply,
      current-supply: u0
    })
    (var-set collection-counter (+ collection-id u1))
    (ok collection-id)
  )
)

;; Mint to collection
(define-public (mint-to-collection (collection-id uint) (recipient principal) (name (string-ascii 64)) (description (string-ascii 256)) (image (string-ascii 256)))
  (let (
    (collection (unwrap! (map-get? collections collection-id) ERR-NOT-FOUND))
    (token-id (var-get token-counter))
  )
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-UNAUTHORIZED)
    (asserts! (< (get current-supply collection) (get max-supply collection)) ERR-INVALID-TOKEN-ID)
    
    (try! (nft-mint? predinex-nft token-id recipient))
    (map-set token-owners token-id recipient)
    (map-set token-metadata token-id { name: name, description: description, image: image })
    (map-set token-collections token-id collection-id)
    
    ;; Update collection supply
    (map-set collections collection-id 
      (merge collection { current-supply: (+ (get current-supply collection) u1) }))
    
    (var-set token-counter (+ token-id u1))
    (ok token-id)
  )
)

;; Get collection info
(define-read-only (get-collection-info (collection-id uint))
  (ok (map-get? collections collection-id))
)

;; Get token collection
(define-read-only (get-token-collection (token-id uint))
  (ok (map-get? token-collections token-id))
)
;; Auction system
(define-map auctions uint { 
  seller: principal, 
  starting-price: uint, 
  current-bid: uint, 
  highest-bidder: (optional principal),
  end-time: uint,
  active: bool 
})
(define-map auction-bids { auction-id: uint, bidder: principal } uint)

;; Start auction
(define-public (start-auction (token-id uint) (starting-price uint) (duration uint))
  (let ((owner (unwrap! (nft-get-owner? predinex-nft token-id) ERR-NOT-FOUND)))
    (asserts! (is-eq tx-sender owner) ERR-NOT-OWNER)
    (asserts! (> starting-price u0) ERR-INVALID-TOKEN-ID)
    (asserts! (> duration u0) ERR-INVALID-TOKEN-ID)
    
    (map-set auctions token-id {
      seller: owner,
      starting-price: starting-price,
      current-bid: starting-price,
      highest-bidder: none,
      end-time: (+ burn-block-height duration),
      active: true
    })
    (ok true)
  )
)

;; Place bid
(define-public (place-bid (token-id uint) (bid-amount uint))
  (let (
    (auction (unwrap! (map-get? auctions token-id) ERR-NOT-FOUND))
  )
    (asserts! (get active auction) ERR-UNAUTHORIZED)
    (asserts! (< burn-block-height (get end-time auction)) ERR-UNAUTHORIZED)
    (asserts! (> bid-amount (get current-bid auction)) ERR-INVALID-TOKEN-ID)
    
    ;; Transfer bid amount to contract
    (try! (stx-transfer? bid-amount tx-sender (as-contract tx-sender)))
    
    ;; Refund previous highest bidder
    (match (get highest-bidder auction)
      prev-bidder (try! (as-contract (stx-transfer? (get current-bid auction) tx-sender prev-bidder)))
      true
    )
    
    ;; Update auction
    (map-set auctions token-id (merge auction {
      current-bid: bid-amount,
      highest-bidder: (some tx-sender)
    }))
    
    (ok true)
  )
)

;; End auction
(define-public (end-auction (token-id uint))
  (let (
    (auction (unwrap! (map-get? auctions token-id) ERR-NOT-FOUND))
  )
    (asserts! (get active auction) ERR-UNAUTHORIZED)
    (asserts! (>= burn-block-height (get end-time auction)) ERR-UNAUTHORIZED)
    
    (match (get highest-bidder auction)
      winner (begin
        ;; Transfer NFT to winner
        (try! (nft-transfer? predinex-nft token-id (get seller auction) winner))
        ;; Transfer payment to seller
        (try! (as-contract (stx-transfer? (get current-bid auction) tx-sender (get seller auction))))
        (map-set token-owners token-id winner)
      )
      ;; No bids, return NFT to seller
      true
    )
    
    ;; Mark auction as inactive
    (map-set auctions token-id (merge auction { active: false }))
    (ok true)
  )
)