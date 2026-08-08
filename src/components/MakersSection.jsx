import { motion } from 'framer-motion'

const team = [
  { name: 'Mohamed chermiti',    role: 'Keeper of Clarity',    craft: 'Dev and 3D',   initials: 'AV', rune: 'ᚠ' },
]

export default function MakersSection() {
  return (
    <footer id="makers" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-[#0d0a07]/60 to-[#080604] pointer-events-none" />
      <div className="noise-overlay" />

      <div className="relative z-10 max-w-6xl mx-auto">

        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="rune-label">The Archivists</span>
          <h2 className="grimoire-title text-4xl md:text-5xl mt-2">Those Who Found It</h2>
          <div className="ink-divider max-w-xs mx-auto mt-6" />
          <p className="font-fell text-ash/40 italic text-sm mt-4 max-w-sm mx-auto">
            Recovered from the dark — built with Three.js, forged in code.
          </p>
        </motion.div>

        <div className="grid gap-5">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              className="maker-card group relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Rune watermark */}
              <span className="absolute bottom-3 right-4 text-gold/6 text-5xl font-cinzel select-none pointer-events-none">
                {member.rune}
              </span>

              {/* Avatar circle */}
              <div className="w-16 h-16 rounded-full border border-gold/20 bg-gradient-to-br from-leather to-[#0e0b06] flex items-center justify-center mb-4 group-hover:border-gold/40 transition-colors duration-400">
                <span className="font-cinzel text-gold/70 text-base font-bold group-hover:text-gold transition-colors duration-400">
                  {member.initials}
                </span>
              </div>

              {/* Name / Role toggle */}
              <p className="font-cinzel text-ash/75 text-sm tracking-wide font-semibold group-hover:hidden">
                {member.name}
              </p>
              <p className="font-cinzel text-gold text-sm tracking-wide font-semibold hidden group-hover:block">
                {member.role}
              </p>

              <p className="font-fell text-ash/40 text-xs italic mt-1 group-hover:hidden">
                {member.craft}
              </p>
              <p className="font-fell text-ash/50 text-xs italic mt-1 hidden group-hover:block">
                Formerly {member.craft}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Footer rule */}
        <div className="mt-16 flex flex-col items-center gap-4">
          <div className="ink-divider w-full max-w-md" />
          <p className="font-cinzel text-ash/25 text-[0.55rem] tracking-[0.35em] uppercase text-center">
            Grimoire of the Lost &mdash; Recovered from the Forbidden Vault
          </p>
          <div className="flex gap-6 mt-2">
            {['ᚠ','ᚢ','ᚦ','ᚨ','ᚱ','ᚲ','ᚷ','ᚹ'].map((r, i) => (
              <span key={i} className="text-gold/12 text-sm font-cinzel select-none">{r}</span>
            ))}
          </div>
        </div>

      </div>
    </footer>
  )
}
