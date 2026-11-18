import { SKILL_MODULES } from './data'
import { TagChip } from './tag-chip'

const tints = ['sky', 'lavender', 'blush', 'mint'] as const

export function SkillsApp() {
  const total = SKILL_MODULES.reduce((sum, mod) => sum + mod.skills.length, 0)

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-border bg-titlebar px-4 py-2">
        <h2 className="font-sans text-sm font-semibold text-foreground">Installed Modules</h2>
        <p className="font-mono text-xs text-muted-foreground">
          {SKILL_MODULES.length} modules · {total} skills · all healthy
        </p>
      </div>
      <ul className="flex min-h-0 flex-1 flex-col gap-3 overflow-auto bg-background/50 p-3">
        {SKILL_MODULES.map((mod, index) => (
          <li key={mod.name} className="flex flex-col gap-3 rounded-xl border border-border bg-card/60 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-sans text-base font-semibold text-foreground">{mod.name}</h3>
              <span className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                <span className="relative flex size-2.5" aria-hidden="true">
                  <span className="absolute inset-0 animate-ping rounded-full bg-mint opacity-70 motion-reduce:hidden" />
                  <span className="relative size-2.5 rounded-full bg-mint ring-1 ring-navy/20" />
                </span>
                {mod.file} · installed
              </span>
            </div>
            <ul className="flex flex-wrap gap-2" aria-label={`${mod.name} skills`}>
              {mod.skills.map((skill) => (
                <li key={skill}>
                  <TagChip tint={tints[index % tints.length]}>{skill}</TagChip>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  )
}
