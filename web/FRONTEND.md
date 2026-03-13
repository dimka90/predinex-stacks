# Predinex Frontend Architecture

## Overview
Predinex is a decentralized prediction market built on the Stacks blockchain. The frontend is a modern Next.js application that prioritizes performance, type safety, and a premium user experience.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **Blockchain Interop**: @stacks/connect, @stacks/transactions, @stacks/network
- **Wallet Connection**: Reown AppKit
- **Icons**: Lucide React
- **State Management**: React Context (StacksProvider)

## Core Components
- **StacksProvider**: Manages global authentication and wallet state.
- **Navbar**: Main navigation and wallet connection status.
- **Hero**: Institutional-grade landing section.
- **MarketCard**: Detailed representation of individual prediction markets.
- **Dashboard**: User-specific betting history and portfolio overview.
- **Rewards**: Leaderboard and incentive tracking.

## Directory Structure
- `app/`: Next.js pages and layouts.
- `components/`: Reusable UI components.
- `lib/`: Core logic, services, and utilities.
- `providers/`: Context providers for global state.
- `styles/`: Global CSS and Tailwind configuration.

## Component Documentation

### Layout Components
- **Navbar**: Responsive navigation with mobile menu support. Handles the primary wallet connection entry point.
- **Footer**: Professional footer with social links, legal info, and project overview.
- **StacksProvider**: Context provider that wraps the application to provide Stacks authentication state.

### Dashboard Components
- **PortfolioOverview**: High-level summary of user earnings, wagered amounts, and profit/loss.
- **ActiveBetsCard**: Interactive list of the user's current open prediction markets.
- **MarketStatsCard**: Statistics for individual pools, including participant counts and volume.
- **PlatformMetrics**: System-wide statistics for the Predinex ecosystem.

### UI Components
- **MarketCard**: The primary display unit for prediction markets, featuring glassmorphism effects and hover interactions.
- **Hero**: The landing page's main call-to-action section with Bitcoin-themed aesthetics.
- **Leaderboard**: Displays top contributors and users based on platform activity.

## State Management

### StacksProvider (React Context)
Predinex uses React Context for global state management related to user authentication and wallet connectivity.

**Key State Variables:**
- `userSession`: Instance of `@stacks/connect` UserSession.
- `userData`: Authenticared user's data (address, public key, etc.).
- `isLoading`: Tracks the initialization of the authentication state.

**Available Actions:**
- `authenticate()`: Triggers the wallet connection modal.
- `signOut()`: Clears the user session and resets local state.
- `openWalletModal()`: Programmatically opens the wallet selection interface.

### Local Component State
For UI-specific states (loading spinners, visibility toggles, form inputs), we favor React's `useState` and `useCallback` to keep components self-contained and performant.
## On-Chain Data Integration

The frontend interacts with Stacks smart contracts using `@stacks/transactions`.

### Fetching Data
- **Read-Only Calls**: Use `callReadOnlyFunction` for fetching pool details, user bets, and system stats.
- **Contract Map Polling**: Strategic polling of contract maps to ensure the UI reflects the latest on-chain state.

### Executing Transactions
- **Wallet Signing**: Utilizes `@stacks/connect` to prompt users for transaction signing.
- **Transaction Monitoring**: Custom hooks in `web/lib/` track transaction status from `pending` to `success` or `failed`.
- **Post-Conditions**: Strict STX post-conditions are applied to all betting transactions to prevent unauthorized fund movements.

## Styling and Design System

### Tailwind CSS
We use Tailwind CSS for all component styling, leveraging a custom theme that provides a cohesive institutional aesthetic.

**Core Design Principles:**
- **Glassmorphism**: Extensive use of `backdrop-blur` and semi-transparent backgrounds (`bg-white/10` or `bg-black/10`).
- **Gradients**: Dynamic background blobs and text gradients (e.g., `bg-gradient-to-r from-primary to-purple-400`).
- **Institutional Palette**: A mix of deep backgrounds (`bg-background`) and vibrant highlight colors (`text-primary`).

### Animations
Animations are implemented using simple CSS transitions for performance:
- **Hover Transitions**: Smooth transitions on buttons and cards using `transition-all` and `duration-300`.
- **Micro-interactions**: Subtle scale effects on clickable elements (`hover:scale-105`, `active:scale-95`).
- **Pulse Effects**: Background glow animations used in the Hero section to draw user attention.

## Accessibility & Inclusion

Predinex is built to be accessible to everyone, following web standards and best practices for inclusion.

- **ARIA Labels**: All interactive elements (buttons, links, navigation drawers) include descriptive `aria-label` and `aria-expanded` attributes.
- **Heading Hierarchy**: We enforce a strict sequential heading hierarchy (H1 -> H2 -> H3) to ensure screen readers can build an accurate document outline.
- **Focus Management**: Interactive elements feature clear `:focus` styles and ring offsets for keyboard navigability.
- **Semantic HTML**: Extensive use of `<main>`, `<nav>`, `<section>`, and `<article>` tags for meaningful page structure.

## Performance Optimization

The application is optimized for speed and efficiency to ensure a smooth user experience.

- **Component Memoization**: Critical components like the `Leaderboard` are memoized using `React.memo` to prevent unnecessary re-renders.
- **Skeleton Loaders**: Custom `animate-pulse` skeletons are implemented for `MarketCard` and `PortfolioOverview` to improve perception of performance.
- **LCP Optimization**: Strategic use of the `priority` property on critical images and optimized CSS variables for smooth transitions.
- **Error Handling**: A global `ErrorBoundary` catches runtime failures, providing users with a graceful fallback and recovery path.
