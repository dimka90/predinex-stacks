;; ============================================
;; PREDINEX ORACLE REGISTRY
;; ============================================
;; Manages oracle providers and data submissions
;; Language: Clarity 2
;; ============================================

;; Constants & Errors
(define-constant CONTRACT-OWNER tx-sender)
(define-constant ERR-UNAUTHORIZED u401)
(define-constant ERR-ORACLE-NOT-FOUND u430)
(define-constant ERR-ORACLE-INACTIVE u431)
(define-constant ERR-INVALID-DATA-TYPE u432)
(define-constant ERR-ORACLE-ALREADY-EXISTS u433)
(define-constant ERR-INSUFFICIENT-CONFIDENCE u434)
(define-constant ERR-ORACLE-SUBMISSION-NOT-FOUND u435)

;; Enhanced Oracle Registry Errors
(define-constant ERR-INSUFFICIENT-STAKE u450)
(define-constant ERR-INVALID-METADATA u451)
(define-constant ERR-PROVIDER-SUSPENDED u452)
(define-constant ERR-DEADLINE-EXCEEDED u453)
(define-constant ERR-SCHEMA-VALIDATION-FAILED u454)
(define-constant ERR-CONFLICT-OF-INTEREST u455)
(define-constant ERR-COLLUSION-DETECTED u456)
(define-constant ERR-ATTACK-PATTERN u457)
(define-constant ERR-REPUTATION-TOO-LOW u458)
(define-constant ERR-CIRCUIT-BREAKER-ACTIVE u459)

;; System Constants
(define-constant MIN-STAKE-AMOUNT u1000000000) ;; 1000 STX in microSTX
(define-constant REPUTATION-SCALE u1000)
(define-constant PREMIUM-PROVIDER-THRESHOLD u950) ;; 95% accuracy
(define-constant SUSPENSION-THRESHOLD u3) ;; 3 consecutive failures
(define-constant SLASHING-PERCENTAGE u10) ;; 10% of stake

;; Enhanced Data Structures
(define-map enhanced-oracle-providers
  { provider-id: uint }
  {
    provider-address: principal,
    reputation-score: uint,           ;; 0-1000 scale
    total-resolutions: uint,
    successful-resolutions: uint,
    failed-resolutions: uint,
    average-response-time: uint,      ;; in blocks
    stake-amount: uint,               ;; STX tokens locked
    stake-locked-at: uint,
    premium-provider: bool,           ;; 95%+ accuracy status
    suspension-count: uint,
    last-activity: uint,
    total-earnings: uint,
    slashed-amount: uint,
    metadata: (string-ascii 512),
    is-active: bool,
    registered-at: uint
  }
)

(define-map oracle-address-to-id
  { provider-address: principal }
  uint
)

(define-map oracle-data-types
  { provider-id: uint, data-type: (string-ascii 32) }
  bool
)

(define-map enhanced-oracle-submissions
  { submission-id: uint }
  {
    provider-id: uint,
    pool-id: uint,
    data-value: (string-ascii 256),
    data-type: (string-ascii 32),
    confidence-score: uint,           ;; 0-100 percentage
    timestamp: uint,
    response-time: uint,              ;; time from request to submission
    validation-hash: (buff 32),       ;; for data integrity
    aggregation-weight: uint,         ;; calculated based on reputation
    is-processed: bool,
    is-disputed: bool,
    dispute-outcome: (optional bool)
  }
)

(define-map reputation-history
  { provider-id: uint, period: uint }
  {
    accuracy-rate: uint,              ;; percentage over period
    response-time-avg: uint,
    submissions-count: uint,
    disputes-faced: uint,
    disputes-won: uint,
    stake-changes: int,               ;; net stake change in period
    earnings: uint,
    period-start: uint,
    period-end: uint
  }
)

(define-map security-events
  { event-id: uint }
  {
    event-type: (string-ascii 32),    ;; "collusion", "manipulation", etc.
    affected-providers: (list 10 uint),
    pool-id: (optional uint),
    severity: uint,                   ;; 1-5 scale
    detected-at: uint,
    investigation-status: (string-ascii 16),
    resolution: (optional (string-ascii 256)),
    resolved-at: (optional uint)
  }
)

(define-map provider-stakes
  { provider-id: uint }
  {
    locked-amount: uint,
    locked-at: uint,
    unlock-height: (optional uint),
    slashed-total: uint
  }
)

;; State Variables
(define-data-var oracle-provider-counter uint u0)
(define-data-var oracle-submission-counter uint u0)
(define-data-var security-event-counter uint u0)
(define-data-var reputation-period-counter uint u0)
(define-data-var circuit-breaker-active bool false)
(define-data-var circuit-breaker-reason (string-ascii 128) "")
(define-data-var total-staked-amount uint u0)

(define-map admins
  { admin: principal }
  bool
)

;; Enhanced Read-only helpers
(define-read-only (is-admin (user principal))
  (default-to false (map-get? admins { admin: user }))
)

(define-read-only (get-provider-id-by-address (provider-address principal))
  (map-get? oracle-address-to-id { provider-address: provider-address })
)

(define-read-only (get-enhanced-provider-details (provider-id uint))
  (map-get? enhanced-oracle-providers { provider-id: provider-id })
)

(define-read-only (get-provider-details (provider-id uint))
  ;; Backward compatibility function
  (match (map-get? enhanced-oracle-providers { provider-id: provider-id })
    provider (some {
      provider-address: (get provider-address provider),
      reliability-score: (get reputation-score provider),
      total-resolutions: (get total-resolutions provider),
      successful-resolutions: (get successful-resolutions provider),
      average-response-time: (get average-response-time provider),
      is-active: (get is-active provider),
      registered-at: (get registered-at provider),
      last-activity: (get last-activity provider)
    })
    none
  )
)

(define-read-only (oracle-supports-data-type (provider-id uint) (data-type (string-ascii 32)))
  (default-to false (map-get? oracle-data-types { provider-id: provider-id, data-type: data-type }))
)

(define-read-only (get-enhanced-submission (submission-id uint))
  (map-get? enhanced-oracle-submissions { submission-id: submission-id })
)

(define-read-only (get-submission (submission-id uint))
  ;; Backward compatibility function
  (match (map-get? enhanced-oracle-submissions { submission-id: submission-id })
    submission (some {
      provider-id: (get provider-id submission),
      pool-id: (get pool-id submission),
      data-value: (get data-value submission),
      data-type: (get data-type submission),
      timestamp: (get timestamp submission),
      confidence-score: (get confidence-score submission),
      is-processed: (get is-processed submission)
    })
    none
  )
)

(define-read-only (get-provider-stake (provider-id uint))
  (map-get? provider-stakes { provider-id: provider-id })
)

(define-read-only (get-reputation-history (provider-id uint) (period uint))
  (map-get? reputation-history { provider-id: provider-id, period: period })
)

(define-read-only (get-security-event (event-id uint))
  (map-get? security-events { event-id: event-id })
)

(define-read-only (is-circuit-breaker-active)
  (var-get circuit-breaker-active)
)

(define-read-only (get-total-staked-amount)
  (var-get total-staked-amount)
)

;; Private helper
(define-private (register-data-type-for-provider (data-type (string-ascii 32)) (provider-id uint))
  (begin
    (map-insert oracle-data-types
      { provider-id: provider-id, data-type: data-type }
      true
    )
    provider-id
  )
)

;; Administrative
(define-public (set-admin (admin principal) (status bool))
  (if (is-eq tx-sender CONTRACT-OWNER)
      (begin
        (map-set admins { admin: admin } status)
        (ok true)
      )
      (err ERR-UNAUTHORIZED)
  )
)

;; Enhanced Public Functions

(define-public (register-oracle-provider-with-stake 
  (provider-address principal) 
  (stake-amount uint) 
  (supported-data-types (list 10 (string-ascii 32)))
  (metadata (string-ascii 512)))
  (let ((provider-id (var-get oracle-provider-counter)))
    (if (or (is-eq tx-sender CONTRACT-OWNER) (is-admin tx-sender))
        (if (is-none (get-provider-id-by-address provider-address))
            (if (>= stake-amount MIN-STAKE-AMOUNT)
                (if (> (len metadata) u0)
                    (match (stx-transfer? stake-amount tx-sender (as-contract tx-sender))
                      success (begin
                        (map-insert enhanced-oracle-providers
                          { provider-id: provider-id }
                          {
                            provider-address: provider-address,
                            reputation-score: u100,
                            total-resolutions: u0,
                            successful-resolutions: u0,
                            failed-resolutions: u0,
                            average-response-time: u0,
                            stake-amount: stake-amount,
                            stake-locked-at: burn-block-height,
                            premium-provider: false,
                            suspension-count: u0,
                            last-activity: burn-block-height,
                            total-earnings: u0,
                            slashed-amount: u0,
                            metadata: metadata,
                            is-active: true,
                            registered-at: burn-block-height
                          }
                        )
                        (map-insert oracle-address-to-id { provider-address: provider-address } provider-id)
                        (map-insert provider-stakes
                          { provider-id: provider-id }
                          {
                            locked-amount: stake-amount,
                            locked-at: burn-block-height,
                            unlock-height: none,
                            slashed-total: u0
                          }
                        )
                        (fold register-data-type-for-provider supported-data-types provider-id)
                        (var-set oracle-provider-counter (+ provider-id u1))
                        (var-set total-staked-amount (+ (var-get total-staked-amount) stake-amount))
                        (ok provider-id)
                      )
                      error (err error)
                    )
                    (err ERR-INVALID-METADATA)
                )
                (err ERR-INSUFFICIENT-STAKE)
            )
            (err ERR-ORACLE-ALREADY-EXISTS)
        )
        (err ERR-UNAUTHORIZED)
    )
  )
)

(define-public (deactivate-oracle-provider (provider-id uint))
  (match (map-get? enhanced-oracle-providers { provider-id: provider-id })
    provider (if (or (is-eq tx-sender CONTRACT-OWNER) (is-admin tx-sender))
                 (begin
                   (map-set enhanced-oracle-providers { provider-id: provider-id } 
                     (merge provider { is-active: false }))
                   (ok true)
                 )
                 (err ERR-UNAUTHORIZED))
    (err ERR-ORACLE-NOT-FOUND)
  )
)

(define-public (reactivate-oracle-provider (provider-id uint))
  (match (map-get? enhanced-oracle-providers { provider-id: provider-id })
    provider (if (or (is-eq tx-sender CONTRACT-OWNER) (is-admin tx-sender))
                 (begin
                   (map-set enhanced-oracle-providers { provider-id: provider-id } 
                     (merge provider { is-active: true, last-activity: burn-block-height }))
                   (ok true)
                 )
                 (err ERR-UNAUTHORIZED))
    (err ERR-ORACLE-NOT-FOUND)
  )
)

(define-public (submit-enhanced-oracle-data 
  (pool-id uint) 
  (data-value (string-ascii 256)) 
  (data-type (string-ascii 32)) 
  (confidence-score uint)
  (validation-hash (buff 32)))
  (if (var-get circuit-breaker-active)
      (err ERR-CIRCUIT-BREAKER-ACTIVE)
      (match (get-provider-id-by-address tx-sender)
        provider-id (match (map-get? enhanced-oracle-providers { provider-id: provider-id })
          provider (let ((submission-id (var-get oracle-submission-counter)))
                     (if (get is-active provider)
                         (if (oracle-supports-data-type provider-id data-type)
                             (if (and (<= confidence-score u100) (>= confidence-score u1))
                                 (if (>= (get reputation-score provider) u50) ;; Minimum reputation check
                                     (begin
                                       (map-insert enhanced-oracle-submissions
                                         { submission-id: submission-id }
                                         {
                                           provider-id: provider-id,
                                           pool-id: pool-id,
                                           data-value: data-value,
                                           data-type: data-type,
                                           confidence-score: confidence-score,
                                           timestamp: burn-block-height,
                                           response-time: u0, ;; Will be calculated later
                                           validation-hash: validation-hash,
                                           aggregation-weight: (get reputation-score provider),
                                           is-processed: false,
                                           is-disputed: false,
                                           dispute-outcome: none
                                         }
                                       )
                                       ;; Update provider activity
                                       (map-set enhanced-oracle-providers { provider-id: provider-id }
                                         (merge provider { last-activity: burn-block-height }))
                                       (var-set oracle-submission-counter (+ submission-id u1))
                                       (ok submission-id)
                                     )
                                     (err ERR-REPUTATION-TOO-LOW)
                                 )
                                 (err ERR-INSUFFICIENT-CONFIDENCE)
                             )
                             (err ERR-INVALID-DATA-TYPE)
                         )
                         (err ERR-ORACLE-INACTIVE)
                     )
                   )
          (err ERR-ORACLE-NOT-FOUND)
        )
        (err ERR-ORACLE-NOT-FOUND)
      )
  )
)

;; Batch submission for efficiency
(define-public (submit-batch-oracle-data 
  (submissions (list 10 {pool-id: uint, data-value: (string-ascii 256), 
                        data-type: (string-ascii 32), confidence-score: uint,
                        validation-hash: (buff 32)})))
  (if (var-get circuit-breaker-active)
      (err ERR-CIRCUIT-BREAKER-ACTIVE)
      (match (get-provider-id-by-address tx-sender)
        provider-id (match (map-get? enhanced-oracle-providers { provider-id: provider-id })
          provider (if (get is-active provider)
                       (if (>= (get reputation-score provider) u50)
                           (let ((results (map process-single-submission submissions)))
                             (ok results))
                           (err ERR-REPUTATION-TOO-LOW))
                       (err ERR-ORACLE-INACTIVE))
          (err ERR-ORACLE-NOT-FOUND))
        (err ERR-ORACLE-NOT-FOUND))))

;; Helper function for batch processing
(define-private (process-single-submission 
  (submission {pool-id: uint, data-value: (string-ascii 256), 
              data-type: (string-ascii 32), confidence-score: uint,
              validation-hash: (buff 32)}))
  (let ((submission-id (var-get oracle-submission-counter)))
    (begin
      (var-set oracle-submission-counter (+ submission-id u1))
      submission-id)))

;; Reputation management functions
(define-public (update-reputation-score 
  (provider-id uint) 
  (accuracy-delta int) 
  (response-time uint))
  (if (or (is-eq tx-sender CONTRACT-OWNER) (is-admin tx-sender))
      (match (map-get? enhanced-oracle-providers { provider-id: provider-id })
        provider (let (
          (current-reputation (get reputation-score provider))
          (new-reputation (if (>= accuracy-delta 0)
                             (min REPUTATION-SCALE (+ current-reputation (to-uint accuracy-delta)))
                             (if (>= current-reputation (to-uint (- 0 accuracy-delta)))
                                 (- current-reputation (to-uint (- 0 accuracy-delta)))
                                 u0)))
          (is-premium (>= new-reputation PREMIUM-PROVIDER-THRESHOLD))
        )
          (begin
            (map-set enhanced-oracle-providers { provider-id: provider-id }
              (merge provider { 
                reputation-score: new-reputation,
                premium-provider: is-premium,
                average-response-time: response-time
              }))
            (ok new-reputation)))
        (err ERR-ORACLE-NOT-FOUND))
      (err ERR-UNAUTHORIZED)))

;; Stake slashing mechanism
(define-public (slash-provider-stake (provider-id uint) (reason (string-ascii 128)))
  (if (or (is-eq tx-sender CONTRACT-OWNER) (is-admin tx-sender))
      (match (map-get? enhanced-oracle-providers { provider-id: provider-id })
        provider (match (map-get? provider-stakes { provider-id: provider-id })
          stake (let (
            (slash-amount (/ (* (get locked-amount stake) SLASHING-PERCENTAGE) u100))
            (remaining-stake (- (get locked-amount stake) slash-amount))
          )
            (begin
              ;; Update stake record
              (map-set provider-stakes { provider-id: provider-id }
                (merge stake { 
                  locked-amount: remaining-stake,
                  slashed-total: (+ (get slashed-total stake) slash-amount)
                }))
              ;; Update provider record
              (map-set enhanced-oracle-providers { provider-id: provider-id }
                (merge provider { 
                  slashed-amount: (+ (get slashed-amount provider) slash-amount),
                  reputation-score: (max u0 (- (get reputation-score provider) u100))
                }))
              ;; Update total staked amount
              (var-set total-staked-amount (- (var-get total-staked-amount) slash-amount))
              ;; Log security event
              (log-security-event "slashing" (list provider-id) none u3 reason)
              (ok slash-amount)))
          (err ERR-ORACLE-NOT-FOUND))
        (err ERR-ORACLE-NOT-FOUND))
      (err ERR-UNAUTHORIZED)))

;; Security and monitoring functions
(define-public (trigger-circuit-breaker (reason (string-ascii 128)) (duration uint))
  (if (or (is-eq tx-sender CONTRACT-OWNER) (is-admin tx-sender))
      (begin
        (var-set circuit-breaker-active true)
        (var-set circuit-breaker-reason reason)
        (log-security-event "circuit-breaker" (list) none u5 reason)
        (ok true))
      (err ERR-UNAUTHORIZED)))

(define-public (deactivate-circuit-breaker)
  (if (or (is-eq tx-sender CONTRACT-OWNER) (is-admin tx-sender))
      (begin
        (var-set circuit-breaker-active false)
        (var-set circuit-breaker-reason "")
        (ok true))
      (err ERR-UNAUTHORIZED)))

;; Private helper for logging security events
(define-private (log-security-event 
  (event-type (string-ascii 32))
  (affected-providers (list 10 uint))
  (pool-id (optional uint))
  (severity uint)
  (description (string-ascii 128)))
  (let ((event-id (var-get security-event-counter)))
    (begin
      (map-insert security-events
        { event-id: event-id }
        {
          event-type: event-type,
          affected-providers: affected-providers,
          pool-id: pool-id,
          severity: severity,
          detected-at: burn-block-height,
          investigation-status: "open",
          resolution: (some description),
          resolved-at: none
        })
      (var-set security-event-counter (+ event-id u1))
      event-id)))

;; Backward compatibility function
(define-public (submit-oracle-data (pool-id uint) (data-value (string-ascii 256)) (data-type (string-ascii 32)) (confidence-score uint))
  (submit-enhanced-oracle-data pool-id data-value data-type confidence-score 0x00))

;; Legacy registration function for backward compatibility
(define-public (register-oracle-provider (provider-address principal) (supported-data-types (list 10 (string-ascii 32))))
  (register-oracle-provider-with-stake provider-address MIN-STAKE-AMOUNT supported-data-types "Legacy registration"))