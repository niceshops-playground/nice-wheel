# 🎡 Wheel of Names — niceshops edition

A tiny React app for fair, fun random draws. Add names, spin the wheel, and
celebrate a winner — styled in the warm niceshops orange palette with a friendly
smiley.

## Features

- ➕ Add names — saved in your **browser session** (per tab, no account, no server)
- ✖️ Remove names individually or clear them all
- 🎨 Every name gets its own slice in the orange palette
- 🌀 Smooth spin animation that lands on a random winner
- 🎉 Winner reveal with confetti and a bouncing smiley
- 🌗 Light & dark themes with a toggle (remembers your choice, follows the OS by default)
- 📲 Installable **PWA** — add to home screen and it works offline
- ♿ Respects `prefers-reduced-motion`

## Tech

Vite · React 19 · TypeScript · Vitest + Testing Library · `vite-plugin-pwa`
(Workbox) for the offline service worker. The wheel geometry and winner maths
live in `src/lib/` as pure, fully unit-tested functions.

## Develop

```bash
npm install
npm run dev      # start the dev server
npm test         # run the test suite
npm run build    # type-check + production build
```

## How it works

- **Names** are persisted to `sessionStorage` via the `useNames` hook
  (`src/hooks/useNames.ts`). Pure list helpers are in `src/lib/names.ts`.
- **The wheel** (`src/lib/wheel.ts`) is the testable core: it builds the
  segments, picks a winner, and computes the exact rotation so that winner ends
  up under the top pointer. `winnerIndexForRotation` and `rotationForWinner` are
  round-trip tested so the wheel can never lie about who it landed on.
- **The logo** (`src/components/Logo.tsx`) is the official niceshops smiley
  mark as an inline SVG that inherits `currentColor`, so it recolours to fit the
  header chip, the wheel hub, and the winner card.
- **Theming** lives in `src/hooks/useTheme.ts`: it persists the choice to
  `localStorage`, falls back to the OS `prefers-color-scheme`, and an inline
  boot script in `index.html` applies it before first paint to avoid a flash.
  All colours are CSS custom properties switched by `[data-theme]`.
- **PWA**: `vite-plugin-pwa` generates `manifest.webmanifest` and a Workbox
  service worker that precaches the app shell. Icons are in `public/`.

## Deployment

Pushes to the deploy branch trigger
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which tests,
builds, and publishes to **GitHub Pages** automatically. Enable it once under
**Settings → Pages → Build and deployment → Source: GitHub Actions**. The app is
then served at `https://<owner>.github.io/<repo>/`.

Every push and pull request also runs the [CI workflow](.github/workflows/ci.yml)
(type-check, tests, build). Dependencies and Actions are kept current by
[Dependabot](.github/dependabot.yml).
