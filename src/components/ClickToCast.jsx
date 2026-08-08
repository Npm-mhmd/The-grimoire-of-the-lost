import { AnimatePresence, motion } from 'framer-motion'

export default function ClickToCast({ flashes }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {flashes.map((flash) => (
          <motion.div
            key={flash.id}
            className="absolute w-24 h-24 -ml-12 -mt-12 rounded-full"
            style={{
              left: flash.x,
              top: flash.y,
              background: `radial-gradient(circle, ${flash.color || '#4f8ef7'}66 0%, ${flash.color || '#4f8ef7'}00 70%)`,
            }}
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
