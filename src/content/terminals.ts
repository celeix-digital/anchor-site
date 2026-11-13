export const terminals = {
  meta: {
    title: 'Terminals, in design — ANCHOR',
    description:
      'We are designing a shared view of each vessel visit for terminals and shipping agents, alongside the systems terminals already run. ANCHOR is live today for shipping agents only.',
  },
  hero: {
    eyebrow: 'Terminals',
    badge: 'In design · Not live',
    lines: ['A shared view of', 'the vessel visit.'],
    sub: 'We are designing a shared view of each vessel visit for terminals and shipping agents, alongside the systems terminals already run. ANCHOR is live today for shipping agents only.',
    primary: { href: '#shape', label: 'Help shape it' },
    notice:
      'Terminal coordination is in design and not available yet. Everything on this page describes design intent; what is live today is for shipping agents.',
  },
  idea: {
    eyebrow: 'The idea',
    heading: 'Many shipping agents. One visit. One record.',
    body: 'Today each shipping agent sends their numbers in their own thread. The direction we are exploring: shipping-agent updates feeding a shared view of the visit, with differences surfaced for a person to settle.',
    sketch: {
      label: 'Concept · In design',
      tag: 'Sketch',
      agents: ['Shipping agent A', 'Shipping agent B', 'Shipping agent C', 'Shipping agent D'],
      record: 'Visit record',
      visit: 'Vessel visit · concept',
      rows: [
        { label: 'Berth window', value: 'confirmed', state: 'ok' },
        { label: 'Cargo figures', value: 'proposed', state: 'pending' },
        { label: 'Arrival time', value: '2 sources', state: 'conflict' },
      ],
      sources: ['A · 06:30', 'C · 08:00'],
      settle: 'Both kept. A person settles it.',
      note: 'Concept sketch for discussion, not a shipped interface or product screenshot.',
    },
  },
  intent: {
    eyebrow: 'Design intent · In design',
    heading: 'What we intend, and what we need to ask you.',
    body: 'Each intent comes with an open question. The answers come from terminals, not from us.',
    colIntent: 'Intent',
    colQuestion: 'Open question for terminals',
    rows: [
      {
        title: 'One visit, many shipping agents',
        body: 'A shared view of a vessel visit that several shipping agents contribute to, instead of a separate thread for each.',
        question: 'Which agent updates do you need before you confirm a berth window?',
      },
      {
        title: 'Facts from what arrives',
        body: 'Arrival times, figures and requests drawn from inbound messages and placed against the visit.',
        question: 'Which figures do you re-type today, and where do they end up?',
      },
      {
        title: 'Conflicts shown, not overwritten',
        body: 'When two sources disagree, both values are surfaced for a person to settle. Nothing is silently replaced.',
        question: 'Who settles a disagreement today, and how do they find out about it?',
      },
      {
        title: 'People decide, alongside your TOS',
        body: 'Commercial decisions stay with people, and coordination sits next to your terminal operating system, not in place of it.',
        question: 'What must never leave your terminal operating system?',
      },
    ],
  },
  shape: {
    eyebrow: 'Shape it with us',
    heading: 'Tell us how your terminal works.',
    body: 'This records your interest in shaping terminal coordination. There is nothing to sign up for yet.',
  },
}
