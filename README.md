# The Jeep Collection — Landing Page

> **Rugged. Refined. Ready for Anything.** — A luxury brand landing page applying the Bugatti design system to Jeep's all-American off-road heritage.

[![Playwright Tests](https://img.shields.io/badge/tests-47%20passing-brightgreen)](https://github.com/chaitanyame/jeep-landing-page-designmd)

## Overview

This is a dark-themed, single-page automotive brand showcase for *The Jeep Collection*. It translates the austere luxury design language initially defined for Bugatti in [`DESIGN.md`](./DESIGN.md) — near-pure black canvas, white uppercase letterspaced display typography, full-bleed automotive photography — onto the visual identity of Jeep's off-road lineup.

The page features:
- **Full-screen hero** with immersive background photography
- **Model gallery** — Wrangler, Grand Cherokee, Gladiator, and Wagoneer
- **Technical specifications** section with spec table
- **Heritage editorial** — the "Since 1941" brand storytelling
- **Newsroom** grid with article cards
- **Test drive booking** — modal form with form submission flow
- **Interactive navigation** — hamburger menu, smooth scroll, scroll-aware nav bar

## Design System

The project is governed by [`DESIGN.md`](./DESIGN.md), a design token specification in the `design.md` format that defines:

| Token Category | Details |
|---|---|
| **Colors** | 18 semantic color tokens — canvas (`#000000`), surfaces, text, links, status |
| **Typography** | 3 typefaces across 7 size tiers, all at font-weight 400 |
| **Spacing** | 10-step scale from 4px to 120px |
| **Breakpoints** | Responsive grid adapting from 375px mobile to 1600px+ desktop |

The page uses three Google Fonts:
- **Saira Condensed** (display headers — uppercase, tight tracking)
- **Cormorant Garamond** (body text — serif elegance)
- **JetBrains Mono** (labels, captions, nav links)

All font weights are kept at `400` (regular) — no bold anywhere — to maintain the restrained, understated luxury feel.

## Project Structure

```
├── index.html            # Compiled landing page (inline CSS + JS)
├── DESIGN.md             # Design token specification
├── package.json          # Node project — test suite only
├── playwright.config.js  # Playwright test configuration
├── tests/
│   └── landing.spec.js   # 47 Playwright tests
└── fragments/
    ├── body.html         # Semantic HTML markup
    ├── styles.css        # Design system CSS (~650 lines)
    └── main.js           # Interactivity (nav, scroll, reveal, modal)
```

### Fragments Architecture

Rather than using a build tool, the page is assembled manually from three source fragments under `fragments/`:
- **`fragments/body.html`** — the full HTML body (header, sections, footer)
- **`fragments/styles.css`** — all CSS design system + component styles
- **`fragments/main.js`** — vanilla JS for navigation, smooth scroll, IntersectionObserver reveals, modal form logic

These are inlined into `index.html` for zero-dependency deployment — open it directly in any browser.

## Getting Started

No build step required. The page is a single `index.html` file that loads directly in a browser.

### View Locally

```bash
# Open directly (macOS/Linux)
open index.html

# Or serve with any static server
python3 -m http.server 8000
# Visit http://localhost:8000
```

### Run Tests

```bash
npm install
npx playwright install chromium
npm test               # runs: playwright test
```

The test suite covers:
- Console error detection
- Navigation and wordmark visibility
- Model card rendering (count, names, images, links)
- Spec table values and labels
- Heritage editorial section
- Newsroom article cards
- CTA band heading and button
- Footer columns and dynamic year
- Modal open/close interactions
- Keyboard accessibility (Escape closes nav)
- Visual smoke test (full-page screenshot)
- Mobile responsiveness (375px viewport)
- Background color and typography compliance
- Image health check (HTTP 200 for every background image)
- Modal form submission flow

### Design Tokens

To customise the visual identity, edit the CSS custom properties in `fragments/styles.css`:

```css
:root {
  --canvas: #000000;
  --ink: #ffffff;
  --body: #cccccc;
  /* all 18 color tokens + spacing scale + font stacks */
}
```

Every visual property — colors, spacing, typography, breakpoints — is defined as a `--var()` token, making comprehensive theming possible by changing only the `:root` block.

## License

ISC
