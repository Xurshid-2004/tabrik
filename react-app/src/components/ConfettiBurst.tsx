import { useEffect, useState, type CSSProperties } from 'react'

/** Longest piece: 1.5s max delay + 5s max fall, rounded up. */
const CLEANUP_AFTER = 6500

/** Fewer pieces on phones so the burst never janks weak GPUs. */
function pieceCount(): number {
  return window.innerWidth < 768 ? 100 : 180
}

const COLORS = [
  '#ffffff',
  '#00a9e0',
  '#1eb53a',
  '#d62828',
  '#ffd700',
  '#f4d276',
  '#ffb347',
] as const

type Piece = {
  id: number
  round: boolean
  style: CSSProperties
}

function makePieces(count: number): Piece[] {
  return Array.from({ length: count }, (_, id) => {
    const width = Math.random() * 8 + 6
    return {
      id,
      round: Math.random() > 0.7,
      style: {
        left: `${Math.random() * 100}vw`,
        width: `${width}px`,
        height: `${width * 1.5}px`,
        background: COLORS[id % COLORS.length],
        animationDelay: `${Math.random() * 1.5}s`,
        animationDuration: `${Math.random() * 2.5 + 2.5}s`,
      },
    }
  })
}

/**
 * Full-screen confetti rain in Uzbek flag colors + gold. Fires each time
 * `trigger` increments and cleans itself up when the last piece lands.
 */
export default function ConfettiBurst({ trigger }: { trigger: number }) {
  const [pieces, setPieces] = useState<Piece[]>([])

  useEffect(() => {
    if (trigger === 0) return
    setPieces(makePieces(pieceCount()))
    const cleanup = window.setTimeout(() => setPieces([]), CLEANUP_AFTER)
    return () => window.clearTimeout(cleanup)
  }, [trigger])

  if (pieces.length === 0) return null

  return (
    <div className="confetti-burst" aria-hidden="true">
      {pieces.map((piece) => (
        <span
          key={`${trigger}-${piece.id}`}
          className={piece.round ? 'confetti-piece round' : 'confetti-piece'}
          style={piece.style}
        />
      ))}
    </div>
  )
}
