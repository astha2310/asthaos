import { ABOUT_LINES } from './data'

export function AboutApp() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <h2 className="sr-only">about_me.txt</h2>
      <div className="flex min-h-0 flex-1 overflow-auto bg-background/50 font-mono text-sm leading-7">
        <ol className="w-full py-3" aria-label="File contents">
          {ABOUT_LINES.map((line, index) => (
            <li key={index} className="flex gap-4 pr-5 hover:bg-sky/25">
              <span
                aria-hidden="true"
                className="w-10 shrink-0 border-r border-border pr-3 text-right text-muted-foreground/70 select-none"
              >
                {index + 1}
              </span>
              <span className="min-w-0 flex-1 text-pretty text-foreground">{line || '\u00a0'}</span>
            </li>
          ))}
        </ol>
      </div>
      <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-border bg-titlebar px-4 py-1.5 font-mono text-xs text-muted-foreground">
        <span>UTF-8 · plain text</span>
        <span>
          {ABOUT_LINES.length} lines · read only
        </span>
      </footer>
    </div>
  )
}
