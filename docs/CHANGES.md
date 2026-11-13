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

## Motion pass (2026-11-12)

- Claude-style transitions: sections fade and rise slightly as they enter, the hero staggers in
  on load, and cards and buttons lift a little on hover. All of it is off under reduced motion.
- A small stock anchor on a chain moves in the right-hand margin (`src/components/AnchorRail.tsx`).
  It hangs low at the top of the page, is hauled up as you scroll, and swings gently while
  moving. Below 1280px it shrinks to a slim rail and the content gets matching right padding.

## Logo and anchor (2026-11-12)

- New ANCHOR39 logo (compass ring with a teal triangle), redrawn as SVG in
  `src/components/Logo.tsx` and used for the favicon (`public/favicon.svg`).
- The hero picture is removed; the hero is headline, intro and buttons only.
- The moving anchor now sits in the left-hand margin and is a little larger.

## Hero visual (2026-11-12)

- The hero now has a product visual on the right, built from real screenshots: the shared
  inbox in an app window, with the AI draft composer overlapping it under a "Needs your review"
  pill, on a soft teal-to-amber panel with a faint compass ring from the logo.

## Sections, teal buttons and naming (2026-11-13)

- Buttons use the logo's teal (`#38b0b8`) with navy text (5.6:1) instead of amber. Amber
  still marks "what your team does".
- "ANCHOR39" now appears only in the nav logo (and the page title/SEO tags). Everywhere else
  the product is "ANCHOR": headings, body copy, footer, demo email subject.
- Every section has a small eyebrow label.
- The problem: a visual of agents, terminals, pilots, surveyors and owners all writing into
  one shared inbox (the example messages are the illustrative ones already in `content.ts`).
- How it works: each lane is a tinted panel with an icon, and steps have filled number badges.
- Live today: each feature has an "AI" or "Your team" tag, and screenshot panels have a soft
  gradient and dot grid. The separate legend was removed.
- Human control: the two statements are cards (white for the AI, navy for your team) with a
  hand-off arrow between them.
- Closing panel: a large, faint compass mark from the logo sits behind the text.

## Full site from anchor39.com (2026-11-13)

All pages and copy from the live anchor39.com, rebuilt in this site's style:

| Route | Page |
|---|---|
| `/` | Home: hero, "follow one email" in five steps, the problem, who it's for, today and tomorrow, the name, how we build, services teaser |
| `/shipping-agents` | Live today: before/after diagram, the four live features, human control, what is not in today's product |
| `/terminal-agents` | In design: concept sketch, design intent with open questions, interest form |
| `/services` | Celeix Digital: four pieces of work, the interactive nine-zone vessel journey, AS-IS to TO-BE, stakeholder matrix, contact form |
| `/vision` | The name and the mark (anatomy, tones), today and tomorrow, the trust ladder, principles |
| `/book-demo` | Request form (`?interest=services`, `terminal`, `webinar` preselect and retitle) |
| `/thank-you` | After the form |

- Content lives in `src/content/` (one file per page plus `shared.ts`); pages in `src/pages/`.
- A small router in `src/router.tsx`; `vercel.json` rewrites page paths to `index.html`.
- Where the live site showed illustrated mockups labelled "not a product screenshot", this site
  shows real ANCHOR screenshots instead. Two new crops: `public/product/thread.webp` (an email
  thread with the vessel and port-call header) and `public/product/dashboard.webp` (vessel counts
  and critical alerts; QA test names in the activity panel are blurred). Diagrams that explain an
  idea (separate threads vs one desk, the terminal concept sketch) stay as labelled diagrams.
- Naming: "ANCHOR" everywhere, except the nav logo, page titles that were ANCHOR39 on the live
  site's home and vision pages, and the story of the name, which explains the "39".
- The form: the live site saves requests to its own database. This static site has no backend,
  so a valid request opens the visitor's email app with the details filled in, addressed to
  `CONTACT_EMAIL` in `src/content/shared.ts` (TODO: confirm before launch). The copy around the
  form says exactly that.
- The old home sections ("AI reads the mail…", "About 57 emails") are replaced by the live copy.
