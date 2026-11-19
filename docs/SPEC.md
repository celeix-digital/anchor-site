# Build the new animated anchor39.com

Rebuild the anchor39.com marketing site as a fully animated, scroll-driven page.

Before you start, save this brief verbatim to `docs/SPEC.md` so we can return to it in later sessions. Work on a new branch called `animated-site`. Don't push or deploy; I'll review locally first.

## 1. Product context
- ANCHOR39 is AI-native coordination for maritime operations, built around the port call and grounded in human control.
- Live today for shipping agents: shared inbox, email classification, vessel and port-call tracking, and AI draft replies that people review and send.
- Tagline: "AI reads the mail. You run the call."
- Audience: shipping agents and port-agency operations teams. Voice: plain, confident, operational. Sentence case. Typographic apostrophes and quotes. No hype.
- Brand navy: #0B2A4A.
- Don't invent features, customers or numbers beyond this brief.

## 2. Stack
- If this folder already contains the anchor39.com site, read it first (package.json, routes, components, deploy config) and build inside that stack. Keep the existing `#how` link working, leave other pages alone, and reuse the existing logo if there is one.
- If the folder is empty, scaffold Vite + React + TypeScript + Tailwind CSS.
- `npm run build` must produce a static site deployable to Vercel.
- Self-host fonts with Fontsource: `@fontsource/big-shoulders-display` and `@fontsource/hanken-grotesk`.
- The ocean is one raw WebGL fragment shader plus one Canvas 2D layer, run by a single requestAnimationFrame loop inside an imperative engine that a React component mounts once. Never pass per-frame values through React state. No three.js, GSAP or smooth-scroll libraries: keep native scrolling and smooth only the scene's values.

## 3. The core experience
A live ocean is fixed behind the whole page. At the top, an anchor rests on the seabed. Scrolling hauls it up through the water until it breaks the surface in the last section.

Drive everything from scroll progress p = scrollY / (scrollHeight − innerHeight), smoothed exponentially (time constant about 0.15 s) so the anchor feels heavy. No per-section triggers.

1. Holding (p = 0, the hero). The anchor lies tilted about 40° on the seabed, crown on the sand, one fluke buried under a small sand mound. The chain lies slack, then sweeps up off the top-right of the screen. A soft shaft of light falls on the anchor. Kelp sways; two vents release bubbles. Hero copy sits on the left and the anchor sits bottom-centre, so they never overlap.
2. Heaving in (the first ~22% of a viewport of scroll). The chain draws tight to vertical and the anchor pivots on its crown until upright. As the fluke pulls free, a puff of sand billows up.
3. Aweigh (most of the page). The anchor hangs from its ring and rises steadily with p, with a slow pendulum sway and slight bob. The seabed sinks away (parallax). Bubbles stream off the anchor while it moves. Particles and creatures drift down the screen as you rise, at different rates per depth layer. The water lightens from abyss to shallows.
4. Breaking the surface (the final viewport of scroll). An animated waterline descends from the top to about 30% of viewport height (24% on mobile). Above it: a dawn sky and a distant port skyline with ship-to-shore cranes, container stacks, a ship at berth, blinking red crane lights and a few gulls. The anchor finishes with ring and stock above the water and flukes below. The part above water is lit warm by the sunrise; the part below stays blue. Add a foam ring where the shank pierces the surface, and drips falling off the stock into small ripples.

Draw the anchor and chain procedurally. Anchor: a classic stock anchor (ring, stock with ball ends, collar, tapered shank, curved arms, arrowhead flukes, crown) with metal gradients that brighten as it rises and a faint rim light from above. Chain: alternating face-on and edge-on links laid along a Bézier from above the screen to the ring; while heaving in, the curve eases from a slack J to straight.

Placement: at 900 px and wider, the anchor and chain run down the centre of the viewport and the anchor is about 31% of viewport height. Below 900 px, it moves to a rail at the right edge (about 14% of viewport height) and content gets matching right padding.

## 4. The ocean
WebGL shader, rendered at 0.5–0.75× CSS resolution and scaled up:
- A vertical gradient that shifts with p (bottom to top): abyss #020B17 to #0B2A4A, mid-water #04182D to #0E4A72, shallows #08385A to #187A9C.
- A moving caustic network (two layers of animated, domain-warped Voronoi edges), stronger near the top and in shallow water.
- Slow god rays from above that strengthen as p rises, and a focused shaft on the resting anchor that fades once it lifts.
- A glow just under the waterline in the final phase, a soft vignette, and dithering to prevent banding.
- Write the shader yourself; don't copy Shadertoy code.

Canvas 2D draw order, back to front: far particles; far creatures; seabed back layer (ridge, coral fans, rocks, pre-rendered offscreen) and back kelp; mid particles and creatures; sky and port (pre-rendered, clipped above the wave line); chain and anchor; seabed front (pre-rendered sand strip), anchor shadow and front kelp; sand puffs, bubbles and near creatures (clipped below the wave line); the surface highlight band.

Sea life is procedural, in three parallax layers (far: small, faint, slow; near: large, crisp, passing in front of the anchor). Each type fades in and out with depth:
- Deep (p 0–0.4): lanternfish with glowing photophores, bioluminescent specks, and jellyfish with pulsing translucent bells and trailing tentacles that rise in pulses.
- Mid-water (p 0.2–0.85): schools of silver fish that move as a group with individual wiggle and occasional glints, and now and then a whale silhouette crossing slowly in the far layer.
- Shallows (p 0.5–1): reef fish in gold, coral and sea green, some striped, with dorsal fins.
- Throughout: marine snow, wobbling bubbles that pop at the surface, and kelp swaying with a wave that travels up each stalk.
Fish are Bézier bodies with a dark-back-to-light-belly gradient, an eye and a flexing tail. Avoid recognisable cartoon fish (no orange-and-white clownfish, no blue tang).

## 5. Layout and content
The chain is the page's spine. Left of it is what the AI does (teal #63C7DB); right of it is what your team does (amber #F2A541). Amber also marks actions such as primary buttons. Text colours: foam #EEF7F9, body #BCD5DF, muted #8EB1C1. Headlines in Big Shoulders Display 800 with tight leading; everything else in Hanken Grotesk 400/500/600. No all-caps labels, no small labels above headings, no arrows on buttons, no emoji.

Put all copy in `src/content.ts`. Put the demo link in a single `DEMO_URL` constant, for now `mailto:hello@anchor39.com?subject=Book%20an%20ANCHOR39%20demo`. Add a `TODO: confirm before launch` comment on the 57-emails line.

Nav: fixed, transparent at the top and frosted navy once scrolled. Anchor glyph plus ANCHOR39 wordmark; links How it works (#how), Live today (#live), Human control (#control); a Book a demo button.

1. Hero (#top)
   - H1 on two lines: "AI reads the mail." / "You run the call." If a line must wrap, break only between "AI reads" / "the mail" and "You run" / "the call".
   - Sub: "AI-native coordination for maritime operations, built around the port call and grounded in human control."
   - Buttons: Book a demo; See how it works.
   - Bottom-left cue: "Scroll to weigh anchor".
2. Problem
   - H2: "One port call. Eight stages. About 57 emails."
   - Note: "Counted on a mapped liquid-bulk vessel call."
   - Body: "Agents, terminals, pilots, surveyors and owners all write into the same shared inbox. Each message has to be read, matched to the right vessel and answered while the call keeps moving." Then: "Miss one, and the berth window, the pilot or the cargo plan slips with it."
3. How it works (#how)
   - H2: "How a port call runs on ANCHOR39". Lane labels: "What the AI does" (left) and "What your team does" (right).
   - Four numbered steps alternating sides, each with a short leader line to a ring marker on the chain:
     1. AI, "Sorts every email": Each message that lands in the shared inbox is classified and filed to its vessel and port call, whether it’s a notice of readiness, a pilot booking or a surveyor’s ETA.
     2. Team, "Follows each call": One live view per port call: the vessel, its timeline and what’s still open, with critical alerts on top.
     3. AI, "Drafts the reply": For routine updates, ANCHOR39 prepares a reply and leaves it in the thread as a draft.
     4. Team, "Reviews and sends": You read the draft, change what you need and send it. Nothing leaves the inbox without a person.
4. Live today (#live)
   - H2: "Live today for shipping agents". Four features, each a small, realistic HTML/CSS product mockup (aria-hidden) with a heading and caption. AI features stacked on the left, team features on the right, offset lower.
   - Email classification (AI): an email from Surveyor’s office, "ETA 15:30 for draft survey on arrival", tagged MT Pacific Envoy, Corpus Christi, Arrival. Caption: "Every message tagged to its vessel, its port and the stage of the call."
   - AI draft replies (AI): "Good morning Captain, berth 7 is confirmed for 14:00 and the pilot boards at 13:15. Please confirm your ETA at the pilot station." marked "Needs your review", with Edit and Send. Caption: "Drafts wait in the thread until someone on your team reviews and sends them."
   - Shared inbox (team): three unread threads: Master, MT Pacific Envoy, "NOR tendered, awaiting berth", 06:40; Terminal operations, "Berth 7 confirmed for 14:00", 07:12; Pilot station, "Boarding moved to 13:15", 07:31. Caption: "The whole desk works from one inbox, with every thread tied to its port call."
   - Vessel and port-call tracking (team): MT Pacific Envoy at Berth 7; stages Arrival (done), Berthing (current), Cargo, Departure; ETB 14:00, pilot 13:15. Caption: "Each vessel’s call from arrival to departure, in one view."
5. Human control (#control)
   - Left: "ANCHOR39 reads, sorts and drafts." Right: "Your team reviews, edits and sends."
   - Then: "Built around the port call and grounded in human control. A draft stays a draft until someone on your team sends it."
6. Surface (#surface), exactly one viewport tall and the last section
   - H2: "Anchor clear. Ready when you are." Line: "ANCHOR39 is live today for shipping agents."
   - Buttons: Book a demo; Back to the seabed (scrolls to the top so you watch the anchor sink).
   - The CTA sits in the lower half, below where the anchor ends up. Footer: © 2026 ANCHOR39.

Give sections generous vertical space; the whole page should be about 6–7 viewports tall so the ascent has room.

Depth gauge (1100 px and wider, fixed on the left edge, aria-hidden): a thin tick scale with a marker showing the anchor's depth from 39 m to 0 m, and the real anchor-handling calls in order: Anchor holding, Heaving in, Up and down, Anchor aweigh, Anchor sighted, Anchor clear.

Load moment: the scene fades up from black over about 1.5 s while the hero lines rise in, staggered. That's the only entrance animation; don't fade in each section on scroll.

## 6. Quality bar
- 60 fps on a mid-range laptop. Cap canvas DPR around 1.75, pre-render static layers, batch particle draws, avoid allocations in hot loops, and pause when the tab is hidden. Add adaptive quality: if frames run slow for a few seconds, lower resolution and creature counts.
- If WebGL is unavailable, fall back to a CSS gradient and keep the 2D layer. With prefers-reduced-motion, drop ambient motion and the load animation, but keep the anchor following scroll.
- Accessibility: semantic headings, a skip link, a visible amber focus outline, aria-hidden canvases, text contrast of at least 4.5:1 over the brightest water it sits on (use soft text shadows), and touch targets of at least 44 px.
- Responsive from 360 px to 2560 px with no horizontal scroll. Respect iOS safe areas. Size the fixed scene with 100lvh so it doesn't jump when the mobile address bar moves. Recompute scroll metrics on resize, after fonts load and when content size changes.
- SEO: title "ANCHOR39 — AI-native coordination for maritime operations", meta description, Open Graph and Twitter tags, theme-color #0B2A4A.

## 7. How to work
- Phase 1: set up (or inspect the existing site), create content.ts, and build every section with final layout and styles, without the scene.
- Phase 2: the scene engine: shader water, anchor and chain through all four phases, seabed, surface and port. Then stop so I can review it in the browser.
- Phase 3: sea life, bubbles, sand puffs, drips, gulls, depth gauge and the load moment.
- Phase 4: responsive, reduced motion, fallbacks, performance and accessibility.

After each phase, run the dev server and check your work with Playwright screenshots (add it as a dev dependency if needed) at p = 0, 0.03, 0.25, 0.5, 0.75, 0.95 and 1, on desktop (1440×900) and mobile (390×844). Look at the screenshots and fix what's off before you report back. Finish with `npm run build` passing, a Lighthouse check if Chrome is available, and a short list of anything I still need to do.
