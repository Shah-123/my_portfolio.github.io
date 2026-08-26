# Shahkar Ahmad — Portfolio

Personal portfolio for **Shahkar Ahmad**, Machine Learning & Agentic AI engineer.
Rebuilt as a React + TypeScript single-page app with a hand-written editorial design system.

## Stack

| | |
|---|---|
| Framework | React 19 + TypeScript (strict) |
| Build | Vite 6 |
| Animation | Framer Motion |
| Icons | lucide-react |
| Styling | CSS Modules + design tokens — no CSS framework |

## Getting started

```bash
npm install
```

```bash
npm run dev
```

Other scripts:

- `npm run build` — typecheck, then build to `dist/`
- `npm run preview` — serve the production build locally
- `npm run typecheck` — types only
- `npm run optimize:images` — regenerate the WebP covers (see below)

## Project structure

```
src/
├─ App.tsx                 page composition
├─ main.tsx                entry point
├─ data/site.ts            ← ALL content lives here
├─ styles/
│  ├─ tokens.css           colour, type scale, spacing, motion
│  └─ global.css           reset, primitives, grain, a11y
├─ hooks/                  theme, active section, reduced motion
└─ components/
   ├─ Navbar · Hero · About · Expertise · Work · Contact · Footer
   └─ ui/                  Button, Reveal, SectionHeading, Marquee,
                           ThemeToggle, ScrollProgress, ProjectCover
```

### Editing content

Everything readable on the page — bio, projects, capabilities, links, stats — is in
[`src/data/site.ts`](src/data/site.ts). Components never hard-code copy, so adding a
project means appending one object to the `projects` array:

```ts
{
  id: "my-project",
  title: "My Project",
  year: "2026",
  category: "Agentic AI",       // drives the filter chips
  summary: "One line for the card.",
  description: "Longer text — only shown on featured cards.",
  highlights: ["Fact one", "Fact two"],
  stack: ["Python", "LangGraph"],
  links: [{ label: "View source", href: "https://…", primary: true }],
  cover: "./assets/my-cover.png", // optional
  featured: true,                 // spans two columns, shows description
}
```

Projects without a `cover` render a generated SVG motif chosen by category
(agent graph, retrieval fan-in, regression scatter, or bar chart), so no card
depends on a hotlinked third-party image.

### Images

The original PNG covers were ~1 MB each — 6.3 MB for one page load.
[`scripts/optimize-images.mjs`](scripts/optimize-images.mjs) resizes them to the
width they are actually displayed at (doubled for retina) and re-encodes to WebP,
bringing the page down to **~830 KB, an 88% reduction**. Originals are kept
untouched in `public/assets`; the site references `public/assets/optimized`.

After adding a new cover, add it to the `TARGETS` list in that script and run:

```bash
npm run optimize:images
```

Covers are lazy-loaded, so only the ones scrolled into view are ever fetched.

### Design system

Two themes are defined entirely as CSS custom properties in `tokens.css`:
a near-black canvas (`#08090A`) and a warm paper light mode (`#F6F5F2`),
sharing one muted-gold accent. Text colours are tuned to clear WCAG AA
(4.5:1) against both backgrounds, including the small monospace labels.

The theme is resolved by an inline script in `index.html` before first paint,
so there is no flash; the visitor's choice persists in `localStorage`, and the
OS preference is followed until they pick one explicitly.

### Motion

All animation is opt-out — `prefers-reduced-motion: reduce` disables reveals,
the marquee, the grain, and smooth scrolling via `useReducedMotion` and a
global media query.

## Deployment

Pushing to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
which builds and publishes `dist/` to GitHub Pages.

> **One-time setup:** in the repository, go to **Settings → Pages** and set
> **Source** to **GitHub Actions**. The site previously served static files from
> the repo root; it now serves a build artifact, so the old "Deploy from a branch"
> setting will not pick up changes.

`vite.config.ts` uses `base: "./"`, so the build works from a project path
(`/my_portfolio.github.io/`) and from a custom domain root without changes.

## Legacy

The original vanilla HTML/CSS/JS site is preserved under [`legacy/`](legacy/)
for reference. It is not built or deployed.
