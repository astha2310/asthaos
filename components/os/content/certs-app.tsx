import { BadgeCheck, Hourglass, KeyRound } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CERTS } from './data'

export function CertsApp() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-border bg-titlebar px-4 py-2">
        <h2 className="font-sans text-sm font-semibold text-foreground">Key Vault</h2>
        <p className="font-mono text-xs text-muted-foreground">vault: unlocked · {CERTS.length} keys</p>
      </div>
      <ul className="grid min-h-0 flex-1 auto-rows-min gap-3 overflow-auto bg-background/50 p-3 @container @lg:grid-cols-2">
        {CERTS.map((cert) => {
          const verified = cert.status === 'verified'
          const StatusIcon = verified ? BadgeCheck : Hourglass
          return (
            <li
              key={cert.id}
              className="relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card/70 p-5 shadow-soft"
            >
              <span
                aria-hidden="true"
                className={cn(
                  'absolute -top-10 -right-10 size-28 rounded-full opacity-60',
                  verified ? 'bg-mint' : 'bg-lavender',
                )}
              />
              <div className="relative flex items-start justify-between gap-3">
                <span
                  className={cn(
                    'flex size-11 items-center justify-center rounded-xl text-navy shadow-soft',
                    verified ? 'bg-mint' : 'bg-lavender',
                  )}
                >
                  <KeyRound className="size-5" aria-hidden="true" />
                </span>
                <span
                  className={cn(
                    'flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-xs font-semibold text-navy ring-1 ring-navy/10',
                    verified ? 'bg-mint' : 'bg-lavender',
                  )}
                >
                  <StatusIcon className="size-3.5" aria-hidden="true" />
                  {verified ? 'Verified' : 'In progress'}
                </span>
              </div>
              <div className="relative flex flex-col gap-1">
                <h3 className="font-sans text-lg font-semibold leading-snug text-foreground text-balance">{cert.name}</h3>
                <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                {cert.note && <p className="text-sm font-medium text-foreground">{cert.note}</p>}
              </div>
              <p className="relative mt-auto border-t border-dashed border-border pt-3 font-mono text-xs text-muted-foreground">
                {cert.fingerprint}
              </p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
