import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const LINES = [
  "The realm was fracturing. Memories dissolved, echoes silenced, clarity lost to shadow.",
  "A Witcher was summoned — not to slay, but to recover what the dark had swallowed.",
  "Three artifacts, sealed inside a crumbling grimoire, held the only cure.",
  "The Clarity Elixir — to restore what centuries of lies had buried.",
  "The Echo Capture — to reclaim the voices the silence had stolen.",
  "The Memory Mender — to piece together a world shattered beyond recognition.",
  "Before the grimoire's last page turns to ash, the quest must be completed.",
]

export default function HeroSection() {
  const [idx, setIdx]     = useState(0)
  const sectionRef        = useRef(null)
  const timerRef          = useRef(null)
  const userScrolled      = useRef(false)

  /* auto-advance: starts after 0.7 s, ticks every 0.5 s */
  useEffect(() => {
    const start = setTimeout(() => {
      timerRef.current = setInterval(() => {
        if (userScrolled.current) { clearInterval(timerRef.current); return }
        setIdx(prev => {
          const next = prev + 1
          if (next >= LINES.length) { clearInterval(timerRef.current); return prev }
          /* push scroll position to match */
          if (sectionRef.current) {
            const perLine = sectionRef.current.offsetHeight / LINES.length
            window.scrollTo({ top: sectionRef.current.offsetTop + next * perLine, behavior: 'smooth' })
          }
          return next
        })
      }, 500)
    }, 700)

    return () => { clearTimeout(start); clearInterval(timerRef.current) }
  }, [])

  /* scroll-driven override */
  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return
      const { top, height } = sectionRef.current.getBoundingClientRect()
      const scrolled = Math.max(0, -top)
      const perLine  = height / LINES.length
      const next     = Math.min(Math.floor(scrolled / perLine), LINES.length - 1)
      setIdx(prev => {
        if (next !== prev) userScrolled.current = true
        return next
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section
      ref={sectionRef}
      id="hero"
      style={{ height: `${LINES.length * 100}vh` }}
      className="relative"
    >
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">

        <div className="absolute inset-0 bg-ink" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(200,168,75,0.05) 0%, transparent 70%)' }}
        />
        <div className="noise-overlay" />

        <div className="relative z-10 w-full max-w-2xl px-6 md:px-10 flex flex-col items-center gap-10">

          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <span className="rune-label">The Witcher's Quest</span>
            <h1 className="grimoire-title text-4xl md:text-6xl lg:text-7xl mt-3 leading-tight">
              The Grimoire
              <span className="block text-xl md:text-2xl lg:text-3xl tracking-[0.2em] mt-2 text-gold/70">
                of the Lost
              </span>
            </h1>
            <div className="ink-divider max-w-[180px] mx-auto mt-5" />
          </motion.div>

          <div className="relative w-full h-16 md:h-20 flex items-center justify-center">
            {LINES.map((line, i) => (
              <motion.p
                key={i}
                className="absolute w-full text-center font-fell text-base md:text-xl text-ash/80 italic leading-relaxed px-2"
                animate={{
                  opacity: i === idx ? 1 : 0,
                  y:       i === idx ? 0 : i < idx ? -24 : 24,
                }}
                transition={{ duration: 0.45, ease: 'easeInOut' }}
              >
                {line}
              </motion.p>
            ))}
          </div>

          <div className="flex items-center gap-[6px]">
            {LINES.map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width:      i === idx ? 18 : i < idx ? 8 : 5,
                  height:     3,
                  background: i <= idx ? '#c8a84b' : 'rgba(200,168,75,0.15)',
                }}
              />
            ))}
          </div>

          <motion.div
            className="flex flex-col items-center gap-1"
            animate={{ opacity: idx === LINES.length - 1 ? 0 : 0.6, y: [0, 5, 0] }}
            transition={{ y: { duration: 1.8, repeat: Infinity }, opacity: { duration: 0.4 } }}
          >
            <span className="font-cinzel text-[0.5rem] tracking-[0.4em] uppercase text-gold/50">scroll</span>
            <ChevronDown size={13} strokeWidth={1.5} className="text-gold/40" />
          </motion.div>

        </div>
      </div>
    </section>
  )
}
