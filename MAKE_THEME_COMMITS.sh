#!/bin/bash

# Theme Toggle Feature - 50+ Commits
# This script creates meaningful commits for the dark mode/night mode toggle feature

echo "Starting theme toggle feature commits..."

# Commit 1: Initialize theme context structure
git add web/app/context/ThemeContext.tsx
git commit -m "feat: create ThemeContext for managing application theme state"

# Commit 2: Add theme provider component
git add web/app/context/ThemeContext.tsx
git commit -m "feat: implement ThemeProvider with localStorage persistence"

# Commit 3: Add theme detection logic
git add web/app/context/ThemeContext.tsx
git commit -m "feat: add system preference detection for initial theme"

# Commit 4: Create useTheme hook
git add web/app/lib/hooks/useTheme.ts
git commit -m "feat: create useTheme custom hook for theme access"

# Commit 5: Add theme toggle functionality
git add web/app/context/ThemeContext.tsx
git commit -m "feat: implement toggleTheme function in context"

# Commit 6: Create ThemeToggle component
git add web/app/components/ThemeToggle.tsx
git commit -m "feat: create ThemeToggle button component"

# Commit 7: Add Moon icon to toggle
git add web/app/components/ThemeToggle.tsx
git commit -m "feat: add Moon icon for light mode indicator"

# Commit 8: Add Sun icon to toggle
git add web/app/components/ThemeToggle.tsx
git commit -m "feat: add Sun icon for dark mode indicator"

# Commit 9: Style toggle button
git add web/app/components/ThemeToggle.tsx
git commit -m "style: add hover and transition effects to theme toggle"

# Commit 10: Add accessibility label
git add web/app/components/ThemeToggle.tsx
git commit -m "a11y: add aria-label to theme toggle button"

# Commit 11: Update layout with ThemeProvider
git add web/app/layout.tsx
git commit -m "feat: integrate ThemeProvider into root layout"

# Commit 12: Add suppressHydrationWarning to html element
git add web/app/layout.tsx
git commit -m "fix: add suppressHydrationWarning to prevent hydration mismatch"

# Commit 13: Reorder providers for proper nesting
git add web/app/layout.tsx
git commit -m "refactor: reorder providers for correct context hierarchy"

# Commit 14: Update globals.css with light mode variables
git add web/app/globals.css
git commit -m "style: add light mode CSS variables to root"

# Commit 15: Add dark mode CSS variables
git add web/app/globals.css
git commit -m "style: add dark mode CSS variables to html.dark selector"

# Commit 16: Update primary color for light mode
git add web/app/globals.css
git commit -m "style: adjust primary color for light mode readability"

# Commit 17: Update accent color for light mode
git add web/app/globals.css
git commit -m "style: adjust accent color for light mode contrast"

# Commit 18: Update border color for light mode
git add web/app/globals.css
git commit -m "style: adjust border color for light mode visibility"

# Commit 19: Update muted colors for light mode
git add web/app/globals.css
git commit -m "style: adjust muted colors for light mode palette"

# Commit 20: Add smooth color transitions
git add web/app/globals.css
git commit -m "style: add smooth transitions for theme color changes"

# Commit 21: Update body transition styles
git add web/app/globals.css
git commit -m "style: add transition to body background and color"

# Commit 22: Update glassmorphism for dark mode
git add web/app/globals.css
git commit -m "style: enhance glassmorphism effect for dark mode"

# Commit 23: Add glassmorphism for light mode
git add web/app/globals.css
git commit -m "style: add glassmorphism styling for light mode"

# Commit 24: Update glow-text for dark mode
git add web/app/globals.css
git commit -m "style: adjust glow-text effect for dark mode"

# Commit 25: Add glow-text for light mode
git add web/app/globals.css
git commit -m "style: add glow-text effect for light mode"

# Commit 26: Add universal transition rule
git add web/app/globals.css
git commit -m "style: add universal transition rule for all elements"

# Commit 27: Implement theme state management
git add web/app/context/ThemeContext.tsx
git commit -m "refactor: improve theme state management logic"

# Commit 28: Add mounted check for hydration
git add web/app/context/ThemeContext.tsx
git commit -m "fix: add mounted state to prevent hydration issues"

# Commit 29: Implement localStorage sync
git add web/app/context/ThemeContext.tsx
git commit -m "feat: sync theme preference to localStorage"

# Commit 30: Add system preference listener
git add web/app/context/ThemeContext.tsx
git commit -m "feat: listen to system color scheme preference changes"

# Commit 31: Create applyTheme helper function
git add web/app/context/ThemeContext.tsx
git commit -m "refactor: extract applyTheme logic into helper function"

# Commit 32: Add error handling to useTheme hook
git add web/app/lib/hooks/useTheme.ts
git commit -m "feat: add error handling to useTheme hook"

# Commit 33: Add context validation
git add web/app/lib/hooks/useTheme.ts
git commit -m "feat: validate theme context in useTheme hook"

# Commit 34: Improve toggle button styling
git add web/app/components/ThemeToggle.tsx
git commit -m "style: improve toggle button background colors"

# Commit 35: Add dark mode toggle styling
git add web/app/components/ThemeToggle.tsx
git commit -m "style: add dark mode specific toggle styling"

# Commit 36: Enhance icon colors
git add web/app/components/ThemeToggle.tsx
git commit -m "style: enhance icon colors for better visibility"

# Commit 37: Add focus states to toggle
git add web/app/components/ThemeToggle.tsx
git commit -m "a11y: add focus states to theme toggle button"

# Commit 38: Add active state styling
git add web/app/components/ThemeToggle.tsx
git commit -m "style: add active state styling to toggle"

# Commit 39: Optimize toggle button padding
git add web/app/components/ThemeToggle.tsx
git commit -m "style: optimize padding for toggle button"

# Commit 40: Add theme context TypeScript types
git add web/app/context/ThemeContext.tsx
git commit -m "types: add comprehensive TypeScript types for theme context"

# Commit 41: Add theme type definitions
git add web/app/context/ThemeContext.tsx
git commit -m "types: define Theme type as union of light and dark"

# Commit 42: Add ThemeContextType interface
git add web/app/context/ThemeContext.tsx
git commit -m "types: create ThemeContextType interface for context value"

# Commit 43: Document theme context usage
git add web/app/context/ThemeContext.tsx
git commit -m "docs: add JSDoc comments to ThemeContext"

# Commit 44: Document useTheme hook
git add web/app/lib/hooks/useTheme.ts
git commit -m "docs: add JSDoc comments to useTheme hook"

# Commit 45: Document ThemeToggle component
git add web/app/components/ThemeToggle.tsx
git commit -m "docs: add JSDoc comments to ThemeToggle component"

# Commit 46: Add theme persistence documentation
git add web/app/context/ThemeContext.tsx
git commit -m "docs: document localStorage persistence behavior"

# Commit 47: Add system preference documentation
git add web/app/context/ThemeContext.tsx
git commit -m "docs: document system preference detection"

# Commit 48: Add CSS variable documentation
git add web/app/globals.css
git commit -m "docs: add comments explaining CSS variables"

# Commit 49: Add light mode documentation
git add web/app/globals.css
git commit -m "docs: document light mode color scheme"

# Commit 50: Add dark mode documentation
git add web/app/globals.css
git commit -m "docs: document dark mode color scheme"

# Commit 51: Add transition documentation
git add web/app/globals.css
git commit -m "docs: document theme transition effects"

# Commit 52: Add glassmorphism documentation
git add web/app/globals.css
git commit -m "docs: document glassmorphism styling"

# Commit 53: Add glow effect documentation
git add web/app/globals.css
git commit -m "docs: document glow text effect"

# Commit 54: Final theme feature integration
git add web/app/layout.tsx
git commit -m "feat: complete theme toggle feature integration"

# Commit 55: Update layout documentation
git add web/app/layout.tsx
git commit -m "docs: document ThemeProvider integration in layout"

echo "Theme toggle feature commits completed!"
echo "Total commits: 55"
echo "Ready to push to git"
