import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function RuneIcon() {
  return (
    <svg width="72" height="72" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-spin-slow">
      <circle cx="32" cy="32" r="30" stroke="#d4af37" strokeWidth="1.5" opacity="0.2" />
      <circle cx="32" cy="32" r="22" stroke="#d4af37" strokeWidth="1" opacity="0.4" />
      <path d="M32 14 L35 28 L32 31 L29 28 Z" fill="#d4af37" opacity="0.7" />
      <path d="M32 50 L29 36 L32 33 L35 36 Z" fill="#d4af37" opacity="0.7" />
      <path d="M14 32 L28 29 L31 32 L28 35 Z" fill="#d4af37" opacity="0.7" />
      <path d="M50 32 L36 35 L33 32 L36 29 Z" fill="#d4af37" opacity="0.7" />
      <circle cx="32" cy="32" r="3" fill="#d4af37" />
    </svg>
  )
}

export default function LoadingScreen({ children }) {
  const [progress, setProgress] = useState(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(interval); return 100 }
        return p + 4
      })
    }, 40)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (progress >= 100) {
      const t = setTimeout(() => setReady(true), 400)
      return () => clearTimeout(t)
    }
  }, [progress])

  return (
    <>
      <AnimatePresence>
        {!ready && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-magic-dark"
            style={{ backgroundImage: 'radial-gradient(circle at center, #0f0e13 0%, #030304 100%)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            <RuneIcon />
            <div className="mt-10 w-48 h-1 bg-[#d4af37]/10 rounded-full overflow-hidden border border-[#d4af37]/20">
              <motion.div
                className="h-full bg-[#d4af37]"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="mt-5 font-display text-[#d4af37]/60 text-xs tracking-[0.25em] uppercase animate-pulse">
              Unsealing the Forbidden Vault
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </>
  )
}
