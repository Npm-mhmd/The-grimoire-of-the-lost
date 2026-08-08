import { motion } from 'framer-motion'

const stats = [
  { value: '800+', label: 'Years of Dormancy',   desc: 'The grimoire lay sealed beneath the vault' },
  { value: 'III',  label: 'Lost Artifacts',       desc: 'Recovered from the crumbling pages' },
  { value: 'XII',  label: 'Forbidden Formulae',   desc: 'Still undeciphered by mortal hands' },
]

export default function LoreSection() {
  return (
    <section id="lore" className="min-h-screen flex flex-col md:flex-row items-stretch relative overflow-hidden">

      <div className="absolute inset-0 bg-gradient-to-b from-ink via-[#0e0b07]/80 to-ink pointer-events-none" />
      <div className="noise-overlay" />

      {/* ── Left: Large text ── */}
      <motion.div
        className="relative flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-20 py-24 z-10"
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="rune-label">The Vault's History</span>

        <h2 className="grimoire-title text-4xl md:text-5xl lg:text-6xl mt-2">
          A Legacy of<br />
          <em className="font-fell not-italic text-gold/80">the Forbidden</em>
        </h2>

        <div className="ink-divider my-8 max-w-sm" />

        <p className="font-fell text-ash/60 text-base md:text-lg leading-[1.95] max-w-lg italic">
          For eight centuries, the grimoire pulsed in silence beneath layers of dust
          and forgotten enchantments. Three artifacts survived the decay — each one
          a window into a power that was never meant to be found.
        </p>

        <p className="font-fell text-ash/45 text-sm leading-[1.9] max-w-lg mt-4 italic">
          The ink within its pages still moves. The runes still breathe. Whatever
          sealed this tome did not intend for it to be opened again.
        </p>

        {/* Decorative rune row */}
        <div className="flex items-center gap-4 mt-10">
          {['ᚠ','ᚢ','ᚦ','ᚨ','ᚱ','ᚲ'].map((r, i) => (
            <span key={i} className="text-gold/20 text-lg font-cinzel select-none">{r}</span>
          ))}
        </div>
      </motion.div>

      {/* ── Right: Stats card ── */}
      <motion.div
        className="relative flex-1 flex flex-col justify-center px-8 md:px-12 py-24 z-10 gap-6"
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Dark card */}
        <div className="parchment-card p-8 md:p-10 relative max-w-lg">
          <div className="corner-tl" /><div className="corner-tr" />
          <div className="corner-bl" /><div className="corner-br" />

          <p className="font-cinzel text-[0.6rem] tracking-[0.35em] uppercase text-gold/40 mb-6">
            — Arcane Records —
          </p>

          <div className="space-y-8">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                className="flex items-start gap-5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.12 }}
              >
                <span className="grimoire-title text-4xl md:text-5xl text-gold leading-none min-w-[3.5rem]">
                  {s.value}
                </span>
                <div className="pt-1">
                  <p className="font-cinzel text-ash/80 text-sm tracking-wide font-semibold">{s.label}</p>
                  <p className="font-fell text-ash/40 text-xs italic mt-1 leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="ink-divider mt-8" />

          <p className="font-fell text-ash/30 text-xs italic mt-4 text-center">
            "What the vault holds, the vault keeps — until the seal is broken."
          </p>
        </div>
      </motion.div>

    </section>
  )
}
