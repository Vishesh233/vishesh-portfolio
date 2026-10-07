# Vishesh Khanna — Portfolio

A single-page personal portfolio: quiet, editorial — a navy/sky dual theme,
cyan accent, serif display type over a structured mono/sans grid. Content lives in
one file (`src/data/site.js`), motion is deliberately restrained, and the whole
UI supports light and dark through `light-dark()` design tokens.

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
```

Optionally copy `.env.example` to `.env` and set `VITE_FORMSPREE_ID` to power
the contact form. Without it the form explains itself and falls back to a
`mailto:` link.

## Scripts

| Script              | What it does                                                        |
| ------------------- | ------------------------------------------------------------------- |
| `npm run dev`       | Vite dev server with HMR                                            |
| `npm run build`     | Production build to `dist/`                                         |
| `npm run preview`   | Serve the production build (used by the Lighthouse audit)           |
| `npm run lint`      | ESLint over the whole project                                       |
| `npm test`          | Vitest + Testing Library in jsdom (26 tests)                        |
| `npm run contrast`  | `scripts/contrast-check.mjs` — 35 text/background pairs, both themes |
| `node scripts/optimize-images.mjs` | Regenerate responsive WebP sets with sharp          |

## Stack

- **React 19** + **Vite 8** + **@vitejs/plugin-react**
- **Tailwind CSS v4** (`@tailwindcss/vite`) with project-level `@utility`
  primitives in `src/styles/utilities.css`
- **Framer Motion 13** for entrances and layout continuity
- **@fontsource** — Instrument Serif (display), Geist Variable (body),
  Geist Mono Variable (labels and numerals); no network font requests
- **Vitest 5** + **Testing Library** + jsdom, **ESLint 10**, **sharp**

## Layout

```
index.html               document head: fonts, SEO/social metadata (canonical,
                          OG and Twitter tags carry TODO(deploy) notes)
public/                  robots.txt, llms.txt, favicon.svg, og-image.png,
                         Vishesh_Khanna_Resume.pdf
scripts/                 contrast-check.mjs, optimize-images.mjs,
                         og-card.html (source of og-image.png)
src/data/site.js         single source of content: nav, hero, skills,
                         projects, education, contact, social links
src/lib/                 motion tokens/variants, theme, contact (Formspree),
                         image helpers, cn() utility
src/components/
  layout/                Container, Section, SiteHeader, SiteFooter, SkipLink
  motion/                Reveal — the single reduced-motion decision point
  sections/              Hero, About, Skills, Projects, Education, Contact
  projects/              ProjectCard, ProjectModal
  ui/                    ActionLink, ContactForm, CopyEmail, Icons, Portrait,
                         ProjectImage, SkillIcons, SocialLinks, ThemeToggle
src/styles/              tokens.css (design tokens), base.css, utilities.css,
                         index.css
src/*.test.jsx/.test.js  26 tests: app shell, ContactForm, contact helpers
```

## Design and motion notes

- **Tokens first.** Colour, spacing, type and elevation are declared once in
  `src/styles/tokens.css` and mirrored by `src/lib/motion.js` for the JS side,
  so CSS transitions and Framer Motion cannot drift apart.
- **Motion reveals structure, never decorates.** Entrances run 600–900 ms,
  feedback ~200 ms; nothing loops or floats idly.
- **`Reveal` owns `prefers-reduced-motion`.** Components never check the
  preference themselves — under reduced motion they render their final state
  immediately, delays included.
- **The hidden state is a real state.** Section reveals start at `opacity: 0.94`
  (not 0) with a 12px settle, because crawlers, slow-JS visitors and
  accessibility audits all see the pre-reveal render — 0.94 is the floor that
  keeps the blended colour above WCAG AA 4.5:1 in both themes (0.72 measured
  3.5:1 and failed).
- **Accessibility pass**: skip link, landmarks, focus-visible rings, labelled
  controls, alt text, ordered headings; every interactive element keeps visible
  hover/focus/active states (press dips to 98% behind `motion-safe:`).

## Performance

- Responsive WebP `srcset`s per project image (sharp pipeline), explicit
  width/height to prevent layout shift
- Framer Motion split into its own chunk in `vite.config.js`
- `defer` utility (`content-visibility: auto`) hands off-screen sections to the
  browser, opt-in per section via `<Section deferred>`

## Lighthouse (against `npm run preview`, Lighthouse 13.5)

| Category            | Mobile        | Desktop       |
| ------------------- | ------------- | ------------- |
| Performance         | **93** (92)   | 100 (100)     |
| Accessibility       | **100** (97)  | **100** (97)  |
| Best Practices      | 100 (100)     | 100 (100)     |
| SEO                 | **100** (92)  | **100** (92)  |
| Agentic discovery\* | **75** (50)   | **75** (50)   |

Baseline in parentheses. Reproduce with:

```bash
npm run build && npm run preview   # http://localhost:4173
npx lighthouse http://localhost:4173/            # default categories
npx lighthouse http://localhost:4173/ --preset=desktop
```

Mobile performance sits at 93 because the page is a JS-rendered SPA —
first paint waits on the app bundle (FCP/LCP audits), which is structural for
this architecture rather than a defect to patch.

\* Agentic discovery is the fifth default category in Lighthouse 13:
`llms.txt` passes; `ard-schema` still fails because the ARD `ai-catalog.json`
requires absolute URLs.

## Deploy TODOs

The site has no public host yet, which blocks three URL-shaped things — all
marked `TODO(deploy)` in `index.html`:

1. Absolute `canonical`, `og:image` and `twitter:image` URLs (scrapers ignore
   relative paths)
2. `sitemap.xml` (then reference it from `robots.txt`)
3. `ai-catalog.json` (ARD) for the remaining agentic-discovery audit

To refresh `public/og-image.png`, open `scripts/og-card.html` headless at
1200×630 and screenshot it — the colours mirror the light-theme tokens.

