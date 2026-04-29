# AGENTS.md — TMPCS.EU Website

This file contains project-specific context for AI coding agents. The reader is assumed to have no prior knowledge of this codebase.

---

## Project Overview

This is the corporate website for **TMPCS.EU**, a Germany-based company specializing in luxury instrument watch import, European wholesale distribution, logistics, and fulfillment. The site is a static marketing website built with Astro and deployed on Netlify.

- **Domain**: https://tmpcs.eu
- **Company**: TMPCS.EU
- **Owner**: Lennart Buiks
- **Location**: Emsbüren, Germany
- **Language**: English (content), German legal pages (Impressum)

---

## Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Astro | ^6.1.9 |
| Styling | Tailwind CSS | ^3.4.19 |
| Build Tool | Vite (via Astro) | — |
| Language | TypeScript | strict mode |
| Image Processing | Sharp (via Astro) | — |
| Font | Inter (self-hosted) | — |
| Deployment | Netlify | static hosting |
| Node.js | >= 22.12.0 | required |

---

## Project Structure

```
/
├── public/                    # Static assets copied to dist/ as-is
│   ├── fonts/                 # Self-hosted Inter font files (woff2)
│   ├── *.jpg / *.webp         # Brand and hero images
│   ├── favicon.svg            # Site favicon
│   ├── og-image.svg           # Open Graph image
│   └── robots.txt
├── src/
│   ├── components/            # Reusable Astro components
│   │   ├── CookieBanner.astro
│   │   ├── Footer.astro
│   │   └── Header.astro
│   ├── content/               # Astro Content Collections (JSON data)
│   │   └── brands/
│   │       ├── bausele.json
│   │       ├── marathon.json
│   │       ├── sicura.json    # draft: true — not published
│   │       ├── squale.json
│   │       ├── subdelta.json
│   │       └── zrc.json
│   ├── layouts/
│   │   └── Layout.astro       # Root HTML layout with SEO meta, Schema.org
│   ├── pages/                 # File-based routing
│   │   ├── index.astro        # Homepage
│   │   ├── brands/
│   │   │   └── [brand].astro  # Dynamic brand detail pages
│   │   ├── contact.astro      # Contact form
│   │   ├── impressum.astro    # German legal notice
│   │   ├── privacy-policy.astro
│   │   └── 404.astro
│   ├── styles/
│   │   └── global.css         # Tailwind directives, CSS variables, font-face
│   └── content.config.ts      # Content collection schema (Zod)
├── astro.config.mjs           # Astro config: static output, Tailwind, Sharp
├── tailwind.config.mjs        # Tailwind theme: custom colors, Inter font
├── postcss.config.mjs         # PostCSS: tailwindcss + autoprefixer
├── tsconfig.json              # Extends astro/tsconfigs/strict
├── netlify.toml               # Build command, security headers, caching
└── package.json
```

---

## Build and Development Commands

All commands run from the project root.

```bash
# Install dependencies
npm install

# Start development server (http://localhost:4321)
npm run dev

# Production build (outputs to ./dist/)
npm run build

# Preview production build locally
npm run preview

# Astro CLI commands
npm run astro -- --help
npm run astro check
```

### Node Version Requirement
The project requires **Node.js >= 22.12.0** (specified in `package.json` engines).

---

## Content Architecture

### Brand Content Collection
Brand data is stored as JSON files in `src/content/brands/` and typed with Zod in `src/content.config.ts`.

**Schema fields:**
- `name` (string) — brand display name
- `slug` (string) — URL-safe identifier
- `tagline` (string) — short headline
- `description` (string) — one-line summary
- `story` (string) — longer narrative
- `logo` (string, optional) — logo image path
- `heroImage` (string, optional) — hero image path
- `draft` (boolean, default false) — if true, page is not generated
- `website` (string URL, optional) — external brand website
- `galleryImages` (string[], default []) — gallery image paths

**Image mapping**: Brand images are mapped manually in page components via a `brandImageMap` Record (e.g., in `index.astro` and `[brand].astro`). Public image paths like `/squale.jpg` refer to files in `public/`.

### Pages
- **Homepage** (`/`): Hero, About, Brand Portfolio grid, Services, Latest News, CTA
- **Brand pages** (`/brands/:slug`): Dynamically generated from content collection, filtered by `draft: false`
- **News** (`/news`): Static news and press releases page
- **Contact** (`/contact`): Contact info + inquiry form powered by Web3Forms
- **Impressum** (`/impressum`): German legal notice (§ 5 TMG)
- **Privacy Policy** (`/privacy-policy`): GDPR-compliant privacy policy
- **404**: Custom not-found page

---

## Styling Conventions

### Tailwind Configuration
- **Colors**: Defined as CSS custom properties in `:root`, referenced in Tailwind theme:
  - `primary`: `#0b2644` (dark navy)
  - `secondary`: `#a5a6a5` (gray)
  - `background`: `#ffffff`
  - `text`: `#121212`
- **Font**: Inter (self-hosted, weights 400/500/600/700) via `@font-face` in `global.css`
- **Container**: `max-w-7xl` with responsive padding (`px-4 sm:px-6 lg:px-8`)

### CSS Patterns
- Tailwind utility-first approach; no custom component classes
- CSS variables for theming in `src/styles/global.css`
- `text-balance` utility for balanced text wrapping
- `scroll-behavior: smooth` on html

### Component Patterns
- Accessibility-first: `aria-labelledby`, `aria-label`, `role` attributes throughout
- Skip-to-content link in Layout
- Focus rings on interactive elements (`focus:ring-2 focus:ring-primary`)
- Images use `loading` and `decoding` attributes
- Inline SVG icons (Heroicons-style) used in components

---

## Environment Variables

The project uses a single public environment variable:

| Variable | Purpose |
|----------|---------|
| `PUBLIC_WEB3FORMS_KEY` | Access key for Web3Forms contact form API |

Copy `.env.example` to `.env` and fill in real values. This variable is read at build time via `import.meta.env.PUBLIC_WEB3FORMS_KEY`.

---

## Deployment

### Netlify Configuration (`netlify.toml`)
- **Build**: `npm run build`
- **Publish directory**: `dist/`
- **Security headers** applied globally:
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `X-XSS-Protection: 1; mode=block`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy` (restrictive)
  - `Strict-Transport-Security` (HSTS, 2 years)
  - `Content-Security-Policy` (strict, allows Web3Forms API connect)
- **Long-term caching** for `/assets/*`, `/fonts/*`, `/*.css`, `/*.js`

### Output Mode
Astro is configured for **static output** (`output: 'static'`). All pages are pre-rendered at build time. There is no server-side rendering or API routes.

---

## Testing

There is **no test framework configured** in this project. There are no unit tests, integration tests, or end-to-end tests.

**Recommended testing approach** (if adding):
- Use Playwright or Vitest for Astro component testing
- Validate build output with `astro check`
- Test contact form submission manually against Web3Forms

---

## Security Considerations

1. **CSP**: Content-Security-Policy is configured in `netlify.toml`. The `connect-src` directive explicitly allows `https://api.web3forms.com` for the contact form.
2. **Honeypot**: The contact form includes a hidden `botcheck` field to deter simple bots.
3. **Client-side validation**: Contact form has JavaScript validation (name length, email format, message length) before submission.
4. **No tracking cookies**: The cookie banner only manages an essential localStorage preference. No analytics or third-party tracking scripts are present.
5. **LocalStorage**: Cookie consent is stored in `localStorage` under key `24-7-cookie-consent`, not sent to any server.
6. **No sensitive data in repo**: Images, contact info, and business details are public marketing information.

---

## SEO & Meta

- Every page sets `title` and `description` via Layout props
- Open Graph and Twitter Card meta tags are included in Layout
- Canonical URLs are generated per page
- Schema.org `Organization` JSON-LD is embedded on every page
- `robots.txt` is present in `public/`
- `og-image.svg` is used as the default social image

---

## Development Guidelines

### Adding a New Brand
1. Add a new JSON file to `src/content/brands/` matching the Zod schema in `src/content.config.ts`
2. Add the brand image to `public/` (JPG or WebP)
3. Add the image mapping in `src/pages/index.astro` (`brandImageMap`)
4. Add the brand link in `src/components/Header.astro` (both desktop and mobile nav)
5. Add the image mapping in `src/pages/brands/[brand].astro`
6. Add the brand link in `src/components/Footer.astro`
7. If published (`draft: false`), the page will be generated automatically at `/brands/{slug}`

### Adding a News Article
1. Open `src/pages/news.astro`
2. Add a new entry to the `newsItems` array in the frontmatter
3. Each entry needs: `date` (YYYY-MM-DD), `title` (string), `content` (string)
4. The entry will automatically appear on both `/news` and the homepage Latest News section
5. To also show it on the homepage, add the same entry to `newsItems` in `src/pages/index.astro`

### Adding a New Page
1. Create a new `.astro` file in `src/pages/`
2. Use the `Layout` component from `../layouts/Layout.astro`
3. Set `title` and `description` props
4. Follow the existing section pattern: hero section with `bg-primary`, content section with `bg-background`

### Code Style
- Use Astro frontmatter for data and imports
- Use TypeScript (strict mode) — types are enforced
- Prefer Astro components over frameworks (no React/Vue/Svelte in use)
- Keep inline scripts IIFE-wrapped and placed at the bottom of components
- Use semantic HTML and ARIA attributes
- Self-close void elements in Astro templates (`<img ... />`)

---

## Notes for Agents

- Do not add server-side rendering or API routes — this is a purely static site.
- Do not add analytics scripts without explicit user consent consideration.
- The `sicura` brand is marked `draft: true` and intentionally excluded from the site.
- The contact form submits to a third-party service (Web3Forms). Test form changes carefully.
- German legal pages (Impressum, Privacy Policy) must remain accurate and compliant with current law.
