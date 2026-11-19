export type Interest = 'demo' | 'services' | 'terminal' | 'webinar'

export const form = {
  // Adapted from the live site: this static site has no database, so the request
  // is handed to the visitor's email app and nothing is stored here.
  how: 'What happens when you continue: your email app opens with this request filled in, addressed to the ANCHOR team. Nothing is stored on this site, no meeting is booked, and nothing is sent until you press send.',
  interestLabel: 'What are you interested in?',
  interests: [
    { value: 'demo', label: 'Product demo' },
    { value: 'services', label: 'Professional services (Celeix Digital)' },
    { value: 'terminal', label: 'Terminals (in design)' },
    { value: 'webinar', label: 'Webinar interest only' },
  ] as { value: Interest; label: string }[],
  terminalNote: 'Terminal coordination is in design, not live. Choosing this tells us you want to help shape it.',
  fields: {
    name: 'Name',
    email: 'Work email',
    company: 'Company',
    port: 'Port(s) you work',
    role: 'Role',
    roleHint: 'For example: shipping agent, ops manager, terminal coordinator',
    message: 'Anything we should know? (optional)',
  },
  consent: 'I agree that ANCHOR may store these details to follow up on this request.',
  submit: 'Continue in email',
  submitNote: 'Opens your email app. Nothing is stored on this site.',
  errors: {
    name: 'Please enter your name.',
    email: 'Please enter a work email, like name@company.com.',
    company: 'Please enter your company.',
    port: 'Please enter the port or ports you work.',
    role: 'Please enter your role.',
    consent: 'Please tick the box so we can follow up.',
  },
  subject: (interest: string, company: string) => `ANCHOR request: ${interest}${company ? `, ${company}` : ''}`,
}

export const demo = {
  meta: {
    title: 'Book a demo | ANCHOR',
    description: 'Pick a time for a 25-minute call with the ANCHOR team. Bring us one port call.',
  },
  hero: {
    heading: {
      default: 'Bring us one port call.',
      services: 'Talk to us about your operation.',
      webinar: 'Tell us you’d like a seat.',
    },
    sub: {
      default: 'Pick a time that suits you for a 25-minute call with the team. Google Calendar sends you the invite and the meeting link.',
      webinar: 'Webinar registration isn’t open yet. Book a short call and we’ll let you know when it is.',
    },
  },
  calendar: {
    title: 'Pick a time for a 25-minute call',
    fallback: 'Calendar not loading?',
    open: 'Open it in a new tab',
  },
  after: {
    title: 'After you pick a time',
    steps: [
      { t: 'Pick a time', d: 'Choose a slot that works for you and add your details.', done: true },
      { t: 'Get the invite', d: 'Google Calendar emails you the invite and the meeting link.', done: true },
      { t: 'Meet the team', d: '25 minutes, walking through one of your port calls.', done: false },
    ],
  },
  covers: {
    title: 'What a demo covers',
    items: [
      { state: 'ai', t: 'The shared inbox and how email is classified' },
      { state: 'ai', t: 'Vessel and port-call tracking alongside the mail' },
      { state: 'ai', t: 'AI draft replies, ready for review' },
      { state: 'human', t: 'Where a person edits, approves and sends' },
    ] as const,
  },
}

export const thanks = {
  meta: { title: 'Request ready | ANCHOR', description: 'Your request is ready to send from your email app.' },
  ready: {
    heading: 'One step left: press send.',
    body: 'Your email app should have opened with your request filled in. Once you send it, someone on the team reads it and follows up. No set response time.',
    fallback: 'If nothing opened, email us at',
  },
  none: {
    heading: 'Nothing to confirm yet.',
    body: 'We don’t see a recent request in this browser session. If you meant to send one, start again below.',
  },
  home: { href: '/', label: 'Back to the homepage' },
  form: { href: '/book-demo', label: 'Go to the form' },
}
