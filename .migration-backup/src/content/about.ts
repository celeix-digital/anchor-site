export const trustLadder = {
  heading: 'Trust is earned one step at a time.',
  body: 'A way to think about how much AI is allowed to do. Any step beyond today would need explicit permissions that people can revoke, with exceptions escalated to people.',
  now: 'Available now',
  later: 'Future direction',
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
}

export const about = {
  meta: {
    title: 'About ANCHOR39 | Vision and the name',
    description:
      'AI-native coordination for maritime operations. Built around the port call. Grounded in human control. Named for the historic survey datum at Meades Ranch, near the 39th parallel.',
  },
  hero: {
    lines: ['A fixed reference', 'for the port call.'],
    sub: 'AI-native coordination for maritime operations. Built around the port call. Grounded in human control.',
    primary: { href: '/book-demo', label: 'Book a demo' },
    secondary: { href: '#trust-ladder', label: 'The trust ladder' },
    coords: '39°N · Meades Ranch, KS',
  },
  // The story of the name keeps "ANCHOR39": the 39 is what it explains.
  name: {
    heading: 'Why ANCHOR39',
    body: 'The name comes from the historic survey datum at Meades Ranch, Kansas, near the 39th parallel: the fixed point that measurements across North America were tied to. We want ANCHOR to be that kind of reference for the port call.',
    source: {
      href: 'https://www.ngs.noaa.gov/PUBS_LIB/NAD1983_Map_data_conversion_tables_1875_A.pdf',
      label: 'The North American Datum (NOAA)',
    },
  },
  build: {
    heading: 'How we build',
    items: [
      { t: 'People decide what goes out', d: 'AI drafts replies and a person reviews and sends them. Nothing leaves the desk on its own.' },
      { t: 'Built around the port call', d: 'The call is the unit of work, not the mailbox. Mail, vessel details and status sit together.' },
      { t: 'Alongside existing systems', d: 'ANCHOR sits next to the tools operations already rely on. There is nothing to rip out first.' },
      { t: 'Exceptions go to people', d: 'When something does not fit, it is escalated, not guessed. Commercial judgement stays with people.' },
    ],
  },
  cta: {
    heading: ['Start with the shipping desk.'],
    body: 'See the shared inbox, classification, tracking and drafts on a call like yours.',
    primary: { href: '/book-demo', label: 'Book a demo' },
    secondary: { href: '/shipping-agents', label: 'For shipping agents' },
  },
}
