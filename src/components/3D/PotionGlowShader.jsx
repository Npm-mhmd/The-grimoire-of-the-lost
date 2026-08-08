import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import * as THREE from 'three'

export const PotionGlowMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color('#d4af37'),
    uIntensity: 0.5,
    uBrewProgress: 0.0,
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  // Fragment Shader
  `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uIntensity;
    uniform float uBrewProgress;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    // Simple noise generator
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }
    
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
                 mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
    }

    void main() {
      // Swirling internal liquid animation
      vec2 noiseUv = vUv * 4.0;
      noiseUv.y -= uTime * 0.4;
      noiseUv.x += sin(uTime * 0.2 + noiseUv.y) * 0.5;
      float liquidNoise = noise(noiseUv);

      // Fresnel rim glow calculation (glowing outlines)
      vec3 viewDir = normalize(vViewPosition);
      float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 3.0);

      // Mix liquid color with noise pattern
      vec3 baseColor = uColor * (0.6 + liquidNoise * 0.4);

      // Brewing effect: eruption of glowing golden particles inside
      float eruption = smoothstep(0.1, 1.0, uBrewProgress) * (fresnel + liquidNoise) * 3.0;
      vec3 glowColor = uColor * (uIntensity * 2.0 + eruption);

      // Emissive output blending
      vec3 finalRGB = baseColor + glowColor * fresnel;

      // Adjust opacity based on brew progress and fresnel
      float alpha = mix(0.75, 1.0, fresnel) + uBrewProgress * 0.2;

      gl_FragColor = vec4(finalRGB, alpha);
    }
  `
)

extend({ PotionGlowMaterial })
