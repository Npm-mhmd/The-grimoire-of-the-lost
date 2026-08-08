import { useEffect, useRef } from 'react'
import useStore from '../store/useStore'

export default function AmbientSound() {
  const ctxRef = useRef(null)
  const hasInteracted = useStore((s) => s.hasInteracted)

  useEffect(() => {
    if (!hasInteracted) return

    const ctx = new AudioContext()
    ctxRef.current = ctx

    const masterGain = ctx.createGain()
    masterGain.gain.value = 0.025
    masterGain.connect(ctx.destination)

    const osc1 = ctx.createOscillator()
    osc1.type = 'sine'
    osc1.frequency.value = 55
    const gain1 = ctx.createGain()
    gain1.gain.value = 0.3
    osc1.connect(gain1)
    gain1.connect(masterGain)
    osc1.start()

    const osc2 = ctx.createOscillator()
    osc2.type = 'sine'
    osc2.frequency.value = 73.4
    const gain2 = ctx.createGain()
    gain2.gain.value = 0.15
    osc2.connect(gain2)
    gain2.connect(masterGain)
    osc2.start()

    const bufferSize = ctx.sampleRate * 2
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = noiseBuffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 3)
    }
    const noise = ctx.createBufferSource()
    noise.buffer = noiseBuffer
    noise.loop = true
    const noiseGain = ctx.createGain()
    noiseGain.gain.value = 0.04
    noise.connect(noiseGain)
    noiseGain.connect(masterGain)
    noise.start()

    return () => {
      ctx.close()
    }
  }, [hasInteracted])

  return null
}
