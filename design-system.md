# MindMed Tutors — Design System

Extracted from the existing implementation (`index.html`, `get-started.html`)
on branch `claude/mindmed-tutors-website-t7tqwd`. This is the objective
reference the System critic judges against. It records what the site *is*, so
new work stays consistent with it.

---

## 1. Colour

Defined in the Tailwind config on every page. These are the only colours in
the system.

| Token | Hex | Role |
|---|---|---|
| `ink` | `#16213E` | Headings, body text, primary button fill, dark sections, footer |
| `blue` | `#5B7EBD` | The accent. Focus rings, hover borders, active states |
| `blue-dark` | `#3E5D97` | Eyebrow labels, inline links, primary button hover |
| `blue-light` | `#8CA6D6` | Accent on dark backgrounds only |
| `lav` | `#A78FC0` | Decorative only |
| `lav-dark` | `#8B70A8` | Wordmark "Mind", secondary eyebrow labels |
| `lav-light` | `#C4B3D8` | Decorative on dark backgrounds |
| `mist` | `#F3F5FA` | Alternating section background |
| `slate` | `#4B5468` | Body copy, secondary text |
| `line` | `#E3E6F0` | All borders, dividers, hairlines |

### Colour rules

- **Blue is the only interactive colour.** Every link, focus ring, hover
  border and active state uses `blue` or `blue-dark`.
- **Lavender is never interactive.** It appears as a decorative stripe, a
  sticker fill, a wordmark half, an eyebrow label. It never fills a button and
  never indicates state. (Mirrors how the reference systems reserve their loud
  accent for canvas, not controls.)
- **Section backgrounds alternate** white → `mist` → white, with `ink` for the
  two dark bands (MindMed Method, footer).
- No gradients except one: the 6px `blue`→`lav` bar on the final CTA card.

## 2. Typography

Three families, loaded from Google Fonts.

| Family | Weights | Applied to |
|---|---|---|
| **Manrope** | 500–800 | `h1`–`h3`, `.font-display`. Global `letter-spacing: -0.01em` |
| **Inter** | 400–600 | Body, UI, buttons, nav, forms |
| **IBM Plex Mono** | 500–600 | `.font-mono-num` — eyebrow labels, step numbers, small caps |

### Type rules

- **Eyebrow labels** are the signature: IBM Plex Mono, `text-xs`,
  `tracking-[0.2em]`, `font-semibold`, in `blue-dark` (or `lav-dark` for a
  secondary section, `blue-light` on dark). Every major section opens with one.
- Section headings: `text-3xl sm:text-4xl`, `font-extrabold`, `leading-[1.1]`.
- Page `h1`: `text-4xl sm:text-5xl lg:text-[3.4rem]`, `leading-[1.05]`.
- Body: `text-slate`, `leading-relaxed`. Never pure black.

## 3. Shape and elevation

| Element | Radius |
|---|---|
| Buttons, chips, pills, tags | `9999px` (full) |
| Cards, panels | `16px` (`.card-flat`, `.catalog-card`) |
| Large feature panels | `24px` (`rounded-3xl`) |
| Photo tiles | `14px` |
| Stickers | `7px` |
| Inputs, option cards | `14px` |

**Elevation is minimal by design.** Cards are defined by a `1px #E3E6F0`
hairline, not by shadow. Hover raises the card `3–4px` and switches the border
to `blue`. Shadows appear only on: the hero photo tiles, stickers, and the
`ink` journey chip.

## 4. Components

### Buttons

- **Primary** — `.btn-primary`: `ink` fill, white text, full radius,
  `px-7 py-3.5`, trailing `→` in a `.arrow` span that translates `3px` right on
  hover. Hover fill → `blue-dark`.
- **Secondary** — `.btn-outline`: transparent, `1.5px solid ink` border, full
  radius. Hover inverts to `ink` fill with white text.
- One primary CTA per section. The site-wide primary action is **"Start Your
  Journey"** → `get-started.html`. Secondary is **"Book a Session"** →
  `contact.html`.

### Cards

- `.card-flat` — white, `1px line` border, `16px` radius, hover border → blue,
  `translateY(-3px)`.
- `.catalog-card` — same, plus `28px` padding, a `32px` stroked icon at
  top-left, a `›` chevron at top-right that translates `3px` on hover, and a
  `mist` background tint on hover.

### Section rhythm

Every major section follows: eyebrow label (mono, tracked) → `h2` → optional
lead paragraph → content. Vertical padding `py-20 md:py-28`. Content is capped
at `max-w-7xl` with `px-5 sm:px-8`.

## 5. Motion

- **Scroll reveal** — `.reveal`: `opacity 0 → 1`, `translateY(18px) → 0`, over
  `.6s ease`, fired by a single `IntersectionObserver` at `threshold: 0.12`,
  unobserved after firing. Staggered via inline `transition-delay` in `.05s`
  steps.
- **Hover** — `.25s`–`.35s ease` on transform, border-color and background.
- **Arrows** — `.2s ease` translate.
- Durations sit between `.2s` and `.6s`. Nothing is instant, nothing crawls.

### Reduced motion

`@media (prefers-reduced-motion: reduce)` must disable: `scroll-behavior`, all
`.reveal` transitions (elements render at final position), and every hover
transform. This block is present on both pages and any new work must extend it.

## 6. Accessibility

Non-negotiable, already implemented site-wide:

- Skip link to `#top` on every page.
- `:focus-visible { outline: 2px solid #5B7EBD; outline-offset: 2px; }`
- Semantic landmarks: `<header>`, `<nav aria-label="Primary">`, `<main>`,
  `<footer>`. One `h1` per page, headings never skip a level.
- Mobile menu button carries `aria-expanded` and `aria-controls`, kept in sync.
- Decorative SVG is `aria-hidden="true"`. Meaningful imagery needs alt text.
- Body text is `slate` on white or `mist` — all combinations meet WCAG AA.
- Any new decorative illustration must be `aria-hidden` and must not be the
  sole carrier of meaning.

## 7. Content integrity

A hard constraint, not a style preference. The site must not invent:
testimonials, statistics, success rates, UCAT scores, university offers, tutor
credentials, partnerships, accreditations, or pricing.

Unsupplied content uses a visibly marked placeholder — `[Insert real student
testimonial here]` inside a **dashed** border, with a caption stating it is a
placeholder. Dashed borders are reserved for this purpose and carry meaning.

## 8. Build constraints

- Static HTML. Tailwind via CDN (`cdn.tailwindcss.com`) with an inline
  `tailwind.config` — identical on every page.
- No build step, no framework, no bundler.
- Custom CSS lives in one `<style>` block per page.
- Fonts preconnected to `fonts.googleapis.com` / `fonts.gstatic.com`.
- No external assets beyond Google Fonts. Illustrations must be inline SVG or
  data URIs so the site stays self-contained and fast.
- Every page carries: unique `<title>`, `<meta name="description">`, Open Graph
  tags, and the SVG favicon data URI.
