'use client'

import { ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { JOBS, type LogLevel } from './data'

const levelClasses: Record<LogLevel, string> = {
  INFO: 'bg-sky text-navy',
  'ALERT-HANDLED': 'bg-mint text-navy',
}

export function ExperienceApp() {
  const [open, setOpen] = useState<Set<string>>(() => new Set([JOBS[0].id]))
  const allOpen = open.size === JOBS.length

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-border bg-titlebar px-4 py-2">
        <h2 className="font-mono text-xs text-muted-foreground">
          <span className="text-foreground">$ tail</span> experience.log · {JOBS.length} entries
        </h2>
        <button
          type="button"
          onClick={() => setOpen(allOpen ? new Set() : new Set(JOBS.map((job) => job.id)))}
          className="rounded-lg px-2 py-1 font-mono text-xs text-foreground hover:bg-card/70 focus-visible:outline-2 focus-visible:outline-ring"
        >
          {allOpen ? 'collapse all' : 'expand all'}
        </button>
      </div>

      <ol className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto bg-background/50 p-3 font-mono text-sm">
        {JOBS.map((job) => {
          const isOpen = open.has(job.id)
          const panelId = `log-${job.id}`
          return (
            <li key={job.id} className="rounded-xl border border-border bg-card/60">
              <h3>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(job.id)}
                  className="flex w-full items-start gap-2 rounded-xl p-3 text-left hover:bg-sky/20 focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <ChevronRight
                    className={cn(
                      'mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform motion-reduce:transition-none',
                      isOpen && 'rotate-90',
                    )}
                    aria-hidden="true"
                  />
                  <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <span className="flex flex-wrap items-center gap-2 text-xs">
                      <time className="text-muted-foreground">
                        [{job.start} → {job.end}]
                      </time>
                      <span className={cn('rounded-md px-1.5 py-0.5 font-semibold', levelClasses[job.level])}>
                        {job.level}
                      </span>
                    </span>
                    <span className="font-sans text-base font-semibold leading-snug text-foreground text-pretty">
                      {job.title}
                      <span className="font-normal text-muted-foreground"> @ {job.org}</span>
                    </span>
                  </span>
                </button>
              </h3>
              <ul
                id={panelId}
                hidden={!isOpen}
                className="flex flex-col gap-2 border-t border-border px-3 py-3 pl-9 text-[13px] leading-relaxed"
              >
                {job.details.map((detail) => (
                  <li key={detail} className="flex gap-2 text-foreground">
                    <span aria-hidden="true" className="shrink-0 text-muted-foreground">
                      {'>'}
                    </span>
                    <span className="text-pretty">{detail}</span>
                  </li>
                ))}
              </ul>
            </li>
          )
        })}
        <li aria-hidden="true" className="px-1 pt-1 text-xs text-muted-foreground">
          -- end of log · next entry: your team? --
        </li>
      </ol>
    </div>
  )
}
