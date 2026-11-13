// All copy for anchor39.com lives here. Sentence case, typographic quotes.

export const DEMO_URL = 'mailto:hello@anchor39.com?subject=Book%20an%20ANCHOR%20demo'

export const site = {
  name: 'ANCHOR39',
  title: 'ANCHOR39 — AI-native coordination for maritime operations',
  description:
    'AI-native coordination for maritime operations, built around the port call and grounded in human control. Live today for shipping agents.',
}

export const nav = {
  skip: 'Skip to content',
  homeLabel: 'ANCHOR39 home',
  footerHomeLabel: 'ANCHOR home',
  links: [
    { href: '#how', label: 'How it works' },
    { href: '#live', label: 'Live today' },
    { href: '#control', label: 'Human control' },
  ],
  cta: 'Book a demo',
}

export const hero = {
  // Each line may only wrap between its two parts.
  lines: [
    ['AI reads', 'the mail.'],
    ['You run', 'the call.'],
  ] as const,
  sub: 'AI-native coordination for maritime operations, built around the port call and grounded in human control.',
  primary: 'Book a demo',
  secondary: 'See how it works',
}

export const problem = {
  eyebrow: 'The problem',
  // The people named in the body copy, shown writing into one inbox.
  parties: ['Agents', 'Terminals', 'Pilots', 'Surveyors', 'Owners'],
  heading: 'One port call. Eight stages. About 57 emails.', // TODO: confirm before launch
  note: 'Counted on a mapped liquid-bulk vessel call.',
  body: [
    'Agents, terminals, pilots, surveyors and owners all write into the same shared inbox. Each message has to be read, matched to the right vessel and answered while the call keeps moving.',
    'Miss one, and the berth window, the pilot or the cargo plan slips with it.',
  ],
}

export type Side = 'ai' | 'team'

export const how = {
  eyebrow: 'How it works',
  heading: 'How a port call runs on ANCHOR',
  lanes: { ai: 'What the AI does', team: 'What your team does' },
  steps: [
    {
      side: 'ai' as Side,
      title: 'Sorts every email',
      body: 'Each message that lands in the shared inbox is classified and filed to its vessel and port call, whether it’s a notice of readiness, a pilot booking or a surveyor’s ETA.',
    },
    {
      side: 'team' as Side,
      title: 'Follows each call',
      body: 'One live view per port call: the vessel, its timeline and what’s still open, with critical alerts on top.',
    },
    {
      side: 'ai' as Side,
      title: 'Drafts the reply',
      body: 'For routine updates, ANCHOR prepares a reply and leaves it in the thread as a draft.',
    },
    {
      side: 'team' as Side,
      title: 'Reviews and sends',
      body: 'You read the draft, change what you need and send it. Nothing leaves the inbox without a person.',
    },
  ],
}

// Screenshots are from the ANCHOR app running on synthetic QA data.
export const live = {
  eyebrow: 'Live today',
  heading: 'Live today for shipping agents',
  legend: { ai: 'What the AI does', team: 'What your team does' },
  classification: {
    title: 'Email classification',
    caption: 'Every message tagged to its vessel, its port and the stage of the call.',
    image: {
      src: '/product/classification.webp',
      width: 804,
      height: 128,
      alt: 'An email thread in ANCHOR labelled Informational and tagged to MT Avalon Spirit and port call HT-26AUG002, with ETA, ETB, ETD and the current operation, discharging.',
    },
    from: 'Surveyor’s office',
    subject: 'ETA 15:30 for draft survey on arrival',
    time: '08:05',
    tags: [
      { kind: 'vessel', label: 'MT Pacific Envoy' },
      { kind: 'port', label: 'Corpus Christi' },
      { kind: 'stage', label: 'Arrival' },
    ],
  },
  drafts: {
    title: 'AI draft replies',
    caption: 'Drafts wait in the thread until someone on your team reviews and sends them.',
    image: {
      src: '/product/draft.webp',
      width: 756,
      height: 374,
      alt: 'The ANCHOR reply composer with a Generate menu and a “Help me write” prompt, and Discard and Send buttons that stay with the user.',
    },
    status: 'Needs your review',
    label: 'Draft reply',
    body: 'Good morning Captain, berth 7 is confirmed for 14:00 and the pilot boards at 13:15. Please confirm your ETA at the pilot station.',
    edit: 'Edit',
    send: 'Send',
  },
  inbox: {
    title: 'Shared inbox',
    caption: 'The whole desk works from one inbox, with every thread tied to its port call.',
    image: {
      src: '/product/inbox.webp',
      width: 1368,
      height: 836,
      alt: 'The ANCHOR shared inbox: folders for vessel, terminal and office mail, and a list of threads each tagged with its vessel, port-call reference and a status such as Action required, Informational or Replied.',
    },
    header: 'Shared inbox',
    unread: '3 unread',
    threads: [
      { from: 'Master, MT Pacific Envoy', subject: 'NOR tendered, awaiting berth', time: '06:40' },
      { from: 'Terminal operations', subject: 'Berth 7 confirmed for 14:00', time: '07:12' },
      { from: 'Pilot station', subject: 'Boarding moved to 13:15', time: '07:31' },
    ],
  },
  tracking: {
    title: 'Vessel and port-call tracking',
    caption: 'Each vessel’s call from arrival to departure, in one view.',
    image: {
      src: '/product/alerts.webp',
      width: 422,
      height: 379,
      alt: 'The Critical alerts panel on the ANCHOR dashboard, listing unanswered queries and notices of readiness for MV Baltic Sentinel and MT Avalon Spirit with how long each has waited.',
    },
    vessel: 'MT Pacific Envoy',
    location: 'Berth 7',
    stages: [
      { label: 'Arrival', state: 'done' },
      { label: 'Berthing', state: 'current' },
      { label: 'Cargo', state: 'next' },
      { label: 'Departure', state: 'next' },
    ] as const,
    facts: [
      { label: 'ETB', value: '14:00' },
      { label: 'Pilot', value: '13:15' },
    ],
  },
}

export const control = {
  eyebrow: 'Human control',
  aiVerbs: ['Reads', 'Sorts', 'Drafts'],
  teamVerbs: ['Reviews', 'Edits', 'Sends'],
  aiLabel: 'What the AI does',
  teamLabel: 'What your team does',
  ai: 'ANCHOR reads, sorts and drafts.',
  team: 'Your team reviews, edits and sends.',
  // One paragraph, set either side of the chain.
  closing: [
    'Built around the port call and grounded in human control.',
    'A draft stays a draft until someone on your team sends it.',
  ],
}

export const surface = {
  heading: 'Anchor clear. Ready when you are.',
  line: 'ANCHOR is live today for shipping agents.',
  primary: 'Book a demo',
  footer: '© 2026 ANCHOR',
}

