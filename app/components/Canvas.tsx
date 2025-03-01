"use client";

import { Box, OrbitControls, Sphere, Torus, useGLTF } from "@react-three/drei";
import { Canvas as ThreeCanvas } from "@react-three/fiber";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import { Suspense } from "react";

function FlatMap() {
  const gltf = useGLTF("flatmap2.glb");

  return <primitive object={gltf.scene} />;
}

export function Canvas() {
  return (
    <ThreeCanvas
      camera={{ position: [0, 2, 5], fov: 70, near: 0.1, far: 10000 }}
      shadows
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />

      <OrbitControls />
      <Suspense>
        <Physics debug>
          <RigidBody colliders="cuboid">
            <Box />
          </RigidBody>

          {/* Use an automatic BallCollider for all meshes inside this RigidBody */}
          <RigidBody position={[0, 10, 0]} colliders="ball">
            <Sphere />
          </RigidBody>

          <RigidBody
            type="fixed"
            colliders="trimesh"
            mass={0.01}
            scale={10}
            position={[0, 0, 0]}
          >
            <FlatMap />
          </RigidBody>

          <CuboidCollider position={[0, -2, 0]} args={[20, 0.5, 20]} />
        </Physics>
      </Suspense>
    </ThreeCanvas>
  );
}
