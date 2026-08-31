import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import './WelcomeShower.css'

/** How long new particles keep falling (ms). */
const SHOWER_DURATION = 4000
/** Fade-out time after the shower ends (ms), matches the CSS transition. */
const FADE_DURATION = 700

/** Fewer particles on phones so the shower never janks weak GPUs. */
function particleCount(): number {
  return window.innerWidth < 768 ? 60 : 110
}

const FLOWERS = ['🌸', '🌺', '🌹', '🌼', '🌷', '💐'] as const
const CONFETTI_COLORS = [
  '#f94144',
  '#f3722c',
  '#f9c74f',
  '#90be6d',
  '#43aa8b',
  '#577590',
  '#c77dff',
  '#ff5d8f',
] as const

type ParticleStyle = CSSProperties & { '--drift': string }

type Particle = {
  id: number
  kind: 'flower' | 'confetti'
  emoji: string
  color: string
  style: ParticleStyle
}

function makeParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, id) => {
    const kind: Particle['kind'] = Math.random() < 0.45 ? 'flower' : 'confetti'
    const size = kind === 'flower' ? 18 + Math.random() * 16 : 7 + Math.random() * 7
    const style: ParticleStyle = {
      left: `${Math.random() * 100}%`,
      // spawn continuously across the first ~2.5s so the shower feels steady
      animationDelay: `${Math.random() * 2.5}s`,
      animationDuration: `${1.8 + Math.random() * 1.7}s`,
      '--drift': `${-60 + Math.random() * 120}px`,
    }
    if (kind === 'flower') {
      style.fontSize = `${size}px`
    } else {
      style.width = `${size}px`
      style.height = `${size * 0.45}px`
      style.background = CONFETTI_COLORS[id % CONFETTI_COLORS.length]
    }
    return {
      id,
      kind,
      emoji: FLOWERS[id % FLOWERS.length],
      color: CONFETTI_COLORS[id % CONFETTI_COLORS.length],
      style,
    }
  })
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/**
 * Full-screen celebratory shower of confetti and flowers shown once on page
 * load. Runs for SHOWER_DURATION, fades out, then unmounts completely so it
 * costs nothing afterwards. Skipped entirely for users who prefer reduced
 * motion.
 */
export default function WelcomeShower({ onDone }: { onDone?: () => void }) {
  const [visible, setVisible] = useState(() => !prefersReducedMotion())
  const [fading, setFading] = useState(false)
  const particles = useMemo(
    () => (visible ? makeParticles(particleCount()) : []),
    // particles are generated once for the lifetime of the effect
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  useEffect(() => {
    if (!visible) {
      onDone?.()
      return
    }
    const fadeTimer = window.setTimeout(() => {
      setFading(true)
      // signal the app that the heavy phase is over (video may start now)
      onDone?.()
    }, SHOWER_DURATION)
    const removeTimer = window.setTimeout(
      () => setVisible(false),
      SHOWER_DURATION + FADE_DURATION,
    )
    return () => {
      window.clearTimeout(fadeTimer)
      window.clearTimeout(removeTimer)
    }
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!visible) return null

  return createPortal(
    <div
      className={`welcome-shower${fading ? ' fading' : ''}`}
      aria-hidden="true"
      role="presentation"
    >
      {particles.map((p) =>
        p.kind === 'flower' ? (
          <span key={p.id} className="shower-particle flower" style={p.style}>
            {p.emoji}
          </span>
        ) : (
          <span key={p.id} className="shower-particle confetti" style={p.style} />
        ),
      )}
    </div>,
    document.body,
  )
}
