# Reown AppKit Integration Guide

## Overview
This project uses Reown AppKit for wallet connections.

## Setup
1. Get project ID from https://dashboard.reown.com
2. Add to \`.env.local\`:
   \`\`\`
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
   \`\`\`

## Usage
\`\`\`tsx
import { AppKitButton } from '@/components/AppKitButton';

export default function Page() {
  return <AppKitButton />;
}
\`\`\`
