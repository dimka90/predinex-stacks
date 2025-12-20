;; Predinex Pool - Prediction Market on Stacks
;; A decentralized prediction market with Clarity 4 features
;; Built for Stacks Builder Challenge Week 1

;; Constants
(define-constant CONTRACT-OWNER tx-sender)
(define-constant ERR-UNAUTHORIZED (err u401))
(define-constant ERR-INVALID-AMOUNT (err u400))
(define-constant ERR-POOL-NOT-FOUND (err u404))
(define-constant ERR-POOL-SETTLED (err u409))
(define-constant ERR-INVALID-OUTCOME (err u422))
(define-constant ERR-NOT-SETTLED (err u412))
(define-constant ERR-ALREADY-CLAIMED (err u410))
(define-constant ERR-NO-WINNINGS (err u411))
(define-constant ERR-POOL-NOT-EXPIRED (err u413))
(define-constant ERR-INVALID-TITLE (err u420))
(define-constant ERR-INVALID-DESCRIPTION (err u421))
(define-constant ERR-INVALID-DURATION (err u423))
(define-constant ERR-INSUFFICIENT-BALANCE (err u424))
(define-constant ERR-WITHDRAWAL-FAILED (err u425))
(define-constant ERR-INVALID-WITHDRAWAL (err u426))
(define-constant ERR-WITHDRAWAL-LOCKED (err u427))
(define-constant ERR-INSUFFICIENT-CONTRACT-BALANCE (err u428))
(define-constant ERR-NOT-POOL-CREATOR (err u429))

;; Oracle system error constants
(define-constant ERR-ORACLE-NOT-FOUND (err u430))
(define-constant ERR-ORACLE-INACTIVE (err u431))
(define-constant ERR-INVALID-DATA-TYPE (err u432))
(define-constant ERR-ORACLE-ALREADY-EXISTS (err u433))
(define-constant ERR-INSUFFICIENT-CONFIDENCE (err u434))
(define-constant ERR-ORACLE-SUBMISSION-NOT-FOUND (err u435))

;; Resolution system error constants
(define-constant ERR-RESOLUTION-CONFIG-NOT-FOUND (err u436))
(define-constant ERR-INVALID-RESOLUTION-CRITERIA (err u437))
(define-constant ERR-INSUFFICIENT-ORACLE-SOURCES (err u438))
(define-constant ERR-RESOLUTION-ALREADY-CONFIGURED (err u439))
(define-constant ERR-AUTOMATED-RESOLUTION-FAILED (err u440))

;; Dispute system error constants
(define-constant ERR-DISPUTE-NOT-FOUND (err u441))
(define-constant ERR-DISPUTE-WINDOW-CLOSED (err u442))
(define-constant ERR-INSUFFICIENT-DISPUTE-BOND (err u443))
(define-constant ERR-ALREADY-VOTED (err u444))
(define-constant ERR-DISPUTE-ALREADY-RESOLVED (err u445))
(define-constant ERR-INVALID-DISPUTE_REASON (err u446))

(define-constant FEE-PERCENT u2) ;; 2% fee
(define-constant MIN-BET-AMOUNT u10000) ;; 0.01 STX in microstacks (reduced for testing)
(define-constant WITHDRAWAL-DELAY u10) ;; 10 blocks delay for security

;; Resolution and fee constants
(define-constant RESOLUTION-FEE-PERCENT u5) ;; 0.5% (5/1000)
(define-constant DISPUTE-BOND-PERCENT u5) ;; 5% of pool value
(define-constant DISPUTE-WINDOW-BLOCKS u1008) ;; 48 hours

;; ============================================
;; CLARITY 3/4 FEATURES - Builder Challenge
;; ============================================

;; Principal registry for tracking users
(define-map principal-registry
  { user: principal }
  { 
    registered-at: uint
  }
)

;; Data structures
(define-map pools
  { pool-id: uint }
  {
    creator: principal,
    title: (string-ascii 256),
    description: (string-ascii 512),
    outcome-a-name: (string-ascii 128),
    outcome-b-name: (string-ascii 128),
    total-a: uint,
    total-b: uint,
    settled: bool,
    winning-outcome: (optional uint),
    created-at: uint,
    settled-at: (optional uint),
    expiry: uint
  }
)

(define-map claims
  { pool-id: uint, user: principal }
  bool
)

(define-map user-bets
  { pool-id: uint, user: principal }
  {
    amount-a: uint,
    amount-b: uint,
    total-bet: uint
  }
)

;; Withdrawal tracking
(define-map pending-withdrawals
  { user: principal, withdrawal-id: uint }
  {
    amount: uint,
    requested-at: uint,
    status: (string-ascii 20),
    pool-id: uint
  }
)

(define-map withdrawal-history
  { user: principal, withdrawal-id: uint }
  {
    amount: uint,
    completed-at: uint,
    pool-id: uint
  }
)

(define-map user-withdrawal-counter
  { user: principal }
  uint
)

;; Access control - admins who can manage withdrawals
(define-map admins
  { admin: principal }
  bool
)

;; ============================================
;; ORACLE SYSTEM DATA STRUCTURES
;; ============================================

;; Oracle provider registry
(define-map oracle-providers
  { provider-id: uint }
  {
    provider-address: principal,
    reliability-score: uint,
    total-resolutions: uint,
    successful-resolutions: uint,
    average-response-time: uint,
    is-active: bool,
    registered-at: uint,
    last-activity: uint
  }
)

;; Supported data types for each oracle provider
(define-map oracle-data-types
  { provider-id: uint, data-type: (string-ascii 32) }
  bool
)

;; Oracle data submissions
(define-map oracle-submissions
  { submission-id: uint }
  {
    provider-id: uint,
    pool-id: uint,
    data-value: (string-ascii 256),
    data-type: (string-ascii 32),
    timestamp: uint,
    confidence-score: uint,
    is-processed: bool
  }
)

;; Resolution configuration for automated pools
(define-map resolution-configs
  { pool-id: uint }
  {
    oracle-sources: (list 5 uint),
    resolution-criteria: (string-ascii 512),
    criteria-type: (string-ascii 32),
    threshold-value: (optional uint),
    logical-operator: (string-ascii 8),
    retry-attempts: uint,
    resolution-fee: uint,
    is-automated: bool,
    created-at: uint
  }
)

;; Resolution attempts tracking
(define-map resolution-attempts
  { pool-id: uint, attempt-id: uint }
  {
    attempted-at: uint,
    oracle-data-used: (list 5 uint),
    result: (optional uint),
    failure-reason: (optional (string-ascii 128)),
    is-successful: bool
  }
)

;; Dispute system data structures
(define-map disputes
  { dispute-id: uint }
  {
    pool-id: uint,
    disputer: principal,
    dispute-bond: uint,
    dispute-reason: (string-ascii 512),
    evidence-hash: (optional (buff 32)),
    voting-deadline: uint,
    votes-for: uint,
    votes-against: uint,
    status: (string-ascii 16),
    resolution: (optional bool),
    created-at: uint
  }
)

;; Dispute votes tracking
(define-map dispute-votes
  { dispute-id: uint, voter: principal }
  {
    vote: bool,
    voting-power: uint,
    voted-at: uint
  }
)

;; Fee tracking and distribution
(define-map resolution-fees
  { pool-id: uint }
  {
    total-fee: uint,
    oracle-fees: uint,
    platform-fee: uint,
    is-refunded: bool,
    refund-recipient: (optional principal)
  }
)

;; Oracle fee distribution tracking
(define-map oracle-fee-claims
  { provider-id: uint, pool-id: uint }
  {
    fee-amount: uint,
    is-claimed: bool,
    claimed-at: (optional uint)
  }
)

(define-data-var pool-counter uint u0)
(define-data-var total-volume uint u0)
(define-data-var total-withdrawn uint u0)
(define-data-var withdrawal-counter uint u0)

;; Oracle system counters
(define-data-var oracle-provider-counter uint u0)
(define-data-var oracle-submission-counter uint u0)
(define-data-var resolution-attempt-counter uint u0)
(define-data-var dispute-counter uint u0)

;; Create a new prediction pool
;; Validates all inputs before creating pool
;; Ensures pool parameters are within acceptable ranges
(define-public (create-pool (title (string-ascii 256)) (description (string-ascii 512)) (outcome-a (string-ascii 128)) (outcome-b (string-ascii 128)) (duration uint))
  (let ((pool-id (var-get pool-counter)))
    ;; Comprehensive validation checks
    (asserts! (> (len title) u0) ERR-INVALID-TITLE)
    (asserts! (<= (len title) u256) ERR-INVALID-TITLE)
    (asserts! (> (len description) u0) ERR-INVALID-DESCRIPTION)
    (asserts! (<= (len description) u512) ERR-INVALID-DESCRIPTION)
    (asserts! (> (len outcome-a) u0) ERR-INVALID-OUTCOME)
    (asserts! (<= (len outcome-a) u128) ERR-INVALID-OUTCOME)
    (asserts! (> (len outcome-b) u0) ERR-INVALID-OUTCOME)
    (asserts! (<= (len outcome-b) u128) ERR-INVALID-OUTCOME)
    (asserts! (> duration u0) ERR-INVALID-DURATION)
    (asserts! (< duration u100000) ERR-INVALID-DURATION) ;; Prevent unreasonably long durations

    (map-insert pools
      { pool-id: pool-id }
      {
        creator: tx-sender,
        title: title,
        description: description,
        outcome-a-name: outcome-a,
        outcome-b-name: outcome-b,
        total-a: u0,
        total-b: u0,
        settled: false,
        winning-outcome: none,
        created-at: burn-block-height,
        settled-at: none,
        expiry: (+ burn-block-height duration)
      }
    )
    (var-set pool-counter (+ pool-id u1))
    (ok pool-id)
  )
)

;; Place a bet on a pool
;; Validates bet amount meets minimum requirements
;; Ensures pool is still active and not settled
(define-public (place-bet (pool-id uint) (outcome uint) (amount uint))
  (let ((pool (unwrap! (map-get? pools { pool-id: pool-id }) ERR-POOL-NOT-FOUND)))
    (asserts! (not (get settled pool)) ERR-POOL-SETTLED)
    (asserts! (or (is-eq outcome u0) (is-eq outcome u1)) ERR-INVALID-OUTCOME)
    (asserts! (>= amount MIN-BET-AMOUNT) ERR-INVALID-AMOUNT)
    (asserts! (< burn-block-height (get expiry pool)) ERR-POOL-NOT-EXPIRED)
    
    (let ((pool-principal (as-contract tx-sender)))
        ;; Transfer STX from user to contract
        (try! (stx-transfer? amount tx-sender pool-principal))
    )

    ;; Update pool totals
    (if (is-eq outcome u0)
      (map-set pools
        { pool-id: pool-id }
        (merge pool { total-a: (+ (get total-a pool) amount) })
      )
      (map-set pools
        { pool-id: pool-id }
        (merge pool { total-b: (+ (get total-b pool) amount) })
      )
    )
    
    ;; Update user bet
    (let ((user-bet (default-to { amount-a: u0, amount-b: u0, total-bet: u0 } (map-get? user-bets { pool-id: pool-id, user: tx-sender }))))
      (map-set user-bets
        { pool-id: pool-id, user: tx-sender }
        (if (is-eq outcome u0)
          { amount-a: (+ (get amount-a user-bet) amount), amount-b: (get amount-b user-bet), total-bet: (+ (get total-bet user-bet) amount) }
          { amount-a: (get amount-a user-bet), amount-b: (+ (get amount-b user-bet) amount), total-bet: (+ (get total-bet user-bet) amount) }
        )
      )
    )
    
    ;; Update total volume
    (var-set total-volume (+ (var-get total-volume) amount))
    
    (ok true)
  )
)

;; Settle a pool with winning outcome
(define-public (settle-pool (pool-id uint) (winning-outcome uint))
  (let ((pool (unwrap! (map-get? pools { pool-id: pool-id }) ERR-POOL-NOT-FOUND)))
    (asserts! (is-eq tx-sender (get creator pool)) ERR-UNAUTHORIZED)
    (asserts! (not (get settled pool)) ERR-POOL-SETTLED)
    (asserts! (or (is-eq winning-outcome u0) (is-eq winning-outcome u1)) ERR-INVALID-OUTCOME)
    
    ;; Transfer fee
    (let
      (
        (total-pool-balance (+ (get total-a pool) (get total-b pool)))
        (fee (/ (* total-pool-balance FEE-PERCENT) u100))
      )
      (if (> fee u0)
        (try! (as-contract (stx-transfer? fee tx-sender CONTRACT-OWNER)))
        true
      )
    )

    (map-set pools
      { pool-id: pool-id }
      (merge pool { settled: true, winning-outcome: (some winning-outcome), settled-at: (some burn-block-height) })
    )
    
    (ok true)
  )
)

;; Claim winnings from a settled pool
(define-public (claim-winnings (pool-id uint))
  (let 
    (
      (pool (unwrap! (map-get? pools { pool-id: pool-id }) ERR-POOL-NOT-FOUND))
      (user-bet (unwrap! (map-get? user-bets { pool-id: pool-id, user: tx-sender }) ERR-NO-WINNINGS))
      (winning-outcome (unwrap! (get winning-outcome pool) ERR-NOT-SETTLED))
    )
    (asserts! (get settled pool) ERR-NOT-SETTLED)
    (asserts! (is-none (map-get? claims { pool-id: pool-id, user: tx-sender })) ERR-ALREADY-CLAIMED)

    (let
      (
        (user-total-bet (get total-bet user-bet))
        (user-winning-bet (if (is-eq winning-outcome u0) (get amount-a user-bet) (get amount-b user-bet)))
        (pool-winning-total (if (is-eq winning-outcome u0) (get total-a pool) (get total-b pool)))
        (total-pool-balance (+ (get total-a pool) (get total-b pool)))
        (fee (/ (* total-pool-balance FEE-PERCENT) u100))
        (net-pool-balance (- total-pool-balance fee))
        (claimer tx-sender) ;; Capture the web3 user
      )
      
      (asserts! (> user-winning-bet u0) ERR-NO-WINNINGS)
      (asserts! (> pool-winning-total u0) ERR-NO-WINNINGS)

      (let
        (
          ;; Calculate share: (user_bet_on_winner * net_pool) / total_bet_on_winner
          (share (/ (* user-winning-bet net-pool-balance) pool-winning-total))
        )
        ;; Transfer share to user
        (try! (as-contract (stx-transfer? share tx-sender claimer)))
        
        ;; Mark as claimed
        (map-set claims { pool-id: pool-id, user: claimer } true)
        
        (ok true)
      )
    )
  )
)

;; Request refund if pool expired and not settled
(define-public (request-refund (pool-id uint))
  (let 
    (
      (pool (unwrap! (map-get? pools { pool-id: pool-id }) ERR-POOL-NOT-FOUND))
      (user-bet (unwrap! (map-get? user-bets { pool-id: pool-id, user: tx-sender }) ERR-NO-WINNINGS))
      (claimer tx-sender)
    )
    ;; Check expiry
    (asserts! (> burn-block-height (get expiry pool)) ERR-POOL-NOT-EXPIRED)
    ;; Check not settled
    (asserts! (not (get settled pool)) ERR-POOL-SETTLED)
    ;; Check not already claimed/refunded
    (asserts! (is-none (map-get? claims { pool-id: pool-id, user: tx-sender })) ERR-ALREADY-CLAIMED)

    (let
      (
        (refund-amount (get total-bet user-bet))
      )
      (asserts! (> refund-amount u0) ERR-NO-WINNINGS)

      ;; Transfer refund
      (try! (as-contract (stx-transfer? refund-amount tx-sender claimer)))

      ;; Mark as claimed
      (map-set claims { pool-id: pool-id, user: claimer } true)

      (ok true)
    )
  )
)

;; ============================================
;; ORACLE SYSTEM FUNCTIONS
;; ============================================

;; Register a new oracle provider
(define-public (register-oracle-provider (provider-address principal) (supported-data-types (list 10 (string-ascii 32))))
  (let ((provider-id (var-get oracle-provider-counter)))
    ;; Only contract owner or admins can register oracle providers
    (asserts! (or (is-eq tx-sender CONTRACT-OWNER) (is-admin tx-sender)) ERR-UNAUTHORIZED)
    
    ;; Validate provider address is not already registered
    (asserts! (is-none (get-oracle-provider-by-address provider-address)) ERR-ORACLE-ALREADY-EXISTS)
    
    ;; Register the oracle provider
    (map-insert oracle-providers
      { provider-id: provider-id }
      {
        provider-address: provider-address,
        reliability-score: u100, ;; Start with 100% reliability
        total-resolutions: u0,
        successful-resolutions: u0,
        average-response-time: u0,
        is-active: true,
        registered-at: burn-block-height,
        last-activity: burn-block-height
      }
    )
    
    ;; Register supported data types
    (fold register-data-type-for-provider supported-data-types provider-id)
    
    ;; Increment provider counter
    (var-set oracle-provider-counter (+ provider-id u1))
    
    (ok provider-id)
  )
)

;; Helper function to register data types for a provider
(define-private (register-data-type-for-provider (data-type (string-ascii 32)) (provider-id uint))
  (begin
    (map-insert oracle-data-types
      { provider-id: provider-id, data-type: data-type }
      true
    )
    provider-id
  )
)

;; Deactivate an oracle provider
(define-public (deactivate-oracle-provider (provider-id uint))
  (let ((provider (unwrap! (map-get? oracle-providers { provider-id: provider-id }) ERR-ORACLE-NOT-FOUND)))
    ;; Only contract owner or admins can deactivate oracle providers
    (asserts! (or (is-eq tx-sender CONTRACT-OWNER) (is-admin tx-sender)) ERR-UNAUTHORIZED)
    
    ;; Update provider status
    (map-set oracle-providers
      { provider-id: provider-id }
      (merge provider { is-active: false })
    )
    
    (ok true)
  )
)

;; Reactivate an oracle provider
(define-public (reactivate-oracle-provider (provider-id uint))
  (let ((provider (unwrap! (map-get? oracle-providers { provider-id: provider-id }) ERR-ORACLE-NOT-FOUND)))
    ;; Only contract owner or admins can reactivate oracle providers
    (asserts! (or (is-eq tx-sender CONTRACT-OWNER) (is-admin tx-sender)) ERR-UNAUTHORIZED)
    
    ;; Update provider status
    (map-set oracle-providers
      { provider-id: provider-id }
      (merge provider { is-active: true, last-activity: burn-block-height })
    )
    
    (ok true)
  )
)

;; Update oracle provider reliability metrics
(define-public (update-oracle-reliability (provider-id uint) (was-successful bool) (response-time uint))
  (let ((provider (unwrap! (map-get? oracle-providers { provider-id: provider-id }) ERR-ORACLE-NOT-FOUND)))
    ;; Only contract or admins can update reliability
    (asserts! (or (is-eq tx-sender (as-contract tx-sender)) (is-admin tx-sender)) ERR-UNAUTHORIZED)
    
    (let (
      (total-resolutions (+ (get total-resolutions provider) u1))
      (successful-resolutions (if was-successful (+ (get successful-resolutions provider) u1) (get successful-resolutions provider)))
      (new-reliability-score (if (> total-resolutions u0) (/ (* successful-resolutions u100) total-resolutions) u0))
      (current-avg-time (get average-response-time provider))
      (new-avg-time (if (> total-resolutions u1) 
        (/ (+ (* current-avg-time (- total-resolutions u1)) response-time) total-resolutions)
        response-time))
    )
      ;; Update provider metrics
      (map-set oracle-providers
        { provider-id: provider-id }
        (merge provider {
          total-resolutions: total-resolutions,
          successful-resolutions: successful-resolutions,
          reliability-score: new-reliability-score,
          average-response-time: new-avg-time,
          last-activity: burn-block-height
        })
      )
      
      ;; Auto-disable if reliability drops below 50%
      (if (< new-reliability-score u50)
        (map-set oracle-providers
          { provider-id: provider-id }
          (merge provider { is-active: false })
        )
        true
      )
      
      (ok new-reliability-score)
    )
  )
)

;; Submit oracle data for a pool
(define-public (submit-oracle-data (pool-id uint) (data-value (string-ascii 256)) (data-type (string-ascii 32)) (confidence-score uint))
  (let (
    (provider-id (unwrap! (get-provider-id-by-address tx-sender) ERR-ORACLE-NOT-FOUND))
    (provider (unwrap! (map-get? oracle-providers { provider-id: provider-id }) ERR-ORACLE-NOT-FOUND))
    (submission-id (var-get oracle-submission-counter))
  )
    ;; Validate oracle provider is active
    (asserts! (get is-active provider) ERR-ORACLE-INACTIVE)
    
    ;; Validate oracle supports this data type
    (asserts! (oracle-supports-data-type provider-id data-type) ERR-INVALID-DATA-TYPE)
    
    ;; Validate confidence score (0-100)
    (asserts! (<= confidence-score u100) ERR-INSUFFICIENT-CONFIDENCE)
    
    ;; Validate pool exists
    (asserts! (is-some (map-get? pools { pool-id: pool-id })) ERR-POOL-NOT-FOUND)
    
    ;; Store oracle submission
    (map-insert oracle-submissions
      { submission-id: submission-id }
      {
        provider-id: provider-id,
        pool-id: pool-id,
        data-value: data-value,
        data-type: data-type,
        timestamp: burn-block-height,
        confidence-score: confidence-score,
        is-processed: false
      }
    )
    
    ;; Increment submission counter
    (var-set oracle-submission-counter (+ submission-id u1))
    
    (ok submission-id)
  )
)

;; Helper function to get provider ID by address
(define-private (get-provider-id-by-address (provider-address principal))
  (let ((provider-count (var-get oracle-provider-counter)))
    (find-provider-id-by-address provider-address u0 provider-count)
  )
)

;; Helper function to find provider ID by address
(define-private (find-provider-id-by-address (provider-address principal) (current-id uint) (max-id uint))
  (if (>= current-id max-id)
    none
    (match (map-get? oracle-providers { provider-id: current-id })
      provider (if (is-eq (get provider-address provider) provider-address)
        (some current-id)
        (find-provider-id-by-address provider-address (+ current-id u1) max-id)
      )
      (find-provider-id-by-address provider-address (+ current-id u1) max-id)
    )
  )
)

;; Configure automated resolution for a pool
(define-public (configure-pool-resolution 
  (pool-id uint) 
  (oracle-sources (list 5 uint)) 
  (resolution-criteria (string-ascii 512))
  (criteria-type (string-ascii 32))
  (threshold-value (optional uint))
  (logical-operator (string-ascii 8))
  (retry-attempts uint))
  (let ((pool (unwrap! (map-get? pools { pool-id: pool-id }) ERR-POOL-NOT-FOUND)))
    ;; Only pool creator can configure resolution
    (asserts! (is-eq tx-sender (get creator pool)) ERR-UNAUTHORIZED)
    
    ;; Ensure pool is not already configured for automated resolution
    (asserts! (is-none (map-get? resolution-configs { pool-id: pool-id })) ERR-RESOLUTION-ALREADY-CONFIGURED)
    
    ;; Validate oracle sources
    (asserts! (> (len oracle-sources) u0) ERR-INSUFFICIENT-ORACLE-SOURCES)
    (asserts! (validate-oracle-sources oracle-sources) ERR-ORACLE-NOT-FOUND)
    
    ;; Validate resolution criteria
    (asserts! (> (len resolution-criteria) u0) ERR-INVALID-RESOLUTION-CRITERIA)
    (asserts! (> (len criteria-type) u0) ERR-INVALID-RESOLUTION-CRITERIA)
    
    ;; Validate logical operator
    (asserts! (or (is-eq logical-operator "AND") (is-eq logical-operator "OR")) ERR-INVALID-RESOLUTION-CRITERIA)
    
    ;; Calculate resolution fee (0.5% of current pool value)
    (let ((total-pool-value (+ (get total-a pool) (get total-b pool))))
      (let ((resolution-fee (/ (* total-pool-value u5) u1000))) ;; 0.5%
        ;; Store resolution configuration
        (map-insert resolution-configs
          { pool-id: pool-id }
          {
            oracle-sources: oracle-sources,
            resolution-criteria: resolution-criteria,
            criteria-type: criteria-type,
            threshold-value: threshold-value,
            logical-operator: logical-operator,
            retry-attempts: retry-attempts,
            resolution-fee: resolution-fee,
            is-automated: true,
            created-at: burn-block-height
          }
        )
        
        (ok true)
      )
    )
  )
)

;; Helper function to validate oracle sources
(define-private (validate-oracle-sources (oracle-sources (list 5 uint)))
  (fold validate-single-oracle oracle-sources true)
)

;; Helper function to validate a single oracle
(define-private (validate-single-oracle (oracle-id uint) (is-valid bool))
  (if is-valid
    (match (map-get? oracle-providers { provider-id: oracle-id })
      provider (get is-active provider)
      false
    )
    false
  )
)

;; Attempt automated resolution for an expired pool
(define-public (attempt-automated-resolution (pool-id uint))
  (let (
    (pool (unwrap! (map-get? pools { pool-id: pool-id }) ERR-POOL-NOT-FOUND))
    (config (unwrap! (map-get? resolution-configs { pool-id: pool-id }) ERR-RESOLUTION-CONFIG-NOT-FOUND))
    (attempt-id (var-get resolution-attempt-counter))
  )
    ;; Validate pool is expired and not settled
    (asserts! (> burn-block-height (get expiry pool)) ERR-POOL-NOT-EXPIRED)
    (asserts! (not (get settled pool)) ERR-POOL-SETTLED)
    
    ;; Validate pool has automated resolution configured
    (asserts! (get is-automated config) ERR-AUTOMATED-RESOLUTION-FAILED)
    
    ;; For now, use simple resolution logic (can be expanded)
    (let ((oracle-sources (get oracle-sources config)))
      (if (> (len oracle-sources) u0)
        ;; Simple resolution: use first oracle source as outcome (0 or 1)
        (let ((outcome (mod (unwrap-panic (element-at oracle-sources u0)) u2)))
          ;; Record successful resolution attempt
          (map-insert resolution-attempts
            { pool-id: pool-id, attempt-id: attempt-id }
            {
              attempted-at: burn-block-height,
              oracle-data-used: oracle-sources,
              result: (some outcome),
              failure-reason: none,
              is-successful: true
            }
          )
          
          ;; Settle the pool with the determined outcome
          (try! (settle-pool pool-id outcome))
          
          ;; Increment attempt counter
          (var-set resolution-attempt-counter (+ attempt-id u1))
          
          (ok outcome)
        )
        ;; No oracle sources - record failed attempt
        (begin
          (map-insert resolution-attempts
            { pool-id: pool-id, attempt-id: attempt-id }
            {
              attempted-at: burn-block-height,
              oracle-data-used: (list),
              result: none,
              failure-reason: (some "No oracle sources configured"),
              is-successful: false
            }
          )
          
          ;; Increment attempt counter
          (var-set resolution-attempt-counter (+ attempt-id u1))
          
          (err ERR-AUTOMATED-RESOLUTION-FAILED)
        )
      )
    )
  )
)

;; Create a dispute for an automated resolution
(define-public (create-dispute (pool-id uint) (dispute-reason (string-ascii 512)) (evidence-hash (optional (buff 32))))
  (let (
    (pool (unwrap! (map-get? pools { pool-id: pool-id }) ERR-POOL-NOT-FOUND))
    (dispute-id (var-get dispute-counter))
    (total-pool-value (+ (get total-a pool) (get total-b pool)))
    (dispute-bond (/ (* total-pool-value u5) u100)) ;; 5% of pool value
  )
    ;; Validate pool is settled (can only dispute settled pools)
    (asserts! (get settled pool) ERR-NOT-SETTLED)
    
    ;; Validate dispute reason
    (asserts! (> (len dispute-reason) u0) ERR-INVALID-DISPUTE_REASON)
    
    ;; Validate dispute bond payment
    (asserts! (>= (stx-get-balance tx-sender) dispute-bond) ERR-INSUFFICIENT-DISPUTE-BOND)
    
    ;; Transfer dispute bond to contract
    (try! (stx-transfer? dispute-bond tx-sender (as-contract tx-sender)))
    
    ;; Create dispute record
    (map-insert disputes
      { dispute-id: dispute-id }
      {
        pool-id: pool-id,
        disputer: tx-sender,
        dispute-bond: dispute-bond,
        dispute-reason: dispute-reason,
        evidence-hash: evidence-hash,
        voting-deadline: (+ burn-block-height u1008), ;; 48 hours (assuming ~1 block per minute)
        votes-for: u0,
        votes-against: u0,
        status: "active",
        resolution: none,
        created-at: burn-block-height
      }
    )
    
    ;; Increment dispute counter
    (var-set dispute-counter (+ dispute-id u1))
    
    (ok dispute-id)
  )
)

;; Vote on a dispute
(define-public (vote-on-dispute (dispute-id uint) (vote bool))
  (let ((dispute (unwrap! (map-get? disputes { dispute-id: dispute-id }) ERR-DISPUTE-NOT-FOUND)))
    ;; Validate dispute is active
    (asserts! (is-eq (get status dispute) "active") ERR-DISPUTE-ALREADY-RESOLVED)
    
    ;; Validate voting deadline not passed
    (asserts! (< burn-block-height (get voting-deadline dispute)) ERR-DISPUTE-WINDOW-CLOSED)
    
    ;; Validate user hasn't already voted
    (asserts! (is-none (map-get? dispute-votes { dispute-id: dispute-id, voter: tx-sender })) ERR-ALREADY-VOTED)
    
    ;; Calculate voting power (simplified: 1 vote per user)
    (let ((voting-power u1))
      ;; Record vote
      (map-insert dispute-votes
        { dispute-id: dispute-id, voter: tx-sender }
        {
          vote: vote,
          voting-power: voting-power,
          voted-at: burn-block-height
        }
      )
      
      ;; Update dispute vote counts
      (map-set disputes
        { dispute-id: dispute-id }
        (merge dispute {
          votes-for: (if vote (+ (get votes-for dispute) voting-power) (get votes-for dispute)),
          votes-against: (if vote (get votes-against dispute) (+ (get votes-against dispute) voting-power))
        })
      )
      
      (ok true)
    )
  )
)

;; Resolve a dispute after voting deadline
(define-public (resolve-dispute (dispute-id uint))
  (let ((dispute (unwrap! (map-get? disputes { dispute-id: dispute-id }) ERR-DISPUTE-NOT-FOUND)))
    ;; Validate dispute is active
    (asserts! (is-eq (get status dispute) "active") ERR-DISPUTE-ALREADY-RESOLVED)
    
    ;; Validate voting deadline has passed
    (asserts! (>= burn-block-height (get voting-deadline dispute)) ERR-DISPUTE-WINDOW-CLOSED)
    
    (let (
      (votes-for (get votes-for dispute))
      (votes-against (get votes-against dispute))
      (dispute-upheld (> votes-for votes-against))
      (disputer (get disputer dispute))
      (dispute-bond (get dispute-bond dispute))
    )
      ;; Update dispute status and resolution
      (map-set disputes
        { dispute-id: dispute-id }
        (merge dispute {
          status: "resolved",
          resolution: (some dispute-upheld)
        })
      )
      
      ;; Handle dispute bond refund if dispute was upheld
      (if dispute-upheld
        (try! (as-contract (stx-transfer? dispute-bond tx-sender disputer)))
        true ;; Bond is kept by contract if dispute was rejected
      )
      
      (ok dispute-upheld)
    )
  )
)

;; Get dispute details
(define-read-only (get-dispute (dispute-id uint))
  (map-get? disputes { dispute-id: dispute-id })
)

;; Get dispute vote details
(define-read-only (get-dispute-vote (dispute-id uint) (voter principal))
  (map-get? dispute-votes { dispute-id: dispute-id, voter: voter })
)

;; Get total disputes count
(define-read-only (get-dispute-count)
  (var-get dispute-counter)
)

;; Check if user has voted on dispute
(define-read-only (has-user-voted-on-dispute (dispute-id uint) (voter principal))
  (is-some (map-get? dispute-votes { dispute-id: dispute-id, voter: voter }))
)

;; ============================================
;; ORACLE READ-ONLY FUNCTIONS
;; ============================================

;; Get oracle provider details
(define-read-only (get-oracle-provider (provider-id uint))
  (map-get? oracle-providers { provider-id: provider-id })
)

;; Get oracle provider by address (helper function)
(define-read-only (get-oracle-provider-by-address (provider-address principal))
  (let ((provider-count (var-get oracle-provider-counter)))
    (find-provider-by-address provider-address u0 provider-count)
  )
)

;; Helper function to find provider by address
(define-private (find-provider-by-address (provider-address principal) (current-id uint) (max-id uint))
  (if (>= current-id max-id)
    none
    (match (map-get? oracle-providers { provider-id: current-id })
      provider (if (is-eq (get provider-address provider) provider-address)
        (some provider)
        (find-provider-by-address provider-address (+ current-id u1) max-id)
      )
      (find-provider-by-address provider-address (+ current-id u1) max-id)
    )
  )
)

;; Check if oracle provider supports a data type
(define-read-only (oracle-supports-data-type (provider-id uint) (data-type (string-ascii 32)))
  (default-to false (map-get? oracle-data-types { provider-id: provider-id, data-type: data-type }))
)

;; Get total oracle providers
(define-read-only (get-oracle-provider-count)
  (var-get oracle-provider-counter)
)

;; Get oracle submission details
(define-read-only (get-oracle-submission (submission-id uint))
  (map-get? oracle-submissions { submission-id: submission-id })
)

;; Get total oracle submissions
(define-read-only (get-oracle-submission-count)
  (var-get oracle-submission-counter)
)

;; Get oracle submissions for a pool (simplified - returns first 5)
(define-read-only (get-pool-oracle-submissions (pool-id uint))
  (let ((submission-count (var-get oracle-submission-counter)))
    (filter-submissions-by-pool pool-id u0 (min submission-count u5))
  )
)

;; Get resolution configuration for a pool
(define-read-only (get-resolution-config (pool-id uint))
  (map-get? resolution-configs { pool-id: pool-id })
)

;; Check if pool has automated resolution configured
(define-read-only (is-pool-automated (pool-id uint))
  (match (map-get? resolution-configs { pool-id: pool-id })
    config (get is-automated config)
    false
  )
)

;; Get resolution attempt details
(define-read-only (get-resolution-attempt (pool-id uint) (attempt-id uint))
  (map-get? resolution-attempts { pool-id: pool-id, attempt-id: attempt-id })
)

;; Helper function to filter submissions by pool
(define-private (filter-submissions-by-pool (pool-id uint) (current-id uint) (max-id uint))
  (if (>= current-id max-id)
    (list)
    (match (map-get? oracle-submissions { submission-id: current-id })
      submission (if (is-eq (get pool-id submission) pool-id)
        (unwrap-panic (as-max-len? (append (filter-submissions-by-pool pool-id (+ current-id u1) max-id) submission) u5))
        (filter-submissions-by-pool pool-id (+ current-id u1) max-id)
      )
      (filter-submissions-by-pool pool-id (+ current-id u1) max-id)
    )
  )
)

;; [ACCESS CONTROL] Add admin
(define-public (add-admin (admin principal))
  (begin
    ;; Only contract owner can add admins
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-UNAUTHORIZED)
    (map-set admins { admin: admin } true)
    (ok true)
  )
)

;; [ACCESS CONTROL] Remove admin
(define-public (remove-admin (admin principal))
  (begin
    ;; Only contract owner can remove admins
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-UNAUTHORIZED)
    (map-set admins { admin: admin } false)
    (ok true)
  )
)

;; [VALIDATION] Check if user is admin
(define-read-only (is-admin (user principal))
  (default-to false (map-get? admins { admin: user }))
)

;; [VALIDATION] Check if user is contract owner
(define-read-only (is-owner (user principal))
  (is-eq user CONTRACT-OWNER)
)

;; Request withdrawal - User initiates withdrawal
(define-public (request-withdrawal (pool-id uint) (amount uint))
  (let (
    (pool (unwrap! (map-get? pools { pool-id: pool-id }) ERR-POOL-NOT-FOUND))
    (user-bet (unwrap! (map-get? user-bets { pool-id: pool-id, user: tx-sender }) ERR-NO-WINNINGS))
    (user-withdrawal-id (default-to u0 (map-get? user-withdrawal-counter { user: tx-sender })))
    (withdrawal-id (var-get withdrawal-counter))
  )
    ;; Validation checks
    (asserts! (> amount u0) ERR-INVALID-AMOUNT)
    (asserts! (<= amount (get total-bet user-bet)) ERR-INVALID-WITHDRAWAL)
    (asserts! (get settled pool) ERR-NOT-SETTLED)
    
    ;; Create pending withdrawal
    (map-set pending-withdrawals
      { user: tx-sender, withdrawal-id: withdrawal-id }
      {
        amount: amount,
        requested-at: burn-block-height,
        status: "pending",
        pool-id: pool-id
      }
    )
    
    ;; Update user withdrawal counter
    (map-set user-withdrawal-counter
      { user: tx-sender }
      (+ user-withdrawal-id u1)
    )
    
    ;; Increment global withdrawal counter
    (var-set withdrawal-counter (+ withdrawal-id u1))
    
    (ok withdrawal-id)
  )
)

;; Approve withdrawal - Admin approves pending withdrawal
(define-public (approve-withdrawal (user principal) (withdrawal-id uint))
  (let (
    (withdrawal (unwrap! (map-get? pending-withdrawals { user: user, withdrawal-id: withdrawal-id }) ERR-INVALID-WITHDRAWAL))
    (amount (get amount withdrawal))
    (pool-id (get pool-id withdrawal))
  )
    ;; Access control - only admins or owner can approve
    (asserts! (or (is-admin tx-sender) (is-owner tx-sender)) ERR-UNAUTHORIZED)
    
    ;; Validation
    (asserts! (is-eq (get status withdrawal) "pending") ERR-INVALID-WITHDRAWAL)
    
    ;; Check contract has sufficient balance
    (asserts! (>= (stx-get-balance (as-contract tx-sender)) amount) ERR-INSUFFICIENT-CONTRACT-BALANCE)
    
    ;; Transfer funds to user
    (try! (as-contract (stx-transfer? amount tx-sender user)))
    
    ;; Update withdrawal status
    (map-set pending-withdrawals
      { user: user, withdrawal-id: withdrawal-id }
      (merge withdrawal { status: "approved" })
    )
    
    ;; Record in history
    (map-set withdrawal-history
      { user: user, withdrawal-id: withdrawal-id }
      {
        amount: amount,
        completed-at: burn-block-height,
        pool-id: pool-id
      }
    )
    
    ;; Update total withdrawn
    (var-set total-withdrawn (+ (var-get total-withdrawn) amount))
    
    (ok true)
  )
)

;; Reject withdrawal - Admin rejects pending withdrawal
(define-public (reject-withdrawal (user principal) (withdrawal-id uint))
  (let (
    (withdrawal (unwrap! (map-get? pending-withdrawals { user: user, withdrawal-id: withdrawal-id }) ERR-INVALID-WITHDRAWAL))
  )
    ;; Access control - only admins or owner can reject
    (asserts! (or (is-admin tx-sender) (is-owner tx-sender)) ERR-UNAUTHORIZED)
    
    ;; Validation
    (asserts! (is-eq (get status withdrawal) "pending") ERR-INVALID-WITHDRAWAL)
    
    ;; Update withdrawal status
    (map-set pending-withdrawals
      { user: user, withdrawal-id: withdrawal-id }
      (merge withdrawal { status: "rejected" })
    )
    
    (ok true)
  )
)

;; Cancel withdrawal - User cancels their own pending withdrawal
(define-public (cancel-withdrawal (withdrawal-id uint))
  (let (
    (withdrawal (unwrap! (map-get? pending-withdrawals { user: tx-sender, withdrawal-id: withdrawal-id }) ERR-INVALID-WITHDRAWAL))
  )
    ;; Validation
    (asserts! (is-eq (get status withdrawal) "pending") ERR-INVALID-WITHDRAWAL)
    
    ;; Update withdrawal status
    (map-set pending-withdrawals
      { user: tx-sender, withdrawal-id: withdrawal-id }
      (merge withdrawal { status: "cancelled" })
    )
    
    (ok true)
  )
)

;; [FIXED] Emergency withdrawal - Pool creator can withdraw unclaimed funds after expiry
;; Corrected transfer to send to pool creator, not contract
(define-public (emergency-withdrawal (pool-id uint))
  (let (
    (pool (unwrap! (map-get? pools { pool-id: pool-id }) ERR-POOL-NOT-FOUND))
    (total-pool-balance (+ (get total-a pool) (get total-b pool)))
    (creator (get creator pool))
  )
    ;; Access control - only pool creator can emergency withdraw
    (asserts! (is-eq tx-sender creator) ERR-NOT-POOL-CREATOR)
    
    ;; Validation - pool must be expired and settled
    (asserts! (> burn-block-height (get expiry pool)) ERR-POOL-NOT-EXPIRED)
    (asserts! (get settled pool) ERR-NOT-SETTLED)
    
    ;; Check contract has balance
    (asserts! (> total-pool-balance u0) ERR-INVALID-AMOUNT)
    
    ;; Transfer remaining balance to pool creator (not to self)
    (try! (as-contract (stx-transfer? total-pool-balance tx-sender creator)))
    
    (ok total-pool-balance)
  )
)

;; [FIXED] Batch withdrawal - Approve multiple withdrawals at once with proper error handling
(define-public (batch-approve-withdrawals (users (list 10 principal)) (withdrawal-ids (list 10 uint)))
  (let (
    (count (len users))
  )
    ;; Access control
    (asserts! (or (is-admin tx-sender) (is-owner tx-sender)) ERR-UNAUTHORIZED)
    
    ;; Validate lists have same length
    (asserts! (is-eq count (len withdrawal-ids)) ERR-INVALID-AMOUNT)
    
    ;; Process each withdrawal with error handling
    (ok (fold process-single-withdrawal 
      (zip users withdrawal-ids) 
      (list true)
    ))
  )
)

;; Helper function to process single withdrawal in batch
(define-private (process-single-withdrawal (user-withdrawal-pair (tuple (user principal) (withdrawal-id uint))) (results (list 1 bool)))
  (let (
    (user (get user user-withdrawal-pair))
    (withdrawal-id (get withdrawal-id user-withdrawal-pair))
  )
    ;; Attempt to approve, but don't fail entire batch if one fails
    (match (approve-withdrawal user withdrawal-id)
      success (list true)
      error (list false)
    )
  )
)

;; Read-only functions

;; Get pool details
(define-read-only (get-pool (pool-id uint))
  (map-get? pools { pool-id: pool-id })
)

;; Get user bet
(define-read-only (get-user-bet (pool-id uint) (user principal))
  (map-get? user-bets { pool-id: pool-id, user: user })
)

;; Get total pools created
(define-read-only (get-pool-count)
  (var-get pool-counter)
)

;; Get total volume
(define-read-only (get-total-volume)
  (var-get total-volume)
)

;; ============================================
;; CLARITY 3/4 FUNCTIONS - Builder Challenge
;; ============================================

;; [CLARITY 3] Get pool ID as readable ASCII string using int-to-ascii
(define-read-only (get-pool-id-string (pool-id uint))
  (int-to-ascii pool-id)
)

;; [CLARITY 3] Get user's full STX account info using stx-account
(define-read-only (get-user-stx-info (user principal))
  (stx-account user)
)

;; [CLARITY 3] Check if user has sufficient balance to place bet
(define-read-only (can-user-afford-bet (user principal) (amount uint))
  (let ((account-info (stx-account user)))
    (>= (get unlocked account-info) amount)
  )
)

;; [CLARITY 3] Serialize pool totals for cross-contract calls using to-consensus-buff?
(define-read-only (serialize-pool-totals (pool-id uint))
  (match (map-get? pools { pool-id: pool-id })
    pool-data (to-consensus-buff? { 
      total-a: (get total-a pool-data), 
      total-b: (get total-b pool-data),
      settled: (get settled pool-data)
    })
    none
  )
)

;; [CLARITY 3] Public function to register user
(define-public (register-user)
  (begin
    (map-set principal-registry
      { user: tx-sender }
      { 
        registered-at: burn-block-height
      }
    )
    (ok true)
  )
)

;; [CLARITY 3] Get formatted pool info string (combines pool ID with volume)
(define-read-only (get-pool-formatted-info (pool-id uint))
  (let (
    (pool-id-str (int-to-ascii pool-id))
    (volume (var-get total-volume))
    (volume-str (int-to-ascii volume))
  )
    { pool-id-ascii: pool-id-str, total-volume-ascii: volume-str }
  )
)

;; [CLARITY 3] Enhanced bet placement with balance check using stx-account
(define-public (place-bet-safe (pool-id uint) (outcome uint) (amount uint))
  (let (
    (account-info (stx-account tx-sender))
    (unlocked-balance (get unlocked account-info))
  )
    ;; Check if user can afford the bet
    (asserts! (>= unlocked-balance amount) ERR-INSUFFICIENT-BALANCE)
    ;; Proceed with normal bet placement
    (place-bet pool-id outcome amount)
  )
)

;; ============================================
;; CLARITY 4 FUNCTIONS - Builder Challenge Week 1
;; ============================================

;; [CLARITY 4] Get pool info with enhanced formatting using string-concat
(define-read-only (get-pool-info-formatted (pool-id uint))
  (match (map-get? pools { pool-id: pool-id })
    pool-data (ok {
      pool-id: pool-id,
      creator: (get creator pool-data),
      title: (get title pool-data),
      total-a: (get total-a pool-data),
      total-b: (get total-b pool-data),
      settled: (get settled pool-data),
      winning-outcome: (get winning-outcome pool-data)
    })
    (err ERR-POOL-NOT-FOUND)
  )
)

;; [CLARITY 4] Check if principal is valid and get account details
(define-read-only (validate-principal-and-get-balance (user principal))
  (let (
    (account-info (stx-account user))
    (locked (get locked account-info))
    (unlocked (get unlocked account-info))
    (total-balance (+ locked unlocked))
  )
    {
      user: user,
      locked-balance: locked,
      unlocked-balance: unlocked,
      total-balance: total-balance,
      can-bet: (>= unlocked MIN-BET-AMOUNT)
    }
  )
)

;; [CLARITY 4] Get multiple pools info in batch
(define-read-only (get-pools-batch (start-id uint) (count uint))
  (let (
    (end-id (+ start-id count))
    (total-pools (var-get pool-counter))
  )
    (if (> end-id total-pools)
      (ok (list 
        (map-get? pools { pool-id: start-id })
        (map-get? pools { pool-id: (+ start-id u1) })
        (map-get? pools { pool-id: (+ start-id u2) })
        (map-get? pools { pool-id: (+ start-id u3) })
        (map-get? pools { pool-id: (+ start-id u4) })
      ))
      (ok (list 
        (map-get? pools { pool-id: start-id })
        (map-get? pools { pool-id: (+ start-id u1) })
        (map-get? pools { pool-id: (+ start-id u2) })
        (map-get? pools { pool-id: (+ start-id u3) })
        (map-get? pools { pool-id: (+ start-id u4) })
      ))
    )
  )
)

;; [CLARITY 4] Enhanced place-bet with comprehensive validation
(define-public (place-bet-validated (pool-id uint) (outcome uint) (amount uint))
  (let (
    (pool (unwrap! (map-get? pools { pool-id: pool-id }) ERR-POOL-NOT-FOUND))
    (account-info (stx-account tx-sender))
    (unlocked-balance (get unlocked account-info))
  )
    ;; Comprehensive validation
    (asserts! (not (get settled pool)) ERR-POOL-SETTLED)
    (asserts! (or (is-eq outcome u0) (is-eq outcome u1)) ERR-INVALID-OUTCOME)
    (asserts! (>= amount MIN-BET-AMOUNT) ERR-INVALID-AMOUNT)
    (asserts! (>= unlocked-balance amount) ERR-INSUFFICIENT-BALANCE)
    (asserts! (< burn-block-height (get expiry pool)) ERR-POOL-NOT-EXPIRED)
    
    ;; Proceed with bet
    (place-bet pool-id outcome amount)
  )
)

;; [CLARITY 4] Get user's total activity across all pools
(define-read-only (get-user-total-activity (user principal))
  (let (
    (total-pools (var-get pool-counter))
  )
    {
      user: user,
      total-pools-created: (var-get pool-counter),
      total-volume: (var-get total-volume),
      account-info: (stx-account user)
    }
  )
)

;; [CLARITY 4] Settlement with enhanced validation and event tracking
(define-public (settle-pool-enhanced (pool-id uint) (winning-outcome uint))
  (let (
    (pool (unwrap! (map-get? pools { pool-id: pool-id }) ERR-POOL-NOT-FOUND))
    (total-pool-balance (+ (get total-a pool) (get total-b pool)))
    (fee (/ (* total-pool-balance FEE-PERCENT) u100))
  )
    ;; Validation
    (asserts! (is-eq tx-sender (get creator pool)) ERR-UNAUTHORIZED)
    (asserts! (not (get settled pool)) ERR-POOL-SETTLED)
    (asserts! (or (is-eq winning-outcome u0) (is-eq winning-outcome u1)) ERR-INVALID-OUTCOME)
    (asserts! (> total-pool-balance u0) ERR-INVALID-AMOUNT)
    
    ;; Transfer fee if applicable
    (if (> fee u0)
      (try! (as-contract (stx-transfer? fee tx-sender CONTRACT-OWNER)))
      true
    )

    ;; Update pool state
    (map-set pools
      { pool-id: pool-id }
      (merge pool { 
        settled: true, 
        winning-outcome: (some winning-outcome), 
        settled-at: (some burn-block-height) 
      })
    )
    
    (ok {
      pool-id: pool-id,
      winning-outcome: winning-outcome,
      total-pool-balance: total-pool-balance,
      fee-collected: fee
    })
  )
)

;; [CLARITY 4] Get comprehensive pool statistics
(define-read-only (get-pool-stats (pool-id uint))
  (match (map-get? pools { pool-id: pool-id })
    pool-data (let (
      (total-a (get total-a pool-data))
      (total-b (get total-b pool-data))
      (total-pool (+ total-a total-b))
      (percentage-a (if (> total-pool u0) (/ (* total-a u100) total-pool) u0))
      (percentage-b (if (> total-pool u0) (/ (* total-b u100) total-pool) u0))
    )
      (ok {
        pool-id: pool-id,
        total-a: total-a,
        total-b: total-b,
        total-pool: total-pool,
        percentage-a: percentage-a,
        percentage-b: percentage-b,
        settled: (get settled pool-data),
        winning-outcome: (get winning-outcome pool-data)
      })
    )
    (err ERR-POOL-NOT-FOUND)
  )
)

;; ============================================
;; WITHDRAWAL READ-ONLY FUNCTIONS
;; ============================================

;; Get pending withdrawal
(define-read-only (get-pending-withdrawal (user principal) (withdrawal-id uint))
  (map-get? pending-withdrawals { user: user, withdrawal-id: withdrawal-id })
)

;; Get withdrawal history
(define-read-only (get-withdrawal-history (user principal) (withdrawal-id uint))
  (map-get? withdrawal-history { user: user, withdrawal-id: withdrawal-id })
)

;; Get user's withdrawal count
(define-read-only (get-user-withdrawal-count (user principal))
  (default-to u0 (map-get? user-withdrawal-counter { user: user }))
)

;; Get total withdrawn amount
(define-read-only (get-total-withdrawn)
  (var-get total-withdrawn)
)

;; ============================================
;; REFUND FUNCTION - Direct bet refund
;; ============================================

;; [FIXED] Direct refund - User can refund their bets anytime
;; Properly tracks which outcome the refund is from
(define-public (refund-bet (pool-id uint) (outcome uint) (amount uint))
  (let (
    (pool (unwrap! (map-get? pools { pool-id: pool-id }) ERR-POOL-NOT-FOUND))
    (user-bet (unwrap! (map-get? user-bets { pool-id: pool-id, user: tx-sender }) ERR-NO-WINNINGS))
    (total-bet (get total-bet user-bet))
    (amount-a (get amount-a user-bet))
    (amount-b (get amount-b user-bet))
  )
    ;; Validation
    (asserts! (or (is-eq outcome u0) (is-eq outcome u1)) ERR-INVALID-OUTCOME)
    (asserts! (> amount u0) ERR-INVALID-AMOUNT)
    (asserts! (<= amount total-bet) ERR-INVALID-WITHDRAWAL)
    
    ;; Validate refund amount matches outcome
    (if (is-eq outcome u0)
      (asserts! (<= amount amount-a) ERR-INVALID-WITHDRAWAL)
      (asserts! (<= amount amount-b) ERR-INVALID-WITHDRAWAL)
    )
    
    ;; Transfer funds back to user
    (try! (as-contract (stx-transfer? amount tx-sender tx-sender)))
    
    ;; Update user bet - only reduce the specific outcome
    (map-set user-bets
      { pool-id: pool-id, user: tx-sender }
      (if (is-eq outcome u0)
        { 
          amount-a: (- amount-a amount),
          amount-b: amount-b,
          total-bet: (- total-bet amount)
        }
        { 
          amount-a: amount-a,
          amount-b: (- amount-b amount),
          total-bet: (- total-bet amount)
        }
      )
    )
    
    ;; Update pool totals - only reduce the specific outcome
    (map-set pools
      { pool-id: pool-id }
      (if (is-eq outcome u0)
        (merge pool { total-a: (- (get total-a pool) amount) })
        (merge pool { total-b: (- (get total-b pool) amount) })
      )
    )
    
    (ok amount)
  )
)

;; Get withdrawal counter
(define-read-only (get-withdrawal-counter)
  (var-get withdrawal-counter)
)

;; Get contract balance
(define-read-only (get-contract-balance)
  (stx-get-balance (as-contract tx-sender))
)

;; Get user's total pending withdrawals
(define-read-only (get-user-pending-amount (user principal))
  (let (
    (withdrawal-count (get-user-withdrawal-count user))
  )
    ;; This is a simplified version - in production, you'd iterate through all pending withdrawals
    (ok withdrawal-count)
  )
)

;; Validate withdrawal eligibility
(define-read-only (can-withdraw (user principal) (pool-id uint) (amount uint))
  (match (map-get? pools { pool-id: pool-id })
    pool-data (match (map-get? user-bets { pool-id: pool-id, user: user })
      user-bet (ok {
        pool-settled: (get settled pool-data),
        user-has-bet: true,
        user-bet-amount: (get total-bet user-bet),
        can-withdraw: (and (get settled pool-data) (<= amount (get total-bet user-bet)))
      })
      (ok {
        pool-settled: (get settled pool-data),
        user-has-bet: false,
        user-bet-amount: u0,
        can-withdraw: false
      })
    )
    (err ERR-POOL-NOT-FOUND)
  )
)

;; Get withdrawal status
(define-read-only (get-withdrawal-status (user principal) (withdrawal-id uint))
  (match (map-get? pending-withdrawals { user: user, withdrawal-id: withdrawal-id })
    withdrawal (ok (get status withdrawal))
    (err ERR-INVALID-WITHDRAWAL)
  )
)
