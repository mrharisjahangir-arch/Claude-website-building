# Design Loop — live progress

**Goal:** a distinctive MindMed character/graphic style + animated section, in the
spirit of Duolingo and Preply, adapted to a professional UK medical-admissions
tutoring company. Target section: a MindMed equivalent of Duolingo's
"learn anytime, anywhere".

**Round:** 2 (built, not yet judged)
**Pieces:** 3 (characters · scattered field & layout · motion)
**Exit condition:** all three critics PASS on all three pieces, or the user stops the run.

---

## Standing constraints

| Constraint | State |
|---|---|
| Visual bar | 4 Duolingo screenshots supplied by client |
| `bar.md` | 7 verified mechanisms + 4 marked `[DERIVED]` |
| `design-system.md` | Extracted from existing code |
| Higgsfield | 3 Recraft `vector` explorations ran. **Output visible to client only** — CDN egress-blocked to this session |
| Craft critic on motion | **Half-blind.** M8–M10 are derived, not measured from the reference |
| Blind A/B vs reference | **Not possible.** Reference images are in chat, not on disk; site is blocked |

---

## Piece status

| Piece | Brief | System | Craft |
|---|---|---|---|
| P1 · Character system | **FAIL** (R1) | not run | not run |
| P2 · Field & layout | **FAIL** (R1) | not run | not run |
| P3 · Motion | not run | not run | not run |

**Run integrity note.** Nine critics were dispatched against round 1. Two
returned before the container restarted; the other seven were killed mid-run and
their verdicts never existed. They are recorded as "not run", not as passes.
Round 2 was rebuilt on the two verdicts that did land, because both were
decisive and independently reached the same conclusion. The full set of nine
still needs to run against round 2 before any piece can be called done.

---

## Gap history

### Round 1 — both returning critics failed

**P1 · Characters — Brief — FAIL**

> The figures have no character — mouthless, expressionless generic flat bodies
> whose only medical signal is a stethoscope pinned on the wrong person, so
> nothing here is ownable by MindMed or recognisable as medical-admissions
> tutoring.

**P2 · Field & layout — Brief — FAIL**

> The section never says medicine — no copy names medical admissions and the
> object field is mostly generic school clip-art (plus an app-implying phone)
> that says nothing about UCAT, interviews or applications, so it reads as any
> tutoring company.

Defects named across both:

*Construction bugs* — detached raised hand with no wrist; hand resting on top of
the clipboard face rather than gripping it; stethoscope terminating in nothing;
background gap between head and shoulders; forearms reading as sticks laid over
the prop; hand clipped by the viewport edge.

*Concept* — no mouths, so no expression, in the one respect where the Duolingo
reference matters most; stethoscope worn by the applicant, who would not wear
one; nothing naming UCAT / MMI / UCAS / medicine anywhere in copy or imagery;
cross-legged floor pose reading as primary-school storytime; two competing CTAs
with the content-free one weighted as primary; an app-shaped phone icon
implying a product that does not exist; responsive degradation deleting the
medical objects and keeping only the mascots.

### Round 2 — changes made in response

| Gap | Change |
|---|---|
| Never says medicine | Eyebrow now `UK MEDICAL SCHOOL ADMISSIONS`; headline now "Prepare for medicine, around everything else."; a service line names UCAT · MMI & interviews · Applications · GCSE & A-Level science |
| Mute, generic objects | Phone, graduation cap, pencil and bar chart cut. New props map to real services: UCAT timed card, MMI stations, personal-statement page, flask, stethoscope |
| Field says nothing | Preply's sticker-label device added — four props now carry a named-service chip, lifted out of the rotating wrapper so they stay horizontal and legible |
| App implication | The phone icon is gone entirely |
| Competing CTAs | Reduced to one primary, "Start Your Journey" |
| Infantilising pose | Both figures rebuilt as bust compositions cropped at the chest — no floor, no desk, adult register |
| No expression | Both figures now have mouths |
| Stethoscope on the applicant | Moved to the tutor, who is a medical student — which is what MindMed's tutors actually are |
| Detached hand / floating stethoscope | Forearm now overlaps its hand; stethoscope earpieces terminate at the head |
| Responsive deletes meaning | The service line survives every breakpoint, so the section cannot end up not saying medicine; `data-keep` now preserves the medical props below the fold |

---

## Next step

Re-dispatch all nine critics against round 2. Nothing here is signed off.
