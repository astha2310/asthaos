'use client'

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { APPS, RESUME_URL } from '../apps'
import { CONTACT, useOs } from '../os-context'
import { JOBS, PROJECTS, SKILL_MODULES } from './data'

const PROMPT = 'recruiter@asthaos:~$ '

type Line = { id: number; content: ReactNode; tone?: 'muted' | 'error' | 'accent' }

const COMMANDS: [string, string][] = [
  ['help', 'list all commands'],
  ['whoami', 'show your current session'],
  ['about', 'a 3-line summary of Astha'],
  ['experience', 'work history with dates'],
  ['projects', 'all project names'],
  ['skills', 'skill module names'],
  ['certs', 'certifications and status'],
  ['contact', 'email and LinkedIn'],
  ['resume', 'open resume.pdf in a new tab'],
  ['ls', 'list desktop files'],
  ['cat <file>', 'open a file as a window (alias: open)'],
  ['nmap astha', 'scan the candidate for open roles'],
  ['sudo hire-astha', 'you know you want to'],
  ['history', 'show past commands'],
  ['clear', 'clear the screen'],
  ['exit', 'close the terminal'],
]

const NMAP = [
  'Starting Nmap scan on astha.patel...',
  'PORT      STATE  SERVICE',
  '443/tcp   open   security-analyst',
  '8443/tcp  open   soc',
  '9000/tcp  open   grc',
  '3389/tcp  open   it-support',
  'Scan complete. 4 open roles found. 0 vulnerabilities.',
]

const linkClass =
  'text-cyber underline decoration-cyber/40 underline-offset-4 hover:decoration-cyber focus-visible:outline-2 focus-visible:outline-ring'

function findApp(name: string) {
  const query = name.trim().toLowerCase().replace(/\/$/, '')
  return APPS.find((app) => {
    const label = app.label.toLowerCase()
    return label === query || label.replace(/\/$/, '') === query || label.split('.')[0] === query || app.id === query
  })
}

export function TerminalApp() {
  const { openApp, closeApp } = useOs()
  const nextId = useRef(1)
  const [lines, setLines] = useState<Line[]>(() => [
    { id: 0, content: "AsthaOS terminal. Type 'help' to see commands.", tone: 'muted' },
  ])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [cursor, setCursor] = useState<number | null>(null)
  const [busy, setBusy] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const timers = useRef<number[]>([])

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true })
    const pending = timers.current
    return () => pending.forEach((timer) => window.clearTimeout(timer))
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [lines])

  useEffect(() => {
    if (!busy) inputRef.current?.focus({ preventScroll: true })
  }, [busy])

  const print = (...entries: (ReactNode | [ReactNode, Line['tone']])[]) => {
    setLines((prev) => [
      ...prev,
      ...entries.map((entry) => {
        const [content, tone] = Array.isArray(entry) ? entry : [entry, undefined]
        return { id: nextId.current++, content, tone }
      }),
    ])
  }

  const run = (raw: string) => {
    const command = raw.trim()
    print(
      <span>
        <span className="text-cyber">{PROMPT}</span>
        {command}
      </span>,
    )
    if (!command) return

    const nextHistory = [...history, command]
    setHistory(nextHistory)
    const [name, ...rest] = command.split(/\s+/)
    const arg = rest.join(' ')

    switch (name.toLowerCase()) {
      case 'help':
        print(
          ...COMMANDS.map(([cmd, desc]) => (
            <span key={cmd}>
              <span className="inline-block w-40 text-cyber">{cmd}</span>
              <span className="text-muted-foreground">{desc}</span>
            </span>
          )),
        )
        return
      case 'whoami':
        print("recruiter (guest access). You are viewing Astha Patel's portfolio.")
        return
      case 'about':
        print(
          'Astha Patel.',
          'Security Analyst · SOC · GRC.',
          'M.S. IT (Security), Arizona State University, 2026.',
        )
        return
      case 'experience':
        print(...JOBS.map((job) => `[${job.start} → ${job.end}]  ${job.title} @ ${job.org}`))
        return
      case 'projects':
        print(...PROJECTS.map((project) => `- ${project.name}`))
        return
      case 'skills':
        print(...SKILL_MODULES.map((module) => `- ${module.name}`))
        return
      case 'certs':
        print('CompTIA Security+ (in progress, expected Jan 2027) · AWS Cloud Security Foundations (verified)')
        return
      case 'contact':
        print(
          <span>
            email:{'    '}
            <a href={`mailto:${CONTACT.email}`} className={linkClass}>
              {CONTACT.email}
            </a>
          </span>,
          <span>
            linkedin:{' '}
            <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" className={linkClass}>
              linkedin.com/in/asthap23
            </a>
          </span>,
        )
        return
      case 'resume':
        window.open(RESUME_URL, '_blank', 'noopener,noreferrer')
        print(['Opening resume.pdf in a new tab...', 'muted'])
        return
      case 'ls':
        print(APPS.map((app) => app.label).join('   '))
        return
      case 'cat':
      case 'open': {
        if (!arg) {
          print([`usage: ${name} <filename>. Try 'ls'.`, 'error'])
          return
        }
        const app = findApp(arg)
        if (!app) {
          print([`${name}: ${arg}: No such file. Try 'ls'.`, 'error'])
          return
        }
        if (app.id === 'terminal') {
          print(['You are already in the terminal.', 'muted'])
          return
        }
        print([`Opening ${app.label}...`, 'muted'])
        openApp(app.id)
        return
      }
      case 'nmap':
        if (arg.toLowerCase() !== 'astha') {
          print([`nmap: target '${arg || '(none)'}' is out of scope. Try 'nmap astha'.`, 'error'])
          return
        }
        print(...NMAP)
        return
      case 'sudo':
        if (arg.toLowerCase() !== 'hire-astha') {
          print([`sudo: ${arg || 'a command'} is not allowed. Try 'sudo hire-astha'.`, 'error'])
          return
        }
        print('[sudo] password for recruiter: ********')
        setBusy(true)
        timers.current.push(
          window.setTimeout(() => print(['Permission granted. Preparing interview invite...', 'accent']), 700),
          window.setTimeout(() => {
            print(
              <a href={CONTACT.interviewMailto} className={linkClass}>
                Send invite
              </a>,
            )
            setBusy(false)
          }, 1500),
        )
        return
      case 'history':
        print(...nextHistory.map((entry, index) => `${String(index + 1).padStart(4, ' ')}  ${entry}`))
        return
      case 'clear':
        setLines([])
        return
      case 'exit':
        closeApp('terminal')
        return
      default:
        print([`command not found: ${name}. Type 'help'.`, 'error'])
    }
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (event.nativeEvent.isComposing || event.keyCode === 229) return
      event.preventDefault()
      run(input)
      setInput('')
      setCursor(null)
      return
    }
    if (event.key === 'ArrowUp' && history.length > 0) {
      event.preventDefault()
      const next = cursor === null ? history.length - 1 : Math.max(0, cursor - 1)
      setCursor(next)
      setInput(history[next])
      return
    }
    if (event.key === 'ArrowDown' && cursor !== null) {
      event.preventDefault()
      const next = cursor + 1
      if (next >= history.length) {
        setCursor(null)
        setInput('')
      } else {
        setCursor(next)
        setInput(history[next])
      }
    }
  }

  return (
    <div
      ref={scrollRef}
      onClick={(event) => {
        if (!(event.target as HTMLElement).closest('a') && !window.getSelection()?.toString()) {
          inputRef.current?.focus({ preventScroll: true })
        }
      }}
      className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-terminal p-4 font-mono text-[13px] leading-relaxed text-foreground"
    >
      <div role="log" aria-live="polite" aria-label="Terminal output" className="flex flex-col">
        {lines.map((line) => (
          <p
            key={line.id}
            className={
              line.tone === 'error'
                ? 'break-words whitespace-pre-wrap text-flare-soft'
                : line.tone === 'muted'
                  ? 'break-words whitespace-pre-wrap text-muted-foreground'
                  : line.tone === 'accent'
                    ? 'break-words whitespace-pre-wrap text-cyber'
                    : 'break-words whitespace-pre-wrap'
            }
          >
            {line.content}
          </p>
        ))}
      </div>
      <div className={busy ? 'invisible' : 'flex items-center'}>
        <label htmlFor="terminal-input" className="shrink-0 whitespace-pre text-cyber">
          {PROMPT}
          <span className="sr-only">Command</span>
        </label>
        <div className="relative flex min-w-0 flex-1 items-center">
          <input
            ref={inputRef}
            id="terminal-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={onKeyDown}
            disabled={busy}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="send"
            className="peer w-full bg-transparent text-base text-transparent caret-transparent outline-none md:text-[13px]"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 flex max-w-full items-center overflow-hidden text-base whitespace-pre text-foreground md:text-[13px]"
          >
            {input}
            <span className="caret ml-px inline-block h-[1.1em] w-[0.6em] bg-cyber opacity-0 peer-focus:opacity-100" />
          </span>
        </div>
      </div>
    </div>
  )
}
