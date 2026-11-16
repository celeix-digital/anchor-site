import { shots } from './shared'

export const home = {
  meta: {
    title: 'ANCHOR39 | A shared workspace for shipping agents',
    description:
      'ANCHOR brings your shared inbox, email classification, vessel and port-call tracking, and AI-assisted replies into one shipping-agent workspace. Your team reviews and sends every reply.',
  },
  hero: {
    lines: ['Keep the port call in view.', 'Not buried in email.'],
    sub: 'Updates from the master. A new berth line-up. Another question from the owners. ANCHOR brings your shared inbox, email classification, vessel and port-call tracking, and AI-assisted replies into one shipping-agent workspace. Your team reviews and sends every reply.',
    primary: 'Book a demo',
    secondary: { href: '#how', label: 'Follow one email' },
  },
  how: {
    heading: 'One email from the master, start to send.',
    sub: 'The last step is always a person.',
    steps: [
      {
        n: '01',
        tab: 'Incoming email',
        title: 'Incoming email',
        body: 'A message from the master arrives in the shared inbox, where the whole desk can see it.',
        shot: shots.inbox,
      },
      {
        n: '02',
        tab: 'Classification',
        title: 'Classification',
        body: 'Email classification helps the desk see what each message is about.',
        shot: shots.classify,
      },
      {
        n: '03',
        tab: 'Vessel / call',
        title: 'Vessel / call context',
        body: 'The agent checks the correspondence against the vessel and port-call information.',
        shot: shots.vessel,
      },
      {
        n: '04',
        tab: 'Suggested reply',
        title: 'Suggested reply',
        body: 'AI drafts a suggested reply in the thread, ready for the agent to read.',
        shot: shots.reply,
      },
      {
        n: '05',
        tab: 'Review / send',
        title: 'Human review',
        body: 'The agent reads, edits, then sends from the desk. Nothing goes out on its own.',
        shot: shots.thread,
      },
    ] as const,
  },
  problem: {
    heading: 'One port call. A desk full of separate conversations.',
    body: 'Each party writes in their own thread. The agent holds the whole call together, usually from an inbox. ANCHOR is built for exactly that desk:',
    features: [
      { title: 'Shared inbox', body: 'The agency’s port-call mail in one place, for the whole desk.' },
      { title: 'Email classification', body: 'Inbound messages sorted by what they are about.' },
      { title: 'Vessel and port-call tracking', body: 'Calls followed alongside the mail that moves them.' },
      { title: 'AI draft replies', body: 'Drafted by AI. Reviewed and sent by a person.' },
    ],
    day: {
      label: 'One call, one Tuesday',
      inbox: 'Shared inbox',
      messages: [
        { time: '06:40', from: 'Master', subject: 'Revised ETA, drafts attached' },
        { time: '07:55', from: 'Terminal', subject: 'Berth line-up moved to Thursday' },
        { time: '08:20', from: 'Pilots', subject: 'Boarding time 08:00, please confirm' },
        { time: '10:03', from: 'Owners', subject: 'Can you confirm bunkers on arrival?' },
        { time: '11:30', from: 'Chandler', subject: 'Stores delivery window, gangway access' },
        { time: '14:12', from: 'Line handlers', subject: 'Gang ordered for 06:00?' },
      ],
    },
  },
  audiences: {
    heading: 'Who it’s for',
    cards: [
      {
        title: 'Shipping agents',
        body: 'Shared inbox, email classification, vessel and port-call tracking, and AI draft replies your team reviews and sends.',
        link: { href: '/shipping-agents', label: 'Work the call, not the inbox' },
      },
      {
        title: 'Terminals',
        body: 'Terminal coordination is in design, not live. Tell us how your terminal works and help shape it.',
        link: { href: '/terminal-agents', label: 'Help shape it' },
      },
      {
        title: 'Ports and operators',
        body: 'Separate from the software. Celeix Digital maps how the operation runs today and plans modernization in phases.',
        link: { href: '/services', label: 'See professional services' },
      },
    ] as const,
  },
  services: {
    heading: 'Services by Celeix Digital',
    body: 'Separate from the software. Discovery, handoff mapping, data and integration assessment, and phased modernization plans with measurable acceptance criteria.',
    primary: { href: '/services', label: 'Explore services' },
    secondary: { href: '/book-demo?interest=services', label: 'Talk to us about your operation' },
  },
  cta: {
    heading: ['Bring us one port call.', 'We’ll show you the desk.'],
    body: 'Walk through the shared inbox, vessel and port-call tracking, and a draft reply your team reviews before sending.',
    primary: { href: '/book-demo', label: 'Book a demo' },
    secondary: { href: '/book-demo?interest=webinar', label: 'Webinar interest' },
  },
}
