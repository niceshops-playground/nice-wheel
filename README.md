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
- ♿ Respects `prefers-reduced-motion`

## Tech

Vite · React 18 · TypeScript · Vitest + Testing Library. The wheel geometry and
winner maths live in `src/lib/` as pure, fully unit-tested functions.

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
- **The smiley** (`src/components/Smiley.tsx`) is an original SVG drawn in the
  niceshops style — swap in an official asset any time.

## Deployment

Pushes to the deploy branch trigger
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which tests,
builds, and publishes to **GitHub Pages** automatically. Enable it once under
**Settings → Pages → Build and deployment → Source: GitHub Actions**. The app is
then served at `https://<owner>.github.io/<repo>/`.

Every push and pull request also runs the [CI workflow](.github/workflows/ci.yml)
(type-check, tests, build). Dependencies and Actions are kept current by
[Dependabot](.github/dependabot.yml).
