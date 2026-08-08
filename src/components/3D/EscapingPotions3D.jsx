import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { simplex3D } from '../../lib/simplex-noise'
import useStore from '../../store/useStore'
import './PotionGlowShader'

const POTION_COUNT = 10
const REPEL_RADIUS = 2.2
const REPEL_STRENGTH = 4.5
const DAMPING = 0.95

const HOUSE_COLORS = [
  new THREE.Color('#d4af37'), // Gryffindor / Golden Luck
  new THREE.Color('#ff69b4'), // Ravenclaw / Amortentia Pink
  new THREE.Color('#22c55e'), // Slytherin / Polyjuice Green
]

export default function EscapingPotions3D() {
  const meshRef = useRef()
  const materialRef = useRef()
  const { viewport } = useThree()
  const activeEffect = useStore((s) => s.activeEffect)

  // Track physical states for each potion instance deterministically to respect React purity
  const potionData = useMemo(() => {
    return Array.from({ length: POTION_COUNT }).map((_, i) => {
      // Deterministic pseudo-random generation based on index
      const seedVal = i * 148.29
      const x = ((i * 382.19) % (viewport.width * 0.8)) - (viewport.width * 0.4)
      const y = ((i * 749.23) % (viewport.height * 0.8)) - (viewport.height * 0.4)
      const z = ((i * 123.45) % 4) - 2
      const noiseSeed = (i * 991.13) % 1000
      const noiseSpeed = 0.15 + (i % 5) * 0.02
      const noiseScale = 0.4 + (i % 3) * 0.1
      const scale = 0.2 + (i % 4) * 0.06

      return {
        x,
        y,
        z,
        noiseSeed,
        noiseSpeed,
        noiseScale,
        repelX: 0,
        repelY: 0,
        repelZ: 0,
        vx: 0,
        vy: 0,
        vz: 0,
        scale,
        color: HOUSE_COLORS[i % HOUSE_COLORS.length],
      }
    })
  }, [viewport])

  // Dummy object to construct transformation matrices
  const tempObject = useMemo(() => new THREE.Object3D(), [])

  useFrame(({ clock, pointer }) => {
    if (!meshRef.current) return

    const t = clock.getElapsedTime()

    // 1. Mouse coordinates in 3D scene space (at z = 0)
    const mouse3D = new THREE.Vector3(
      (pointer.x * viewport.width) / 2,
      (pointer.y * viewport.height) / 2,
      0
    )

    // 2. Loop through instances and update physics
    potionData.forEach((potion, i) => {
      // Wandering coordinates using Simplex Noise
      const noiseX = simplex3D(potion.noiseSeed, 0, t * potion.noiseSpeed) * viewport.width * 0.4
      const noiseY = simplex3D(0, potion.noiseSeed, t * potion.noiseSpeed) * viewport.height * 0.4
      const noiseZ = simplex3D(potion.noiseSeed, t * potion.noiseSpeed, 0) * 2

      const currentX = noiseX + potion.repelX
      const currentY = noiseY + potion.repelY
      const currentZ = noiseZ + potion.repelZ

      // Calculate vector pointing from mouse to potion
      const dx = currentX - mouse3D.x
      const dy = currentY - mouse3D.y
      const dz = currentZ - mouse3D.z
      const dist = Math.hypot(dx, dy, dz)

      // Repulsion force field
      if (dist < REPEL_RADIUS) {
        const force = (REPEL_RADIUS - dist) * REPEL_STRENGTH * (1 / (dist + 0.1))
        potion.vx += (dx / (dist + 0.01)) * force * 0.016
        potion.vy += (dy / (dist + 0.01)) * force * 0.016
        potion.vz += (dz / (dist + 0.01)) * force * 0.016
      }

      // Apply damping & friction
      potion.vx *= DAMPING
      potion.vy *= DAMPING
      potion.vz *= DAMPING

      // Update offsets
      potion.repelX += potion.vx
      potion.repelY += potion.vy
      potion.repelZ += potion.vz

      // Constrain within viewport boundaries
      const boundX = viewport.width * 0.5
      const boundY = viewport.height * 0.5
      if (Math.abs(noiseX + potion.repelX) > boundX) {
        potion.repelX = Math.sign(noiseX + potion.repelX) * boundX - noiseX
        potion.vx *= -1
      }
      if (Math.abs(noiseY + potion.repelY) > boundY) {
        potion.repelY = Math.sign(noiseY + potion.repelY) * boundY - noiseY
        potion.vy *= -1
      }

      // 3. Apply transformations to instanced matrix
      tempObject.position.set(noiseX + potion.repelX, noiseY + potion.repelY, noiseZ + potion.repelZ)
      
      // Floating animation rotation
      tempObject.rotation.set(
        t * 0.2 + potion.noiseSeed,
        t * 0.3 + potion.noiseSeed,
        0
      )
      
      tempObject.scale.setScalar(potion.scale)
      tempObject.updateMatrix()
      
      meshRef.current.setMatrixAt(i, tempObject.matrix)
    })

    meshRef.current.instanceMatrix.needsUpdate = true

    // 4. Update Custom Material Shader Uniforms
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = t
      if (activeEffect) {
        // Boost glow when brewing effect is active
        materialRef.current.uniforms.uBrewProgress.value = THREE.MathUtils.lerp(
          materialRef.current.uniforms.uBrewProgress.value,
          1.0,
          0.1
        )
      } else {
        materialRef.current.uniforms.uBrewProgress.value = THREE.MathUtils.lerp(
          materialRef.current.uniforms.uBrewProgress.value,
          0.0,
          0.05
        )
      }
    }
  })

  // Hook instance colors
  useEffect(() => {
    if (!meshRef.current) return
    potionData.forEach((potion, i) => {
      meshRef.current.setColorAt(i, potion.color)
    })
    meshRef.current.instanceColor.needsUpdate = true
  }, [potionData])

  return (
    <instancedMesh ref={meshRef} args={[null, null, POTION_COUNT]}>
      {/* Decent detail sphere for good looks */}
      <sphereGeometry args={[1, 32, 32]} />
      <potionGlowMaterial 
        ref={materialRef} 
        transparent 
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  )
}
