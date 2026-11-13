export const trustLadder = {
  eyebrow: 'The trust ladder',
  heading: 'Trust is earned one step at a time.',
  body: 'A way to think about how much AI is allowed to do. Any step beyond today would require explicit permissions people can revoke, with exceptions escalated to people.',
  steps: [
    { live: true, t: 'Observe', d: 'AI classifies inbox email. People track vessels and port calls and decide what needs attention.' },
    { live: true, t: 'Recommend', d: 'AI drafts replies. Shipping-agent drafts are reviewed and sent by people.' },
    {
      live: false,
      t: 'Bounded autonomy',
      d: 'AI could act on narrow tasks people explicitly permit. Permissions stay revocable; exceptions and commercial decisions go to people.',
    },
    {
      live: false,
      t: 'Broader autonomy',
      d: 'Wider permissions only where people choose to grant them and the evidence supports it. People keep commercial decisions.',
    },
  ],
  note: 'Stages one and two describe how today’s shipping-agent features behave; they are not separate products. Stages three and four are direction only, with no timeframe. Using today’s product does not require adopting any autonomy.',
}

export const vision = {
  meta: {
    title: 'Vision and the name — ANCHOR39',
    description:
      'AI-native coordination for maritime operations. Built around the port call. Grounded in human control. Named for the historic survey datum at Meades Ranch, near the 39th parallel.',
  },
  hero: {
    eyebrow: 'Vision and the name',
    datum: 'Meades Ranch · Near the 39th parallel',
    lines: ['A fixed reference', 'for the port call.'],
    sub: 'AI-native coordination for maritime operations. Built around the port call. Grounded in human control.',
    primary: { href: '#mark', label: 'The story of the mark' },
    secondary: { href: '#today', label: 'Today and tomorrow' },
    coords: '39°N · Meades Ranch, KS',
  },
  // The story of the name keeps "ANCHOR39": the 39 is what it explains.
  name: {
    eyebrow: 'Why ANCHOR39',
    heading: 'Named for a point the continent was measured from.',
    body: [
      'ANCHOR39 takes inspiration from the historic survey datum at Meades Ranch, Kansas, near the 39th parallel. It served as a fixed reference used to connect measurements across North America.',
      'That is the idea behind the name: a trusted reference people can coordinate around. The mark is a survey station marker, redrawn.',
    ],
  },
  anatomy: {
    eyebrow: 'Anatomy of the mark',
    parts: [
      { k: 'ring', t: 'Ring', d: 'The survey station. A fixed place everything is measured from.' },
      { k: 'ticks', t: 'Crosshair', d: 'Alignment. Four ticks that point outward, to everyone working from the same reference.' },
      { k: 'tri', t: 'Triangle', d: 'Triangulation. Positions confirmed by relating several points to one another.' },
      { k: 'dot', t: 'Center point', d: 'The reference itself. The one point people can coordinate around.' },
    ] as const,
    tones: ['App icon', 'On page', 'One colour'],
    tonesNote: 'The mark is the brand. The small rings, discs and crosses in the product show state, and are a separate family.',
    focus: 'Our name draws on surveying history. Our focus is the people coordinating maritime operations today.',
    source: {
      href: 'https://www.ngs.noaa.gov/PUBS_LIB/NAD1983_Map_data_conversion_tables_1875_A.pdf',
      label: 'Historical reference: the North American Datum (NOAA / USGS)',
    },
  },
  today: {
    eyebrow: 'Today and tomorrow',
    heading: 'What is live, and where we are going.',
    live: {
      label: 'Live today',
      title: 'For shipping agents',
      items: ['Shared inbox', 'Email classification', 'Vessel and port-call tracking', 'AI draft replies, reviewed and sent by people'],
    },
    design: {
      label: 'In design',
      title: 'Terminals',
      body: 'A shared view of the vessel visit for terminals and shipping agents.',
      link: { href: '/terminal-agents', label: 'See the design intent.' },
    },
    future: {
      label: 'Future direction',
      title: 'Connected coordination',
      body: 'We are building toward coordination across agents, terminals, ports and maritime service providers, with AI acting within permissions people define and escalating exceptions to people. No timeframe is implied.',
    },
  },
  principles: {
    eyebrow: 'Principles · Future direction',
    heading: 'How we intend to grow.',
    body: 'These describe intent for future work. They are not features available today.',
    items: [
      { t: 'People stay in control', d: 'Commercial and operational judgement stays with people.' },
      { t: 'Permissions are explicit', d: 'AI does only what people have chosen to allow.' },
      { t: 'Exceptions go to people', d: 'When something does not fit, it is escalated, not guessed.' },
      { t: 'Alongside, not instead', d: 'Coordination that works with the systems operations already use.' },
    ],
  },
  terminals: { lead: 'Curious about terminals?', link: { href: '/terminal-agents', label: 'See what is in design.' } },
  cta: {
    heading: ['Start with what’s live.'],
    body: 'See the shared inbox, classification, tracking and drafts on a call like yours.',
    primary: { href: '/book-demo', label: 'Book a demo' },
    secondary: { href: '/shipping-agents', label: 'For shipping agents' },
  },
}
