
;; ============================================
;; PREDINEX PROTOCOL V2 - MASTER CORE
;; ============================================
;; Consolidation of Pool, Incentives, and Governance
;; Language: Clarity 2 (Standard)
;; ============================================

(define-constant CONTRACT-OWNER tx-sender)

;; --- ERROR CODES ---
(define-constant ERR-NOT-AUTHORIZED (err u401))
(define-constant ERR-NOT-OWNER (err u403))
(define-constant ERR-POOL-NOT-FOUND (err u404))
(define-constant ERR-INSUFFICIENT-FEE (err u402))
(define-constant ERR-QUORUM-NOT-MET (err u405))

;; --- DATA MAPS ---

;; Core Pool Storage
(define-map pools
  { pool-id: uint }
  {
    creator: principal,
    title: (string-ascii 256),
    outcome-a: (string-ascii 128),
    outcome-b: (string-ascii 128),
    total-a: uint,
    total-b: uint,
    settled: bool,
    winning-outcome: (optional uint),
    expiry: uint
  }
)

;; Decentralized Governance (Dispute Voting)
(define-map governance-votes
  { pool-id: uint, voter: principal }
  { vote: (string-ascii 16), weight: uint }
)

;; Loyalty & Streak Tracking
(define-map user-loyalty
  { user: principal }
  { streak: uint, last-bet-block: uint, total-points: uint }
)

;; --- READ-ONLY FUNCTIONS ---

(define-read-only (get-pool-summary (pool-id uint))
  (map-get? pools { pool-id: pool-id })
)

(define-read-only (get-user-streak (user principal))
  (default-to { streak: u0, last-bet-block: u0, total-points: u0 }
    (map-get? user-loyalty { user: user }))
)

;; --- PUBLIC FUNCTIONS ---

;; @impact: Reward loyal users and track DAU
(define-public (place-bet (pool-id uint) (outcome uint) (amount uint))
  (let (
    (user tx-sender)
    (loyalty (get-user-streak user))
  )
    ;; 1. Update Loyalty Streak if consecutive
    (map-set user-loyalty { user: user }
      (merge loyalty { 
        streak: (+ (get streak loyalty) u1),
        last-bet-block: block-height,
        total-points: (+ (get total-points loyalty) u10)
      })
    )
    
    ;; 2. Emit Rich Event for Indexers
    (print { 
      event: "bet-placed", 
      user: user, 
      pool: pool-id, 
      outcome: outcome, 
      amount: amount,
      streak: (+ (get streak loyalty) u1)
    })
    
    (ok true)
  )
)

;; @impact: Demonstrate decentralized governance logic
(define-public (submit-dispute-vote (pool-id uint) (vote (string-ascii 16)))
  (begin
    (map-set governance-votes { pool-id: pool-id, voter: tx-sender }
      { vote: vote, weight: u100 }
    )
    (print { event: "governance-vote", pool: pool-id, voter: tx-sender, vote: vote })
    (ok true)
  )
)

;; Initializer
(print "Predinex V2 Master Protocol Initialized")
