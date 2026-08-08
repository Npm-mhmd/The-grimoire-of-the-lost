import { useState } from 'react'
import { motion } from 'framer-motion'
import TUTORIALS from '../tutorials/tutorials'
import TutorialOverlay from './TutorialOverlay'

export default function TutorialSection() {
  const [activeTutorial, setActiveTutorial] = useState(null)

  return (
    <>
      <section id="tutorials" className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-[#0f0c08]/70 to-ink pointer-events-none" />
        <div className="noise-overlay" />

        <div className="relative z-10 max-w-6xl mx-auto">

          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8 }}
          >
            <span className="rune-label">Arcane Instructions</span>
            <h2 className="grimoire-title text-4xl md:text-5xl mt-2">Tutorials</h2>
            <div className="ink-divider max-w-xs mx-auto mt-6" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TUTORIALS.map(({ id, Icon, title, steps }, i) => (
              <motion.div
                key={id}
                className="tome-card group cursor-pointer"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setActiveTutorial(id)}
              >
                <div className="corner-tl" /><div className="corner-br" />

                <span className="font-cinzel text-[0.55rem] tracking-[0.4em] text-gold/35 uppercase">
                  Lesson {String(i + 1).padStart(2, '0')}
                </span>

                <div className="text-gold/60 group-hover:text-gold transition-colors duration-300 mt-1">
                  <Icon size={34} strokeWidth={1.2} />
                </div>

                <h3 className="font-cinzel text-ash/85 text-base tracking-wide font-semibold mt-1">
                  {title}
                </h3>

                <div className="w-8 h-px bg-gold/25 group-hover:w-16 transition-all duration-500" />

                <ol className="space-y-2 text-left w-full px-2">
                  {steps.slice(0, 2).map((step, si) => (
                    <li key={si} className="font-fell text-ash/50 text-xs leading-relaxed italic flex items-start gap-2">
                      <span className="text-gold/40 mt-0.5">✦</span>
                      <span>{step}</span>
                    </li>
                  ))}
                  {steps.length > 2 && (
                    <li className="font-cinzel text-gold/30 text-[0.5rem] tracking-widest text-center pt-1">
                      +{steps.length - 2} more steps
                    </li>
                  )}
                </ol>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 flex flex-col items-center gap-4">
            <div className="ink-divider w-full max-w-md" />
            <p className="font-cinzel text-ash/25 text-[0.55rem] tracking-[0.35em] uppercase text-center">
              Master these arts, and the vault shall reveal its secrets
            </p>
          </div>

        </div>
      </section>

      {activeTutorial && (
        <TutorialOverlay
          artifactColor="#c8a84b"
          artifactIndex={0}
          initialTutorial={activeTutorial}
          onClose={() => setActiveTutorial(null)}
        />
      )}
    </>
  )
}
