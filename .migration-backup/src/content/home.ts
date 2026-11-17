import { shots } from './shared'

export type Box = [x: number, y: number, w: number, h: number]

export const home = {
  meta: {
    title: 'ANCHOR39 | A shared workspace for shipping agents',
    description:
      'ANCHOR brings your shared inbox, vessels and port calls into one workspace for shipping agents. It sorts incoming email, keeps each port call up to date and drafts replies, all under your team’s watch.',
  },
  hero: {
    lines: ['Keep the port call in view.', 'Not buried in email.'],
    sub: 'ANCHOR brings your shared inbox, vessels and port calls into one workspace for shipping agents. It sorts incoming email, keeps each port call up to date and drafts replies, all under your team’s watch.',
    primary: 'Book a demo',
    secondary: { href: '#how', label: 'See the email life cycle' },
  },
  how: {
    heading: 'The life cycle of one email, from inbox to reply.',
    sub: 'ANCHOR does the sorting and the drafting. Your team always has the final say.',
    // Highlight boxes: `d` in the 1608×900 desktop screen, `m` in the 700×680 phone crop.
    steps: [
      {
        n: '01',
        tab: 'Email arrives',
        title: 'An email arrives',
        body: 'A new email lands in the shared inbox, where everyone on your team can see it.',
        shot: shots.inbox,
        mark: { d: [444, 168, 1152, 124] as Box, m: [4, 104, 692, 124] as Box },
      },
      {
        n: '02',
        tab: 'Sorted',
        title: 'ANCHOR sorts it',
        body: 'ANCHOR reads the email, tags it (for example Action required or Informational) and matches it to the right vessel, so your team sees at a glance what needs doing.',
        shot: shots.classify,
        mark: { d: [814, 72, 782, 164] as Box, m: [6, 8, 690, 164] as Box },
      },
      {
        n: '03',
        tab: 'Vessel updated',
        title: 'The vessel is updated',
        body: 'The email is added to that vessel’s port call, so its timeline, times and emails stay up to date without retyping.',
        shot: shots.vessel,
        mark: { d: [266, 204, 1316, 156] as Box, m: [4, 140, 692, 156] as Box },
      },
      {
        n: '04',
        tab: 'Reply drafted',
        title: 'A reply is drafted',
        body: 'ANCHOR writes a draft reply from the whole conversation, ready for your team to check.',
        shot: shots.reply,
        mark: { d: [820, 356, 772, 388] as Box, m: [12, 292, 684, 382] as Box },
      },
      {
        n: '05',
        tab: 'Your team sends',
        title: 'Your team decides',
        body: 'Your team reads the draft, changes what it needs to and sends it. Nothing goes out without your approval.',
        shot: shots.thread,
        mark: { d: [818, 192, 778, 336] as Box, m: [12, 128, 684, 336] as Box },
      },
    ],
  },
  problem: {
    heading: 'One port call. Dozens of emails from different people.',
    body: 'The captain, the terminal, the pilots, the owners and suppliers all write in separately, and your team has to piece the call together from a busy inbox. ANCHOR keeps it all in one place:',
    features: [
      { title: 'Shared inbox', body: 'Every email about your port calls in one place, visible to the whole team.' },
      { title: 'Automatic email sorting', body: 'Each email is tagged by what it is about, so urgent requests stand out.' },
      { title: 'Vessel and port call management', body: 'Each port call stays up to date with the emails that move it.' },
      { title: 'Ready-made draft replies', body: 'Written from the conversation, then checked and sent by your team.' },
    ],
    day: {
      label: 'One port call, one Tuesday',
      inbox: 'Shared inbox',
      messages: [
        { time: '06:40', from: 'Captain', subject: 'Revised arrival time, draft attached' },
        { time: '07:55', from: 'Terminal', subject: 'Berth moved to Thursday' },
        { time: '08:20', from: 'Pilots', subject: 'Boarding at 08:00, please confirm' },
        { time: '10:03', from: 'Owners', subject: 'Can you confirm fuel on arrival?' },
        { time: '11:30', from: 'Supplier', subject: 'Stores delivery window, gangway access' },
        { time: '14:12', from: 'Mooring crew', subject: 'Crew ordered for 06:00?' },
      ],
    },
  },
  audiences: {
    heading: 'Who it’s for',
    cards: [
      {
        title: 'Shipping agents',
        body: 'A shared inbox, automatic email sorting, vessel and port call management, and draft replies your team checks and sends.',
        link: { href: '/shipping-agents', label: 'Work the call, not the inbox' },
      },
      {
        title: 'Terminals',
        body: 'Terminal coordination is in design, not live. Tell us how your terminal works and help shape it.',
        link: { href: '/terminal-agents', label: 'Help shape it' },
      },
      {
        title: 'Ports and operators',
        body: 'Separate from the software. Celeix Digital maps how your operation runs today and plans improvements in phases.',
        link: { href: '/services', label: 'See our services' },
      },
    ] as const,
  },
  cta: {
    heading: ['Bring us one of your port calls.', 'We’ll show you ANCHOR at work.'],
    body: 'A short live demo with our team, using a port call like yours. Ask anything and see how it fits the way you work.',
    primary: { href: '/book-demo', label: 'Book a demo' },
    secondary: { href: '/book-demo?interest=webinar', label: 'Webinar interest' },
  },
  services: {
    heading: 'Services by Celeix Digital',
    body: 'ANCHOR is built by Celeix Digital. Separately from the software, we help ports, terminals and operators map how their operation runs today and plan improvements in phases.',
    primary: { href: '/services', label: 'Explore services' },
    secondary: { href: '/book-demo?interest=services', label: 'Talk to us about your operation' },
  },
}
