// How a port call works, zone by zone. Moved here from the Services page so
// "How it works" in the nav and footer explains the vessel's visit.

export const zones = [
  {
    t: 'Ocean',
    s: 'Pre-arrival & notices',
    d: 'Arrival notices, ETAs and documents are exchanged before the vessel is near port, often in different formats.',
    r: ['Shipping agents', 'Captains & vessel operators', 'Port & harbor operations'],
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
    r: ['Pilots', 'Shipping agents', 'Captains & vessel operators'],
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
    r: ['Shipping agents', 'Captains & vessel operators', 'Terminals & berth planners'],
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

export const how = {
  meta: {
    title: 'How it works | ANCHOR',
    description:
      'How a vessel visit runs, zone by zone, from the first notice offshore to closing the trip, and who is involved at each step.',
  },
  hero: {
    lines: ['How a port call works,', 'zone by zone.'],
    sub: 'From the first notice offshore to closing the trip, a vessel visit passes through nine zones. Each one has its own people, handoffs and paperwork, and the shipping agent is involved in most of them.',
    primary: { href: '/book-demo', label: 'Book a demo' },
    secondary: { href: '#zones', label: 'See the nine zones' },
  },
  journey: {
    heading: 'Nine zones, one vessel visit.',
    body: 'Pick a zone to see what happens there and who is involved.',
    people: 'People involved',
    zoneOf: (n: number) => `Zone ${String(n).padStart(2, '0')} of 09`,
    keys: 'Use arrow keys on the chart to move between zones.',
    quay: 'Quay',
  },
  people: {
    heading: 'Who each zone depends on.',
    groups: [
      'Port & harbor operations',
      'Shipping agents',
      'Captains & vessel operators',
      'Terminals & berth planners',
      'Pilots, tugs & line handlers',
      'Cargo interests',
      'Finance',
    ],
    rows: [
      'Shipping agents',
      'Captains & vessel operators',
      'Port & harbor operations',
      'Terminals & berth planners',
      'Pilots',
      'Tugs',
      'Line handlers',
      'Cargo interests',
      'Finance',
    ],
    caption: 'Who is typically involved in each zone. It varies by port.',
    stakeholder: 'Stakeholder',
    dot: 'Example touchpoint',
    none: 'Not highlighted in this example',
  },
  fits: {
    heading: 'Where ANCHOR fits',
    body: 'Every zone runs on email. ANCHOR keeps those emails in one shared inbox, matched to the right vessel and port call, so your team always knows where each call stands.',
    primary: { href: '/book-demo', label: 'Book a demo' },
    secondary: { href: '/shipping-agents', label: 'See it for shipping agents' },
  },
}
