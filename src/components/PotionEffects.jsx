import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../store/useStore'

const ARTIFACT_COLORS = {
  'Clarity Elixir': '#4f8ef7',
  'Echo Capture': '#e85555',
  'Memory Mender': '#34d399',
}

export default function PotionEffects() {
  const activeEffect = useStore((s) => s.activeEffect)
  const [particles, setParticles] = useState([])

  useEffect(() => {
    if (!activeEffect) {
      const id = setTimeout(() => setParticles([]), 0)
      return () => clearTimeout(id)
    }

    const color = ARTIFACT_COLORS[activeEffect] ?? '#d4af37'

    const newParticles = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: window.innerHeight + 50,
      size: Math.random() * 20 + 10,
      color,
      delay: Math.random() * 0.5,
      duration: Math.random() * 2 + 2,
      targetX: Math.random() * window.innerWidth,
      targetY: -100 - Math.random() * 200,
    }))

    const id = setTimeout(() => setParticles(newParticles), 0)
    return () => clearTimeout(id)
  }, [activeEffect])

  return (
    <div className="fixed inset-0 pointer-events-none z-[200] overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ x: p.x, y: p.y, opacity: 0, scale: 0 }}
            animate={{ x: p.targetX, y: p.targetY, opacity: [0, 1, 1, 0], scale: [0, 1, 1.5, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: p.duration, delay: p.delay, ease: 'easeOut' }}
            className="absolute rounded-full"
            style={{ width: p.size, height: p.size, backgroundColor: p.color, boxShadow: `0 0 20px ${p.color}`, filter: 'blur(2px)' }}
          />
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {activeEffect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.12 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 mix-blend-overlay"
            style={{ backgroundColor: ARTIFACT_COLORS[activeEffect] ?? '#d4af37' }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
