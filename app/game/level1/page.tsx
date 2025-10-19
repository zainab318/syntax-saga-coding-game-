"use client"

import React, { Suspense, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, useGLTF } from "@react-three/drei"
import * as THREE from "three"

// 🌊 Sea model
function Sea() {
  const { scene } = useGLTF("/Sea.glb")
  scene.position.set(0, -3, 0)
  scene.scale.set(3, 3, 3)
  return <primitive object={scene} />
}

// 🏝 Base model
function Base() {
  const { scene } = useGLTF("/Level1_base (1).glb")
  scene.position.set(0, 1, 0)
  scene.scale.set(1.5, 1.5, 1.5)
  return <primitive object={scene} />
}

// 🐴 Character with forward motion
function Character({ moveTrigger }: { moveTrigger: number }) {
  const { scene } = useGLTF("/Seahorse.glb")
  const ref = useRef<THREE.Object3D>(null)
  const [targetX, setTargetX] = useState(1)

  // Update target each time moveTrigger changes
  React.useEffect(() => {
    if (moveTrigger > 0) {
      setTargetX(prev => prev + 4.5) // move forward 4.5 units
    }
  }, [moveTrigger])

  // Smooth animation toward target
  useFrame(() => {
    if (ref.current) {
      ref.current.position.x += (targetX - ref.current.position.x) * 0.1
    }
  })

  return (
    <primitive
      ref={ref}
      object={scene}
      position={[1, 3, -1.6]}
      scale={[1.2, 1.2, 1.2]}
    />
  )
}

// 🎮 Level 1 Scene
export default function Level1() {
  const [moveTrigger, setMoveTrigger] = useState(0)

  return (
    <div className="w-screen h-screen bg-sky-200 relative">
      <Canvas camera={{ position: [6, 5, 8], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 15, 10]} intensity={1.4} />

        <Suspense fallback={null}>
          <Sea />
          <Base />
          <Character moveTrigger={moveTrigger} />
          <OrbitControls enableZoom={true} />
          <Environment preset="sunset" />
        </Suspense>
      </Canvas>

      {/* 🕹 Forward button */}
      <button
        onClick={() => setMoveTrigger(t => t + 1)}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-xl text-lg shadow-md"
      >
        Forward
      </button>
    </div>
  )
}

// ✅ Preload for smoother loading
useGLTF.preload("/Sea.glb")
useGLTF.preload("/Level1_base (1).glb")
useGLTF.preload("/Seahorse.glb")