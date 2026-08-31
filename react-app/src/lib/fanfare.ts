let ctx: AudioContext | null = null

/**
 * Short celebratory fanfare (C–E–G–C arpeggio) synthesized with the Web Audio
 * API. Replaces the old external mp3, whose CDN returns 403 — this version
 * needs no network and can never fail to load. Must be called from a user
 * gesture (click) so the browser allows audio.
 */
export function playFanfare() {
  try {
    ctx ??= new AudioContext()
    if (ctx.state === 'suspended') void ctx.resume()

    const now = ctx.currentTime
    const master = ctx.createGain()
    master.gain.value = 0.18
    master.connect(ctx.destination)

    // [frequency Hz, start offset s, duration s]
    const notes: Array<[number, number, number]> = [
      [523.25, 0, 0.18], // C5
      [659.25, 0.12, 0.18], // E5
      [783.99, 0.24, 0.18], // G5
      [1046.5, 0.36, 0.7], // C6 — held
      [1318.51, 0.36, 0.7], // E6 — chord sparkle
    ]

    for (const [freq, start, dur] of notes) {
      const osc = ctx.createOscillator()
      osc.type = 'triangle'
      osc.frequency.value = freq

      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0, now + start)
      gain.gain.linearRampToValueAtTime(1, now + start + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, now + start + dur)

      osc.connect(gain)
      gain.connect(master)
      osc.start(now + start)
      osc.stop(now + start + dur + 0.05)
    }
  } catch {
    // Audio unavailable — the celebration continues silently
  }
}
