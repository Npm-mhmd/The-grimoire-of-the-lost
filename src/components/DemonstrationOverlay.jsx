import { useState, useEffect, useRef, useMemo, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

const COLORS = ['#4f8ef7', '#e85555', '#34d399']
const GOLD = '#c8a84b'

const DEMONSTRATIONS = {
  0: {
    subject: 'Ancient Scroll',
    before: 'Faded, illegible runes — centuries of decay have blurred the text into obscurity',
    beforeDamaged: 'The parchment is worn, the ink smudged beyond recognition. Whatever was written here has been swallowed by time.',
    after: 'Crystal-clear inscriptions glow with precision light — every stroke restored to luminous perfection',
    icon: '📜',
  },
  1: {
    subject: 'Whispering Void',
    before: 'Chaotic distortion — the air ripples with jagged, broken frequencies',
    beforeDamaged: 'Sonic screeches tear through the silence. The waves are deformed, fragmented — a cacophony of broken sound.',
    after: 'Harmonic resonance — smooth, rhythmic waves pulse in perfect cadence',
    icon: '〰️',
  },
  2: {
    subject: 'Shattered Mirror',
    before: 'A single fracture splits the reflection — the image is broken, distorted',
    beforeDamaged: 'Cracks web across the glass. The reflection fractures into a thousand misaligned pieces, each showing a different broken world.',
    after: 'Gold-vein light seals every crack — the mirror is whole again, reflecting more beautifully than before',
    icon: '🪞',
  },
}

/* ─── Scroll: blurry parchment with text → clear ─── */
function ScrollSubject({ restored, color }) {
  const meshRef = useRef()
  const cRef = useRef()
  const tRef = useRef()

  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(1.4, 0.9, 32, 1)
    const p = g.attributes.position
    for (let i = 0; i < p.count; i++) {
      p.setZ(i, Math.sin(p.getX(i) * 1.6) * 0.045 + Math.sin(p.getY(i) * 2) * 0.02)
    }
    p.needsUpdate = true
    g.computeVertexNormals()
    return g
  }, [])

  const texture = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 512; c.height = 280
    cRef.current = c
    const t = new THREE.CanvasTexture(c)
    t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping
    tRef.current = t
    return t
  }, [])

  function paint() {
    const c = cRef.current
    if (!c) return
    const ctx = c.getContext('2d')
    const blur = restored ? 0 : 5

    ctx.clearRect(0, 0, 512, 280)

    const bg = ctx.createLinearGradient(0, 0, 0, 280)
    bg.addColorStop(0, '#eedea0'); bg.addColorStop(0.25, '#e2d098')
    bg.addColorStop(0.6, '#d6c488'); bg.addColorStop(1, '#caba78')
    ctx.fillStyle = bg; ctx.fillRect(0, 0, 512, 280)

    for (let i = 0; i < 200; i++) {
      ctx.fillStyle = `rgba(90,60,25,${0.005 + Math.random() * 0.02})`
      ctx.fillRect(Math.random() * 512, Math.random() * 280, 1 + Math.random() * 5, 1 + Math.random() * 2)
    }

    const vg = ctx.createRadialGradient(256, 140, 30, 256, 140, 320)
    vg.addColorStop(0, 'transparent'); vg.addColorStop(0.75, 'transparent'); vg.addColorStop(1, 'rgba(50,30,10,0.3)')
    ctx.fillStyle = vg; ctx.fillRect(0, 0, 512, 280)

    ctx.filter = `blur(${blur}px)`
    ctx.textAlign = 'center'
    ctx.font = 'italic 15px Georgia, "Times New Roman", serif'

    const lines = [
      'In the year of the Crimson Comet,',
      'a vault was sealed beneath the',
      'old tower. Within it, three vials —',
      'each containing a power so',
      'dangerous that the Council of',
      'Scribes forbade their names from',
      'being spoken aloud. The grimoire',
      'was locked. The key was destroyed.',
      'The story was forgotten.',
      '',
      'Until now.',
    ]

    lines.forEach((line, i) => {
      const alpha = blur > 2 ? 0.08 + Math.random() * 0.04 : 0.7
      if (blur > 2) {
        ctx.fillStyle = `rgba(60,35,15,${alpha})`
      } else {
        ctx.fillStyle = i === lines.length - 1 ? '#8a1c2c' : `rgba(40,25,10,${alpha})`
      }
      ctx.fillText(line, 256, 42 + i * 20)
    })

    ctx.filter = 'none'

    if (!restored) {
      for (let i = 0; i < 30; i++) {
        ctx.filter = `blur(${2 + Math.random() * 5}px)`
        ctx.fillStyle = `rgba(40,25,10,${0.02 + Math.random() * 0.04})`
        ctx.beginPath()
        ctx.ellipse(Math.random() * 512, Math.random() * 280, 8 + Math.random() * 30, 4 + Math.random() * 12, Math.random() * Math.PI, 0, Math.PI * 2)
        ctx.fill()
      }
    } else {
      ctx.shadowColor = color; ctx.shadowBlur = 10
      ctx.fillStyle = `${color}18`
      ctx.fillRect(0, 0, 512, 280)
      ctx.shadowBlur = 0

      ctx.font = 'bold 18px Georgia, "Times New Roman", serif'
      ctx.shadowColor = color; ctx.shadowBlur = 5
      ctx.fillStyle = '#8a1c2c'
      ctx.fillText(lines[lines.length - 1], 256, 42 + (lines.length - 1) * 20)
      ctx.shadowBlur = 0
    }

    tRef.current.needsUpdate = true
  }

  useEffect(() => { paint() }, [restored, color])

  const col = useMemo(() => new THREE.Color(color), [color])
  const blk = useMemo(() => new THREE.Color('#000'), [])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    meshRef.current.rotation.y = Math.sin(t * 0.2) * 0.12
    meshRef.current.position.y = 0.05 + Math.sin(t * 0.4) * 0.012
    const m = meshRef.current.material
    if (restored) {
      m.emissiveIntensity += (0.2 + Math.sin(t * 1.3) * 0.08 - m.emissiveIntensity) * 0.04
      m.emissive.lerp(col, 0.04)
    } else {
      m.emissiveIntensity += (0 - m.emissiveIntensity) * 0.04
      m.emissive.lerp(blk, 0.04)
    }
  })

  return (
    <group position={[0, 0.15, 0]}>
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial
          map={texture} transparent roughness={0.55} metalness={0}
          side={THREE.DoubleSide} emissive="#000" emissiveIntensity={0}
        />
      </mesh>
      {restored && <pointLight color={color} intensity={0.5} distance={2} decay={2} />}
    </group>
  )
}

/* ─── Waves: chaotic bad waves → harmonic good waves ─── */
function WaveSubject({ restored, color }) {
  const meshRef = useRef()
  const cols = 56; const rows = 32
  const count = cols * rows

  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(2, 1.3, cols - 1, rows - 1)
    g.rotateX(-Math.PI / 2)
    return g
  }, [])

  const colRestored = useMemo(() => new THREE.Color(color), [color])
  const colDamaged = useMemo(() => new THREE.Color('#3a1525'), [])
  const blk = useMemo(() => new THREE.Color('#000'), [])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    const pos = meshRef.current.geometry.attributes.position
    const array = pos.array

    for (let i = 0; i < count; i++) {
      const x = pos.getX(i)
      const z = pos.getZ(i)
      const dist = Math.sqrt(x * x + z * z)

      let y
      if (restored) {
        y = Math.sin(dist * 5 - t * 2.2) * 0.1
          + Math.sin(x * 4 + t * 1.5) * 0.04
          + Math.sin(z * 3 + t * 1.8) * 0.04
          + Math.sin(dist * 2.5 + t * 0.6) * 0.03
      } else {
        y = Math.sin(dist * 7 + t * 5) * 0.2 * Math.sin(t * 3 + x * 6 + z * 4) * 0.18
          + (Math.sin(x * 14 + t * 9) + Math.sin(z * 12 + t * 7)) * 0.035
          + (Math.random() - 0.5) * 0.06
      }

      pos.setY(i, y)
    }

    pos.needsUpdate = true
    meshRef.current.geometry.computeVertexNormals()

    const mat = meshRef.current.material
    mat.color.lerp(restored ? colRestored : colDamaged, 0.05)
    if (restored) {
      mat.emissive.lerp(colRestored, 0.05)
      mat.emissiveIntensity += (0.4 + Math.sin(t * 1.1) * 0.15 - mat.emissiveIntensity) * 0.04
    } else {
      mat.emissive.lerp(blk, 0.05)
      mat.emissiveIntensity += (0.02 - mat.emissiveIntensity) * 0.04
    }
    if (restored) {
      mat.opacity += (0.85 - mat.opacity) * 0.03
    } else {
      mat.opacity += (0.35 + Math.sin(t * 2.5) * 0.08 - mat.opacity) * 0.03
    }

    if (meshRef.current.children[0]) {
      const wm = meshRef.current.children[0].material
      if (restored) {
        wm.opacity += (0.25 - wm.opacity) * 0.03
        wm.color.lerp(colRestored, 0.04)
      } else {
        wm.opacity += (0.03 - wm.opacity) * 0.03
        wm.color.lerp(blk, 0.04)
      }
    }
  })

  return (
    <group position={[0, -0.15, 0]}>
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial
          color="#3a1525" side={THREE.DoubleSide} transparent
          roughness={0.2} metalness={0} emissive="#000" emissiveIntensity={0.02}
        />
        <mesh geometry={geometry}>
          <meshBasicMaterial color="#000" wireframe transparent opacity={0.03} />
        </mesh>
      </mesh>
      {restored && <pointLight color={color} intensity={0.6} distance={2} decay={2} />}
    </group>
  )
}

/* ─── Mirror: shattered pie-slice shards → single piece ─── */
function MirrorSubject({ restored, color }) {
  const innerRef = useRef()
  const segs = 8
  const pRef = useRef(restored ? 1 : 0)

  const wedgeData = useMemo(() => {
    const data = []
    for (let i = 0; i < segs; i++) {
      const start = (i / segs) * Math.PI * 2
      const end = ((i + 1) / segs) * Math.PI * 2
      const r = 0.48

      const shape = new THREE.Shape()
      shape.moveTo(0, 0)
      shape.lineTo(Math.cos(start) * r, Math.sin(start) * r)
      for (let s = 1; s <= 10; s++) {
        const a = start + (end - start) * (s / 10)
        shape.lineTo(Math.cos(a) * r, Math.sin(a) * r)
      }
      shape.lineTo(0, 0)

      data.push({
        geometry: new THREE.ShapeGeometry(shape),
        scatterPos: new THREE.Vector3(
          (Math.random() - 0.5) * 1.0,
          (Math.random() - 0.5) * 1.0,
          -0.3 - Math.random() * 0.4
        ),
        scatterRot: new THREE.Euler(
          (Math.random() - 0.5) * 1.2,
          (Math.random() - 0.5) * 1.2,
          (Math.random() - 0.5) * 2.0
        ),
      })
    }
    return data
  }, [])

  const startCol = useMemo(() => new THREE.Color('#2a2030'), [])
  const endCol = useMemo(() => new THREE.Color('#d8d0e8'), [])
  const gold = useMemo(() => new THREE.Color(GOLD), [])
  const blk = useMemo(() => new THREE.Color('#000'), [])
  const tmp = useMemo(() => new THREE.Color(), [])
  const tmp2 = useMemo(() => new THREE.Color(), [])

  useFrame(({ clock }) => {
    if (!innerRef.current) return
    const t = clock.getElapsedTime()
    const target = restored ? 1 : 0
    pRef.current += (target - pRef.current) * 0.035
    const p = Math.min(1, Math.max(0, pRef.current))

    const meshes = innerRef.current.children
    for (let i = 0; i < Math.min(meshes.length, segs); i++) {
      const child = meshes[i]
      const wd = wedgeData[i]
      if (!child.isMesh || !wd) continue

      child.position.x = wd.scatterPos.x * (1 - p)
      child.position.y = wd.scatterPos.y * (1 - p)
      child.position.z = wd.scatterPos.z * (1 - p)

      child.rotation.x = wd.scatterRot.x * (1 - p)
      child.rotation.y = wd.scatterRot.y * (1 - p)
      child.rotation.z = wd.scatterRot.z * (1 - p)

      const mat = child.material
      tmp.lerpColors(startCol, endCol, p)
      mat.color.copy(tmp)
      mat.metalness = 0.1 + 0.65 * p
      mat.roughness = 0.85 - 0.75 * p
      mat.opacity = 0.35 + 0.6 * p

      tmp2.lerpColors(blk, gold, p)
      mat.emissive.copy(tmp2)
      mat.emissiveIntensity = 0.5 * p + (restored ? Math.sin(t * 1.3 + i * 1.1) * 0.08 : 0)
    }

    if (innerRef.current.userData.ring) {
      const ring = innerRef.current.userData.ring
      const s = p < 0.3 ? 0 : (p - 0.3) / 0.7
      ring.scale.setScalar(s)
      ring.material.opacity = s * (0.2 + Math.sin(t * 1.5) * 0.06)
    }

    if (innerRef.current.userData.halo) {
      const halo = innerRef.current.userData.halo
      halo.material.opacity = restored ? 0.08 + Math.sin(t * 0.8) * 0.04 : 0
      halo.scale.setScalar(restored ? 1.0 + Math.sin(t * 0.6) * 0.02 : 0.3)
    }
  })

  return (
    <group position={[0, 0.05, 0]}>
      <group ref={innerRef}>
        <mesh ref={el => { if (el) innerRef.current.userData.ring = el }}>
          <ringGeometry args={[0.445, 0.48, 48]} />
          <meshBasicMaterial color={GOLD} transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
        <mesh ref={el => { if (el) innerRef.current.userData.halo = el }}>
          <circleGeometry args={[0.52, 32]} />
          <meshBasicMaterial color={GOLD} transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
        {wedgeData.map((wd, i) => (
          <mesh key={i} geometry={wd.geometry}>
            <meshStandardMaterial
              color="#2a2030" metalness={0.1} roughness={0.85}
              transparent opacity={0.35} side={THREE.DoubleSide}
              emissive="#000" emissiveIntensity={0}
            />
          </mesh>
        ))}
      </group>
      {restored && (
        <>
          <pointLight color={GOLD} intensity={1.2} distance={2.2} decay={2} />
          <pointLight color={GOLD} intensity={0.5} distance={1.5} decay={2} position={[0.25, 0.25, 0.2]} />
        </>
      )}
    </group>
  )
}

function Subject3D({ artifactIndex, restored, color }) {
  const subjects = [
    <ScrollSubject key="scroll" restored={restored} color={color} />,
    <WaveSubject key="wave" restored={restored} color={color} />,
    <MirrorSubject key="mirror" restored={restored} color={color} />,
  ]
  return subjects[artifactIndex] || null
}

export default function DemonstrationOverlay({ artifactIndex, artifactColor, onClose }) {
  const [phase, setPhase] = useState('before')
  const [textPhase, setTextPhase] = useState('before')
  const demo = DEMONSTRATIONS[artifactIndex]

  useEffect(() => {
    setPhase('before')
    setTextPhase('before')
    const txt = setTimeout(() => setTextPhase('damaged'), 1200)
    const heal = setTimeout(() => { setPhase('after'); setTextPhase('after') }, 3800)
    return () => { clearTimeout(txt); clearTimeout(heal) }
  }, [artifactIndex])

  const isAfter = phase === 'after'

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[400] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          className="relative z-10 w-full max-w-2xl parchment-card p-8 overflow-hidden"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="corner-tl" /><div className="corner-tr" />
          <div className="corner-bl" /><div className="corner-br" />

          <div className="relative z-20">
            <div className="flex items-center justify-between mb-6">
              <span className="rune-label" style={{ color: artifactColor }}>Potion Demonstration</span>
              <button
                onClick={onClose}
                className="font-cinzel text-[0.55rem] tracking-[0.3em] uppercase text-ash/40 hover:text-gold transition-colors px-3 py-1 border border-gold/20 rounded"
              >
                ✕ Close
              </button>
            </div>

            <h2 className="grimoire-title text-2xl mb-1">
              {demo.icon} {demo.subject}
            </h2>
            <p className="font-fell text-ash/40 text-xs italic mb-6">
              Observe the artifact&apos;s effect on its subject
            </p>

            <div className="relative bg-black/40 rounded border border-gold/10 mb-6 overflow-hidden" style={{ minHeight: 320 }}>
              {!isAfter && (
                <div className="absolute inset-0 z-10 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)`,
                    transition: 'background 2s ease',
                  }} />
              )}
              <Canvas
                camera={{ position: [0, 0, 2.5], fov: 45 }}
                gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0 }}
                style={{ width: '100%', height: 320 }}
              >
                <color attach="background" args={['transparent']} />
                <ambientLight intensity={isAfter ? 0.3 : 0.1} />
                <spotLight position={[2, 4, 3]} angle={0.5} penumbra={0.9}
                  intensity={isAfter ? 2.0 : 0.3} color={isAfter ? '#f0d8a0' : '#302030'} />
                <Environment preset="night" />
                <Suspense fallback={null}>
                  <Subject3D artifactIndex={artifactIndex} restored={isAfter} color={artifactColor} />
                </Suspense>
                <OrbitControls enableZoom={false} enablePan={false}
                  autoRotate={isAfter} autoRotateSpeed={0.5} />
                {isAfter && (
                  <EffectComposer>
                    <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.92} intensity={0.5} mipmapBlur />
                  </EffectComposer>
                )}
              </Canvas>
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={textPhase}
                className="font-fell text-sm text-center leading-relaxed px-4"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.6 }}
                style={{
                  color: isAfter ? artifactColor : textPhase === 'damaged' ? 'rgba(200,100,100,0.8)' : 'rgba(200,168,75,0.4)',
                  fontStyle: textPhase === 'damaged' ? 'normal' : 'italic',
                }}
              >
                {textPhase === 'after' ? demo.after : textPhase === 'damaged' ? demo.beforeDamaged : demo.before}
              </motion.p>
            </AnimatePresence>

            <div className="flex justify-center gap-3 mt-5">
              {['before', 'after'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => { setPhase(p); setTextPhase(p) }}
                  className="font-cinzel text-[0.45rem] tracking-[0.25em] uppercase px-4 py-1.5 rounded transition-all duration-300 border"
                  style={{
                    borderColor: phase === p ? `${COLORS[artifactIndex]}80` : 'rgba(200,168,75,0.15)',
                    color: phase === p ? COLORS[artifactIndex] : 'rgba(200,168,75,0.35)',
                    background: phase === p ? `${COLORS[artifactIndex]}15` : 'transparent',
                    boxShadow: phase === p ? `0 0 12px ${COLORS[artifactIndex]}22` : 'none',
                  }}
                >
                  {p === 'before' ? '◀ Damaged' : 'Restored ▶'}
                </button>
              ))}
            </div>

            <div className="flex justify-center mt-4">
              <button
                type="button"
                onClick={() => { setPhase('before'); setTextPhase('before'); setTimeout(() => setTextPhase('damaged'), 1200); setTimeout(() => { setPhase('after'); setTextPhase('after') }, 3800) }}
                className="font-cinzel text-[0.5rem] tracking-[0.2em] uppercase px-5 py-2 rounded transition-all duration-300 border"
                style={{ borderColor: `${COLORS[artifactIndex]}60`, color: COLORS[artifactIndex], background: `${COLORS[artifactIndex]}10` }}
              >
                🔄 Replay Transformation
              </button>
            </div>

            <div className="ink-divider mt-6 mb-2" />
            <p className="font-fell text-ash/30 text-xs italic text-center">
              The artifact&apos;s true power revealed — a glimpse beyond the veil
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
