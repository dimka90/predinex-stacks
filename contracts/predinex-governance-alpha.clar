
;; Predinex Governance Alpha
;; Version: 0.1.0
;; Focus: Proposal submission and community voting for pool resolution disputes.

(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-PROPOSAL-NOT-FOUND (err u101))
(define-constant ERR-ALREADY-VOTED (err u102))

(define-data-var contract-owner principal tx-sender)
(define-map proposals 
    uint 
    {
        creator: principal,
        description: (string-ascii 140),
        votes-for: uint,
        votes-against: uint,
        active: bool
    }
)

(define-map votes {proposal-id: uint, voter: principal} bool)
(define-data-var proposal-count uint u0)

;; Public Functions

(define-public (submit-proposal (description (string-ascii 140)))
    (let
        (
            (id (+ (var-get proposal-count) u1))
        )
        (map-set proposals id {
            creator: tx-sender,
            description: description,
            votes-for: u0,
            votes-against: u0,
            active: true
        })
        (var-set proposal-count id)
        (ok id)
    )
)

(define-public (vote (proposal-id uint) (for bool))
    (let
        (
            (proposal (unwrap! (map-get? proposals proposal-id) ERR-PROPOSAL-NOT-FOUND))
            (vote-key {proposal-id: proposal-id, voter: tx-sender})
        )
        (asserts! (is-none (map-get? votes vote-key)) ERR-ALREADY-VOTED)
        
        (map-set votes vote-key for)
        (if for
            (map-set proposals proposal-id (merge proposal {votes-for: (+ (get votes-for proposal) u1)}))
            (map-set proposals proposal-id (merge proposal {votes-against: (+ (get votes-against proposal) u1)}))
        )
        (ok true)
    )
)

;; Read-only Functions

(define-read-only (get-proposal (id uint))
    (map-get? proposals id)
)

(define-read-only (get-voter-status (id uint) (voter principal))
    (map-get? votes {proposal-id: id, voter: voter})
)
