"use client";

import React, { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export interface SeahorsePosition {
  x: number;
  z: number;
  rotation: number;
}

interface AnimatedSeahorseProps {
  position: SeahorsePosition;
  isAnimating: boolean;
  onAnimationComplete?: () => void;
}

export default function AnimatedSeahorse({
  position,
  isAnimating,
  onAnimationComplete,
}: AnimatedSeahorseProps) {
  const seahorseRef = useRef<THREE.Group>(null);
  const { scene: seahorseScene } = useGLTF("/SeaHorse2.glb");
  const bobOffset = useRef(0);

  // Apply color to seahorse
  useEffect(() => {
    seahorseScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // ✅ Center the mesh geometry
        child.geometry.center();

        // ✅ Clone and modify material safely
        const material = child.material.clone();
        if ("color" in material) {
          material.color = new THREE.Color("#FFD700"); // Gold
        }
        child.material = material;
      }
    });
  }, [seahorseScene]);

  // Animation logic with smooth interpolation and bobbing
  useFrame((_, delta) => {
    if (seahorseRef.current) {
      const currentPos = seahorseRef.current.position;
      const currentRot = seahorseRef.current.rotation.y;

      // Smooth movement to target position
      const lerpSpeed = 0.1;

      // Interpolate position
      currentPos.x += (position.x - currentPos.x) * lerpSpeed;
      currentPos.z += (position.z - currentPos.z) * lerpSpeed;

      // Add bobbing animation (up and down motion)
      bobOffset.current += delta * 2; // Speed of bobbing
      const bobAmount = Math.sin(bobOffset.current) * 0.15; // Height of bobbing
      currentPos.y = 8 + bobAmount;

      // Interpolate rotation
      let targetRot = position.rotation;
      let rotDiff = targetRot - currentRot;

      // Normalize rotation difference to [-PI, PI]
      while (rotDiff > Math.PI) rotDiff -= 2 * Math.PI;
      while (rotDiff < -Math.PI) rotDiff += 2 * Math.PI;

      seahorseRef.current.rotation.y += rotDiff * lerpSpeed;
    }
  });

  return (
    <group
      ref={seahorseRef}
      position={[position.x, 3, position.z]}
      rotation={[0, position.rotation, 0]}
    >
      <primitive object={seahorseScene.clone(true)} scale={1.2} />
    </group>
  );
}
