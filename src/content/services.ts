export const zones = [
  {
    t: 'Ocean',
    s: 'Pre-arrival & notices',
    d: 'Arrival notices, ETAs and documents are exchanged before the vessel is near port, often in different formats.',
    r: ['Shipping agents', 'Masters & vessel operators', 'Port & harbor operations'],
  },
  {
    t: 'Anchorage',
    s: 'Waiting & readiness',
    d: 'The vessel waits while berth and terminal readiness are confirmed, usually by phone and email.',
    r: ['Port & harbor operations', 'Terminals & berth planners', 'Shipping agents'],
  },
  {
    t: 'Pilot boarding',
    s: 'Inbound movement',
    d: 'Boarding times are ordered and adjusted as readiness and conditions change.',
    r: ['Pilots', 'Shipping agents', 'Masters & vessel operators'],
  },
  {
    t: 'Tug assist',
    s: 'Escorted transit',
    d: 'Tug timing follows the same schedule as pilots, and drifts when that schedule moves.',
    r: ['Tugs', 'Pilots', 'Port & harbor operations'],
  },
  {
    t: 'Line handling',
    s: 'Mooring',
    d: 'Line handlers make the vessel fast; arrival and all-fast times are often recorded by hand.',
    r: ['Line handlers', 'Terminals & berth planners', 'Shipping agents'],
  },
  {
    t: 'Dock operations',
    s: 'Alongside',
    d: 'Cargo work, inspections and services run alongside, with readiness and volumes feeding later charges.',
    r: ['Terminals & berth planners', 'Cargo interests', 'Shipping agents', 'Finance'],
  },
  {
    t: 'Shifting',
    s: 'Moves within port',
    d: 'A berth change repeats much of the movement coordination, with the same parties re-notified.',
    r: ['Port & harbor operations', 'Pilots', 'Tugs', 'Line handlers'],
  },
  {
    t: 'Ready to depart',
    s: 'Sailing preparation',
    d: 'Clearances, final figures and outbound orders come together before the vessel can sail.',
    r: ['Shipping agents', 'Masters & vessel operators', 'Terminals & berth planners'],
  },
  {
    t: 'Channel exit & trip closure',
    s: 'Outbound & close-out',
    d: 'The vessel clears the channel, and times and services are reconciled for billing and records.',
    r: ['Port & harbor operations', 'Finance', 'Shipping agents'],
  },
]

export const zoneGroups = [
  { label: 'Offshore', from: 0, to: 1 },
  { label: 'Inbound approach', from: 2, to: 4 },
  { label: 'Alongside', from: 5, to: 6 },
  { label: 'Outbound', from: 7, to: 8 },
]

export const services = {
  meta: {
    title: 'Professional services by Celeix Digital — ANCHOR',
    description:
      'Celeix Digital helps ports, terminals and operators understand their current coordination and plan modernization in phases. Consulting work, distinct from the ANCHOR product.',
  },
  hero: {
    eyebrow: 'Services by Celeix Digital',
    badge: 'Separate from the software',
    lines: ['Start with how the', 'operation really runs.'],
    sub: 'Celeix Digital helps ports, terminals and operators understand their current coordination and plan modernization in phases. This is consulting work, distinct from the ANCHOR product.',
    primary: { href: '#contact', label: 'Talk to us about your operation' },
    secondary: { href: '#zones', label: 'Walk the nine zones' },
  },
  work: {
    eyebrow: 'What we do',
    heading: 'Four pieces of work. One plan you can measure.',
    body: 'Consulting engagements. You do not need to use the ANCHOR software to work with Celeix Digital.',
    colWork: 'Work',
    colOutput: 'What it produces',
    items: [
      {
        title: 'AS-IS discovery',
        body: 'Document how coordination happens today, in the words of the people doing it.',
        output: 'Interviews, sample messages and forms, walked call by call',
      },
      {
        title: 'Stakeholder & handoff mapping',
        body: 'Trace where information passes between parties, and where it gets re-entered or lost.',
        output: 'A map of who hands what to whom, zone by zone',
      },
      {
        title: 'Data & integration assessment',
        body: 'Understand the systems already in place and how coordination can work alongside them.',
        output: 'An inventory of systems, owners and the facts they hold',
      },
      {
        title: 'Phased modernization planning',
        body: 'Implementation phases, each tied to acceptance criteria agreed up front.',
        output: 'A phased plan with criteria you can test against',
      },
    ],
  },
  journey: {
    eyebrow: 'The vessel journey · Nine zones',
    heading: 'We walk the visit, zone by zone.',
    body: 'From the first notice offshore to trip closure, each zone has its own people, handoffs and records. We use these zones to structure discovery.',
    tag: 'Discovery framework',
    tagNote: 'A way to walk one vessel visit with the people involved. Not nine product modules; real calls vary by port.',
    people: 'People involved',
    zoneOf: (n: number) => `Zone ${String(n).padStart(2, '0')} of 09`,
    keys: 'Use arrow keys on the chart to move between zones.',
    note: 'Email and document workflows may group these stages differently, and not every call passes through every zone in this order. Shifting, for example, depends on the call.',
    quay: 'Quay',
  },
  path: {
    eyebrow: 'From AS-IS to TO-BE',
    heading: 'Understand today before designing tomorrow.',
    steps: [
      { tag: 'AS-IS', title: 'Document the present', body: 'How work happens today, with the evidence behind it: messages, forms, calls and spreadsheets.' },
      { tag: 'Gaps', title: 'Find handoff gaps and dependencies', body: 'Where information passes between parties, waits, gets re-entered, or depends on someone else being ready.' },
      { tag: 'TO-BE', title: 'Design future coordination', body: 'How the call could be coordinated alongside the systems already in place, not instead of them.' },
      { tag: 'Phases', title: 'Phase delivery', body: 'Each phase tied to measurable acceptance criteria agreed up front.' },
    ],
    note: 'What we aim for: fewer re-typed facts, clearer readiness, and handoffs everyone can see. These are goals for an engagement, not results we claim in advance.',
  },
  find: {
    eyebrow: 'What we tend to find',
    heading: 'The same fact, typed in four places.',
    body: 'Common patterns, not promised outcomes. Every engagement starts from your operation.',
    items: [
      'The same information re-entered by different teams',
      'Readiness and schedule updates scattered across channels',
      'Manual handoffs between separate parties',
      'Reconciliation that gets harder downstream',
    ],
  },
  people: {
    eyebrow: 'Who we talk to',
    heading: 'The people each zone depends on.',
    groups: [
      'Port & harbor operations',
      'Shipping agents',
      'Masters & vessel operators',
      'Terminals & berth planners',
      'Pilots, tugs & line handlers',
      'Cargo interests',
      'Finance',
    ],
    rows: [
      'Shipping agents',
      'Masters & vessel operators',
      'Port & harbor operations',
      'Terminals & berth planners',
      'Pilots',
      'Tugs',
      'Line handlers',
      'Cargo interests',
      'Finance',
    ],
    caption:
      'Example touchpoints for discovery, not an exhaustive responsibility map. Involvement varies by port. Scroll horizontally on smaller screens.',
    stakeholder: 'Stakeholder',
    dot: 'Example touchpoint',
    none: 'Not highlighted in this example',
    note: 'These are the people the port call depends on. They are part of the discovery work; they are not all users of the ANCHOR platform today. We plan coordination alongside existing systems, including terminal operating systems, not in place of them.',
  },
  contact: {
    eyebrow: 'Talk to us about your operation',
    heading: 'Start with one conversation.',
    body: 'Tell us about your port or terminal, and the team follows up from your request.',
  },
}
