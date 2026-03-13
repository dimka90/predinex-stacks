# Predinex Security Model

This document outlines the security assumptions, threat mitigations, and safety mechanisms of the Predinex ecosystem.

## Threat Model

### Oracle Malfeasance
**Threat**: Oracles submitting false data to profit from specific outcomes.
**Mitigation**: 
- **Staking**: Oracles must stake a minimum of 1000 STX.
- **Slashing**: Admins can slash 10% of the stake for proven false data.
- **Reputation**: Data weight is determined by history and confidence scores.

### Front-Running
**Threat**: Users placing bets after an event has occurred but before the pool is settled.
**Mitigation**:
- **Expiry Check**: The `place-bet` function strictly enforces `burn-block-height < expiry`.
- **Resolution Delay**: Automated resolution cannot be triggered until `burn-block-height > expiry`.

### System-Wide Exploits
**Threat**: Bugs in settlement logic or coordinated oracle attacks.
**Mitigation**:
- **Circuit Breaker**: Global resolution pause.
- **Dispute Window**: 1008 block (approx. 1 week) window for any user to dispute a settlement.
- **Dispute Bond**: 5% bond required to prevent spam disputes.

## Safety Mechanisms

1. **Protocol Limits**: Max bet caps and pool expiration logic.
2. **Modular Architecture**: Separate logic for betting, oracle management, and resolution.
3. **Transparency**: All contract states and oracle submissions are immutable and queryable via the Stacks blockchain.
