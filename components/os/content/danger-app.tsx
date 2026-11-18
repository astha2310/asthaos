'use client'

import { CalendarClock, LockKeyhole, ShieldAlert } from 'lucide-react'
import { useEffect, useState } from 'react'
import { CONTACT, useOs } from '../os-context'

const START_SECONDS = 23 * 3600 + 59 * 60 + 59

const pad = (value: number) => String(value).padStart(2, '0')

function useCountdown() {
  const [remaining, setRemaining] = useState(START_SECONDS)

  useEffect(() => {
    const startedAt = Date.now()
    const interval = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000)
      setRemaining(Math.max(0, START_SECONDS - elapsed))
    }, 1000)
    return () => window.clearInterval(interval)
  }, [])

  return remaining
}

export function DangerApp() {
  const { closeApp, notify } = useOs()
  const remaining = useCountdown()
  const hours = Math.floor(remaining / 3600)
  const minutes = Math.floor((remaining % 3600) / 60)
  const seconds = remaining % 60

  const report = () => {
    closeApp('danger')
    notify({ title: 'Great instinct.', body: 'Reporting suspicious files is always the right call.' })
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col items-center gap-5 overflow-y-auto bg-terminal px-5 py-6 text-center md:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(60%_100%_at_50%_0%,rgb(236_72_153/0.22),transparent)]"
      />

      <div className="relative flex size-24 shrink-0 items-center justify-center" aria-hidden="true">
        <span className="absolute inset-0 rounded-[2rem] bg-[linear-gradient(135deg,var(--flare),var(--plasma))] opacity-25 blur-xl" />
        <span className="glitch relative flex size-20 items-center justify-center rounded-[1.75rem] bg-[linear-gradient(135deg,var(--flare),var(--plasma))] shadow-window">
          <LockKeyhole className="size-10 text-white" strokeWidth={2.25} />
        </span>
      </div>

      <h2 className="glitch relative max-w-md text-2xl font-bold tracking-tight text-balance text-foreground md:text-3xl">
        OOPS! YOUR CALENDAR HAS BEEN ENCRYPTED
      </h2>

      <div className="relative flex max-w-lg flex-col gap-3 text-pretty">
        <p className="leading-relaxed text-foreground">
          All your free time slots have been locked with{' '}
          <span className="font-mono text-flare-soft">AES-256-INTERVIEW</span> encryption. To decrypt them, schedule an
          interview with Astha Patel.
        </p>
        <p className="rounded-xl border border-plasma/40 bg-plasma/10 px-4 py-3 text-sm leading-relaxed text-foreground">
          <span className="font-semibold text-plasma-soft">Ransom:</span> 30 minutes of your time.{' '}
          <span className="font-semibold text-plasma-soft">Accepted payment:</span> Zoom, Teams, phone call or coffee.
        </p>
      </div>

      <div className="relative flex flex-col items-center gap-1">
        <p
          className="font-mono text-4xl font-bold tracking-wider text-flare-soft tabular-nums md:text-5xl"
          aria-label={`${hours} hours, ${minutes} minutes and ${seconds} seconds remaining`}
          role="timer"
        >
          {pad(hours)}:{pad(minutes)}:{pad(seconds)}
        </p>
        <p className="text-sm text-muted-foreground">until this candidate gets hired somewhere else</p>
      </div>

      <div className="relative flex w-full max-w-sm flex-col gap-3 sm:flex-row">
        <a
          href={CONTACT.interviewMailto}
          className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,var(--flare),var(--plasma))] px-4 text-sm font-semibold text-white hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <CalendarClock className="size-4" aria-hidden="true" />
          Pay Ransom
        </a>
        <button
          type="button"
          onClick={report}
          className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-signal px-4 text-sm font-semibold text-white hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <ShieldAlert className="size-4" aria-hidden="true" />
          Report to IT
        </button>
      </div>

      <p className="relative mt-auto font-mono text-xs text-muted-foreground">
        Relax, this is a joke. Real ransomware never asks this nicely.
      </p>
    </div>
  )
}
