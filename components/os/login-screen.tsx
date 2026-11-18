'use client'

import { ArrowRight, FileDown, KeyRound, Lock, ShieldCheck, Smartphone, User, type LucideIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { RESUME_URL } from './apps'

type Step = 'credentials' | 'mfa' | 'granted' | 'leaving'

const CODE = ['3', '1', '4', '1', '5', '9']

export function LoginScreen({ onUnlock }: { onUnlock: () => void }) {
  const [step, setStep] = useState<Step>('credentials')
  const [filled, setFilled] = useState(0)
  const mfaHeadingRef = useRef<HTMLHeadingElement>(null)
  const grantedRef = useRef<HTMLParagraphElement>(null)
  const onUnlockRef = useRef(onUnlock)
  onUnlockRef.current = onUnlock

  useEffect(() => {
    const timers: number[] = []
    let interval: number | undefined

    if (step === 'mfa') {
      timers.push(window.setTimeout(() => mfaHeadingRef.current?.focus(), 80))
      timers.push(
        window.setTimeout(() => {
          let digits = 0
          interval = window.setInterval(() => {
            digits += 1
            setFilled(digits)
            if (digits >= CODE.length) {
              window.clearInterval(interval)
              timers.push(window.setTimeout(() => setStep('granted'), 450))
            }
          }, 280)
        }, 700),
      )
    }
    if (step === 'granted') {
      grantedRef.current?.focus()
      timers.push(window.setTimeout(() => setStep('leaving'), 1400))
    }
    if (step === 'leaving') {
      timers.push(window.setTimeout(() => onUnlockRef.current(), 600))
    }

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
      if (interval) window.clearInterval(interval)
    }
  }, [step])

  const flipped = step !== 'credentials'
  const granted = step === 'granted' || step === 'leaving'

  return (
    <main className="wallpaper fixed inset-0 flex flex-col items-center justify-center gap-5 overflow-y-auto p-4">
      <div
        className={cn(
          'w-full max-w-sm transition-all duration-500 [perspective:1600px] motion-reduce:transition-none',
          step === 'leaving' && 'scale-95 opacity-0',
        )}
      >
        <div
          className={cn(
            'relative grid transition-transform duration-700 [transform-style:preserve-3d] motion-reduce:transition-none',
            flipped && '[transform:rotateY(180deg)]',
          )}
        >
          <section
            aria-hidden={flipped}
            inert={flipped}
            className="glass rounded-3xl shadow-soft [backface-visibility:hidden] [grid-area:1/1]"
          >
            <form
              onSubmit={(event) => {
                event.preventDefault()
                setStep('mfa')
              }}
              className="flex flex-col items-center gap-6 p-8"
            >
              <Avatar />
              <div className="flex flex-col items-center gap-1 text-center">
                <h1 className="text-2xl font-semibold tracking-tight text-balance text-foreground">Astha Patel</h1>
                <p className="text-sm text-muted-foreground">IT Support &amp; Security Analyst</p>
              </div>
              <div className="flex w-full flex-col gap-3">
                <ReadOnlyField id="login-username" label="Username" icon={User} value="recruiter" />
                <ReadOnlyField id="login-password" label="Password" icon={KeyRound} value="hireme2026" type="password" />
              </div>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-medium text-primary-foreground shadow-soft transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none"
              >
                Sign in
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            </form>
          </section>

          <section
            aria-hidden={!flipped}
            inert={!flipped}
            className="glass flex flex-col items-center justify-center rounded-3xl shadow-soft [backface-visibility:hidden] [grid-area:1/1] [transform:rotateY(180deg)]"
          >
            <div className="flex flex-col items-center gap-5 p-8 text-center">
              {granted ? (
                <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in-90 duration-500">
                  <span className="flex size-20 items-center justify-center rounded-full bg-mint text-navy shadow-soft">
                    <ShieldCheck className="size-10" aria-hidden="true" />
                  </span>
                  <p
                    ref={grantedRef}
                    tabIndex={-1}
                    className="font-mono text-xl font-semibold tracking-[0.2em] text-foreground outline-none"
                  >
                    ACCESS GRANTED
                  </p>
                  <p className="text-sm text-muted-foreground">Welcome, recruiter. Opening your desktop.</p>
                </div>
              ) : (
                <>
                  <span className="flex size-14 items-center justify-center rounded-2xl bg-lavender text-navy">
                    <Smartphone className="size-6" aria-hidden="true" />
                  </span>
                  <div className="flex flex-col gap-1">
                    <h2
                      ref={mfaHeadingRef}
                      tabIndex={-1}
                      className="text-xl font-semibold tracking-tight text-foreground outline-none"
                    >
                      Two-step verification
                    </h2>
                    <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
                      Enter the 6-digit code sent to your device.
                    </p>
                  </div>
                  <div role="group" aria-label="Verification code" className="flex gap-2">
                    {CODE.map((digit, index) => (
                      <div
                        key={index}
                        aria-hidden="true"
                        className={cn(
                          'flex h-12 w-10 items-center justify-center rounded-xl border font-mono text-xl font-semibold transition-colors',
                          index < filled
                            ? 'border-transparent bg-sky text-navy animate-in zoom-in-75 duration-200'
                            : index === filled
                              ? 'border-foreground/40 bg-card'
                              : 'border-border bg-card/50',
                        )}
                      >
                        {index < filled ? digit : ''}
                      </div>
                    ))}
                  </div>
                  <p className="font-mono text-xs text-muted-foreground">
                    {filled < CODE.length ? 'Autofilling from trusted device...' : 'Verifying code...'}
                  </p>
                </>
              )}
              <p className="sr-only" aria-live="polite">
                {granted
                  ? 'Access granted. Opening desktop.'
                  : step === 'mfa'
                    ? filled === CODE.length
                      ? 'Code entered. Verifying.'
                      : 'Verification code is being filled in automatically.'
                    : ''}
              </p>
            </div>
          </section>
        </div>
      </div>

      <a
        href={RESUME_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-foreground/80 underline-offset-4 transition-opacity hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-ring',
          step === 'leaving' && 'opacity-0',
        )}
      >
        <FileDown className="size-4" aria-hidden="true" />
        Skip to Resume
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    </main>
  )
}

function Avatar() {
  return (
    <div className="relative">
      <div className="flex size-24 items-center justify-center rounded-full bg-sky text-3xl font-semibold tracking-tight text-navy shadow-soft ring-4 ring-glass-border">
        AP
      </div>
      <span className="absolute right-0 bottom-0 flex size-8 items-center justify-center rounded-full bg-blush text-navy ring-4 ring-glass-border">
        <Lock className="size-3.5" aria-hidden="true" />
        <span className="sr-only">Account protected</span>
      </span>
    </div>
  )
}

function ReadOnlyField({
  id,
  label,
  icon: Icon,
  value,
  type = 'text',
}: {
  id: string
  label: string
  icon: LucideIcon
  value: string
  type?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-mono text-xs text-muted-foreground">
        {label}
      </label>
      <div className="relative">
        <Icon
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          id={id}
          type={type}
          value={value}
          readOnly
          autoComplete="off"
          className="w-full rounded-xl border border-input bg-card/70 py-2.5 pr-3 pl-10 font-mono text-sm text-foreground focus-visible:outline-2 focus-visible:outline-ring"
        />
      </div>
    </div>
  )
}
