'use client'

import { useEffect, useState } from 'react'
import { BootScreen } from './boot-screen'
import { Desktop } from './desktop'
import { LoginScreen } from './login-screen'

type Stage = 'boot' | 'login' | 'desktop'

export function AsthaOS() {
  const [stage, setStage] = useState<Stage>('boot')
  const [matrix, setMatrix] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('matrix', matrix)
  }, [matrix])

  if (stage === 'boot') return <BootScreen onDone={() => setStage('login')} />
  if (stage === 'login') return <LoginScreen onUnlock={() => setStage('desktop')} />

  return (
    <Desktop
      matrix={matrix}
      onToggleMatrix={() => setMatrix((value) => !value)}
      onLock={() => setStage('login')}
    />
  )
}
