import { create } from 'zustand'

const useStore = create((set) => ({
  activePotionIndex: 0,
  activeEffect: null,
  isTransitioning: false,
  heroToLoreProgress: 0,
  loreToHowItWorksProgress: 0,
  hasInteracted: false,
  bookPage: 0,
  bookProgress: 0,

  setActivePotionIndex: (index) => set({ activePotionIndex: index }),
  setActiveEffect: (effectName) => set({ activeEffect: effectName }),
  setIsTransitioning: (value) => set({ isTransitioning: value }),
  setHeroToLoreProgress: (value) => set({ heroToLoreProgress: value }),
  setLoreToHowItWorksProgress: (value) => set({ loreToHowItWorksProgress: value }),
  setHasInteracted: (value) => set({ hasInteracted: value }),
  setBookPage: (page) => set({ bookPage: page }),
  setBookProgress: (p) => set({ bookProgress: p }),
}))

export default useStore
