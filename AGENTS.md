# AGENTS

## Project Overview

- Build a Connect Fjord-style game Safari as a web app.
- Use TypeScript, React, and Vite.
- Maintain a clear board model data structure and render the UI based on that
  model.
- The board is 7x7. Keep the UI layer abstracted over the model.
- Support drag-and-drop for intuitive iPad play.
- Persist game state in localStorage.
- Provide a new-game flow that confirms if a game is in progress.
- Prepare for Vercel deployment with the correct scripts.

## Testing Requirements

- Implement unit tests for all relevant functionality.
- Implement Playwright end-to-end tests covering 10 different games.
- Always run all tests after making changes to make sure there are no errors.
- Always run `npm run format` before committing.
- Always run `npm run typecheck` to catch TypeScript errors before shipping.
- Keep Vitest DOM polyfills up to date so unit tests match CI (e.g., `elementFromPoint`).
- Capture screenshots for each Playwright move step for review.
- Maintain ESLint and Prettier configurations for linting and formatting.
- Keep GitHub Actions configured to run tests, linting, and formatting checks on
  PRs and main merges.

## Engineering Practices

- Follow best practices and DRY principles.
- Keep files around 150 lines or less.
- Use clear function names and intuitive structure/naming.
