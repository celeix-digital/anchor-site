import { shots } from './shared'

export const shipping = {
  meta: {
    title: 'For shipping agents — ANCHOR',
    description:
      'ANCHOR gives the agency desk a shared inbox, classifies inbound email, tracks vessels and port calls, and drafts replies with AI. Your people review every draft and decide what is sent.',
  },
  hero: {
    eyebrow: 'Shipping agents',
    badge: 'Live today',
    lines: ['Run the port call,', 'not the inbox.'],
    sub: 'ANCHOR gives the agency desk a shared inbox, classifies inbound email, tracks vessels and port calls, and drafts replies with AI. Your people review every draft and decide what is sent.',
    primary: 'Book a demo',
    secondary: { href: '#changes', label: 'What changes' },
    window: 'Shared inbox · Port-call desk',
  },
  today: {
    eyebrow: 'The day you have now',
    heading: 'Every call is a pile of mail you hold in your head.',
    body: 'Masters, owners, terminals, pilots and suppliers all write separately. The facts that matter are spread across threads, and the agent is the one who stitches them together.',
    senders: ['Master', 'Owners', 'Terminal', 'Pilots', 'Chandler', 'Line handlers'],
    before: { label: 'Today, in most agencies', title: 'Separate threads', centre: ['The agent', 'connects them', 'from memory'] },
    after: { label: 'With a shared desk', title: 'One call, one view', inbox: 'Shared inbox', call: 'Call 0417', count: '6 senders · 1 desk' },
    note: 'Diagram for explanation. Fictional senders, not a product screenshot.',
  },
  changes: {
    eyebrow: 'What changes · Live today',
    heading: 'AI does the drafting. People do the deciding.',
    sub: 'Four things are live today.',
    features: [
      {
        n: '1',
        side: 'team',
        label: 'Shared inbox',
        title: 'One shared inbox for the desk',
        body: 'Port-call mail is worked together, not across personal mailboxes. Whoever picks up the call can see what has already arrived.',
        shot: shots.inbox,
        bleed: true,
      },
      {
        n: '2',
        side: 'ai',
        label: 'Email classification',
        title: 'Each message labelled by what it is about',
        body: 'Pre-arrival, berth, owners’ queries, husbandry. Labels are aids for the desk to check, not guarantees.',
        shot: shots.classification,
        zoom: true,
      },
      {
        n: '3',
        side: 'team',
        label: 'Vessel and port-call tracking',
        title: 'The call sits next to its mail',
        body: 'Vessels and port calls are tracked alongside the correspondence that moves them. Your agents keep the details current.',
        shot: shots.thread,
      },
      {
        n: '4',
        side: 'ai',
        label: 'AI draft replies',
        title: 'A draft is a starting point',
        body: 'AI drafts the reply. A person reads it, edits it and decides whether it goes out.',
        shot: shots.draft,
      },
    ] as const,
  },
  control: {
    eyebrow: 'Grounded in human control',
    heading: 'Nothing goes out on its own.',
    body: 'The line between what the software does and what your people do is drawn the same way on every call.',
    software: {
      title: 'The software',
      items: ['Collects port-call mail into the shared inbox', 'Labels inbound messages by type', 'Drafts a suggested reply'],
    },
    people: {
      title: 'Your people',
      items: ['Check labels and call details', 'Edit the draft, or write their own', 'Decide whether to send, and send it'],
    },
    notToday: {
      title: 'Not part of today’s product',
      items: [
        { title: 'No automatic sending.', body: 'Every reply leaves because a person sent it.' },
        { title: 'No terminal side yet.', body: 'Terminal coordination is in design.' },
        { title: 'No autonomous actions.', body: 'Wider AI permissions are future direction.' },
      ],
    },
  },
  cta: {
    heading: ['See it on a call like yours.'],
    body: 'A walkthrough of the live product, with your kind of traffic in mind.',
    primary: { href: '/book-demo', label: 'Book a demo' },
    secondary: { href: '/vision', label: 'Read the vision' },
  },
}
