# Shahkar Ahmad — Portfolio

Personal portfolio site for **Shahkar Ahmad**, AI Engineer (agentic systems, LangGraph, MCP,
hybrid RAG). Built as a static site: no framework, no build step — open `index.html` or push
to GitHub Pages.

**Design language:** "Agentic OS" — a terminal-forward dark interface with a command palette,
a live Three.js agent-topology graph, and a credentials gallery. Dark is primary; a paper-terminal
light theme is included.

## Run locally

```bash
python -m http.server 8000
# then open http://localhost:8000
```

Any static server works. There is nothing to install.

## Structure

| File | Purpose |
|---|---|
| `index.html` | All content and markup. Sections: hero, ticker, about, stack, work, journey, credentials, contact |
| `style.css` | Design tokens + components. Breakpoint-free base; edit tokens in `:root` to retheme |
| `mediaqueries.css` | Responsive layer (1200 → 420px), print styles, `hover: none` and `no-js` fallbacks |
| `script.js` | Behaviour. Boot sequence, command palette, 3D graph, reveals, counters, filters, form |
| `assets/covers/` | Hand-drawn SVG cover art per project, composed for a 2.4:1 crop band |
| `assets/credentials/` | Certificate and hackathon scans shown in the credentials gallery |
| `assets/Shahkar Ahmad Shah.pdf` | The canonical CV, linked from every "Download CV" control |

## Configuration

Two constants at the top of `script.js` are the only places you should need to edit:

```js
const CONFIG = {
  mootcourtRepo: "https://github.com/Shah-123/CourtSimulator",
  mootcourtPublic: false,    // flip to true once the repo is public
  formspreeId: "YOUR_FORM_ID",
  ...
};
```

- **MootCourtSimulator link** — the repository (`CourtSimulator`) is private, so the URL 404s
  for anonymous visitors. The link is wired but keeps a `private` badge until
  `mootcourtPublic` is set to `true`, which removes the badge.
- **Contact form** — the Formspree endpoint must be set in *both* `CONFIG.formspreeId` and the
  `<form action>` in `index.html`. Until then the form degrades to opening the visitor's mail
  client and says so, rather than pretending to send.

## Behaviour notes

- **3D agent graph** — Three.js is loaded via dynamic `import()` from a CDN. If the CDN is
  unreachable, WebGL is unavailable, or the viewport is under 720px, the panel falls back to a
  static SVG topology. The loop pauses off-screen and on `visibilitychange`.
- **Command palette** — `Ctrl/Cmd+K` (or `/`). Fuzzy search over sections, projects, skills,
  external links and actions. Fully keyboard driven and focus-trapped.
- **Motion** — every animation is gated on `prefers-reduced-motion`. With it set, the boot
  sequence is skipped, the graph renders one static frame, and reveals appear instantly.
- **No-JS** — the page is fully readable without JavaScript: the boot overlay never mounts,
  case studies and `more_work.log` rows render expanded, and skill bars show their level.

## Verification

Headless-Chrome screenshots of every section, the open palette, an expanded case study,
mobile widths and the light theme are reproducible with the scripts kept in `.qwen/tmp/`
(`shoot.js`). `.qwen/tmp/verify_work.js` drives the same CDP session to exercise the
`more_work.log` expanders specifically — column alignment against the table header, ARIA
state, filter behaviour, and that a repo link inside a row does not toggle it. Markup is
checked by `.qwen/tmp/check-html.mjs` (tag nesting, duplicate ids, `aria-controls` targets,
local asset paths). All external and local links are audited by `.qwen/tmp/audit_links.py`.
