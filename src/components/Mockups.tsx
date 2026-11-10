import { live } from '../content'

// Small, static product mockups. Decorative: the heading and caption beside
// each one carry the meaning, so every mockup is aria-hidden.

function ShipIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M2 10.5h12l-1.6 3H3.6L2 10.5Zm2-4h8v3H4v-3Zm3-3h2v3H7v-3Z" fill="currentColor" />
    </svg>
  )
}
function PinIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 1.5a4.5 4.5 0 0 0-4.5 4.5c0 3.2 4.5 8.5 4.5 8.5s4.5-5.3 4.5-8.5A4.5 4.5 0 0 0 8 1.5Zm0 6.2a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4Z" fill="currentColor" />
    </svg>
  )
}
function StageIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="3.5" fill="currentColor" />
      <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.2" opacity=".5" />
    </svg>
  )
}

const tagIcon = { vessel: ShipIcon, port: PinIcon, stage: StageIcon }

export function ClassificationMock() {
  const c = live.classification
  return (
    <div className="mock" aria-hidden="true">
      <div className="mock-row mock-mail">
        <span className="mock-avatar">SO</span>
        <div className="mock-mail-main">
          <div className="mock-line">
            <span className="mock-from">{c.from}</span>
            <span className="mock-time">{c.time}</span>
          </div>
          <div className="mock-subject">{c.subject}</div>
        </div>
      </div>
      <div className="mock-tags">
        {c.tags.map((t) => {
          const Icon = tagIcon[t.kind as keyof typeof tagIcon]
          return (
            <span key={t.label} className={`mock-tag mock-tag-${t.kind}`}>
              <Icon />
              {t.label}
            </span>
          )
        })}
      </div>
    </div>
  )
}

export function DraftMock() {
  const d = live.drafts
  return (
    <div className="mock" aria-hidden="true">
      <div className="mock-line mock-draft-head">
        <span className="mock-draft-label">{d.label}</span>
        <span className="mock-pill">{d.status}</span>
      </div>
      <p className="mock-draft-body">{d.body}</p>
      <div className="mock-actions">
        <span className="mock-btn mock-btn-ghost">{d.edit}</span>
        <span className="mock-btn mock-btn-primary">{d.send}</span>
      </div>
    </div>
  )
}

export function InboxMock() {
  const i = live.inbox
  return (
    <div className="mock mock-flush" aria-hidden="true">
      <div className="mock-line mock-inbox-head">
        <span className="mock-inbox-title">{i.header}</span>
        <span className="mock-count">{i.unread}</span>
      </div>
      <ul className="mock-threads">
        {i.threads.map((t) => (
          <li key={t.time} className="mock-thread">
            <span className="mock-dot" />
            <div className="mock-thread-main">
              <div className="mock-line">
                <span className="mock-from">{t.from}</span>
                <span className="mock-time">{t.time}</span>
              </div>
              <div className="mock-subject">{t.subject}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function TrackingMock() {
  const t = live.tracking
  return (
    <div className="mock" aria-hidden="true">
      <div className="mock-line mock-track-head">
        <span className="mock-vessel">
          <ShipIcon />
          {t.vessel}
        </span>
        <span className="mock-berth">{t.location}</span>
      </div>
      <ol className="mock-stages">
        {t.stages.map((s) => (
          <li key={s.label} className={`mock-stage is-${s.state}`}>
            <span className="mock-stage-mark">
              {s.state === 'done' && (
                <svg viewBox="0 0 12 12" aria-hidden="true">
                  <path d="M2.5 6.2 5 8.6l4.5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            <span className="mock-stage-label">{s.label}</span>
          </li>
        ))}
      </ol>
      <div className="mock-facts">
        {t.facts.map((f) => (
          <div key={f.label} className="mock-fact">
            <span className="mock-fact-label">{f.label}</span>
            <span className="mock-fact-value">{f.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
