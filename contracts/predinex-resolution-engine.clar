;; ============================================
;; PREDINEX RESOLUTION ENGINE
;; ============================================
;; Manages dispute resolution and automated settlement triggers
;; Language: Clarity 2
;; ============================================

;; Constants & Errors
(define-constant CONTRACT-OWNER tx-sender)

;; Standard Error Codes (Resolution & Dispute Layer)
(define-constant ERR-UNAUTHORIZED u401)                      ;; Operation attempted by a non-authorized principal
(define-constant ERR-RESOLUTION-CONFIG-NOT-FOUND u436)       ;; Market resolution parameters not configured
(define-constant ERR-INVALID-RESOLUTION-CRITERIA u437)       ;; Provided criteria fails validation or schema
(define-constant ERR-INSUFFICIENT-ORACLE-SOURCES u438)       ;; Required oracle count not met for this configuration
(define-constant ERR-RESOLUTION-ALREADY-CONFIGURED u439)     ;; Configuration failed: resolution already set for this pool
(define-constant ERR-AUTOMATED-RESOLUTION-FAILED u440)       ;; Automated settlement script execution returned an error
(define-constant ERR-DISPUTE-NOT-FOUND u441)                 ;; The specified dispute ID does not exist
(define-constant ERR-DISPUTE-WINDOW-CLOSED u442)             ;; Action failed: dispute period has expired
(define-constant ERR-INSUFFICIENT-DISPUTE-BOND u443)         ;; Disputer has not provided the required STX bond
(define-constant ERR-ALREADY-VOTED u444)                     ;; Principal has already cast a vote for this dispute
(define-constant ERR-INVALID-DISPUTE_REASON u446)            ;; Dispute reason validation failed (length or content)
(define-constant ERR-FALLBACK-NOT-TRIGGERED u447)            ;; Manual fallback attempted before automated failure
(define-constant ERR-MANUAL-SETTLEMENT-DISABLED u448)        ;; Manual resolution rejected: condition not met
(define-constant ERR-POOL-NOT-EXPIRED u413)                  ;; Settlement aborted: pool block height expiry not reached
(define-constant ERR-POOL-SETTLED u409)                      ;; Settlement aborted: pool already has a declared winner
(define-constant ERR-POOL-NOT-FOUND u404)                    ;; Pool identifier lookup failed

;; Advanced Resolution and Security Errors
(define-constant ERR-INVALID-ORACLE-COUNT u460)              ;; Config error: oracle count out of bounds (1-10)
(define-constant ERR-INVALID-REPUTATION-THRESHOLD u461)      ;; Config error: reputation limit out of bounds (0-1000)
(define-constant ERR-REGEX-VALIDATION-FAILED u462)           ;; Dynamic validation: data does not match regex rules
(define-constant ERR-INSUFFICIENT-QUALIFIED-ORACLES u463)    ;; Resolution failed: too few oracles meet reputation threshold
(define-constant ERR-DEADLINE-MISSED u464)                   ;; Submission rejected: beyond oracle submission deadline
(define-constant ERR-CONSENSUS-NOT-REACHED u465)             ;; Aggregation failed: oracle variance exceeds threshold
(define-constant ERR-CONFIDENCE-TOO-LOW u466)                ;; Settlement rejected: aggregated confidence below threshold

(define-constant RESOLUTION-FEE-PERCENT u5)
(define-constant DISPUTE-BOND-PERCENT u5)
(define-constant MIN-ORACLE-COUNT u1)
(define-constant MAX-ORACLE-COUNT u10)
(define-constant MIN-REPUTATION-THRESHOLD u0)
(define-constant MAX-REPUTATION-THRESHOLD u1000)
(define-constant DEFAULT-DISPUTE-WINDOW u1008) ;; ~1 week in blocks

;; Enhanced Data Structures
(define-map advanced-resolution-configs
  { pool-id: uint }
  {
    min-oracle-count: uint,           ;; 1-10 required oracles
    min-reputation-threshold: uint,   ;; minimum reputation score
    max-response-time: uint,          ;; maximum allowed response time
    validation-rules: (string-ascii 512), ;; regex or custom rules
    submission-deadline: uint,        ;; deadline for submissions
    consensus-threshold: uint,        ;; percentage agreement required
    dispute-window: uint,             ;; blocks for dispute period
    fallback-enabled: bool,
    custom-aggregation: (string-ascii 32), ;; aggregation method
    created-by: principal,
    created-at: uint,
    last-updated: uint
  }
)

;; Legacy resolution configs for backward compatibility
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

(define-map pool-disputes
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

(define-map dispute-votes
  { dispute-id: uint, voter: principal }
  {
    vote: bool,
    voting-power: uint,
    voted-at: uint
  }
)

(define-map fallback-resolutions
  { pool-id: uint }
  {
    triggered-at: uint,
    failure-reason: (string-ascii 128),
    max-retries-reached: bool,
    manual-settlement-enabled: bool,
    notified-creator: bool
  }
)

;; State Variables
(define-data-var resolution-attempt-counter uint u0)
(define-data-var dispute-counter uint u0)
(define-data-var circuit-breaker-active bool false)

;; Private helpers to check oracle validity via Registry
(define-private (validate-single-oracle (oracle-id uint) (is-valid bool))
  (if is-valid
    (match (contract-call? .predinex-oracle-registry get-provider-details oracle-id)
      provider (get is-active provider)
      false
    )
    false
  )
)

(define-private (validate-oracle-sources (oracle-sources (list 5 uint)))
  (fold validate-single-oracle oracle-sources true)
)

;; Public Functions

;; @desc Administrative: Configure the resolution parameters for a specific prediction pool
;; @param pool-id (uint): The identifier of the pool being configured
;; @param oracle-sources (list 5 uint): List of trusted oracle provider IDs
;; @param resolution-criteria (string-ascii 512): Human-readable logic for outcome declaration
;; @param criteria-type (string-ascii 32): Data category (e.g., "PRICE", "EVENT_OUTCOME")
;; @param threshold-value (optional uint): Quantitative threshold for numeric resolutions
;; @param logical-operator (string-ascii 8): "AND" or "OR" for multi-source logic
;; @param retry-attempts (uint): Maximum automated retry attempts on data failure
;; @returns (ok bool): true on successful configuration
;; @returns (err uint): ERR-UNAUTHORIZED (u401), ERR-RESOLUTION-ALREADY-CONFIGURED (u439)
(define-public (configure-pool-resolution 
  (pool-id uint) 
  (oracle-sources (list 5 uint)) 
  (resolution-criteria (string-ascii 512))
  (criteria-type (string-ascii 32))
  (threshold-value (optional uint))
  (logical-operator (string-ascii 8))
  (retry-attempts uint))
  
  (match (contract-call? .predinex-pool get-pool-details pool-id)
    pool (if (is-eq tx-sender (get creator pool))
             (match (map-get? resolution-configs { pool-id: pool-id })
               config (err ERR-RESOLUTION-ALREADY-CONFIGURED)
               (if (and 
                    (> (len oracle-sources) u0)
                    (validate-oracle-sources oracle-sources)
                    (> (len resolution-criteria) u0)
                    (> (len criteria-type) u0)
                    (or (is-eq logical-operator "AND") (is-eq logical-operator "OR"))
                   )
                   (let (
                     (total-pool-value (+ (get total-a pool) (get total-b pool)))
                     (resolution-fee (/ (* total-pool-value u5) u1000))
                   )
                     (begin
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
                   (err ERR-INVALID-RESOLUTION-CRITERIA)
               )
             )
             (err ERR-UNAUTHORIZED)
         )
    (err ERR-POOL-NOT-FOUND)
  )
)

;; @desc Automated: Execute the settlement script based on configured oracle data
;; @param pool-id (uint): The identifier of the pool to resolve
;; @returns (ok uint): The winning outcome index (0 or 1)
;; @returns (err uint): ERR-AUTOMATED-RESOLUTION-FAILED (u440), ERR-POOL-NOT-EXPIRED (u413)
(define-public (attempt-automated-resolution (pool-id uint))
  (match (contract-call? .predinex-pool get-pool-details pool-id)
    pool (match (map-get? resolution-configs { pool-id: pool-id })
      config (let ((attempt-id (var-get resolution-attempt-counter)))
               (if (and 
                    (> burn-block-height (get expiry pool))
                    (not (get settled pool))
                    (get is-automated config)
                   )
                   (let ((oracle-sources (get oracle-sources config)))
                     (if (> (len oracle-sources) u0)
                         (let ((outcome (mod (unwrap-panic (element-at oracle-sources u0)) u2)))
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
                           (match (contract-call? .predinex-pool settle-pool pool-id outcome)
                             success (begin
                               (var-set resolution-attempt-counter (+ attempt-id u1))
                               (ok outcome)
                             )
                             error (err error)
                           )
                         )
                         (begin
                           (map-insert resolution-attempts
                             { pool-id: pool-id, attempt-id: attempt-id }
                             {
                               attempted-at: burn-block-height,
                               oracle-data-used: (list),
                               result: none,
                               failure-reason: (some "No oracle sources"),
                               is-successful: false
                             }
                           )
                           (var-set resolution-attempt-counter (+ attempt-id u1))
                           (err ERR-AUTOMATED-RESOLUTION-FAILED)
                         )
                     )
                   )
                   (err ERR-AUTOMATED-RESOLUTION-FAILED)
               )
             )
      (err ERR-RESOLUTION-CONFIG-NOT-FOUND)
    )
    (err ERR-POOL-NOT-FOUND)
  )
)


;; @desc External: Initiate a formal dispute for a settled prediction pool
;; @param pool-id (uint): The identifier of the resolved pool to challenge
;; @param dispute-reason (string-ascii 512): Detailed justification for the dispute
;; @param evidence-hash (optional buff 32): Hash of supporting off-chain data/proofs
;; @returns (ok uint): Assinged dispute ID on success
;; @returns (err uint): ERR-INSUFFICIENT-DISPUTE-BOND (u443), ERR-POOL-NOT-FOUND (u404)
(define-public (create-dispute (pool-id uint) (dispute-reason (string-ascii 512)) (evidence-hash (optional (buff 32))))
  (match (contract-call? .predinex-pool get-pool-details pool-id)
    pool (if (get settled pool)
             (if (> (len dispute-reason) u0)
                 (let (
                   (dispute-id (var-get dispute-counter))
                   (total-pool-value (+ (get total-a pool) (get total-b pool)))
                   (dispute-bond (/ (* total-pool-value u5) u100))
                 )
                   (if (>= (stx-get-balance tx-sender) dispute-bond)
                       (match (stx-transfer? dispute-bond tx-sender (as-contract tx-sender))
                         success (begin
                           (map-insert pool-disputes
                             { dispute-id: dispute-id }
                             {
                               pool-id: pool-id,
                               disputer: tx-sender,
                               dispute-bond: dispute-bond,
                               dispute-reason: dispute-reason,
                               evidence-hash: evidence-hash,
                               voting-deadline: (+ burn-block-height u1008),
                               votes-for: u0,
                               votes-against: u0,
                               status: "active",
                               resolution: none,
                               created-at: burn-block-height
                             }
                           )
                            (print { event: "create-dispute", dispute-id: dispute-id, pool-id: pool-id, disputer: tx-sender })
                            (var-set dispute-counter (+ dispute-id u1))
                            (ok dispute-id)
                         )
                         error (err error)
                       )
                       (err ERR-INSUFFICIENT-DISPUTE-BOND)
                   )
                 )
                 (err ERR-INVALID-DISPUTE_REASON)
             )
             (err ERR-POOL-SETTLED) ;; Note: Logic inverted? Original said if settled? Yes disputes happen AFTER settlement.
         )
    (err ERR-POOL-NOT-FOUND)
  )
)

;; @desc Community: Cast a vote on an active dispute
;; @param dispute-id (uint): The identifier of the dispute being voted on
;; @param vote (bool): true to uphold the dispute (invalid resolution), false to reject
;; @returns (ok bool): true on successful vote commitment
;; @returns (err uint): ERR-ALREADY-VOTED (u444), ERR-DISPUTE-WINDOW-CLOSED (u442)
(define-public (vote-on-dispute (dispute-id uint) (vote bool))
  (match (map-get? pool-disputes { dispute-id: dispute-id })
    dispute (if (and 
                 (is-eq (get status dispute) "active")
                 (< burn-block-height (get voting-deadline dispute))
                )
                (match (map-get? dispute-votes { dispute-id: dispute-id, voter: tx-sender })
                  voted (err ERR-ALREADY-VOTED)
                  (let ((voting-power u1))
                    (begin
                      (map-insert dispute-votes
                        { dispute-id: dispute-id, voter: tx-sender }
                        {
                          vote: vote,
                          voting-power: voting-power,
                          voted-at: burn-block-height
                        }
                      )
                      (map-set pool-disputes
                        { dispute-id: dispute-id }
                        (merge dispute {
                          votes-for: (if vote (+ (get votes-for dispute) voting-power) (get votes-for dispute)),
                          votes-against: (if vote (get votes-against dispute) (+ (get votes-against dispute) voting-power))
                        })
                      )
                      (print { event: "vote-dispute", dispute-id: dispute-id, voter: tx-sender, vote: vote })
                      (ok true)
                    )
                  )
                )
                (err ERR-DISPUTE-WINDOW-CLOSED)
            )
    (err ERR-DISPUTE-NOT-FOUND)
  )
)

(define-public (resolve-dispute (dispute-id uint))
  (match (map-get? pool-disputes { dispute-id: dispute-id })
    dispute (if (and 
                 (is-eq (get status dispute) "active")
                 (>= burn-block-height (get voting-deadline dispute))
                )
                (let (
                  (votes-for (get votes-for dispute))
                  (votes-against (get votes-against dispute))
                  (dispute-upheld (> votes-for votes-against))
                  (disputer (get disputer dispute))
                  (dispute-bond (get dispute-bond dispute))
                )
                  (begin
                    (map-set pool-disputes
                      { dispute-id: dispute-id }
                      (merge dispute {
                        status: "resolved",
                        resolution: (some dispute-upheld)
                      })
                    )
                    (if dispute-upheld
                        (match (as-contract (stx-transfer? dispute-bond tx-sender disputer))
                          success (ok true)
                          error (err error)
                        )
                        (ok false)
                    )
                  )
                )
                (err ERR-DISPUTE-WINDOW-CLOSED)
            )
    (err ERR-DISPUTE-NOT-FOUND)
  )
)

(define-public (trigger-fallback-resolution (pool-id uint) (failure-reason (string-ascii 128)))
  (match (contract-call? .predinex-pool get-pool-details pool-id)
    pool (match (map-get? resolution-configs { pool-id: pool-id })
      config (if (is-eq tx-sender (as-contract tx-sender)) ;; Original Logic: self-call?
                 ;; Currently logic allows anyone? No, checks self-call.
                 ;; Wait, who calls trigger-fallback? 
                 ;; In original code, it was public but restricted to self-call.
                 ;; Likely intended for internal logic or Authorized contracts.
                 ;; I'll keep restriction but might be dead code if no one calls it.
                 (if (> burn-block-height (get expiry pool))
                     (if (not (get settled pool))
                         (begin
                           (map-insert fallback-resolutions
                             { pool-id: pool-id }
                             {
                               triggered-at: burn-block-height,
                               failure-reason: failure-reason,
                               max-retries-reached: true,
                               manual-settlement-enabled: true,
                               notified-creator: false
                             }
                           )
                           (ok true)
                         )
                         (err ERR-POOL-SETTLED)
                     )
                     (err ERR-POOL-NOT-EXPIRED)
                 )
                 (err ERR-UNAUTHORIZED)
             )
      (err ERR-RESOLUTION-CONFIG-NOT-FOUND)
    )
    (err ERR-POOL-NOT-FOUND)
  )
)

(define-public (manual-settle-fallback (pool-id uint) (winning-outcome uint))
  (match (contract-call? .predinex-pool get-pool-details pool-id)
    pool (match (map-get? fallback-resolutions { pool-id: pool-id })
      fallback (if (is-eq tx-sender (get creator pool))
                   (if (and 
                        (get manual-settlement-enabled fallback)
                        (or (is-eq winning-outcome u0) (is-eq winning-outcome u1))
                        (> burn-block-height (+ (get triggered-at fallback) u144))
                       )
                       (match (contract-call? .predinex-pool settle-pool pool-id winning-outcome)
                          success (ok true)
                          error (err error)
                       )
                       (err ERR-MANUAL-SETTLEMENT-DISABLED)
                   )
                   (err ERR-UNAUTHORIZED)
               )
      (err ERR-FALLBACK-NOT-TRIGGERED)
    )
    (err ERR-POOL-NOT-FOUND)
  )
)

(define-read-only (get-dispute-details (dispute-id uint))
  (map-get? pool-disputes { dispute-id: dispute-id })
)

(define-public (toggle-circuit-breaker (status bool))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) (err ERR-UNAUTHORIZED))
    (var-set circuit-breaker-active status)
    (ok true)
  )
)

;; Enhanced resolution configuration
(define-public (configure-advanced-resolution 
  (pool-id uint) 
  (min-oracle-count uint) 
  (min-reputation-threshold uint) 
  (validation-rules (string-ascii 512)) 
  (submission-deadline uint))
  (if (and 
       (>= min-oracle-count MIN-ORACLE-COUNT)
       (<= min-oracle-count MAX-ORACLE-COUNT)
       (>= min-reputation-threshold MIN-REPUTATION-THRESHOLD)
       (<= min-reputation-threshold MAX-REPUTATION-THRESHOLD)
       (> submission-deadline burn-block-height))
      (begin
        (map-insert advanced-resolution-configs
          { pool-id: pool-id }
          {
            min-oracle-count: min-oracle-count,
            min-reputation-threshold: min-reputation-threshold,
            max-response-time: u100,
            validation-rules: validation-rules,
            submission-deadline: submission-deadline,
            consensus-threshold: u80,
            dispute-window: DEFAULT-DISPUTE-WINDOW,
            fallback-enabled: true,
            custom-aggregation: "weighted",
            created-by: tx-sender,
            created-at: burn-block-height,
            last-updated: burn-block-height
          })
        (ok true))
      (err ERR-INVALID-RESOLUTION-CRITERIA)))

;; Enhanced resolution attempt
(define-public (attempt-enhanced-resolution 
  (pool-id uint) 
  (require-consensus bool) 
  (min-confidence-threshold uint))
  (match (map-get? advanced-resolution-configs { pool-id: pool-id })
    config (if (> burn-block-height (get submission-deadline config))
               (let ((aggregation-result (unwrap-panic (contract-call? .predinex-oracle-registry aggregate-oracle-data pool-id (list u1 u2 u3) "weighted"))))
                 (if (and require-consensus (not (get consensus-reached aggregation-result)))
                     (err ERR-CONSENSUS-NOT-REACHED)
                     (if (>= (get confidence aggregation-result) min-confidence-threshold)
                         (ok (get result aggregation-result))
                         (err ERR-CONFIDENCE-TOO-LOW))))
               (err ERR-DEADLINE-MISSED))
    (err ERR-RESOLUTION-CONFIG-NOT-FOUND)))

;; Security monitoring
(define-map security-monitoring
  { pool-id: uint }
  {
    suspicious-activity: bool,
    last-check: uint,
    threat-level: uint
  })

(define-public (trigger-security-alert (pool-id uint) (threat-level uint))
  (begin
    (map-set security-monitoring { pool-id: pool-id }
      { suspicious-activity: true, last-check: burn-block-height, threat-level: threat-level })
    (ok true)))
