import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useStore from '../store/useStore'

gsap.registerPlugin(ScrollTrigger)

export default function ScrollManager() {
  const setHeroToLoreProgress = useStore((s) => s.setHeroToLoreProgress)
  const setLoreToHowItWorksProgress = useStore((s) => s.setLoreToHowItWorksProgress)

  useEffect(() => {
    const heroTrigger = ScrollTrigger.create({
      trigger: '#lore',
      start: 'top bottom',
      end: 'top top',
      scrub: 1,
      onUpdate: (self) => {
        setHeroToLoreProgress(self.progress)
      },
    })

    const loreTrigger = ScrollTrigger.create({
      trigger: '#artifacts',
      start: 'top bottom',
      end: 'top top',
      scrub: 1,
      onUpdate: (self) => {
        setLoreToHowItWorksProgress(self.progress)
      },
    })

    return () => {
      heroTrigger.kill()
      loreTrigger.kill()
    }
  }, [setHeroToLoreProgress, setLoreToHowItWorksProgress])

  return null
}
