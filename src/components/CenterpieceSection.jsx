import { Suspense, useRef, useMemo, useState, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import useStore from '../store/useStore'
import ErrorBoundary from './ErrorBoundary'
import TutorialOverlay from './TutorialOverlay'
import { MemoryMenderEffect, EchoCaptureEffect, ClarityElixirEffect } from './ArtifactEffects'

/* ── Artifact data ── */
const ARTIFACTS = [
  {
    index: 0,
    label: 'Clarity Elixir',
    subtitle: 'The Script Enhancer',
    model: '/models/blue.glb',
    color: '#4f8ef7',
    emissive: '#1a3a8a',
    particleColor: '#7ab3ff',
    school: 'Precision & Restoration',
    lore: 'Distilled from the tears of a scribe who never erred. Transforms faded inscriptions into luminous truth — each drop a lens that strips away the noise of centuries.',
    properties: ['High-fidelity texture restoration', 'Material shader transformation', 'Faded-to-clear state simulation', 'Precision enhancement field'],
  },
  {
    index: 1,
    label: 'Echo Capture',
    subtitle: 'The Silent Listener',
    model: '/models/redp.glb',
    color: '#e85555',
    emissive: '#8a1a1a',
    particleColor: '#ff8a8a',
    school: 'Auditory Resonance',
    lore: 'Brewed in absolute silence. Holds within it every sound ever swallowed by the dark — a silent listener that never forgets, never releases, only amplifies.',
    properties: ['Pulse-based emission shaders', 'Environmental resonance field', 'Auditory capture visualizer', 'Silent absorption matrix'],
  },
  {
    index: 2,
    label: 'Memory Mender',
    subtitle: 'The Shattered Restorer',
    model: '/models/greenp.glb',
    color: '#34d399',
    emissive: '#0d6040',
    particleColor: '#6effd4',
    school: 'Fracture & Healing',
    lore: 'Forged from the shards of a broken mirror that once reflected a perfect world. Gold-vein shaders trace the cracks of fractured reality, healing each fissure with liquid light.',
    properties: ['Intricate geometric modeling', 'Gold-vein shader effects', 'Fractured reality simulation', 'Kintsugi healing matrix'],
  },
]

useGLTF.preload('/models/blue.glb')
useGLTF.preload('/models/redp.glb')
useGLTF.preload('/models/greenp.glb')

/* ── 3D Potion mesh ── */
function PotionMesh({ artifact, invoked }) {
  const ref = useRef()
  const { scene } = useGLTF(artifact.model)

  const cloned = useMemo(() => {
    const c = scene.clone(true)
    c.traverse((child) => {
      if (!child.isMesh || !child.material) return
      child.material = child.material.clone()
      if (child.material.name === 'Bottle') {
        child.material.color = new THREE.Color(artifact.color)
        child.material.emissive = new THREE.Color(artifact.emissive)
        child.material.emissiveIntensity = invoked ? 1.0 : 0.35
        child.material.roughness = 0.12
        child.material.metalness = 0.08
        child.material.transparent = true
        child.material.opacity = 0.9
      }
      if (child.material.name === 'Liquid') {
        child.material.color = new THREE.Color(artifact.color)
        child.material.emissive = new THREE.Color(artifact.emissive)
        child.material.emissiveIntensity = invoked ? 2.5 : 1.0
        child.material.roughness = 0.04
        child.material.transparent = true
        child.material.opacity = 0.8
      }
      if (child.material.name === 'Kurk') {
        child.material.color = new THREE.Color('#3a2510')
        child.material.roughness = 0.92
      }
    })
    return c
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, artifact.index, invoked])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    ref.current.position.y = Math.sin(t * 0.8) * 0.03
    if (invoked) ref.current.rotation.y = t * 1.2
  })

  return (
    <group position={[0, -15 * 0.045, 0]}>
      <group ref={ref} scale={15}>
        <primitive object={cloned} />
      </group>
    </group>
  )
}

/* ── Invocation particles ── */
function InvocationParticles({ color, active }) {
  const ref = useRef()
  const COUNT = 200
  const { positions, velocities } = useMemo(() => {
    const positions  = new Float32Array(COUNT * 3)
    const velocities = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.acos(2 * Math.random() - 1)
      const r     = 0.1 + Math.random() * 0.3
      positions[i*3]   = r * Math.sin(phi) * Math.cos(theta)
      positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i*3+2] = r * Math.cos(phi)
      const speed = 0.008 + Math.random() * 0.018
      velocities[i*3]   = positions[i*3]   * speed
      velocities[i*3+1] = positions[i*3+1] * speed + 0.004
      velocities[i*3+2] = positions[i*3+2] * speed
    }
    return { positions, velocities }
  }, [])
  const posRef  = useRef(positions.slice())
  const lifeRef = useRef(new Float32Array(COUNT).fill(0))

  useFrame(() => {
    if (!ref.current || !active) return
    const pos = ref.current.geometry.attributes.position.array
    for (let i = 0; i < COUNT; i++) {
      lifeRef.current[i] += 0.012
      if (lifeRef.current[i] > 1) {
        lifeRef.current[i] = 0
        posRef.current[i*3]   = (Math.random() - 0.5) * 0.2
        posRef.current[i*3+1] = (Math.random() - 0.5) * 0.2
        posRef.current[i*3+2] = (Math.random() - 0.5) * 0.2
      }
      posRef.current[i*3]   += velocities[i*3]
      posRef.current[i*3+1] += velocities[i*3+1]
      posRef.current[i*3+2] += velocities[i*3+2]
      pos[i*3]   = posRef.current[i*3]
      pos[i*3+1] = posRef.current[i*3+1]
      pos[i*3+2] = posRef.current[i*3+2]
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  if (!active) return null
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color={color} transparent opacity={0.75} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  )
}

/* ── Ambient embers ── */
function AmbientEmbers() {
  const ref = useRef()
  const COUNT = 80
  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const speeds    = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) {
      positions[i*3]   = (Math.random() - 0.5) * 10
      positions[i*3+1] = (Math.random() - 0.5) * 6
      positions[i*3+2] = (Math.random() - 0.5) * 5
      speeds[i] = 0.003 + Math.random() * 0.006
    }
    return { positions, speeds }
  }, [])

  useFrame(() => {
    if (!ref.current) return
    const pos = ref.current.geometry.attributes.position.array
    for (let i = 0; i < COUNT; i++) {
      pos[i*3+1] += speeds[i]
      if (pos[i*3+1] > 3) pos[i*3+1] = -3
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.014} color="#c8a84b" transparent opacity={0.35} sizeAttenuation />
    </points>
  )
}

/* ── 3D Scene ── */
function ArtifactScene({ artifact, invoked }) {
  return (
    <>
      <color attach="background" args={['#080608']} />
      <fog attach="fog" args={['#080608', 4, 12]} />
      <Environment preset="night" />
      <ambientLight intensity={0.25} />
      <spotLight position={[3, 5, 4]} angle={0.5} penumbra={0.9} intensity={1.2} color="#c8b89a" />
      <spotLight position={[-3, 2, 3]} angle={0.5} penumbra={1} intensity={0.4} color={artifact.color} />

      <AmbientEmbers />
      <InvocationParticles color={artifact.particleColor} active={invoked} />

      <Suspense fallback={null}>
        <PotionMesh artifact={artifact} invoked={invoked} />
      </Suspense>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={!invoked}
        autoRotateSpeed={0.5}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI / 1.8}
      />

      <EffectComposer>
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.94} intensity={invoked ? 0.8 : 0.25} mipmapBlur />
      </EffectComposer>
    </>
  )
}

/* ── Artifact effect selector ── */
function ArtifactInvokeEffect({ index, active }) {
  if (index === 0) return <ClarityElixirEffect active={active} />
  if (index === 1) return <EchoCaptureEffect   active={active} />
  if (index === 2) return <MemoryMenderEffect  active={active} />
  return null
}

/* ── Main Component ── */
export default function CenterpieceSection() {
  const activePotionIndex    = useStore((s) => s.activePotionIndex)
  const setActivePotionIndex = useStore((s) => s.setActivePotionIndex)
  const [invoked, setInvoked]           = useState(false)
  const [inputVal, setInputVal]         = useState('')
  const [invokeMsg, setInvokeMsg]       = useState('')
  const [showTutorial, setShowTutorial] = useState(false)

  const artifact = ARTIFACTS[activePotionIndex]

  const handleInvoke = useCallback(() => {
    setInvoked(true)
    setInvokeMsg(`The ${artifact.label} responds to your call...`)
    useStore.getState().setActiveEffect(artifact.label)
    setTimeout(() => {
      setInvoked(false)
      setInvokeMsg('')
      useStore.getState().setActiveEffect(null)
    }, 5000)
  }, [artifact])

  const handleConsult = useCallback(() => {
    if (!inputVal.trim()) return
    setInvokeMsg(`"${inputVal.trim()}" — the grimoire stirs...`)
    setInvoked(true)
    setTimeout(() => { setInvoked(false); setInvokeMsg('') }, 4000)
    setInputVal('')
  }, [inputVal])

  return (
    <>
      <section id="centerpiece" className="relative min-h-screen flex flex-col overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-[#0a0806]/60 to-ink pointer-events-none" />
        <div className="noise-overlay" />

        <div className="relative z-10 flex flex-col flex-1 max-w-7xl mx-auto w-full px-4 py-20 gap-8">

          {/* Header */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="rune-label">Interactive Centerpiece</span>
            <h2 className="grimoire-title text-4xl md:text-5xl mt-2">The Artifact Chamber</h2>
            <p className="font-fell text-ash/50 italic text-sm mt-3">
              Drag to rotate · Select an artifact · Invoke its power
            </p>
          </motion.div>

          {/* Artifact selector tabs */}
          <div className="flex justify-center gap-3 flex-wrap">
            {ARTIFACTS.map((a) => (
              <button
                key={a.index}
                type="button"
                onClick={() => { setActivePotionIndex(a.index); setInvoked(false) }}
                className="font-cinzel text-[0.6rem] tracking-[0.25em] uppercase px-5 py-2.5 border transition-all duration-300"
                style={{
                  borderColor: activePotionIndex === a.index ? `${a.color}80` : 'rgba(200,168,75,0.15)',
                  color:       activePotionIndex === a.index ? a.color : 'rgba(200,168,75,0.45)',
                  background:  activePotionIndex === a.index ? `${a.color}12` : 'transparent',
                  boxShadow:   activePotionIndex === a.index ? `0 0 20px ${a.color}22` : 'none',
                }}
              >
                {a.label}
              </button>
            ))}
          </div>

          {/* Main layout */}
          <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-[520px]">

            {/* 3D Viewer */}
            <motion.div
              className="flex-1 relative rounded-sm overflow-hidden"
              style={{ border: `1px solid ${artifact.color}28`, minHeight: 420 }}
              key={activePotionIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* corner frames */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t border-l pointer-events-none z-10" style={{ borderColor: `${artifact.color}50` }} />
              <div className="absolute top-0 right-0 w-8 h-8 border-t border-r pointer-events-none z-10" style={{ borderColor: `${artifact.color}50` }} />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l pointer-events-none z-10" style={{ borderColor: `${artifact.color}50` }} />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r pointer-events-none z-10" style={{ borderColor: `${artifact.color}50` }} />

              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
                <span className="font-cinzel text-[0.5rem] tracking-[0.35em] uppercase text-ash/25">drag to rotate</span>
              </div>

              {/* ── Artifact invoke visual effect ── */}
              <ArtifactInvokeEffect index={activePotionIndex} active={invoked} />

              {/* invoke message */}
              <AnimatePresence>
                {invokeMsg && (
                  <motion.div
                    className="absolute inset-x-0 bottom-6 z-20 flex justify-center pointer-events-none"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                  >
                    <p
                      className="font-fell italic text-sm px-6 py-2 rounded-sm"
                      style={{ color: artifact.color, background: `${artifact.color}12`, border: `1px solid ${artifact.color}30` }}
                    >
                      {invokeMsg}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <ErrorBoundary>
                <Canvas
                  camera={{ position: [0, 0, 3.5], fov: 40 }}
                  gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05, alpha: false }}
                  style={{ width: '100%', height: '100%' }}
                >
                  <ArtifactScene artifact={artifact} invoked={invoked} />
                </Canvas>
              </ErrorBoundary>
            </motion.div>

            {/* Info Panel */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activePotionIndex}
                className="lg:w-80 xl:w-96 flex flex-col gap-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                {/* Artifact info */}
                <div className="parchment-card p-6 relative flex-1">
                  <div className="corner-tl" /><div className="corner-br" />

                  <span className="font-cinzel text-[0.55rem] tracking-[0.35em] uppercase mb-3 block" style={{ color: `${artifact.color}99` }}>
                    {artifact.school}
                  </span>
                  <h3 className="grimoire-title text-2xl" style={{ color: artifact.color }}>
                    {artifact.label}
                  </h3>
                  <p className="font-fell italic text-ash/50 text-sm mt-1">{artifact.subtitle}</p>
                  <div className="ink-divider my-4" />
                  <p className="font-fell text-ash/60 text-sm leading-[1.9] italic">{artifact.lore}</p>
                  <div className="mt-5 space-y-2">
                    {artifact.properties.map((prop, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-[0.5rem] mt-1.5" style={{ color: artifact.color }}>◆</span>
                        <span className="font-cinzel text-ash/55 text-[0.65rem] tracking-wide">{prop}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Input + actions */}
                <div className="parchment-card p-5 flex flex-col gap-3">
                  <p className="font-cinzel text-[0.55rem] tracking-[0.3em] uppercase text-gold/40">
                    Consult the Grimoire
                  </p>
                  <input
                    type="text"
                    className="ink-input"
                    placeholder="Type a question or incantation..."
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleConsult()}
                  />
                  <div className="flex gap-2 mt-1">
                    <button
                      type="button"
                      className="gothic-btn flex-1 text-center"
                      onClick={handleInvoke}
                      style={{ borderColor: `${artifact.color}60`, color: artifact.color }}
                    >
                      Invoke
                    </button>
                    <button
                      type="button"
                      className="gothic-btn-secondary flex-1 text-center"
                      onClick={handleConsult}
                    >
                      Consult
                    </button>
                  </div>
                  <button
                    type="button"
                    className="w-full font-cinzel text-[0.6rem] tracking-[0.25em] uppercase py-2.5 border transition-all duration-300 hover:opacity-80"
                    onClick={() => setShowTutorial(true)}
                    style={{ borderColor: `${artifact.color}25`, color: `${artifact.color}70`, background: 'transparent' }}
                  >
                    Tutorial
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>

          </div>
        </div>
      </section>

      {showTutorial && (
        <TutorialOverlay
          artifactColor={artifact.color}
          artifactIndex={activePotionIndex}
          onClose={() => setShowTutorial(false)}
        />
      )}
    </>
  )
}
