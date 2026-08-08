import HeroSection from './components/HeroSection'
import LoreSection from './components/LoreSection'
import HowItWorks from './components/HowItWorks'
import CenterpieceSection from './components/CenterpieceSection'
import TutorialSection from './components/TutorialSection'
import MakersSection from './components/MakersSection'
import ScrollManager from './components/ScrollManager'
import AmbientSound from './components/AmbientSound'
import LoadingScreen from './components/LoadingScreen'
import PotionEffects from './components/PotionEffects'
import MagicCursor from './components/MagicCursor'

function App() {
  return (
    <LoadingScreen>
      <ScrollManager />
      <AmbientSound />
      <PotionEffects />
      <MagicCursor />
      <main className="w-full">
        <HeroSection />
        <LoreSection />
        <HowItWorks />
        <CenterpieceSection />
        <TutorialSection />
        <MakersSection />
      </main>
    </LoadingScreen>
  )
}

export default App
