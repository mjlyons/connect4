# Connect Fjord

A mobile-friendly Connect Fjord web app built with TypeScript, React, and Vite. The board is a 7x7 grid with drag-and-drop support designed for iPad Safari. Game state is persisted in localStorage so you can refresh without losing progress.

## Features

- 7x7 Connect Fjord board with a clean UI.
- Drag-and-drop token placement with tap/click fallback.
- Game model separated from the UI layer.
- LocalStorage persistence.
- New game confirmation if a match is in progress.
- Unit tests (Vitest) and Playwright end-to-end coverage.

## Getting Started

```bash
npm install
npm run dev
```

## Tests

```bash
npm test
npm run test:e2e
```

## Build

```bash
npm run build
npm run preview
```

## Deploy on Vercel

This project is ready for Vercel. The build output is in `dist`.

```bash
npm run build
```
