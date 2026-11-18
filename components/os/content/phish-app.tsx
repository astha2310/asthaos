'use client'

import { CircleCheck, CircleX, Fish, RotateCcw, ShieldCheck } from 'lucide-react'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { cn } from '@/lib/utils'

type Verdict = 'phishing' | 'legit'

type Email = {
  fromName: string
  fromAddress: string
  subject: string
  body: string
  cta?: string
  answer: Verdict
  explanation: string
}

const EMAILS: Email[] = [
  {
    fromName: 'IT Support',
    fromAddress: 'helpdesk@micros0ft-security.com',
    subject: 'Your password expires in 2 hours',
    body: 'Click below to keep your current password or you will lose access.',
    cta: 'Keep my password',
    answer: 'phishing',
    explanation:
      'The domain uses a zero instead of an o, it is not a real company domain, and it uses urgency to rush you.',
  },
  {
    fromName: 'Sunrise University Library',
    fromAddress: 'library@sunrise.edu',
    subject: 'Reminder: book due Friday',
    body: "Your book 'Network Security Basics' is due Friday. You can renew it from your library account.",
    answer: 'legit',
    explanation:
      'Expected sender, no link, no request for a password, and no pressure. When in doubt, go to the site yourself instead of clicking.',
  },
  {
    fromName: 'Jordan Lee, CEO',
    fromAddress: 'jordan.lee.ceo.office@gmail.com',
    subject: 'Quick favor, keep this quiet',
    body: 'I am in a meeting. I need you to buy 5 gift cards for a client right now. Send me the codes. Do not tell anyone.',
    answer: 'phishing',
    explanation: 'A personal Gmail address, gift cards, secrecy and urgency are classic CEO fraud signs.',
  },
]

export function PhishApp() {
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<Verdict | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const feedbackRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)

  const email = EMAILS[index]
  const correct = picked === email?.answer

  useEffect(() => {
    if (picked) feedbackRef.current?.focus()
  }, [picked])

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true })
  }, [index, done])

  const answer = (verdict: Verdict) => {
    if (picked) return
    setPicked(verdict)
    if (verdict === email.answer) setScore((value) => value + 1)
  }

  const next = () => {
    if (index === EMAILS.length - 1) setDone(true)
    else setIndex((value) => value + 1)
    setPicked(null)
  }

  const restart = () => {
    setIndex(0)
    setPicked(null)
    setScore(0)
    setDone(false)
  }

  if (done) {
    const perfect = score === EMAILS.length
    return (
      <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center gap-5 overflow-hidden p-6 text-center">
        {perfect && <Confetti />}
        <h2 ref={headingRef} tabIndex={-1} className="font-mono text-sm text-muted-foreground outline-none">
          Score: <span className="text-foreground">{score} / {EMAILS.length}</span>
        </h2>
        {perfect ? (
          <div className="flex flex-col items-center gap-3">
            <span className="bg-brand-gradient flex size-20 items-center justify-center rounded-3xl p-px shadow-window">
              <span className="flex size-full items-center justify-center rounded-3xl bg-panel">
                <ShieldCheck className="size-10 text-cyber" aria-hidden="true" />
              </span>
            </span>
            <p className="text-brand-gradient text-2xl font-bold tracking-tight">Human Firewall</p>
            <p className="max-w-xs text-sm text-pretty text-muted-foreground">
              You caught every phish and trusted the real email. That is the job.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <span className="flex size-16 items-center justify-center rounded-2xl bg-plasma/15 text-plasma-soft ring-1 ring-plasma/40">
              <Fish className="size-8" aria-hidden="true" />
            </span>
            <p className="text-xl font-semibold text-foreground">Good try. Every analyst keeps training.</p>
          </div>
        )}
        <button
          type="button"
          onClick={restart}
          className="relative flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 ref={headingRef} tabIndex={-1} className="font-mono text-sm text-muted-foreground outline-none">
          Email {index + 1} of {EMAILS.length} · Phishing or legit?
        </h2>
        <div className="flex gap-1.5" aria-hidden="true">
          {EMAILS.map((item, i) => (
            <span
              key={item.subject}
              className={cn('h-1.5 w-6 rounded-full', i <= index ? 'bg-cyber' : 'bg-foreground/15')}
            />
          ))}
        </div>
      </div>

      <article
        aria-label={`Email from ${email.fromName}`}
        className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card"
      >
        <dl className="flex flex-col gap-1.5 border-b border-border bg-titlebar px-4 py-3 text-sm">
          <div className="flex flex-wrap gap-x-2">
            <dt className="w-16 shrink-0 text-muted-foreground">From</dt>
            <dd className="min-w-0 break-all text-foreground">
              <span className="font-semibold">{email.fromName}</span>{' '}
              <span className="font-mono text-xs text-muted-foreground">{`<${email.fromAddress}>`}</span>
            </dd>
          </div>
          <div className="flex flex-wrap gap-x-2">
            <dt className="w-16 shrink-0 text-muted-foreground">Subject</dt>
            <dd className="min-w-0 font-semibold text-foreground">{email.subject}</dd>
          </div>
        </dl>
        <div className="flex flex-col items-start gap-4 px-4 py-5">
          <p className="leading-relaxed text-pretty text-foreground">{email.body}</p>
          {email.cta && (
            <span
              aria-label={`Link button inside the email: ${email.cta}`}
              role="img"
              className="rounded-lg bg-signal px-4 py-2 text-sm font-semibold text-white"
            >
              {email.cta}
            </span>
          )}
        </div>
      </article>

      {picked ? (
        <div
          ref={feedbackRef}
          tabIndex={-1}
          role="status"
          className={cn(
            'flex flex-col gap-3 rounded-2xl border p-4 outline-none animate-in fade-in slide-in-from-bottom-2',
            correct ? 'border-cyber/40 bg-cyber/10' : 'border-flare/40 bg-flare/10',
          )}
        >
          <p className={cn('flex items-center gap-2 font-semibold', correct ? 'text-cyber' : 'text-flare-soft')}>
            {correct ? (
              <CircleCheck className="size-5" aria-hidden="true" />
            ) : (
              <CircleX className="size-5" aria-hidden="true" />
            )}
            {correct ? 'Correct.' : 'Not quite.'} This one is {email.answer === 'phishing' ? 'phishing' : 'legit'}.
          </p>
          <p className="text-sm leading-relaxed text-pretty text-foreground">{email.explanation}</p>
          <button
            type="button"
            onClick={next}
            className="self-end rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {index === EMAILS.length - 1 ? 'See score' : 'Next'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => answer('phishing')}
            className="h-11 rounded-xl border border-flare/50 bg-flare/15 text-sm font-semibold text-flare-soft hover:bg-flare/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Phishing
          </button>
          <button
            type="button"
            onClick={() => answer('legit')}
            className="h-11 rounded-xl border border-cyber/50 bg-cyber/15 text-sm font-semibold text-cyber hover:bg-cyber/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Legit
          </button>
        </div>
      )}
    </div>
  )
}

const CONFETTI_COLORS = ['var(--cyber)', 'var(--plasma)', 'var(--flare)']

function Confetti() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 42 }, (_, i) => {
        const style = {
          left: `${(i * 37) % 100}%`,
          top: '-12px',
          width: i % 3 === 0 ? 6 : 8,
          height: i % 2 === 0 ? 12 : 8,
          backgroundColor: CONFETTI_COLORS[i % 3],
          borderRadius: i % 4 === 0 ? '9999px' : '2px',
          '--drift': `${((i * 53) % 120) - 60}px`,
          '--spin': `${360 + ((i * 97) % 540)}deg`,
          '--delay': `${(i % 10) * 0.08}s`,
          '--dur': `${2 + (i % 5) * 0.35}s`,
        } as CSSProperties
        return <span key={i} className="confetti-piece absolute" style={style} />
      })}
    </div>
  )
}
