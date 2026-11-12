# Changes after team review (2026-11-12)

Team feedback on the animated version (tag `animated-v1`):

- Heavy animation and floating graphics hurt readability and enterprise appeal.
- Use the Claude website's content-first layout as the reference.
- Show real product images instead of abstract graphics.

What changed on branch `content-first`:

- Light, content-first layout (warm off-white, navy text, amber actions). Brand fonts and the
  teal (AI) / amber (your team) distinction are kept.
- The scroll-driven ocean scene, depth gauge, sea life and load animation are removed. The hero
  keeps one still image: a frame rendered from the old scene (`public/hero-port.webp`).
- "Live today" uses real ANCHOR app screenshots in `public/product/`, cropped from QA runs on
  synthetic data. QA-only UI (the "QA Admin" user, test threads, errors) was cropped out and the
  email signature in `draft.webp` is blurred.
- Copy that only made sense with the animation was dropped: "Scroll to weigh anchor" and
  "Back to the seabed".
- The animated version is preserved at tag `animated-v1`.
