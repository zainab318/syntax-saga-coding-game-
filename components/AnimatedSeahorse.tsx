"use client"

import React, { useRef, useEffect, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export interface SeahorsePosition {
  x: number
  z: number
  rotation: number
}

interface AnimatedSeahorseProps {
  position: SeahorsePosition
  isAnimating: boolean
  onAnimationComplete?: () => void
}

export default function AnimatedSeahorse({ 
  position, 
  isAnimating, 
  onAnimationComplete 
}: AnimatedSeahorseProps) {
  const seahorseRef = useRef<THREE.Group>(null)
  const { scene: seahorseScene } = useGLTF("/Character3d.glb")
  const [targetPosition, setTargetPosition] = useState(position)
  const [targetRotation, setTargetRotation] = useState(position.rotation)
  const [isMoving, setIsMoving] = useState(false)

  // Apply purple color to seahorse
  useEffect(() => {
    if (seahorseScene) {
      seahorseScene.traverse((child) => {
        const mesh = child as unknown as THREE.Mesh
        if ((mesh as any).isMesh && mesh.material) {
          const material = (mesh.material as THREE.Material).clone() as any
          ;(material.color as THREE.Color) = new THREE.Color("#5B1E8E")
          mesh.material = material
        }
      })
    }
  }, [seahorseScene])

  // Animation logic
  useFrame((_, delta) => {
    if (seahorseRef.current && isAnimating) {
      const currentPos = seahorseRef.current.position
      const currentRot = seahorseRef.current.rotation.y
      
      // Smooth movement to target position
      const moveSpeed = 2.0
      const rotSpeed = 3.0
      
      // Move towards target position
      const distance = Math.sqrt(
        Math.pow(targetPosition.x - currentPos.x, 2) + 
        Math.pow(targetPosition.z - currentPos.z, 2)
      )
      
      if (distance > 0.1) {
        setIsMoving(true)
        const direction = new THREE.Vector3(
          targetPosition.x - currentPos.x,
          0,
          targetPosition.z - currentPos.z
        ).normalize()
        
        currentPos.x += direction.x * moveSpeed * delta
        currentPos.z += direction.z * moveSpeed * delta
      } else {
        // Reached target position
        currentPos.x = targetPosition.x
        currentPos.z = targetPosition.z
        setIsMoving(false)
      }
      
      // Rotate towards target rotation
      const rotationDiff = targetRotation - currentRot
      if (Math.abs(rotationDiff) > 0.01) {
        const rotationDirection = rotationDiff > 0 ? 1 : -1
        seahorseRef.current.rotation.y += rotationDirection * rotSpeed * delta
      } else {
        seahorseRef.current.rotation.y = targetRotation
      }
      
      // Check if animation is complete
      if (!isMoving && Math.abs(targetRotation - currentRot) < 0.01) {
        onAnimationComplete?.()
      }
    }
  })

  // Update target position when position prop changes
  useEffect(() => {
    setTargetPosition(position)
    setTargetRotation(position.rotation)
  }, [position])

  return (
    <group ref={seahorseRef} position={[position.x, 0.3, position.z]}>
      <primitive
        object={seahorseScene.clone(true)}
        scale={1.5}
      />
    </group>
  )
}
