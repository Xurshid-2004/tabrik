import { useMemo, type CSSProperties } from 'react'

/** Fewer stars on phones — twinkle animations add up on weak GPUs. */
function starCount(): number {
  return window.innerWidth < 768 ? 70 : 120
}

type StarStyle = CSSProperties & { '--duration': string }

type Star = {
  id: number
  big: boolean
  style: StarStyle
}

function makeStars(count: number): Star[] {
  return Array.from({ length: count }, (_, id) => ({
    id,
    big: Math.random() > 0.9,
    style: {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 70}%`,
      opacity: Math.random(),
      animationDelay: `${Math.random() * 5}s`,
      '--duration': `${Math.random() * 3 + 1}s`,
    },
  }))
}

/** Twinkling night-sky stars, generated once per page load. */
export default function Stars() {
  const stars = useMemo(() => makeStars(starCount()), [])

  return (
    <div className="stars" aria-hidden="true">
      {stars.map((star) => (
        <span
          key={star.id}
          className={star.big ? 'star big' : 'star'}
          style={star.style}
        />
      ))}
    </div>
  )
}
