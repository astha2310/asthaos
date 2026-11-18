import { cn } from '@/lib/utils'

const STATUS = [
  'Open to Security Analyst, SOC and GRC roles',
  'Also open to IT support roles',
  'Studying for CompTIA Security+',
  'Open to relocation',
]

export function StickyNote({ variant }: { variant: 'desktop' | 'widget' }) {
  return (
    <aside
      aria-labelledby={`status-note-${variant}`}
      className={cn(
        'relative flex flex-col gap-3 border-t-4 border-note-edge bg-note text-foreground shadow-window',
        variant === 'desktop' ? 'w-64 rotate-2 rounded-lg p-5 pt-6' : 'w-full rounded-3xl p-5',
      )}
    >
      {variant === 'desktop' && (
        <span
          aria-hidden="true"
          className="absolute -top-2.5 left-1/2 h-5 w-16 -translate-x-1/2 -rotate-3 rounded-sm bg-plasma/50"
        />
      )}
      <h2 id={`status-note-${variant}`} className="font-mono text-xs font-semibold tracking-widest uppercase">
        Status:
      </h2>
      <ul className="flex flex-col gap-2 text-sm leading-relaxed">
        {STATUS.map((item) => (
          <li key={item} className="flex gap-2">
            <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-note-edge" />
            {item}
          </li>
        ))}
      </ul>
    </aside>
  )
}
