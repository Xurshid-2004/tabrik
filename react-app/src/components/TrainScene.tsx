import { useEffect, useRef, useState } from 'react'

const VIDEO_SRC = '/train.mp4'

type Props = {
  /**
   * While true the footage is paused — used during the welcome shower and
   * while the greeting modal is open, so the video never competes with the
   * particle animations for the GPU (prevents stutter on phones).
   */
  paused?: boolean
}

/**
 * Real locomotive footage at the bottom of the scene — replaces the old
 * CSS-drawn train. The video fades in only once it can play (no flash of an
 * empty box), is masked so it blends into the night sky, and degrades to a
 * plain dark ground if the file fails to load. For reduced-motion users the
 * footage stays paused on its first frame.
 */
export default function TrainScene({ paused = false }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Autoplay policies require muted playback; guarantee it before play()
    video.muted = true

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (paused || reducedMotion) {
      video.pause()
      return
    }

    video.play().catch(() => {
      // Autoplay blocked by the browser — the still first frame remains visible
    })
  }, [paused])

  if (failed) {
    return <div className="train-scene-fallback" aria-hidden="true" />
  }

  return (
    <div className="train-scene" aria-hidden="true">
      <video
        ref={videoRef}
        className={`train-video${ready ? ' ready' : ''}`}
        src={VIDEO_SRC}
        autoPlay={false}
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        tabIndex={-1}
        onCanPlay={() => setReady(true)}
        onError={() => setFailed(true)}
      />
    </div>
  )
}
