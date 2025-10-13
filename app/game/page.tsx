"use client"

import React, { useState, Suspense, useRef, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, useGLTF } from "@react-three/drei"
import * as THREE from "three"
import { Water } from "three/examples/jsm/objects/Water.js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ProgrammingBar, { CommandBlock } from "@/components/ProgrammingBar"
import AnimatedSeahorse, { SeahorsePosition } from "@/components/AnimatedSeahorse"

// 🌊 Water Component (React wrapper around THREE.Water)
function WaterPlane() {
  const waterRef = useRef<THREE.Group>(null)

  useEffect(() => {
    if (!waterRef.current) return

    const waterGeometry = new THREE.PlaneGeometry(200, 200)
    const textureLoader = new THREE.TextureLoader()

    const waterNormals = textureLoader.load("/waternormals.jpg", (texture) => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    })

    const water = new Water(waterGeometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals,
      sunDirection: new THREE.Vector3(0, 1, 0),
      sunColor: 0xffffff,
      waterColor: 0x3BA7F5,
      distortionScale: 3.7,
      fog: false,
    })

    water.rotation.x = -Math.PI / 2
    water.position.y = -1.2
    waterRef.current.add(water)
  }, [])

  // Animate water surface
  useFrame((_, delta) => {
    if (waterRef.current && waterRef.current.children[0]) {
      const water = waterRef.current.children[0] as any
      if (water.material && water.material.uniforms) {
        water.material.uniforms["time"].value += delta
      }
    }
  })

  return <group ref={waterRef} />
}

// Shared grid settings
const GRID_SIZE = 6
const SPACING = 5
const HALF = Math.floor(GRID_SIZE / 2)
const MIN_COORD = (0 - HALF) * SPACING // -15
const MAX_COORD = (GRID_SIZE - 1 - HALF) * SPACING // 10

// 🪙 Coin Component (centered on middle tile) with collect animation
function Coin({ collected = false, onHidden }: { collected?: boolean; onHidden?: () => void }) {
  const { scene: coinScene } = useGLTF("/coin23d.glb")
  const coinGroup = useRef<THREE.Group>(null)

  // Recenter the coin horizontally and lift it so its bottom rests on y=0
  const recentered = coinScene.clone(true)
  const box = new THREE.Box3().setFromObject(recentered)
  const center = new THREE.Vector3()
  box.getCenter(center)
  // Center X/Z
  recentered.position.x -= center.x
  recentered.position.z -= center.z
  // Lift by min Y so the bottom of geometry sits at y=0
  recentered.position.y -= box.min.y

  // Pop-and-rise animation when collected
  useFrame((_, delta) => {
    if (!coinGroup.current) return
    if (collected) {
      coinGroup.current.position.y += 1.2 * delta
      const s = Math.max(coinGroup.current.scale.x - 1.5 * delta, 0)
      coinGroup.current.scale.setScalar(s)
      if (s <= 0.01) {
        onHidden?.()
      }
    }
  })

  return (
    <group ref={coinGroup} position={[0, 3.6, 0]} scale={3}>
      <primitive object={recentered} />
    </group>
  )
}

// 🌿 Main Grid of Blocks and Plants
function BlockGrid({ gridSize = GRID_SIZE, spacing = SPACING }) {
  const { scene: floorScene } = useGLTF("/Singleblock.glb")
  const { scene: plantScene } = useGLTF("/Plant23d.glb")
  
  const plantPositions = [
    { x: 1, z: 2 },
    { x: 1, z: 5 },
    { x: 2, z: 4 },
    { x: 5, z: 5 },
    { x: 4, z: 3 },
  ]

  const blocks = []
  for (let x = 0; x < gridSize; x++) {
    for (let z = 0; z < gridSize; z++) {
      const pos = [
        (x - Math.floor(gridSize / 2)) * spacing,
        -1,
        (z - Math.floor(gridSize / 2)) * spacing,
      ]

      const hasPlant = plantPositions.some((p) => p.x === x && p.z === z)

      blocks.push(
        <group key={`${x}-${z}`}>
          {/* 🧱 Block */}
          <primitive object={floorScene.clone()} position={pos} scale={1.5} />

          {/* 🌿 Plant above block */}
          {hasPlant && (
            <primitive
              object={plantScene.clone(true)}
              position={[pos[0], pos[1] + 1.2, pos[2]]} // 👈 1.2 is roughly top of block
              scale={1.2}
            />
          )}

        </group>
      )
    }
  }

  return (
    <>
      {blocks}
    </>
  )
  
}

// 🎮 Main Page Component
export default function GamePage() {
  const [currentLevel, setCurrentLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [coinCollected, setCoinCollected] = useState(false)
  const [coinVisible, setCoinVisible] = useState(true)
  const [flashText, setFlashText] = useState<string | null>(null)
  const [seahorsePosition, setSeahorsePosition] = useState<SeahorsePosition>({
    x: -10, // snap to grid corner
    z: -10, // snap to grid corner
    rotation: 0
  })
  const [isExecuting, setIsExecuting] = useState(false)
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0)

  const handleNextLevel = () => {
    setCurrentLevel((prev) => prev + 1)
    setScore((prev) => prev + 100)
  }

  const handleReset = () => {
    setCurrentLevel(1)
    setScore(0)
    setSeahorsePosition({ x: -10, z: -10, rotation: 0 })
    setCurrentCommandIndex(0)
    setCoinCollected(false)
    setCoinVisible(true)
    setFlashText(null)
  }

  // Execute program commands
  const executeProgram = (commands: CommandBlock[]) => {
    if (commands.length === 0) return
    
    setIsExecuting(true)
    setCurrentCommandIndex(0)
    executeNextCommand(commands, 0)
  }

  const executeNextCommand = (commands: CommandBlock[], index: number) => {
    if (index >= commands.length) {
      setIsExecuting(false)
      return
    }

    const command = commands[index]
    const newPosition = { ...seahorsePosition }

    switch (command.type) {
      case 'forward':
        // Move one tile forward
        newPosition.x += Math.sin(newPosition.rotation) * SPACING
        newPosition.z += Math.cos(newPosition.rotation) * SPACING
        break
      case 'backward':
        newPosition.x -= Math.sin(newPosition.rotation) * SPACING
        newPosition.z -= Math.cos(newPosition.rotation) * SPACING
        break
      case 'turnLeft':
        newPosition.rotation += Math.PI / 2 // 90 degrees
        break
      case 'turnRight':
        newPosition.rotation -= Math.PI / 2 // -90 degrees
        break
      case 'turnAround':
        newPosition.rotation += Math.PI
        break
      case 'wait':
        // no position change
        break
    }

    // Clamp rotation to [-PI, PI] for stability
    if (newPosition.rotation > Math.PI || newPosition.rotation < -Math.PI) {
      newPosition.rotation = Math.atan2(Math.sin(newPosition.rotation), Math.cos(newPosition.rotation))
    }

    // Clamp to grid bounds so the seahorse can't leave the platform
    newPosition.x = Math.min(MAX_COORD, Math.max(MIN_COORD, Math.round(newPosition.x / SPACING) * SPACING))
    newPosition.z = Math.min(MAX_COORD, Math.max(MIN_COORD, Math.round(newPosition.z / SPACING) * SPACING))

    setSeahorsePosition(newPosition)
    setCurrentCommandIndex(index + 1)

    // Coin collection check after this step
    maybeCollectCoin(newPosition)

    // Wait for animation to complete before next command
    setTimeout(() => {
      executeNextCommand(commands, index + 1)
    }, 1200) // slower step cadence
  }

  const maybeCollectCoin = (pos: SeahorsePosition) => {
    if (coinCollected || !coinVisible) return
    const threshold = SPACING * 0.9 // within ~one tile from center
    if (Math.abs(pos.x) <= threshold && Math.abs(pos.z) <= threshold) {
      setCoinCollected(true)
      setScore((s) => s + 100)
      setFlashText("Coin collected!")
      setTimeout(() => setFlashText(null), 1000)
    }
  }

  // Also check collection any time the seahorse position changes (extra safety)
  useEffect(() => {
    maybeCollectCoin(seahorsePosition)
  }, [seahorsePosition])

  return (
    <div className="min-h-screen bg-green-100 flex flex-col">
      {/* Header with Score */}
      <div className="bg-green-100 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-black text-lg font-bold">9/60</span>
            <div className="flex gap-1">
              {[1, 2, 3].map((star) => (
                <span key={star} className="text-yellow-500 text-lg">
                  {star <= 2 ? '★' : '☆'}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3D Game Scene */}
      <div className="flex-1 bg-green-100">
        <div className="w-full h-[400px] bg-green-100">
          <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 10, 5]} intensity={1.2} />

            <Suspense fallback={null}>
              <WaterPlane />
              <BlockGrid />
              {coinVisible && (
                <Coin collected={coinCollected} onHidden={() => setCoinVisible(false)} />
              )}
              <AnimatedSeahorse 
                position={seahorsePosition}
                isAnimating={isExecuting}
                onAnimationComplete={() => {
                  // Animation complete callback
                }}
              />
              <OrbitControls enableZoom={true} />
              <Environment preset="city" />
            </Suspense>
          </Canvas>
        </div>
      </div>

      {/* Programming Bar at Bottom */}
      <div className="bg-green-100 p-4">
        <ProgrammingBar 
          onExecuteProgram={executeProgram}
          isExecuting={isExecuting}
        />
      </div>
      {flashText && (
        <div className="fixed inset-x-0 bottom-24 flex justify-center pointer-events-none">
          <div className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded-md shadow-lg">
            {flashText}
          </div>
        </div>
      )}
    </div>
  )
}

// ✅ Preload Models
useGLTF.preload("/Singleblock.glb")
useGLTF.preload("/Plant23d.glb")
useGLTF.preload("/coin23d.glb")
useGLTF.preload("/Character3d.glb")