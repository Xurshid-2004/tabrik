import { useCallback, useState, type CSSProperties } from 'react'
import ConfettiBurst from './components/ConfettiBurst'
import GreetingModal from './components/GreetingModal'
import Stars from './components/Stars'
import TrainScene from './components/TrainScene'
import WelcomeShower from './components/WelcomeShower'
import { playFanfare } from './lib/fanfare'
import './App.css'

type ParticleStyle = CSSProperties & { '--duration': string }

const GOLD_PARTICLES: ParticleStyle[] = [
  { left: '15%', top: '30%', '--duration': '4s' },
  { left: '25%', top: '45%', '--duration': '6s', animationDelay: '1s' },
  { left: '80%', top: '35%', '--duration': '5s', animationDelay: '2s' },
  { left: '88%', top: '50%', '--duration': '7s', animationDelay: '0.5s' },
  { left: '65%', top: '25%', '--duration': '4.5s', animationDelay: '1.5s' },
  { left: '10%', top: '60%', '--duration': '5.5s', animationDelay: '2.5s' },
  { left: '95%', top: '70%', '--duration': '6.5s', animationDelay: '0.8s' },
]

function App() {
  const [modalOpen, setModalOpen] = useState(false)
  const [confettiTrigger, setConfettiTrigger] = useState(0)
  const [showerDone, setShowerDone] = useState(false)
  const onShowerDone = useCallback(() => setShowerDone(true), [])

  const openModal = useCallback(() => {
    setModalOpen(true)
    setConfettiTrigger((n) => n + 1)
    playFanfare()
  }, [])

  const closeModal = useCallback(() => {
    setModalOpen(false)
  }, [])

  return (
    <div className="app">
      <WelcomeShower onDone={onShowerDone} />

      <div className="sky-glow" aria-hidden="true" />
      <Stars />

      <header className="header">
        <div className="brand">
          <div className="brand-icon" aria-hidden="true">
            🚆
          </div>
          <div className="brand-text">
            <div className="brand-title">MUSTAQILLIK</div>
            <div className="brand-subtitle">EKSPRESSI</div>
          </div>
        </div>
        <div className="date">🇺🇿 1 SENTYABR</div>
      </header>

      <section className="hero">
        <div className="badge">🇺🇿 O'zbekiston Mustaqilligi</div>

        <h1>
          Mustaqillik
          <span>bayrami muborak!</span>
        </h1>

        <p className="subtitle">
          Temiryo'lchilarimizga mustahkam sog'liq, xonadonlariga tinchlik,
          farovonlik va mashaqqatli mehnatlarida omad tilaymiz.
        </p>

        <button type="button" className="open-button" onClick={openModal}>
          🎁 &nbsp; Tabrikni ochish
        </button>
      </section>

      <div className="moon" aria-hidden="true" />

      {/* video zarlar tugaguncha va modal ochiq payt pauza — GPU raqobati bo'lmasin */}
      <TrainScene paused={!showerDone || modalOpen} />

      {GOLD_PARTICLES.map((style, i) => (
        <span key={i} className="particle" style={style} aria-hidden="true" />
      ))}

      <GreetingModal open={modalOpen} onClose={closeModal} />
      <ConfettiBurst trigger={confettiTrigger} />
    </div>
  )
}

export default App
