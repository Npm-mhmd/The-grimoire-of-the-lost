import { Environment } from '@react-three/drei'

export default function BookEnvironment() {
  return (
    <>
      <color attach="background" args={['#060607']} />
      <fog attach="fog" args={['#060607', 3, 14]} />
      <Environment preset="studio" />
    </>
  )
}
