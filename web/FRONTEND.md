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
