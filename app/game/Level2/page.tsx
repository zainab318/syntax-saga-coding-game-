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
  const { scene } = useGLTF("/Level2_base.glb")
  scene.position.set(0, -1, 0)
  scene.scale.set(1.5, 1.5, 1.5)
  return <primitive object={scene} />
}

// 🐴 Seahorse with forward and right motion
function Seahorse({ moveTrigger, moveRightTrigger }: { moveTrigger: number; moveRightTrigger: number }) {
  const { scene } = useGLTF("/SeaHorse.glb")
  const ref = useRef<THREE.Object3D>(null)
  const startX = -3.5
  const startZ = -6
  const [targetX, setTargetX] = useState(startX)
  const [targetZ, setTargetZ] = useState(startZ)

  // Update target X each time moveTrigger changes
  React.useEffect(() => {
    setTargetX(prev => prev + 4.5) // move forward 4.5 units
  }, [moveTrigger])

  
  React.useEffect(() => {
    setTargetZ(prev => prev + 4.5) 
  }, [moveRightTrigger])

  // Smooth animation toward target
  useFrame(() => {
    if (ref.current) {
      ref.current.position.x += (targetX - ref.current.position.x) * 0.1
      ref.current.position.z += (targetZ - ref.current.position.z) * 0.1
    }
  })

  return (
    <primitive
      ref={ref}
      object={scene}
      position={[startX, 0.4, startZ]}
      scale={[1.2, 1.2, 1.2]}
    />
  )
}

// 🎮 Level 2 Scene
export default function Level2() {
  const [moveTrigger, setMoveTrigger] = useState(0)
  const [moveRightTrigger, setMoveRightTrigger] = useState(0)

  return (
    <div className="w-screen h-screen bg-sky-200 relative">
      <Canvas camera={{ position: [6, 5, 8], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 15, 10]} intensity={1.4} />

        <Suspense fallback={null}>
          <Sea />
          <Base />
          <Seahorse moveTrigger={moveTrigger} moveRightTrigger={moveRightTrigger} />
          <OrbitControls enableZoom={true} />
          <Environment preset="sunset" />
        </Suspense>
      </Canvas>

      {/* 🕹 Control buttons */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4">
        <button
          onClick={() => setMoveTrigger(t => t + 1)}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl text-lg shadow-md"
        >
          Forward
        </button>
        <button
          onClick={() => setMoveRightTrigger(t => t + 1)}
          className="bg-green-600 text-white px-6 py-3 rounded-xl text-lg shadow-md"
        >
          Move Right
        </button>
      </div>
    </div>
  )
}

// ✅ Preload for smoother loading
useGLTF.preload("/Sea.glb")
useGLTF.preload("/Level2_base.glb")
useGLTF.preload("/SeaHorse.glb")