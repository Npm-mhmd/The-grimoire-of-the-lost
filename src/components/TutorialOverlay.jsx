import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import TUTORIALS from '../tutorials/tutorials'
import DemonstrationOverlay from './DemonstrationOverlay'

export default function TutorialOverlay({ artifactColor, artifactIndex, initialTutorial, onClose }) {
  const [activeId, setActiveId] = useState(initialTutorial || TUTORIALS[0].id)
  const [showDemo, setShowDemo] = useState(false)

  const active     = TUTORIALS.find(t => t.id === activeId)
  const ActiveIcon = active?.Icon

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[300] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          className="relative z-10 w-full max-w-2xl max-h-[80vh] overflow-y-auto parchment-card p-6 md:p-8"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="corner-tl" /><div className="corner-tr" />
          <div className="corner-bl" /><div className="corner-br" />

          {/* Header */}
          <div className="flex items-start justify-between mb-6 gap-4">
            <span className="rune-label">Arcane Instructions</span>
            <button
              onClick={onClose}
              className="text-ash/40 hover:text-gold transition-colors flex-shrink-0 p-1"
            >
              <X size={14} strokeWidth={1.5} />
            </button>
          </div>

          <h2 className="grimoire-title text-xl md:text-2xl mb-6">
            How to Use the Grimoire
          </h2>

          {/* Tutorial tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {TUTORIALS.map(({ id, Icon, title }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveId(id)}
                className="flex items-center gap-1.5 font-cinzel text-[0.5rem] tracking-[0.2em] uppercase px-2 py-1.5 rounded transition-all duration-300"
                style={{
                  border:     `1px solid ${activeId === id ? `${artifactColor || '#c8a84b'}80` : 'rgba(200,168,75,0.15)'}`,
                  color:      activeId === id ? (artifactColor || '#c8a84b') : 'rgba(200,168,75,0.45)',
                  background: activeId === id ? `${artifactColor || '#c8a84b'}12` : 'transparent',
                }}
              >
                <Icon size={10} strokeWidth={1.5} />
                {title}
              </button>
            ))}
          </div>

          {/* Active content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25 }}
            >
              <h3 className="flex items-center gap-2 font-cinzel text-gold/80 text-sm tracking-wide mb-4">
                {ActiveIcon && <ActiveIcon size={13} strokeWidth={1.5} />}
                {active?.title}
              </h3>

              <ol className="space-y-2">
                {active?.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 font-fell text-ash/60 text-xs md:text-sm leading-relaxed">
                    <span
                      className="font-cinzel text-[0.45rem] tracking-widest mt-1 min-w-[1rem] text-center flex-shrink-0"
                      style={{ color: artifactColor || '#c8a84b' }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </motion.div>
          </AnimatePresence>

          {/* Footer */}
          <div className="ink-divider mt-6 mb-4" />
          <div className="flex flex-col gap-3">
            <p className="font-fell text-ash/30 text-xs italic">
              Master these arts, and the vault shall reveal its secrets
            </p>
            <button
              type="button"
              onClick={() => setShowDemo(true)}
              className="font-cinzel text-[0.5rem] tracking-[0.2em] uppercase px-3 py-1.5 rounded transition-all duration-300 border self-start"
              style={{ borderColor: `${artifactColor || '#c8a84b'}40`, color: artifactColor || '#c8a84b' }}
            >
              ✦ View Effect
            </button>
          </div>
        </motion.div>
      </motion.div>

      {showDemo && (
        <DemonstrationOverlay
          artifactIndex={artifactIndex ?? 0}
          artifactColor={artifactColor || '#c8a84b'}
          onClose={() => setShowDemo(false)}
        />
      )}
    </AnimatePresence>
  )
}
