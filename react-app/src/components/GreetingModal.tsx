import { useEffect, useRef, type MouseEvent } from 'react'

type Props = {
  open: boolean
  onClose: () => void
}

/**
 * Greeting card dialog. Stays mounted so the open/close CSS transitions run;
 * handles Escape, backdrop click, and moves focus to the close button when
 * opened so keyboard users are not stranded behind the overlay.
 */
export default function GreetingModal({ open, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return

    closeRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  const onBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose()
  }

  return (
    <div
      className={open ? 'modal active' : 'modal'}
      role="dialog"
      aria-modal="true"
      aria-labelledby="greeting-title"
      aria-hidden={!open}
      onClick={onBackdropClick}
    >
      <div className="card">
        <button
          ref={closeRef}
          type="button"
          className="close"
          aria-label="Yopish"
          onClick={onClose}
        >
          &times;
        </button>

        <div className="card-emblem" aria-hidden="true">
          🚆
        </div>
        <h2 id="greeting-title">Mustaqillik bayrami muborak!</h2>
        <div className="gold-line" />

        <p>
          <strong>Aziz temiryo'lchilar!</strong>
        </p>

        <p>
          Sizlarni jonajon Vatanimiz — O'zbekiston Respublikasi Mustaqilligining
          bayrami bilan chin qalbdan muborakbod etaman!
        </p>

        <p>
          Xonadonlaringizga tinchlik-xotirjamlik, qalblaringizga quvonch,
          mashaqqatli va sharafli mehnatingizga omad, yo'llaringizga esa doimo
          ravonlik tilaymiz.
        </p>

        <strong className="final">Mustaqilligimiz abadiy bo'lsin!</strong>

        <div className="signature">
          <span className="signature-note">Samimiy tilaklar bilan,</span>
          <span className="signature-name">Abduvaliyev Xurshid 🌟</span>
        </div>
      </div>
    </div>
  )
}
