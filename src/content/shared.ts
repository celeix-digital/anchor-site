// Copy shared across pages. Taken from anchor39.com, with the product called
// "ANCHOR" everywhere except the logo and the story of the name.

export type Shot = { src: string; width: number; height: number; alt: string }

// TODO: confirm before launch. The live site saves requests to its own database;
// this static site hands the request to the visitor's email app instead.
export const CONTACT_EMAIL = 'hello@anchor39.com'

export const nav = {
  skip: 'Skip to content',
  homeLabel: 'ANCHOR39 home',
  footerHomeLabel: 'ANCHOR home',
  links: [
    { href: '/#how', label: 'How it works' },
    { href: '/shipping-agents', label: 'Shipping agents' },
    { href: '/terminal-agents', label: 'Terminals' },
    { href: '/vision', label: 'Vision' },
    { href: '/services', label: 'Services' },
  ],
  cta: { href: '/book-demo', label: 'Book a demo' },
  menu: 'Menu',
}

// Screenshots are from the ANCHOR app running on synthetic QA data.
export const shots = {
  inbox: {
    src: '/product/inbox.webp',
    width: 1368,
    height: 836,
    alt: 'The ANCHOR shared inbox: folders for vessel, terminal and office mail, and a list of threads each tagged with its vessel, port-call reference and a status such as Action required, Informational or Replied.',
  },
  classification: {
    src: '/product/classification.webp',
    width: 804,
    height: 128,
    alt: 'An email thread in ANCHOR labelled Informational and tagged to MT Avalon Spirit and port call HT-26AUG002, with ETA, ETB, ETD and the current operation, discharging.',
  },
  draft: {
    src: '/product/draft.webp',
    width: 756,
    height: 374,
    alt: 'The ANCHOR reply composer with a Generate menu and a “Help me write” prompt, and Discard and Send buttons that stay with the user.',
  },
  thread: {
    src: '/product/thread.webp',
    width: 804,
    height: 486,
    alt: 'An email thread in ANCHOR for MT Avalon Spirit, port call HT-26AUG002, showing ETA, ETB and ETD above a reply the desk sent, with Reply, Forward and Tag agent buttons.',
  },
  dashboard: {
    src: '/product/dashboard.webp',
    width: 1304,
    height: 492,
    alt: 'The ANCHOR dashboard: counts of active vessels, vessels at port, inbound arrivals and unread emails, and a Critical alerts list of unanswered queries and notices of readiness by vessel.',
  },
  alerts: {
    src: '/product/alerts.webp',
    width: 422,
    height: 379,
    alt: 'The Critical alerts panel on the ANCHOR dashboard, listing unanswered queries and notices of readiness for MV Baltic Sentinel and MT Avalon Spirit with how long each has waited.',
  },
} satisfies Record<string, Shot>

export const status = {
  live: 'Live today',
  design: 'In design',
  future: 'Future direction',
  separate: 'Separate from the software',
}

export const audiences = [
  {
    state: 'live',
    label: status.live,
    title: 'Shipping agents',
    body: 'Shared inbox, email classification, vessel and port-call tracking, AI drafts people send.',
    href: '/shipping-agents',
  },
  {
    state: 'design',
    label: status.design,
    title: 'Terminals',
    body: 'Design intent only. Nothing to sign up for yet.',
    href: '/terminal-agents',
  },
  {
    state: 'separate',
    label: status.separate,
    title: 'Celeix Digital',
    body: 'Discovery and phased modernization planning.',
    href: '/services',
  },
] as const

export const footer = {
  blurb:
    'A shared reference for the agency desk and, in time, the wider port community. AI assists; people keep operational authority.',
  markLink: { href: '/vision#mark', label: 'Why a survey datum? The story of the mark' },
  glyphs: [
    { state: 'ai', label: 'AI-drafted', shape: 'hollow ring' },
    { state: 'human', label: 'Reviewed by a person', shape: 'solid disc' },
    { state: 'attention', label: 'Needs attention', shape: 'open cross' },
  ] as const,
  columns: [
    {
      title: 'Product',
      links: [
        { href: '/shipping-agents', label: 'Shipping agents · Live today' },
        { href: '/terminal-agents', label: 'Terminals · In design' },
        { href: '/vision', label: 'Vision' },
        { href: '/vision#trust-ladder', label: 'Trust ladder' },
      ],
    },
    {
      title: 'Services',
      links: [
        { href: '/services', label: 'Services by Celeix Digital' },
        { href: '/services#zones', label: 'The nine-zone vessel journey' },
        { href: '/book-demo?interest=services', label: 'Talk to us about your operation' },
      ],
    },
    {
      title: 'Get in touch',
      links: [
        { href: '/book-demo', label: 'Book a demo' },
        { href: '/book-demo?interest=webinar', label: 'Webinar interest' },
      ],
    },
  ],
  legal: '© 2026 ANCHOR · Services delivered by Celeix Digital, separate from the software',
  datum: '39°N · DATUM',
  signIn: { href: 'https://app.anchor39.com', label: 'app.anchor39.com', after: 'for platform sign-in' },
}

export const notScreenshot = 'Real screens from the ANCHOR app, running on test data.'
