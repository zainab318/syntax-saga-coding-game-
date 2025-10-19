"use client"

import React, { Suspense, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, useGLTF } from "@react-three/drei"
import ProgrammingBar, { CommandBlock } from "@/components/ProgrammingBar"
import AnimatedSeahorse, { SeahorsePosition } from "@/components/AnimatedSeahorse"

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

// 🎮 Level 1 Scene
export default function Level1() {
  const [isExecuting, setIsExecuting] = useState(false)
  const [seahorsePosition, setSeahorsePosition] = useState<SeahorsePosition>({
    x: 1,
    z: -1.6,
    rotation: 0
  })

  const executeProgram = (commands: CommandBlock[]) => {
    if (commands.length === 0) return
    
    setIsExecuting(true)
    executeNextCommand(commands, 0, { x: seahorsePosition.x, z: seahorsePosition.z, rotation: seahorsePosition.rotation })
  }

  const executeNextCommand = (commands: CommandBlock[], index: number, currentPos: SeahorsePosition) => {
    if (index >= commands.length) {
      setIsExecuting(false)
      return
    }

    const command = commands[index]
    const newPosition = { ...currentPos }

    switch (command.type) {
      case 'forward':
        // Move forward based on current rotation
        newPosition.x += Math.sin(newPosition.rotation) * 4.5
        newPosition.z += Math.cos(newPosition.rotation) * 4.5
        break
      case 'backward':
        // Move backward based on current rotation
        newPosition.x -= Math.sin(newPosition.rotation) * 4.5
        newPosition.z -= Math.cos(newPosition.rotation) * 4.5
        break
      case 'turnLeft':
        newPosition.rotation += Math.PI / 2 // 90 degrees left
        break
      case 'turnRight':
        newPosition.rotation -= Math.PI / 2 // 90 degrees right
        break
      case 'turnAround':
        newPosition.rotation += Math.PI // 180 degrees
        break
      case 'wait':
        // No position change
        break
    }

    // Normalize rotation to [-PI, PI]
    if (newPosition.rotation > Math.PI || newPosition.rotation < -Math.PI) {
      newPosition.rotation = Math.atan2(Math.sin(newPosition.rotation), Math.cos(newPosition.rotation))
    }

    setSeahorsePosition(newPosition)

    // Wait for animation to complete before next command
    setTimeout(() => {
      executeNextCommand(commands, index + 1, newPosition)
    }, 1200)
  }

  return (
    <div className="w-screen h-screen bg-sky-200 relative flex flex-col">
      {/* 3D Canvas */}
      <div className="flex-1">
        <Canvas camera={{ position: [6, 5, 8], fov: 50 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[10, 15, 10]} intensity={1.4} />

          <Suspense fallback={null}>
            <Sea />
            <Base />
            <AnimatedSeahorse 
              position={seahorsePosition}
              isAnimating={isExecuting}
              onAnimationComplete={() => {}}
            />
            <OrbitControls enableZoom={true} />
            <Environment preset="sunset" />
          </Suspense>
        </Canvas>
      </div>

      {/* Programming Bar at Bottom */}
      <div className="bg-sky-200 p-4">
        <ProgrammingBar 
          onExecuteProgram={executeProgram}
          isExecuting={isExecuting}
        />
      </div>
    </div>
  )
}

// ✅ Preload for smoother loading
useGLTF.preload("/Sea.glb")
useGLTF.preload("/Level1_base (1).glb")
useGLTF.preload("/Seahorse.glb")