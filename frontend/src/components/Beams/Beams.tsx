import { useEffect, useMemo, useRef, type ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

import './Beams.css'

type BeamsProps = {
  beamWidth?: number
  beamHeight?: number
  beamNumber?: number
  lightColor?: string
  beamColor?: string
  backgroundColor?: string
  speed?: number
  noiseIntensity?: number
  scale?: number
  rotation?: number
}

type BeamFieldProps = Required<Omit<BeamsProps, 'backgroundColor'>>

const vertexShader = `
  uniform float time;
  uniform float speed;
  uniform float waveScale;
  varying vec2 vUv;
  varying float vWave;

  void main() {
    vUv = uv;
    vec3 transformed = position;
    float wave = sin((uv.y * 8.0 * waveScale) + time * speed + position.x * 0.2);
    transformed.z += wave * 0.65;
    vWave = wave;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
  }
`

const fragmentShader = `
  uniform vec3 beamColor;
  uniform vec3 lightColor;
  uniform float noiseIntensity;
  varying vec2 vUv;
  varying float vWave;

  float random(vec2 point) {
    return fract(sin(dot(point, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    float edge = smoothstep(0.0, 0.18, vUv.x) * smoothstep(1.0, 0.82, vUv.x);
    float verticalGlow = 0.45 + 0.55 * smoothstep(0.0, 1.0, vUv.y);
    float shimmer = 0.72 + (vWave * 0.16);
    float grain = (random(gl_FragCoord.xy) - 0.5) * 0.12 * noiseIntensity;
    vec3 color = mix(beamColor, lightColor, verticalGlow * 0.72 + vWave * 0.08);
    gl_FragColor = vec4(color + grain, edge * verticalGlow * shimmer * 0.82);
  }
`

function CanvasWrapper({ children }: { children: ReactNode }) {
  return <Canvas dpr={[1, 1.75]} frameloop="always" className="beams-container" gl={{ alpha: false, antialias: true }}>{children}</Canvas>
}

function BeamField({ beamWidth, beamHeight, beamNumber, lightColor, beamColor, speed, noiseIntensity, scale, rotation }: BeamFieldProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const geometry = useMemo(() => new THREE.PlaneGeometry(beamWidth, beamHeight, 1, 80), [beamHeight, beamWidth])
  const material = useMemo(() => new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    uniforms: {
      time: { value: 0 },
      speed: { value: speed },
      waveScale: { value: scale },
      noiseIntensity: { value: noiseIntensity },
      beamColor: { value: new THREE.Color(beamColor) },
      lightColor: { value: new THREE.Color(lightColor) },
    },
    vertexShader,
    fragmentShader,
  }), [beamColor, lightColor, noiseIntensity, scale, speed])

  const positions = useMemo(() => {
    const spacing = beamWidth * 0.66
    const start = -((beamNumber - 1) * spacing) / 2
    return Array.from({ length: beamNumber }, (_, index) => ({
      x: start + index * spacing,
      y: Math.sin(index * 1.7) * 0.55,
      z: -Math.abs(index - beamNumber / 2) * 0.09,
    }))
  }, [beamNumber, beamWidth])

  useFrame((_, delta) => {
    if (materialRef.current && speed > 0) materialRef.current.uniforms.time.value += delta
  })

  useEffect(() => () => {
    geometry.dispose()
    material.dispose()
  }, [geometry, material])

  return <group rotation={[0, 0, THREE.MathUtils.degToRad(rotation)]}>
    {positions.map((position, index) => <mesh key={index} geometry={geometry} position={[position.x, position.y, position.z]}>
      <primitive ref={index === 0 ? materialRef : undefined} object={material} attach="material" />
    </mesh>)}
  </group>
}

export default function Beams({
  beamWidth = 2,
  beamHeight = 15,
  beamNumber = 12,
  lightColor = '#31D0A3',
  beamColor = '#064E46',
  backgroundColor = '#071524',
  speed = 2,
  noiseIntensity = 1.75,
  scale = 0.2,
  rotation = 0,
}: BeamsProps) {
  return <CanvasWrapper>
    <color attach="background" args={[backgroundColor]} />
    <BeamField beamWidth={beamWidth} beamHeight={beamHeight} beamNumber={beamNumber} lightColor={lightColor} beamColor={beamColor} speed={speed} noiseIntensity={noiseIntensity} scale={scale} rotation={rotation} />
    <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={30} />
  </CanvasWrapper>
}
