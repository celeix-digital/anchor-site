// ANCHOR39 mark: a compass ring with four ticks around a teal triangle and centre dot.
// The ring uses currentColor so it can sit on light or dark backgrounds.
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <circle cx="24" cy="24" r="17.2" fill="none" stroke="currentColor" strokeWidth="1.9"/>
      <g fill="currentColor">
        <rect x="22.8" y="1.4" width="2.4" height="5.2" rx="0.6"/>
        <rect x="22.8" y="41.4" width="2.4" height="5.2" rx="0.6"/>
        <rect x="1.4" y="22.8" width="5.2" height="2.4" rx="0.6"/>
        <rect x="41.4" y="22.8" width="5.2" height="2.4" rx="0.6"/>
      </g>
      <path d="M24 10.2 L36.3 30.8 L11.7 30.8 Z" fill="none" stroke="#38b0b8" strokeWidth="2.1" strokeLinejoin="round"/>
      <circle cx="24" cy="24" r="3.1" fill="#38b0b8"/>
    </svg>
  )
}
