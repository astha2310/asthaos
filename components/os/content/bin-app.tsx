'use client'

import { ChevronDown, FileText, FolderOpen, ShieldX, Trash2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type Entry = { name: string; size: string; note: string; depth: 0 | 1; folder?: boolean }

const FOLDER_FILES: Entry[] = [
  {
    name: 'failed_rdp_logins.log',
    size: '277,167 entries',
    note: 'From my Azure honeypot, Oct 27 to Nov 1, 2026',
    depth: 1,
  },
  { name: 'botnet_10_ips.txt', size: '10 IPs', note: 'Made 95% of all attempts', depth: 1 },
  { name: 'successful_logins.txt', size: '0 bytes', note: 'Empty, exactly as it should be', depth: 1 },
]

export function BinApp() {
  const [open, setOpen] = useState(true)
  const [denied, setDenied] = useState(false)
  const deniedRef = useRef<HTMLParagraphElement>(null)

  const rows: Entry[] = [
    { name: 'blocked_hackers/', size: '3 items', note: 'Honeypot evidence', depth: 0, folder: true },
    ...(open ? FOLDER_FILES : []),
    { name: 'imposter_syndrome.tmp', size: 'deleted', note: 'Not needed here', depth: 0 },
  ]

  const empty = () => {
    setDenied(true)
    requestAnimationFrame(() => deniedRef.current?.focus())
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <p className="font-mono text-xs text-muted-foreground">~/.trash · 5 items</p>
        <button
          type="button"
          onClick={empty}
          className="flex h-9 items-center gap-2 rounded-xl bg-signal px-3 text-sm font-semibold text-white hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <Trash2 className="size-4" aria-hidden="true" />
          Empty Recycle Bin
        </button>
      </div>

      {denied && (
        <p
          ref={deniedRef}
          tabIndex={-1}
          role="alert"
          className="mx-4 mt-4 flex items-start gap-2 rounded-xl border border-flare/40 bg-flare/10 px-4 py-3 text-sm text-foreground outline-none animate-in fade-in slide-in-from-top-1"
        >
          <ShieldX className="mt-0.5 size-4 shrink-0 text-flare-soft" aria-hidden="true" />
          <span>
            <span className="font-semibold text-flare-soft">Access denied.</span> Evidence must be preserved for chain of
            custody.
          </span>
        </p>
      )}

      <div className="min-h-0 flex-1 overflow-auto p-4">
        <table className="w-full min-w-[34rem] border-separate border-spacing-0 text-left text-sm">
          <thead>
            <tr className="font-mono text-xs text-muted-foreground">
              <th scope="col" className="border-b border-border px-3 pb-2 font-medium">
                Name
              </th>
              <th scope="col" className="border-b border-border px-3 pb-2 font-medium">
                Size
              </th>
              <th scope="col" className="border-b border-border px-3 pb-2 font-medium">
                Note
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name} className="hover:bg-card/60">
                <td className="border-b border-border/60 px-3 py-2.5">
                  {row.folder ? (
                    <button
                      type="button"
                      aria-expanded={open}
                      onClick={() => setOpen((value) => !value)}
                      className="flex items-center gap-2 rounded-md font-mono text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                    >
                      <ChevronDown
                        className={cn('size-4 text-muted-foreground transition-transform', !open && '-rotate-90')}
                        aria-hidden="true"
                      />
                      <FolderOpen className="size-4 text-plasma-soft" aria-hidden="true" />
                      {row.name}
                    </button>
                  ) : (
                    <span className={cn('flex items-center gap-2 font-mono text-foreground', row.depth === 1 && 'pl-7')}>
                      {row.depth === 0 && <span className="w-4" aria-hidden="true" />}
                      <FileText className="size-4 shrink-0 text-cyber" aria-hidden="true" />
                      <span className={cn(row.size === 'deleted' && 'text-muted-foreground line-through')}>
                        {row.name}
                      </span>
                    </span>
                  )}
                </td>
                <td className="border-b border-border/60 px-3 py-2.5 font-mono text-xs whitespace-nowrap text-muted-foreground">
                  {row.size}
                </td>
                <td className="border-b border-border/60 px-3 py-2.5 text-pretty text-foreground">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
