# Feature: Predinex Rewards Page Implementation

## 🚀 Overview
This PR introduces the new **Rewards** page for Predinex, designed to track user contributions, display leaderboard rankings, and transparently explain the reward calculation methodology.

The implementation follows a "Premium" aesthetic using glassmorphism effects, gradient typography, and smooth animations, ensuring a high-quality user experience.

## ✨ Key Features
- **New Rewards Route**: Accessible at `/rewards`.
- **"How are rewards calculated?" Section**: implemented using a custom, animated **Accordion** component.
- **Calculation Rules**: Clearly defined criteria based on:
    - Smart contract activity and impact.
    - Usage of `@stacks/connect` and `@stacks/transactions`.
    - GitHub contributions to public repositories.
- **Leaderboard Integration**: A visual leaderboard component to showcase top contributors.
- **User Rank Card**: A personalized card displaying the user's current rank and percentile.
- **Premium UI**: 
    - Glassmorphism panels (`.glass-panel`).
    - Responsive layout.
    - Enhanced typography and accessibility.

## 🛠️ Technical Details
- **Framework**: Next.js 16 (App Router).
- **Styling**: Tailwind CSS with custom utilities.
- **Components**:
    - `Accordion` (Compound component pattern).
    - `Leaderboard` (Mock data implementation for v1).
- **Utilities**: Added `cn` utility for robust class merging.

## 📊 Commit History (30 Commits)
This feature was implemented via a series of 30 granular, professional commits:

1.  `8cfb1d2` chore: release rewards page v1.0
2.  `04aed76` docs: update internal documentation for rewards module
3.  `6d83c5e` chore(code): remove unused imports and variables
4.  `05a465f` ui(responsive): adjust padding for mobile viewports
5.  `05909cf` fix(a11y): add aria-labels to interactive elements
6.  `a1b7788` feat(rewards): add skeleton loading state structure
7.  `aa1a0f1` refactor(rewards): structure mock data for preview
8.  `324d1cd` feat(rewards): add personal rank card
9.  `b49fef5` feat(rewards): integrate leaderboard section
10. `3148c9b` feat(components): implement leaderboard component
11. `629f7ec` docs(rewards): verify accuracy of reward calculation rules
12. `ee189b1` style(rewards): format code snippets
13. `0135d34` ui(rewards): enhance list item typography
14. `776dc46` content(rewards): add github contributions rule
15. `5a60ef0` content(rewards): add stacks SDK usage rule
16. `a131080` content(rewards): add smart contract activity rule
17. `7726d88` feat(rewards): add calculation methodology section
18. `cf7a48f` refactor(rewards): optimize page imports
19. `8d68cfe` ui(rewards): update container width and spacing
20. `67b62f1` feat(rewards): create rewards layout wrapper
21. `ea63b2a` feat(rewards): add authentication guard and header
22. `6eb11d0` feat(rewards): initialize rewards page route
23. `f4fbff1` refactor(ui): optimize Accordion component exports
24. `654d3d3` feat(ui): implement AccordionContent with animation
25. `788d98a` feat(ui): implement AccordionTrigger with styles
26. `0b189e1` feat(ui): implement AccordionItem component
27. `256befc` feat(ui): scaffold Accordion component
28. `9f8001f` ui(web): add glass-panel utility class
29. `e0341d8` chore(web): add application constants
30. `c8caa0f` feat(web): add cn utility for class merging

## ✅ Verification
- [x] Page builds successfully.
- [x] UI is responsive on mobile and desktop.
- [x] Accordion animations are smooth.
- [x] Accessibility attributes (aria-labels) are present.

---
*Ready for review and merge into main.*
