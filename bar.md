# bar.md — the standard we are judged against

Source: 4 screenshots of duolingo.com supplied by the client (2026-08-27) —
the "learn anytime, anywhere" section, the sign-up hero character cluster,
the lab-characters illustration, and the running-character illustration.
Secondary: the Preply + Duolingo `design.md` teardowns supplied in chat.

Each line below is checkable by looking at a render. Adjectives are not
allowed here. Where a line could not be verified from the reference, it is
marked **[DERIVED]** and must never be reported as a checked comparison.

> **Correction to the supplied design.md:** it states Duolingo uses "bold black
> outlines." The screenshots show **no outlines on any character or object**.
> The written spec is wrong. These mechanisms follow the screenshots.

---

## M1 — Flat shapes, exactly two tones per form, zero outlines

Every character and object is built from solid fills. Each form carries its
base colour plus **one** darker tone for the shadow side. No gradients, no
strokes, no outlines, no more than two tones on a single form.

**Check:** sample any limb, torso, or phone body. If it has a stroke, or a
gradient, or three or more tones, it fails.

## M2 — Characters are chunky, limbs are capsules, faces are near-empty

Proportions are exaggerated: no necks, oversized rounded limbs that read as
capsules, heads roughly one third of body height. Facial detail is minimal —
small eyes, often no visible nose or mouth at all. Detail lives in silhouette
and pose, not in the face.

**Check:** cover the character's body and look only at the head. If the face
carries fine detail (eyebrows, nostrils, defined lips, teeth), it fails.

## M3 — Every character is doing something to a prop

Not one figure in the reference stands neutral. They kneel at a microscope,
hold a flask, run across scattered phones, sit on a tablet. The prop is what
makes the character read as *learning* rather than decoration.

**Check:** name the object each character is touching or using. If a character
touches nothing, it fails.

## M4 — Scattered field: the centre stays empty, the margins carry the objects

In "learn anytime, anywhere" the headline and buttons sit in a clear centre
column. Objects populate the **outer margins only** and never overlap the text.
Density rises toward the frame edges.

**Check:** draw the centre third of the frame. If any object intrudes into it,
or if the outer thirds are empty, it fails.

## M5 — Rotation and scale both vary widely, and vary independently

Scattered objects sit at rotations spanning roughly −45° to +45°, with no two
adjacent objects at the same angle. Scale varies by at least 2× between the
smallest and largest object, and small objects are not simply distant copies —
scale and rotation are uncorrelated.

**Check:** measure the angle and size of any six objects. If angles cluster
within ~15° of each other, or all objects are within 1.5× the same size, it fails.

## M6 — One flat background colour per section, and it is not white

The "learn anytime, anywhere" frame sits on a single unmodulated pale blue.
No gradient, no texture, no vignette. The illustration carries all the colour
energy; the ground stays silent.

**Check:** sample the background at four corners and the centre. If the values
differ, it fails.

## M7 — Headline is the only large type, and it is heavily weighted and tightly set

The section headline is the single largest element, set in a rounded heavy
weight, two lines, centred, with line-height at or below 1.2 and slightly
negative tracking. Nothing else on the frame competes with it for size.

**Check:** measure the headline against the next largest text. If the ratio is
under 2.5×, or line-height exceeds 1.2, it fails.

---

## Motion mechanisms — [DERIVED], not verified

No video, GIF, or timing data was supplied. These are principled derivations
from the static evidence and from the reference brand's known character. The
craft critic must state plainly that motion was judged against derivation, not
against the real reference.

## M8 — [DERIVED] Objects drift continuously; nothing sits perfectly still

Scattered objects read as suspended, so they carry a slow, continuous,
non-looping-feeling drift — small translation plus small rotation. Amplitude
stays under ~12px and under ~4° so the field never reads as jittery.

**Check:** record 6 seconds. If any object is pixel-static the whole time, or if
any object moves more than ~12px from its origin, it fails.

## M9 — [DERIVED] Every object has its own period; nothing is in lockstep

Drift periods differ per object (roughly 3–7s) and are deliberately
non-harmonic, so the field never visibly pulses as one unit.

**Check:** take a filmstrip. If two or more objects reach their extremes on the
same frame repeatedly, it fails.

## M10 — [DERIVED] Entrances overshoot and settle; nothing eases linearly

Elements arriving on scroll overshoot their resting position slightly and
settle back, over 400–700ms. No entrance is linear, and none is shorter than
400ms.

**Check:** step the entrance frame by frame. If the element stops dead at its
final position with no overshoot, or completes in under 400ms, it fails.

## M11 — Motion respects `prefers-reduced-motion`

With reduced motion requested, all drift and entrance animation stops and every
element renders at its resting position. The composition must still read as
complete and intentional when fully static.

**Check:** set the media query and screenshot. If anything is mid-transit,
invisible, or misplaced, it fails.

---

## Brand constraint that overrides the reference

MindMed is a UK medical-admissions company selling to parents as well as
students. The reference's saturation (`#58CC02`, `#FF7AAC`) belongs to a
consumer language app and would read as unserious here.

**The rule:** adopt the reference's *construction* — flat two-tone forms,
chunky capsule limbs, prop interaction, scattered field, varied rotation — and
reject its *saturation*. Characters are built from the MindMed palette
(`#16213E`, `#5B7EBD`, `#3E5D97`, `#8CA6D6`, `#A78FC0`, `#C4B3D8`, `#F3F5FA`).

**Check:** sample every fill in the illustration. Any colour outside the
MindMed palette fails. If a parent would not trust the section with their
child's medical-school application, it fails regardless of what else passes.
