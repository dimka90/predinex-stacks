# Security Model

Predinex implements a multi-layered security architecture to protect user funds and protocol integrity.

## Smart Contract Security

### Access Control
- **Creator-only settlement**: Only the pool creator can trigger settlement, preventing unauthorized fund distribution.
- **Admin functions**: Oracle management and emergency operations are restricted to the contract deployer.
- **Post-conditions**: All STX transfers enforce strict post-conditions to prevent over-spending.

### Input Validation
- **Amount bounds**: All bet amounts are validated against min/max thresholds (1-1000 STX).
- **Duration limits**: Pool durations are capped to prevent indefinite lock-ups.
- **String length limits**: Pool titles (100 chars) and descriptions (500 chars) are length-validated on-chain.

### Oracle Security
- **Stake requirements**: Oracle providers must stake 1000+ STX to participate.
- **Reputation scoring**: Providers build 0-1000 reputation based on accuracy.
- **Slashing mechanism**: 10% stake slashing for malicious data submissions.
- **Collusion detection**: Pattern analysis identifies coordinated manipulation attempts.
- **Circuit breaker**: Emergency halt capability when attacks are detected.

## Frontend Security

### Input Sanitization
- All user inputs are sanitized against XSS and injection attacks via `sanitize.ts`.
- Pool titles and descriptions are cleaned before submission to contracts.

### Rate Limiting
- All oracle submissions are rate-limited per principal to prevent spam and protect protocol integrity.
- API calls are throttled using `performance-utils.ts` to prevent abuse.

### Wallet Security
- Private keys never leave the user's wallet extension.
- All transactions require explicit user approval in the wallet UI.
- Session validation ensures stale connections are detected and refreshed.

## Vulnerability Reporting

If you discover a security vulnerability, please email security@predinex.io. Do not open a public GitHub issue.

We follow a responsible disclosure process and will acknowledge your report within 48 hours.
