// Copy shared across pages. Taken from anchor39.com, with the product called
// "ANCHOR" everywhere except the logo and the story of the name.

export type Shot = { src: string; mobile?: string; width: number; height: number; alt: string }

// Where demo and services requests go. The site is static, so the form opens the
// visitor's email app with the request filled in, addressed here.
export const CONTACT_EMAIL = 'anchor39@celeix.digital'

export const nav = {
  skip: 'Skip to content',
  homeLabel: 'ANCHOR39 home',
  footerHomeLabel: 'ANCHOR home',
  links: [
    { href: '/how-it-works', label: 'How it works' },
    { href: '/shipping-agents', label: 'Shipping agents' },
    { href: '/terminal-agents', label: 'Terminals' },
    { href: '/services', label: 'Services' },
    { href: '/about', label: 'About' },
  ],
  cta: { href: '/book-demo', label: 'Book a demo' },
  menu: 'Menu',
}

/*
 * Full-app screens from the ANCHOR app running on sample data, built by
 * scripts/compose-shots.mjs. Each has a desktop image and a tighter crop for phones.
 */
const app = (name: string, alt: string): Shot => ({ src: `/product/${name}.webp`, mobile: `/product/${name}-m.webp`, width: 1608, height: 900, alt })

export const shots = {
  dashboard: app(
    'app-dashboard',
    'The ANCHOR dashboard for the Houston port: active vessels, vessels at port, inbound arrivals and unread emails, critical alerts for unanswered queries and notices of readiness, mentions, and the Action required list.',
  ),
  inbox: app(
    'app-inbox',
    'The ANCHOR shared inbox: folders for vessel, terminal and office mail, and threads tagged with their vessel, port-call reference and a status such as Action required, Informational or Replied.',
  ),
  classify: app(
    'app-classify',
    'An email open in ANCHOR, tagged Action required, with ANCHOR suggesting the vessel MV Coral Meridian and port call HT-26AUG001 and buttons to confirm or edit.',
  ),
  vessel: app(
    'app-vessel',
    'The vessel page for MV Coral Meridian: the port-call timeline from pre-arrival to voyage completed, voyage route, ETA, ETB and ETD, and the emails for the call.',
  ),
  reply: app(
    'app-reply',
    'A reply being written in ANCHOR, with the Generate menu and the Help me write prompt, and Discard and Send buttons that stay with the person.',
  ),
  thread: app(
    'app-thread',
    'An email thread for MT Avalon Spirit, port call HT-26AUG002, with ETA, ETB and ETD above a reply the Houston team sent.',
  ),
} satisfies Record<string, Shot>

export const footer = {
  blurb: 'A shared workspace for shipping agents.',
  columns: [
    {
      title: 'Product',
      links: [
        { href: '/shipping-agents', label: 'Shipping agents' },
        { href: '/terminal-agents', label: 'Terminals' },
      ],
    },
    {
      title: 'Company',
      wide: true,
      links: [
        { href: '/about', label: 'About' },
        { href: '/how-it-works', label: 'How it works' },
        { href: '/services', label: 'Services' },
        { href: '/book-demo', label: 'Book a demo' },
      ],
    },
  ],
  legal: '© 2026 ANCHOR · Services delivered by Celeix Digital, separate from the software',
}
