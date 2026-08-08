import { useRef, useEffect, useState } from 'react'
import { useGLTF, Float } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { gsap } from 'gsap'
import * as THREE from 'three'
import useStore from '../../store/useStore'

const POTION_COLORS = ['#f59e0b', '#3b82f6', '#22c55e']

export default function PotionModel() {
  const groupRef = useRef()
  const { scene } = useGLTF('/models/potion.glb')
  const [isHovered, setIsHovered] = useState(false)

  const activePotionIndex = useStore((s) => s.activePotionIndex)
  const rotateProgress = useStore((s) => s.loreToHowItWorksProgress)

  useEffect(() => {
    if (!groupRef.current) return

    gsap.to(groupRef.current.scale, {
      x: 1.8,
      y: 1.8,
      z: 1.8,
      duration: 0.35,
      ease: 'back.out(2)',
      yoyo: true,
      repeat: 1,
    })
  }, [activePotionIndex])

  useEffect(() => {
    if (!scene) return
    const color = isHovered
      ? new THREE.Color(POTION_COLORS[activePotionIndex])
      : new THREE.Color('#000000')
    const intensity = isHovered ? 0.6 : 0

    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.emissive = color
        child.material.emissiveIntensity = intensity
      }
    })
  }, [isHovered, activePotionIndex, scene])

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = rotateProgress * Math.PI * 2
    }
  })

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.15} floatIntensity={1}>
        <primitive
          object={scene}
          scale={1.5}
          position={[0, 0, 0]}
          onPointerOver={() => setIsHovered(true)}
          onPointerOut={() => setIsHovered(false)}
        />
      </Float>
    </group>
  )
}

useGLTF.preload('/models/potion.glb')
