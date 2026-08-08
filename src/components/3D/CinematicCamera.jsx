import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useStore from '../../store/useStore'

export default function CinematicCamera() {
  const { camera, pointer } = useThree()
  const heroToLoreProgress = useStore((s) => s.heroToLoreProgress)
  const loreToHowItWorksProgress = useStore((s) => s.loreToHowItWorksProgress)

  const targetPos = new THREE.Vector3()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    // 1. Orbital radius calculations based on scroll progression
    // Starts at 5, zooms in to 2.5 during lore, zooms out slightly to 4.0 during book
    const radius = 5.0 - heroToLoreProgress * 2.5 + loreToHowItWorksProgress * 1.5

    // 2. Slow auto-orbit angle (cinematic sweeping motion)
    const orbitAngle = t * 0.05

    // 3. Cinematic base coordinates
    const baseX = Math.sin(orbitAngle) * radius
    const baseY = Math.sin(t * 0.1) * 0.4 // Subtle vertical bobbing
    const baseZ = Math.cos(orbitAngle) * radius

    // 4. Parallax effect from mouse position
    const parallaxX = pointer.x * 0.5
    const parallaxY = pointer.y * 0.3

    targetPos.set(baseX + parallaxX, baseY + parallaxY, baseZ)

    // Smoothly LERP camera position
    camera.position.lerp(targetPos, 0.04)

    // Smoothly focus on centerpiece origin
    camera.lookAt(0, 0, 0)
  })

  return null
}
