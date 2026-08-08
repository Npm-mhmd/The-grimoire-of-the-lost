import { Html } from '@react-three/drei'

function RuneSVG() {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="animate-spin-slow"
    >
      <circle cx="32" cy="32" r="28" stroke="#f59e0b" strokeWidth="1.5" opacity="0.2" />
      <circle cx="32" cy="32" r="18" stroke="#f59e0b" strokeWidth="1" opacity="0.4" />
      <path d="M32 16 L34 28 L32 30 L30 28 Z" fill="#f59e0b" opacity="0.6" />
      <path d="M32 48 L30 36 L32 34 L34 36 Z" fill="#f59e0b" opacity="0.6" />
      <path d="M16 32 L28 30 L30 32 L28 34 Z" fill="#f59e0b" opacity="0.6" />
      <path d="M48 32 L36 34 L34 32 L36 30 Z" fill="#f59e0b" opacity="0.6" />
      <circle cx="32" cy="32" r="3" fill="#f59e0b" />
    </svg>
  )
}

export default function CustomLoader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <RuneSVG />
        <span className="font-display text-amber-500/60 text-xs tracking-[0.2em] uppercase animate-pulse">
          Materialising
        </span>
      </div>
    </Html>
  )
}
