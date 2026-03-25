# Changelog

All notable changes to this project will be documented in this file.

## [2.1.0] - 2026-03-25

### Added
- **ProgressRing** SVG component for probability visualization
- **CountdownTimer** component for market expiry tracking
- **TransactionStatus** component with pending/success/error states
- **ConfirmDialog** component for destructive action confirmation
- **AnimatedCounter** with ease-out cubic animation for statistics
- **Breadcrumbs** navigation component with home icon
- **LoadingOverlay** with blur backdrop and animated spinner
- **NetworkIndicator** component for mainnet/testnet status display
- `useMediaQuery` hook with `useIsMobile`, `useIsTablet`, `useIsDesktop` helpers
- `useCountdown` hook with auto-tick and expiry detection
- `useOnClickOutside` hook for modal and dropdown dismissal
- Event emitter service with typed protocol event bus
- Market analytics service with probability, payout, ROI, and Kelly criterion
- STX conversion helpers (`microStxToStx`, `stxToMicroStx`, `formatStx`)
- Input sanitization utilities for pool titles and descriptions
- Performance utilities: `debounce`, `throttle`, `copyToClipboard`, `createRateLimiter`
- `formatPercentage` and `timeAgo` utility functions
- Resolution metadata, pool analytics, and leaderboard entry types

### Enhanced
- **Footer**: Upgraded to 4-column grid with social links, legal links, and live status indicator
- **StatusBadge**: Added support for 6 market states with animated status dots
- **useLocalStorage**: Added SSR safety, callback updater pattern, and `remove()` function
- **useDebounce**: Added JSDoc documentation and SSR directive
- **Error codes**: Expanded with settlement, oracle, and incentive error codes
- **API Reference**: Added resolution engine and incentive function documentation
- **Security Model**: Comprehensive multi-layered security documentation
- **Contributing Guide**: Full contribution workflow with code standards

## [2.0.0] - 2026-03-23

### Added
- Market creation terminal with on-chain pool initialization
- Decentralized settlement engine for creator-authorized resolution
- Social sharing terminal (Twitter, Telegram, Discord)
- Premium glassmorphism and institutional UI design system
- Toast notification system with auto-dismiss
- Interactive MarketChart and OrderBook components
- User Dashboard with PNL tracking

## [1.0.0] - 2026-03-13

### Added
- Initial Predinex Protocol implementation
- Core smart contracts (predinex-pool, oracle-registry)
- Frontend application with Next.js 16
- Market discovery and betting interface
- Wallet connection (Hiro, Leather, Xverse)
