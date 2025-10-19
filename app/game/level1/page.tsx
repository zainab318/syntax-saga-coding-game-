"use client"

import React, { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, useGLTF } from "@react-three/drei"

// 🌊 Sea model
function Sea() {
  const { scene } = useGLTF("/Sea.glb")
  scene.position.set(0, -3, 0) // lower it below the base
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

// 🧍 Character model
function Character() {
  const { scene } = useGLTF("/Seahorse.glb")
  scene.position.set(1, 3, -1.6)
  scene.scale.set(1.2, 1.2, 1.2)
  return <primitive object={scene} />
}

// 🎮 Level 1 Scene
export default function Level1() {
  return (
    <div className="w-screen h-screen bg-sky-200">
      <Canvas camera={{ position: [6, 5, 8], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 15, 10]} intensity={1.4} />

        <Suspense fallback={null}>
          <Sea />
          <Base />
          <Character />
          <OrbitControls enableZoom={true} />
          <Environment preset="sunset" />
        </Suspense>
      </Canvas>
    </div>
  )
}

// ✅ Preload for smoother loading
useGLTF.preload("/Sea.glb")
useGLTF.preload("/Level1_base (1).glb")
useGLTF.preload("/Seahorse.glb")