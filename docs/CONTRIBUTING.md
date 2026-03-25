# Contributing to Predinex

Thank you for your interest in contributing to Predinex! We welcome meaningful contributions that improve the protocol's functionality, security, and user experience.

## Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes with descriptive commits
4. Push to your fork and submit a Pull Request

## Branch Naming

Use the following prefixes for all branches:
- `feature/` — New features and enhancements
- `fix/` — Bug fixes and patches
- `docs/` — Documentation updates
- `refactor/` — Code restructuring without behavior changes
- `test/` — Test additions or modifications

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
feat(scope): add new betting confirmation dialog
fix(wallet): resolve connection timeout on mobile
docs(api): add settlement endpoint documentation
refactor(hooks): enhance useLocalStorage with SSR safety
```

## Code Standards

- **TypeScript**: All new code must be written in TypeScript with proper type annotations.
- **Components**: Use functional components with descriptive JSDoc comments.
- **Hooks**: Custom hooks must be SSR-safe (check `typeof window`).
- **Styling**: Use Tailwind CSS utilities. Custom CSS goes in `globals.css`.
- **Testing**: Write tests for utility functions and critical business logic.

## Pull Request Guidelines

1. Keep PRs focused on a single concern
2. Include a clear description of what changed and why
3. Ensure no TypeScript errors (`npm run build`)
4. Update documentation if adding new features
5. Reference any related issues

## Code Review

All PRs require at least one approval before merging. Reviewers will check for:
- Correctness and edge case handling
- TypeScript type safety
- Accessibility (ARIA labels, keyboard navigation)
- Performance (no unnecessary re-renders)
- Security (input validation, XSS prevention)

## Questions?

Open a GitHub Discussion or reach out on Discord.
