import { motion } from 'framer-motion'
import { BookOpen, ScanSearch, Flame } from 'lucide-react'

const rules = [
  {
    Icon: BookOpen,
    title: 'Consult the Index',
    desc: 'Each artifact is catalogued within the grimoire\'s forbidden index. Select a relic to reveal its nature, its origin, and the power it holds.',
    rune: 'ᚠ',
  },
  {
    Icon: ScanSearch,
    title: 'Examine the Relic',
    desc: 'Rotate, inspect, and study the artifact in the interactive 3D viewer. Drag to reveal hidden details etched into its surface by ancient hands.',
    rune: 'ᚢ',
  },
  {
    Icon: Flame,
    title: 'Invoke the Formula',
    desc: 'Speak the artifact\'s name into the grimoire. The enchantment responds — particles rise, the seal breaks, and the power is yours to command.',
    rune: 'ᚦ',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 px-6 relative overflow-hidden">
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
          <span className="rune-label">The Rule of Three</span>
          <h2 className="grimoire-title text-4xl md:text-5xl mt-2">How It Works</h2>
          <div className="ink-divider max-w-xs mx-auto mt-6" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rules.map(({ Icon, title, desc, rune }, i) => (
            <motion.div
              key={title}
              className="tome-card group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="corner-tl" /><div className="corner-br" />

              <span className="absolute top-4 right-5 text-gold/8 text-5xl font-cinzel select-none pointer-events-none">
                {rune}
              </span>

              <span className="font-cinzel text-[0.55rem] tracking-[0.4em] text-gold/35 uppercase">
                Step {String(i + 1).padStart(2, '0')}
              </span>

              <div className="text-gold/60 group-hover:text-gold transition-colors duration-400 mt-1">
                <Icon size={36} strokeWidth={1.2} />
              </div>

              <h3 className="font-cinzel text-ash/85 text-base tracking-wide font-semibold mt-1">
                {title}
              </h3>

              <div className="w-8 h-px bg-gold/25 group-hover:w-16 transition-all duration-500" />

              <p className="font-fell text-ash/50 text-sm leading-[1.85] italic max-w-xs">
                {desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
