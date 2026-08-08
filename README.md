# Grimoire of the Lost

> Deep in the Restricted Section of Hogwarts Library, a crumbling grimoire pulses with dormant magic. Recover its lost potion recipes before the enchantment fades forever.

For eight centuries, the grimoire lay sealed beneath layers of dust and forgotten enchantments. Its ink still moves. Its runes still breathe. Three lost artifacts survived the decay — blue, red, and green potions, each one a window into a power that was never meant to be found. You are the one who broke the seal. The vault's history is yours to recover, one spell at a time.

**Grimoire of the Lost** was built as a **hackathon project** — a scroll-driven, immersive 3D story experience where visitors uncover a wizard's grimoire page by page, choose one of three potions, and watch them come alive in a cinematic environment.

## Demo
visit [https://the-grimoire-of-the-lost.netlify.app/]
## Tech Stack

- **React 19** — Component architecture
- **Three.js** + **React Three Fiber** — 3D rendering
- **@react-three/drei** — Environment, Float, useGLTF helpers
- **@react-three/postprocessing** — Bloom effect
- **GSAP** + **ScrollTrigger** — Scroll-driven camera animation
- **Zustand** — Potion state management
- **Framer Motion** — Page/button transitions
- **Tailwind CSS 3** — Dark Academia UI

## Features

- **Scroll-Storytelling** — GSAP ScrollTrigger drives camera zoom and model rotation as the user scrolls between sections
- **Interactive Potion Selection** — Three icon-buttons update a Zustand store; the 3D model pulses on selection
- **Hover Emissive Feedback** — The model glows with the selected potion's color on pointer hover
- **Bloom Post-Processing** — Pulsing luminance bloom for a magical glow
- **Procedural Ambient Audio** — Low drone + filtered noise crackle activates on first click (Web Audio API)
- **Click-to-Cast Particles** — White flash burst at cursor on potion selection
- **Full-Page Preloader** — Animated rune progress bar hides until the GLB model is ready
- **Error Boundary** — Graceful fallback if the 3D scene fails to load
- **WebXR AR Entry Point** — "Summon to Reality" button attempts an immersive-AR session
- **Dark Academia Aesthetic** — `#0a0a0a` background, amber-700 headings, parchment-card overlays

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── 3D/
│   │   ├── BookEnvironment.jsx     — Studio environment + fog
│   │   ├── CinematicCamera.jsx     — Cinematic camera rig
│   │   ├── CustomLoader.jsx        — Rune SVG inside Canvas Suspense
│   │   ├── EscapingPotions3D.jsx   — Simplex-noise drifting potions
│   │   └── PotionModel.jsx         — GLTF model + hover emissive
│   ├── AmbientSound.jsx            — Web Audio ambient drone
│   ├── ArtifactEffects.jsx         — Artifact glow/particle effects
│   ├── CenterpieceSection.jsx      — Full-width canvas + AR button
│   ├── ClickToCast.jsx             — Flash particle on click
│   ├── DemonstrationOverlay.jsx    — Cinematic demonstration overlay
│   ├── ErrorBoundary.jsx           — 3D error fallback
│   ├── HeroSection.jsx             — Split layout hero
│   ├── HowItWorks.jsx              — Potion selection grid
│   ├── LoadingScreen.jsx           — App-level preloader
│   ├── LoreSection.jsx             — Dark themed lore card
│   ├── MagicCursor.jsx             — Custom cursor effects
│   ├── MakersSection.jsx           — Team credits
│   ├── PotionEffects.jsx           — Procedural potion effects
│   ├── ScrollManager.jsx           — GSAP ScrollTrigger setup
│   ├── TutorialOverlay.jsx         — Tutorial tip overlay
│   └── TutorialSection.jsx         — Interactive tutorial steps
├── lib/
│   └── simplex-noise.js            — Procedural noise helpers
├── store/
│   └── useStore.js                 — Zustand (activePotionIndex, scroll progress, hasInteracted)
├── tutorials/
│   └── tutorials.js                — Tutorial step definitions
├── App.jsx                         — Page composition
├── main.jsx                        — React entry point
└── index.css                       — Tailwind base + component classes

public/
└── models/                         — GLB 3D potion models (blue, red, green)
```

## Deployment

Place your GLB models in `public/models/` before building. The vite-plugin-compression step generates `.gz` files for supported assets during build.
