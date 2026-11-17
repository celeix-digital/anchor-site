// Small line icons, 24px grid, drawn in currentColor.
type P = { className?: string }
const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
}

/** AI: a four-point spark. */
export function SparkIcon({ className }: P) {
  return (
    <svg className={className} {...base}>
      <path d="M12 3.5c.6 4.4 2.6 6.4 7 7-4.4.6-6.4 2.6-7 7-.6-4.4-2.6-6.4-7-7 4.4-.6 6.4-2.6 7-7Z" />
      <path d="M19 3v3M17.5 4.5h3" />
    </svg>
  )
}

/** Your team: two people. */
export function TeamIcon({ className }: P) {
  return (
    <svg className={className} {...base}>
      <circle cx="9" cy="8.5" r="3.2" />
      <path d="M3.5 19c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5" />
      <circle cx="16.5" cy="9.5" r="2.5" />
      <path d="M15.6 14.2c2.4-.3 4.3 1.2 4.9 4.3" />
    </svg>
  )
}

export function MailIcon({ className }: P) {
  return (
    <svg className={className} {...base}>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="m4 7.5 8 5.5 8-5.5" />
    </svg>
  )
}

export function ArrowIcon({ className }: P) {
  return (
    <svg className={className} {...base}>
      <path d="M4 12h15M13.5 6.5 19 12l-5.5 5.5" />
    </svg>
  )
}
