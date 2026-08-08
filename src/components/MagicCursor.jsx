import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { BookOpen, Wand2 } from 'lucide-react'

export default function MagicCursor() {
  const [visible,   setVisible]   = useState(false)
  const [clicked,   setClicked]   = useState(false)
  const [isPointer, setIsPointer] = useState(false)

  const mouseX = useMotionValue(-200)
  const mouseY = useMotionValue(-200)

  /* tight spring — feels immediate, <16 ms effective lag */
  const cfg     = { damping: 32, stiffness: 320, mass: 0.5 }
  const cursorX = useSpring(mouseX, cfg)
  const cursorY = useSpring(mouseY, cfg)

  useEffect(() => {
    const onMove = (e) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      if (!visible) setVisible(true)
    }
    const onDown = () => setClicked(true)
    const onUp   = () => setClicked(false)
    const onOver = (e) => {
      const el = e.target
      setIsPointer(
        el.tagName === 'BUTTON' || el.tagName === 'A' ||
        !!el.closest('button')  || !!el.closest('a')
      )
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup',   onUp)
    window.addEventListener('mouseover', onOver)
    document.body.style.cursor = 'none'

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup',   onUp)
      window.removeEventListener('mouseover', onOver)
      document.body.style.cursor = 'auto'
    }
  }, [visible, mouseX, mouseY])

  if (!visible) return null

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 select-none"
      style={{ x: cursorX, y: cursorY }}
    >
      <motion.div
        animate={{
          scale:  clicked ? 0.75 : isPointer ? 1.2 : 1,
          rotate: clicked ? -8   : isPointer ? 12  : 0,
        }}
        transition={{ type: 'spring', stiffness: 420, damping: 24 }}
        style={{ filter: 'drop-shadow(0 0 6px rgba(212,175,55,0.55))' }}
      >
        {isPointer
          ? <Wand2    size={26} strokeWidth={1.4} style={{ color: '#d4af37' }} />
          : <BookOpen size={24} strokeWidth={1.3} style={{ color: 'rgba(212,175,55,0.85)' }} />
        }
      </motion.div>

      {/* trailing spark */}
      <motion.div
        className="absolute rounded-full"
        style={{ width: 3, height: 3, background: 'rgba(212,175,55,0.55)', top: '85%', left: '50%', translateX: '-50%' }}
        animate={{ scale: [0, 1, 0], opacity: [0, 0.8, 0], y: [0, 8, 14] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'easeOut' }}
      />
    </motion.div>
  )
}
