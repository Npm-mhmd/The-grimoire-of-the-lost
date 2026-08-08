import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ─────────────────────────────────────────────
   MEMORY MENDER — shattered glass → whole
───────────────────────────────────────────── */
const SHARDS = [
  { id: 0,  d: 'M50,50 L20,10 L5,40 Z',        tx: -60, ty: -55, r: -35 },
  { id: 1,  d: 'M50,50 L20,10 L55,0 Z',         tx: -10, ty: -70, r: 20  },
  { id: 2,  d: 'M50,50 L55,0 L90,15 Z',         tx: 40,  ty: -65, r: 15  },
  { id: 3,  d: 'M50,50 L90,15 L100,50 Z',       tx: 65,  ty: -20, r: 30  },
  { id: 4,  d: 'M50,50 L100,50 L95,80 Z',       tx: 60,  ty: 30,  r: -20 },
  { id: 5,  d: 'M50,50 L95,80 L75,100 Z',       tx: 40,  ty: 60,  r: 25  },
  { id: 6,  d: 'M50,50 L75,100 L40,100 Z',      tx: 0,   ty: 70,  r: -10 },
  { id: 7,  d: 'M50,50 L40,100 L10,85 Z',       tx: -45, ty: 55,  r: 20  },
  { id: 8,  d: 'M50,50 L10,85 L5,40 Z',         tx: -65, ty: 15,  r: -30 },
  { id: 9,  d: 'M50,50 L30,30 L55,0 L20,10 Z',  tx: -20, ty: -40, r: 15  },
  { id: 10, d: 'M50,50 L70,30 L90,15 L55,0 Z',  tx: 30,  ty: -45, r: -15 },
  { id: 11, d: 'M50,50 L80,65 L100,50 L95,80 Z',tx: 55,  ty: 10,  r: 10  },
]

export function MemoryMenderEffect({ active }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <svg viewBox="0 0 100 100" className="w-48 h-48 md:w-64 md:h-64" style={{ filter: 'drop-shadow(0 0 8px #34d39988)' }}>
            {/* gold kintsugi seams — fade in after shards assemble */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.6 }}
            >
              <line x1="50" y1="50" x2="20" y2="10" stroke="#c8a84b" strokeWidth="0.6" opacity="0.7" />
              <line x1="50" y1="50" x2="55" y2="0"  stroke="#c8a84b" strokeWidth="0.5" opacity="0.6" />
              <line x1="50" y1="50" x2="90" y2="15" stroke="#c8a84b" strokeWidth="0.6" opacity="0.7" />
              <line x1="50" y1="50" x2="100" y2="50" stroke="#c8a84b" strokeWidth="0.5" opacity="0.6" />
              <line x1="50" y1="50" x2="75" y2="100" stroke="#c8a84b" strokeWidth="0.6" opacity="0.7" />
              <line x1="50" y1="50" x2="10" y2="85" stroke="#c8a84b" strokeWidth="0.5" opacity="0.6" />
              <line x1="50" y1="50" x2="5"  y2="40" stroke="#c8a84b" strokeWidth="0.6" opacity="0.7" />
            </motion.g>

            {SHARDS.map((s, i) => (
              <motion.path
                key={s.id}
                d={s.d}
                fill="#34d399"
                fillOpacity="0.18"
                stroke="#34d399"
                strokeWidth="0.5"
                strokeOpacity="0.7"
                initial={{ x: s.tx, y: s.ty, rotate: s.r, opacity: 0.9 }}
                animate={{ x: 0, y: 0, rotate: 0, opacity: 0.22 }}
                transition={{
                  duration: 1.1,
                  delay: i * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            ))}
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ─────────────────────────────────────────────
   ECHO CAPTURE — jagged waves → smooth sine
───────────────────────────────────────────── */
function buildWavePath(width, height, t, chaos) {
  const cx = width / 2
  const cy = height / 2
  const amp = height * 0.32
  const points = []
  const steps = 80
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * width
    const phase = (i / steps) * Math.PI * 4 + t
    // chaos = 1 → jagged noise, chaos = 0 → pure sine
    const noise = chaos * (Math.sin(phase * 3.7) * 0.4 + Math.sin(phase * 7.1) * 0.25 + Math.sin(phase * 13.3) * 0.15)
    const y = cy + Math.sin(phase) * amp * (1 - chaos * 0.4) + noise * amp
    points.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`)
  }
  return points.join(' ')
}

export function EchoCaptureEffect({ active }) {
  const canvasRef = useRef(null)
  const rafRef    = useRef(null)
  const startRef  = useRef(null)
  const DURATION  = 3000 // ms to go from chaos → smooth

  useEffect(() => {
    if (!active) { cancelAnimationFrame(rafRef.current); return }
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    startRef.current = performance.now()

    const draw = (now) => {
      const elapsed = now - startRef.current
      const progress = Math.min(elapsed / DURATION, 1)
      // ease out: chaos starts at 1, ends at 0
      const chaos = 1 - progress * progress

      const W = canvas.width
      const H = canvas.height
      ctx.clearRect(0, 0, W, H)

      const t = elapsed * 0.003

      // draw 3 wave layers
      const layers = [
        { alpha: 0.25, offset: 0,    width: 1.5 },
        { alpha: 0.55, offset: 0.8,  width: 2   },
        { alpha: 0.9,  offset: -0.5, width: 2.5 },
      ]

      layers.forEach(({ alpha, offset, width }) => {
        const path = new Path2D(buildWavePath(W, H, t + offset, chaos))
        ctx.beginPath()
        ctx.strokeStyle = `rgba(232, 85, 85, ${alpha})`
        ctx.lineWidth = width
        ctx.lineJoin = 'round'
        ctx.lineCap  = 'round'
        ctx.stroke(path)

        // glow pass
        ctx.save()
        ctx.filter = 'blur(3px)'
        ctx.strokeStyle = `rgba(232, 85, 85, ${alpha * 0.4})`
        ctx.lineWidth = width * 2.5
        ctx.stroke(path)
        ctx.restore()
      })

      // center baseline
      ctx.beginPath()
      ctx.strokeStyle = `rgba(232, 85, 85, ${0.12 + progress * 0.1})`
      ctx.lineWidth = 0.5
      ctx.moveTo(0, H / 2)
      ctx.lineTo(W, H / 2)
      ctx.stroke()

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafRef.current)
  }, [active])

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <canvas
            ref={canvasRef}
            width={320}
            height={160}
            className="w-full h-full"
            style={{ maxWidth: 320, maxHeight: 160 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ─────────────────────────────────────────────
   CLARITY ELIXIR — blurry parchment → sharp
───────────────────────────────────────────── */
const PARCHMENT_LINES = [
  { w: '85%', y: '28%' },
  { w: '70%', y: '38%' },
  { w: '90%', y: '48%' },
  { w: '60%', y: '58%' },
  { w: '78%', y: '68%' },
]

export function ClarityElixirEffect({ active }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* parchment card */}
          <div
            className="relative w-full max-w-[220px] rounded-sm overflow-hidden"
            style={{
              background: 'linear-gradient(160deg, #e8d9b0 0%, #ddd0a0 50%, #e4d6a8 100%)',
              border: '1px solid rgba(200,168,75,0.4)',
              padding: '18px 16px',
              boxShadow: 'inset 0 0 30px rgba(0,0,0,0.15), 0 4px 20px rgba(0,0,0,0.5)',
            }}
          >
            {/* title line */}
            <motion.div
              className="mb-3 h-3 rounded-full mx-auto"
              style={{ width: '55%', background: '#5c4a2e', transformOrigin: 'center' }}
              initial={{ filter: 'blur(6px)', opacity: 0.3 }}
              animate={{ filter: 'blur(0px)', opacity: 1 }}
              transition={{ duration: 1.8, ease: 'easeOut' }}
            />

            {/* text lines */}
            {PARCHMENT_LINES.map((line, i) => (
              <motion.div
                key={i}
                className="rounded-full mb-2"
                style={{
                  width: line.width,
                  height: 5,
                  background: i % 2 === 0 ? '#7a6040' : '#9a7a50',
                  opacity: 0.7,
                }}
                initial={{ filter: 'blur(8px)', opacity: 0.15 }}
                animate={{ filter: 'blur(0px)', opacity: i % 2 === 0 ? 0.7 : 0.5 }}
                transition={{ duration: 1.4, delay: 0.15 + i * 0.18, ease: 'easeOut' }}
              />
            ))}

            {/* ink drop ripple — the elixir landing */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 8, height: 8,
                background: 'rgba(79,142,247,0.6)',
                top: '50%', left: '50%',
                transform: 'translate(-50%,-50%)',
                boxShadow: '0 0 12px rgba(79,142,247,0.8)',
              }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 18, opacity: 0 }}
              transition={{ duration: 1.6, ease: 'easeOut' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
