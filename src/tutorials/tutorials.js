import { BookMarked, Gem, Zap, Box, ScrollText } from 'lucide-react'

const TUTORIALS = [
  {
    id: 'navigation',
    title: 'Navigating the Grimoire',
    Icon: BookMarked,
    steps: [
      'Scroll through the grimoire using your mouse wheel or trackpad.',
      'The story unfolds line by line — each scroll reveals the next chapter.',
      'Progress dots at the center show how far you have journeyed.',
    ],
  },
  {
    id: 'artifacts',
    title: 'Exploring Artifacts',
    Icon: Gem,
    steps: [
      'Select an artifact from the tabs above the 3D viewer.',
      'The panel updates with detailed lore and magical properties.',
      'Each artifact has a unique color, school, and set of abilities.',
    ],
  },
  {
    id: 'invocation',
    title: 'Invoking Power',
    Icon: Zap,
    steps: [
      'Click the Invoke button to activate the artifact\'s magic.',
      'Watch the unique visual effect play out in the 3D viewer.',
      'The artifact responds with a dazzling display of light and color.',
    ],
  },
  {
    id: '3d-viewer',
    title: 'The Artifact Chamber',
    Icon: Box,
    steps: [
      'Drag to rotate the 3D artifact and inspect it from any angle.',
      'Switch between artifacts using the tabs above the viewer.',
      'Click Invoke to see the potion glow and spin with magical energy.',
    ],
  },
  {
    id: 'consult',
    title: 'Consulting the Grimoire',
    Icon: ScrollText,
    steps: [
      'Type a question or incantation into the input field.',
      'Press Enter or click Consult to receive the grimoire\'s response.',
      'The ancient tome stirs and answers your call with wisdom.',
    ],
  },
]

export default TUTORIALS
