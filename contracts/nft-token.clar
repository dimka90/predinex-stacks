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
;; NFT lending system
(define-map loans uint { 
  lender: principal, 
  borrower: principal, 
  collateral: uint, 
  interest-rate: uint,
  duration: uint,
  start-time: uint,
  active: bool 
})

;; Offer NFT for lending
(define-public (offer-loan (token-id uint) (collateral-required uint) (interest-rate uint) (duration uint))
  (let ((owner (unwrap! (nft-get-owner? predinex-nft token-id) ERR-NOT-FOUND)))
    (asserts! (is-eq tx-sender owner) ERR-NOT-OWNER)
    (asserts! (> collateral-required u0) ERR-INVALID-TOKEN-ID)
    
    (map-set loans token-id {
      lender: owner,
      borrower: owner, ;; Placeholder until borrowed
      collateral: collateral-required,
      interest-rate: interest-rate,
      duration: duration,
      start-time: u0,
      active: false
    })
    (ok true)
  )
)

;; Borrow NFT
(define-public (borrow-nft (token-id uint))
  (let (
    (loan (unwrap! (map-get? loans token-id) ERR-NOT-FOUND))
    (collateral (get collateral loan))
  )
    (asserts! (not (get active loan)) ERR-ALREADY-EXISTS)
    
    ;; Transfer collateral to contract
    (try! (stx-transfer? collateral tx-sender (as-contract tx-sender)))
    
    ;; Transfer NFT to borrower
    (try! (nft-transfer? predinex-nft token-id (get lender loan) tx-sender))
    (map-set token-owners token-id tx-sender)
    
    ;; Update loan
    (map-set loans token-id (merge loan {
      borrower: tx-sender,
      start-time: burn-block-height,
      active: true
    }))
    
    (ok true)
  )
)

;; Repay loan
(define-public (repay-loan (token-id uint))
  (let (
    (loan (unwrap! (map-get? loans token-id) ERR-NOT-FOUND))
    (interest (/ (* (get collateral loan) (get interest-rate loan)) u10000))
  )
    (asserts! (is-eq tx-sender (get borrower loan)) ERR-NOT-OWNER)
    (asserts! (get active loan) ERR-UNAUTHORIZED)
    
    ;; Pay interest to lender
    (try! (stx-transfer? interest tx-sender (get lender loan)))
    
    ;; Return NFT to lender
    (try! (nft-transfer? predinex-nft token-id tx-sender (get lender loan)))
    (map-set token-owners token-id (get lender loan))
    
    ;; Return collateral to borrower
    (try! (as-contract (stx-transfer? (get collateral loan) tx-sender (get borrower loan))))
    
    ;; Mark loan as inactive
    (map-set loans token-id (merge loan { active: false }))
    (ok true)
  )
)
;; NFT fractionalization system
(define-map fractionalized-nfts uint { 
  owner: principal, 
  total-shares: uint, 
  share-price: uint,
  vault-address: principal,
  active: bool 
})
(define-map nft-shares { token-id: uint, holder: principal } uint)

;; Fractionalize NFT
(define-public (fractionalize-nft (token-id uint) (total-shares uint) (share-price uint))
  (let ((owner (unwrap! (nft-get-owner? predinex-nft token-id) ERR-NOT-FOUND)))
    (asserts! (is-eq tx-sender owner) ERR-NOT-OWNER)
    (asserts! (> total-shares u0) ERR-INVALID-TOKEN-ID)
    (asserts! (> share-price u0) ERR-INVALID-TOKEN-ID)
    
    ;; Transfer NFT to contract (vault)
    (try! (nft-transfer? predinex-nft token-id owner (as-contract tx-sender)))
    (map-set token-owners token-id (as-contract tx-sender))
    
    ;; Create fractionalization record
    (map-set fractionalized-nfts token-id {
      owner: owner,
      total-shares: total-shares,
      share-price: share-price,
      vault-address: (as-contract tx-sender),
      active: true
    })
    
    ;; Give all shares to original owner initially
    (map-set nft-shares { token-id: token-id, holder: owner } total-shares)
    (ok true)
  )
)

;; Buy shares
(define-public (buy-shares (token-id uint) (shares-amount uint))
  (let (
    (fraction-info (unwrap! (map-get? fractionalized-nfts token-id) ERR-NOT-FOUND))
    (share-price (get share-price fraction-info))
    (total-cost (* shares-amount share-price))
    (current-owner-shares (default-to u0 (map-get? nft-shares { token-id: token-id, holder: (get owner fraction-info) })))
  )
    (asserts! (get active fraction-info) ERR-UNAUTHORIZED)
    (asserts! (>= current-owner-shares shares-amount) ERR-INVALID-TOKEN-ID)
    
    ;; Transfer payment
    (try! (stx-transfer? total-cost tx-sender (get owner fraction-info)))
    
    ;; Transfer shares
    (map-set nft-shares { token-id: token-id, holder: (get owner fraction-info) } (- current-owner-shares shares-amount))
    (map-set nft-shares { token-id: token-id, holder: tx-sender } 
      (+ shares-amount (default-to u0 (map-get? nft-shares { token-id: token-id, holder: tx-sender }))))
    
    (ok true)
  )
)

;; Redeem NFT (if holding all shares)
(define-public (redeem-nft (token-id uint))
  (let (
    (fraction-info (unwrap! (map-get? fractionalized-nfts token-id) ERR-NOT-FOUND))
    (user-shares (default-to u0 (map-get? nft-shares { token-id: token-id, holder: tx-sender })))
  )
    (asserts! (get active fraction-info) ERR-UNAUTHORIZED)
    (asserts! (is-eq user-shares (get total-shares fraction-info)) ERR-UNAUTHORIZED)
    
    ;; Transfer NFT back to user
    (try! (nft-transfer? predinex-nft token-id (as-contract tx-sender) tx-sender))
    (map-set token-owners token-id tx-sender)
    
    ;; Mark as inactive
    (map-set fractionalized-nfts token-id (merge fraction-info { active: false }))
    (ok true)
  )
)
;; Dynamic metadata and evolution system
(define-map token-evolution uint { 
  level: uint, 
  experience: uint, 
  last-interaction: uint,
  evolution-stage: (string-ascii 32) 
})
(define-map evolution-requirements uint { exp-required: uint, new-stage: (string-ascii 32) })

;; Initialize evolution system
(define-public (init-evolution (token-id uint))
  (let ((owner (unwrap! (nft-get-owner? predinex-nft token-id) ERR-NOT-FOUND)))
    (asserts! (is-eq tx-sender owner) ERR-NOT-OWNER)
    
    (map-set token-evolution token-id {
      level: u1,
      experience: u0,
      last-interaction: burn-block-height,
      evolution-stage: "basic"
    })
    (ok true)
  )
)

;; Add experience to NFT
(define-public (add-experience (token-id uint) (exp-amount uint))
  (let (
    (owner (unwrap! (nft-get-owner? predinex-nft token-id) ERR-NOT-FOUND))
    (evolution (unwrap! (map-get? token-evolution token-id) ERR-NOT-FOUND))
  )
    (asserts! (is-eq tx-sender owner) ERR-NOT-OWNER)
    
    (let (
      (new-exp (+ (get experience evolution) exp-amount))
      (new-level (+ (get level evolution) (/ new-exp u1000))) ;; Level up every 1000 exp
    )
      (map-set token-evolution token-id (merge evolution {
        experience: new-exp,
        level: new-level,
        last-interaction: burn-block-height
      }))
      
      ;; Check for evolution
      (try! (check-evolution token-id new-exp))
      (ok new-level)
    )
  )
)

;; Check and trigger evolution
(define-private (check-evolution (token-id uint) (current-exp uint))
  (let ((evolution (unwrap! (map-get? token-evolution token-id) ERR-NOT-FOUND)))
    (match (map-get? evolution-requirements (get level evolution))
      req (if (>= current-exp (get exp-required req))
        (begin
          (map-set token-evolution token-id (merge evolution {
            evolution-stage: (get new-stage req)
          }))
          (ok true)
        )
        (ok false)
      )
      (ok false)
    )
  )
)

;; Set evolution requirements (owner only)
(define-public (set-evolution-requirement (level uint) (exp-required uint) (new-stage (string-ascii 32)))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-UNAUTHORIZED)
    (map-set evolution-requirements level { exp-required: exp-required, new-stage: new-stage })
    (ok true)
  )
)

;; Get evolution info
(define-read-only (get-evolution-info (token-id uint))
  (ok (map-get? token-evolution token-id))
)
;; Batch operations for gas efficiency
(define-public (batch-transfer (transfers (list 20 { token-id: uint, from: principal, to: principal })))
  (ok (map execute-single-transfer transfers))
)

(define-private (execute-single-transfer (transfer-data { token-id: uint, from: principal, to: principal }))
  (let (
    (token-id (get token-id transfer-data))
    (from (get from transfer-data))
    (to (get to transfer-data))
  )
    (match (transfer token-id from to)
      success true
      error false
    )
  )
)

;; Batch approve
(define-public (batch-approve (approvals (list 20 { token-id: uint, spender: principal })))
  (ok (map execute-single-approval approvals))
)

(define-private (execute-single-approval (approval-data { token-id: uint, spender: principal }))
  (let (
    (token-id (get token-id approval-data))
    (spender (get spender approval-data))
  )
    (match (approve spender token-id)
      success true
      error false
    )
  )
)

;; Batch burn
(define-public (batch-burn (token-ids (list 20 uint)))
  (ok (map execute-single-burn token-ids))
)

(define-private (execute-single-burn (token-id uint))
  (match (burn token-id)
    success true
    error false
  )
)
;; Whitelist and access control
(define-map whitelist principal bool)
(define-map minter-roles principal bool)
(define-data-var whitelist-enabled bool false)
(define-data-var public-mint-enabled bool true)

;; Add to whitelist
(define-public (add-to-whitelist (user principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-UNAUTHORIZED)
    (map-set whitelist user true)
    (ok true)
  )
)

;; Remove from whitelist
(define-public (remove-from-whitelist (user principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-UNAUTHORIZED)
    (map-set whitelist user false)
    (ok true)
  )
)

;; Grant minter role
(define-public (grant-minter-role (user principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-UNAUTHORIZED)
    (map-set minter-roles user true)
    (ok true)
  )
)

;; Revoke minter role
(define-public (revoke-minter-role (user principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-UNAUTHORIZED)
    (map-set minter-roles user false)
    (ok true)
  )
)

;; Toggle whitelist requirement
(define-public (toggle-whitelist (enabled bool))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-UNAUTHORIZED)
    (var-set whitelist-enabled enabled)
    (ok enabled)
  )
)

;; Check if user is whitelisted
(define-read-only (is-whitelisted (user principal))
  (default-to false (map-get? whitelist user))
)

;; Check if user has minter role
(define-read-only (has-minter-role (user principal))
  (or (is-eq user CONTRACT-OWNER) (default-to false (map-get? minter-roles user)))
)

;; Whitelist-protected mint
(define-public (whitelist-mint (recipient principal) (name (string-ascii 64)) (description (string-ascii 256)) (image (string-ascii 256)))
  (begin
    (asserts! (has-minter-role tx-sender) ERR-UNAUTHORIZED)
    (if (var-get whitelist-enabled)
      (asserts! (is-whitelisted recipient) ERR-UNAUTHORIZED)
      true
    )
    (mint recipient name description image)
  )
)
;; NFT burning with rewards system
(define-map burn-rewards uint uint) ;; token-id -> reward amount
(define-data-var burn-reward-pool uint u0)
(define-data-var default-burn-reward uint u1000)

;; Set burn reward for specific token
(define-public (set-burn-reward (token-id uint) (reward-amount uint))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-UNAUTHORIZED)
    (asserts! (token-exists token-id) ERR-NOT-FOUND)
    (map-set burn-rewards token-id reward-amount)
    (ok true)
  )
)

;; Fund burn reward pool
(define-public (fund-burn-rewards (amount uint))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-UNAUTHORIZED)
    (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
    (var-set burn-reward-pool (+ (var-get burn-reward-pool) amount))
    (ok true)
  )
)

;; Burn NFT with reward
(define-public (burn-with-reward (token-id uint))
  (let (
    (owner (unwrap! (nft-get-owner? predinex-nft token-id) ERR-NOT-FOUND))
    (reward (default-to (var-get default-burn-reward) (map-get? burn-rewards token-id)))
  )
    (asserts! (is-eq tx-sender owner) ERR-NOT-OWNER)
    (asserts! (>= (var-get burn-reward-pool) reward) ERR-INVALID-TOKEN-ID)
    
    ;; Burn the NFT
    (try! (nft-burn? predinex-nft token-id owner))
    (map-delete token-owners token-id)
    (map-delete token-approvals token-id)
    (map-delete token-metadata token-id)
    
    ;; Pay reward
    (try! (as-contract (stx-transfer? reward tx-sender owner)))
    (var-set burn-reward-pool (- (var-get burn-reward-pool) reward))
    
    (emit-transfer (some owner) 'SP000000000000000000002Q6VF78 token-id)
    (ok reward)
  )
)

;; Get burn reward for token
(define-read-only (get-burn-reward (token-id uint))
  (ok (default-to (var-get default-burn-reward) (map-get? burn-rewards token-id)))
)

;; Get burn reward pool balance
(define-read-only (get-burn-reward-pool)
  (ok (var-get burn-reward-pool))
)
;; Analytics and statistics system
(define-map user-stats principal { 
  tokens-owned: uint, 
  tokens-minted: uint, 
  tokens-burned: uint,
  total-spent: uint,
  total-earned: uint 
})
(define-data-var total-volume uint u0)
(define-data-var total-burned uint u0)

;; Update user statistics
(define-private (update-user-stats (user principal) (action (string-ascii 16)) (amount uint))
  (let (
    (current-stats (default-to 
      { tokens-owned: u0, tokens-minted: u0, tokens-burned: u0, total-spent: u0, total-earned: u0 }
      (map-get? user-stats user)
    ))
  )
    (if (is-eq action "mint")
      (map-set user-stats user (merge current-stats { tokens-minted: (+ (get tokens-minted current-stats) u1) }))
      (if (is-eq action "burn")
        (map-set user-stats user (merge current-stats { tokens-burned: (+ (get tokens-burned current-stats) u1) }))
        (if (is-eq action "buy")
          (map-set user-stats user (merge current-stats { total-spent: (+ (get total-spent current-stats) amount) }))
          (if (is-eq action "sell")
            (map-set user-stats user (merge current-stats { total-earned: (+ (get total-earned current-stats) amount) }))
            true
          )
        )
      )
    )
  )
)

;; Get comprehensive contract statistics
(define-read-only (get-contract-stats)
  (ok {
    total-supply: (var-get token-counter),
    total-volume: (var-get total-volume),
    total-burned: (var-get total-burned),
    collections-created: (var-get collection-counter),
    burn-reward-pool: (var-get burn-reward-pool)
  })
)

;; Get user statistics
(define-read-only (get-user-stats (user principal))
  (ok (map-get? user-stats user))
)

;; Get top holders (simplified version)
(define-read-only (get-top-holders)
  (ok (list 
    { user: CONTRACT-OWNER, balance: u0 } ;; Placeholder - would need proper implementation
  ))
)

;; Calculate floor price (simplified)
(define-read-only (get-floor-price)
  (ok u1000000) ;; Placeholder - would calculate from active listings
)

;; Get collection statistics
(define-read-only (get-collection-stats (collection-id uint))
  (match (map-get? collections collection-id)
    collection (ok {
      name: (get name collection),
      current-supply: (get current-supply collection),
      max-supply: (get max-supply collection),
      completion-rate: (/ (* (get current-supply collection) u100) (get max-supply collection))
    })
    (err ERR-NOT-FOUND)
  )
)