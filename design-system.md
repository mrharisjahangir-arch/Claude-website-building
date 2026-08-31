# MindMed Tutors — Design System

The spec for the landing page redesign. Built against the `landing-page-design`
skill, with structural cues from the Harvest style reference and the graphic
register of Brilliant.

**Locked decisions:** warm cream canvas · single violet accent · Manrope only ·
free trial session as the offer.

---

## 1. Colour

Harvest's transferable discipline, run through MindMed's brand: the canvas is
never white, and exactly one accent does all the interactive work.

| Token | Value | Role |
|---|---|---|
| `--canvas` | `#FBF8F4` | Page background. Warm cream. **Never `#ffffff`** |
| `--paper` | `#FFFFFF` | Cards and panels floating above the canvas |
| `--ink` | `#1D1B22` | Headings and body. Warm near-black, **never pure `#000`** |
| `--stone` | `#5C5661` | Secondary body copy |
| `--ash` | `#8A8391` | Captions, metadata, placeholder-adjacent text |
| `--bone` | `#DFD7CE` | Input borders, hairline dividers |
| `--violet` | `#6B4BA8` | **The only accent.** Every CTA, link, active state, icon accent |
| `--violet-deep` | `#573C8A` | Accent hover state only |
| `--violet-wash` | `#EDE7F6` | Atmospheric tint behind illustrations. Never functional |

### Rules

- **One accent.** `--violet` carries every button, link and active state.
  Introducing a second accent breaks the system.
  - **Scoped exception: the hero heartbeat.** The ECG line behind the hero
    (`#hero .hero-ecg`) uses a deliberate second colour, teal `#12B3A6`,
    at the client's explicit request. It is confined to that one moving
    line and its glow — never a control, never text, never used anywhere
    else on the page. Every button and link stays violet, including the
    one the beat pulses past.
- **The logo blue (`#5B7EBD`) appears only inside illustrations**, never on a
  control. It is the one place a second colour enters, exactly as Harvest
  confines external colour to partner logos.
- `--violet` is the logo's lavender deepened until it passes contrast. White on
  `#6B4BA8` is ~7:1 (AA and AAA large). The original `#A78FC0` cannot carry
  text and must never be used for one.
- **No background gradients.** Backgrounds are flat. The single permitted
  gradient is on hero heading text (see §5).
- **Shadows are warm-tinted**, never cold grey:
  - Cards: `rgba(107,75,168,0.14) 6px 4px 24px 0px`
  - Buttons: `rgba(29,27,34,0.18) 0px 1px 4px 0px`

## 2. Typography

**Manrope only.** One typeface across the whole site. No italics anywhere.
Weights 400 / 500 / 600 / 700 — never 800 or 900.

Manrope was chosen over the reference's substitute because the skill bans Inter,
and Manrope carries the same geometric-humanist warmth while already being
MindMed's established display face.

All sizes resolve to the Tailwind scale. No arbitrary values — no `text-[19px]`,
no `font-size: 22px`.

| Role | Class | Size / line height |
|---|---|---|
| Caption, eyebrow | `text-xs` | 12 / 16 |
| Small UI, nav | `text-sm` | 14 / 20 |
| Body | `text-base` | 16 / 24 |
| Lead paragraph | `text-lg` | 18 / 28 |
| Card heading | `text-xl` | 20 / 28 |
| Section subheading | `text-2xl` | 24 / 32 |
| Section heading | `text-4xl` | 36 / 40 |
| Tagline reveal | `text-5xl` | 48 / 1 |
| Hero | `text-6xl` | 60 / 1 |

### Copy rules

- **No hyphens inside sentences.** Rewrite the phrase instead.
- **No orphaned words.** `text-wrap: balance` on headings, `text-wrap: pretty`
  on body.
- Sentence case for headings, never Title Case On Everything.
- Banned: "elevate", "seamless", "unleash", "next gen", "game changer",
  "delve", "in the world of".

## 3. Spacing

Only these values. Nothing between them, nothing outside them.

`0 · 2 · 4 · 8 · 12 · 16 · 24 · 32 · 40 · 48 · 64 · 80 · 96`

Section gap 80–96px. Card padding 32–40px. Page max-width 1200px.

## 4. Shape

| Element | Radius |
|---|---|
| Tags, pills, nav island | `999px` |
| Cards | `20px` |
| Buttons, inputs, images | `16px` |

**Nested radius formula.** When the gap between an inner and outer shape is
under 32px: `inner = outer − gap`, applied only when the result exceeds 2.
A `20px` card with `8px` internal padding gives the inner element `12px`.

**Borders go all the way round a card or not at all.** Never one side only.

## 5. Hero

- Heading and subheading both capped at **680px**.
- Line breaks land at meaningful thought breaks, never mid-phrase.
- Heading text carries the one permitted gradient, left to right:
  `#1D1B22 → #666066`. On text only, never on a background.

## 6. Icons

Phosphor, Solar, or Iconamoon. Never Material Icons or Material Symbols.

## 7. Motion

Global easing: `cubic-bezier(0.32, 0.72, 0, 1)`. Never a default transition.

All scroll reveals use `IntersectionObserver`. **Never
`window.addEventListener('scroll')`** — it forces continuous reflow and kills
mobile performance.

### Scroll choreography

| Section | Motion |
|---|---|
| Nav island | Contracts and gains blur past 40px of scroll |
| Hero | Staggered rise, 60ms apart; illustration settles last with slight overshoot |
| Proof strip | Fades up as one block, no stagger — it must read instantly |
| Benefits | `translate-y-16 blur-md opacity-0` → resolved, 80ms stagger |
| Tagline reveal | Words light one at a time in reading order, 30% → full ink |
| How it works | Connector line draws left to right, steps land as it passes |
| Tutor | Card rises, photo scales 1.04 → 1 |
| FAQ | Height and opacity, chevron rotates 45° |
| Form | Steps cross-fade with 8px slide, progress bar eases |

Reveal duration 800ms or longer. Interface transitions stay at or under 300ms.

### Interaction states

Every interactive element ships all of these:

- **Hover** — lift 2px or background shift
- **Active** — `scale(0.98)` for physical feedback
- **Focus** — visible ring, `2px solid #6B4BA8` at `2px` offset. Not optional.
- **Loading** — skeletons shaped like the real layout, not spinners
- **Empty** — a composed "getting started" view, never a blank panel
- **Error** — inline and specific. Never `window.alert()`

Under `prefers-reduced-motion: reduce`, everything collapses to opacity only.
All movement and blur is removed; the composition must still read as complete.

## 8. Illustration

Register follows Brilliant: **geometric and precise, not cartoon.** One idea per
illustration, generous space around it.

Built as inline SVG in `--violet` plus neutrals, with the logo blue permitted
inside the artwork. Planned pieces: a UCAT timing curve, an MMI circuit as a
node diagram, an application timeline.

Where a real photograph genuinely beats an illustration — the tutor headshot —
leave a correctly-sized, clearly-marked slot. Do not fake it.

## 9. Content integrity

A hard constraint, not a preference. Never invent testimonials, ratings,
statistics, success rates, UCAT scores, university offers, tutor credentials,
partnerships, accreditations, or pricing.

Real proof supplied by the client is used verbatim. Anything not yet supplied
gets a visibly marked placeholder with correct structure, so real content drops
in without a rebuild.

**No round fake numbers.** Organic values only.

## 10. Ship requirements

- Privacy policy and terms in the footer
- Branded 404 and favicon
- Client-side validation for email format and required fields
- Skip-to-content link
- `<title>`, meta description, `og:image`, social tags
- Alt text on every meaningful image
- Semantic landmarks: `<nav>`, `<main>`, `<section>`, `<footer>`
- No dead links; current nav item indicated

## 11. Build constraints

Static HTML. **No framework, no build step, and no CSS library.**

Tailwind was dropped after the first build: the page is written against the
custom properties above and never meaningfully used its classes, so loading the
CDN meant a render blocking script and an external dependency for nothing. The
type scale and radius values below still come from Tailwind's defaults, as the
skill requires — they are simply expressed in plain CSS.

One `<style>` block per page. Illustrations inline as SVG so the site stays
self contained and fast. Only external request is the Manrope stylesheet.
