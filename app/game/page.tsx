"use client"

import React, { useState, Suspense, useRef, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, useGLTF } from "@react-three/drei"
import * as THREE from "three"
import { Water } from "three/examples/jsm/objects/Water.js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// 🌊 Water Component (React wrapper around THREE.Water)
function WaterPlane() {
  const waterRef = useRef()

  useEffect(() => {
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
      waterRef.current.children[0].material.uniforms["time"].value += delta
    }
  })

  return <group ref={waterRef} />
}

// 🌿 Main Grid of Blocks and Plants
function BlockGrid({ gridSize = 6, spacing = 5 }) {
  const { scene: floorScene } = useGLTF("/Singleblock.glb")
  const { scene: plantScene } = useGLTF("/Plant23d.glb")
  const { scene: coinScene } = useGLTF("/coin23d.glb")
  const { scene: seahorse } = useGLTF("/Character3d.glb")
  useEffect(() => {
    if (seahorse) {
      seahorse.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material = child.material.clone(); 
          child.material.color = new THREE.Color("#5B1E8E"); 
        }
      });
    }
  }, [seahorse]);
  
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
  
      {/* 🪙 Coin in center */}
      <primitive
  object={coinScene.clone(true)}
  position={[-2, 1, 2]}
/>

<primitive
  object={seahorse.clone(true)}
  position={[-9, 0.3, -5]}
  scale={1.5}
/>
    </>
  )
  
}

// 🎮 Main Page Component
export default function GamePage() {
  const [currentLevel, setCurrentLevel] = useState(1)
  const [score, setScore] = useState(0)

  const handleNextLevel = () => {
    setCurrentLevel((prev) => prev + 1)
    setScore((prev) => prev + 100)
  }

  const handleReset = () => {
    setCurrentLevel(1)
    setScore(0)
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Syntax Saga</h1>
          <p className="text-gray-400 text-lg">Coding Adventure Game</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm">Current Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{currentLevel}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm">Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{score}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">Playing</div>
            </CardContent>
          </Card>
        </div>

        {/* 🌊 3D Scene */}
        <div className="w-full h-[500px] bg-gray-950 border border-gray-700 rounded-lg overflow-hidden mb-6">
          <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 10, 5]} intensity={1.2} />

            <Suspense fallback={null}>
              <WaterPlane />
              <BlockGrid />
              <OrbitControls enableZoom={true} />
              <Environment preset="city" />
            </Suspense>
          </Canvas>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={handleNextLevel}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
          >
            Knowledge Door
            router.push( "/knowledgedoor") 
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800 px-6 py-2"
          >
            Reset Game
          </Button>
        </div>

        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Ready to start your coding adventure? Add your game logic here!</p>
        </div>
      </div>
    </div>
  )
}

// ✅ Preload Models
useGLTF.preload("/Singleblock.glb")
useGLTF.preload("/Plant23d.glb")
useGLTF.preload("/coin23d.glb")
useGLTF.preload("/Character3d.glb")