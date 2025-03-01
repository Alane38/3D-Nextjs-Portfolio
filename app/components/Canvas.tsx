"use client";

import { OrbitControls, Sky, Text3D, useGLTF } from "@react-three/drei";
import { Canvas as ThreeCanvas } from "@react-three/fiber";
import { Physics, RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useControls } from "leva";
import { Suspense, useRef } from "react";

function FlatMap() {
  const gltf = useGLTF("flatmap2.glb");

  return (
    <RigidBody
      type="fixed"
      colliders="trimesh"
      mass={0.01}
      scale={10}
      position={[0, 0, 0]}
      ref={(gltf) => console.log(gltf)}
    >
      <primitive object={gltf.scene} />;
    </RigidBody>
  );
}

function Diamond() {
  const gltf = useGLTF("diamond.glb");
  const ref = useRef<RapierRigidBody>(null);

  return (
    <RigidBody
      type="dynamic"
      colliders="trimesh"
      mass={0.1}
      scale={10}
      position={[0, 10 + 9, 0]}
      ref={ref}
    >
      <group
        onPointerDown={() => {
          if (ref.current) {
            ref.current.applyImpulse({ x: 0, y: 10000, z: 2000 }, false);
            ref.current.applyTorqueImpulse({ x: 0, y: 10000, z: 5000 }, false);
            // ref.current.setRotation({w: Math.random(), x: Math.random(), y: Math.random(), z: Math.random()}, false);
          }
        }}
      >
        <primitive object={gltf.scene} />;
      </group>
    </RigidBody>
  );
}

function Text({ textSize, text }: { textSize: number, text: string }) {
  return (
    <RigidBody
      type="fixed"
      colliders="trimesh"
      mass={0.1}
      scale={10}
      position={[0, 30, 0]}
    >
      <Text3D font={"/fonts/FontFlemme.json"} position={[0, 0, 0]} size={1} bevelEnabled bevelThickness={textSize}>
        {text}
        <meshNormalMaterial attach="material" />
      </Text3D>
    </RigidBody>
  );
}

export function Canvas() {
  const { sunPosition } = useControls("Sun Position", {
    sunPosition: {
      value: [1, 2, 3],
      step: 1,
    },
  });

  const {TextSize, TextV} = useControls("Text Size", {
    TextSize: {
      value: 0.2,
      step: 0.1,
    },
    TextV: {
      value: "NEWALFOX",
    },
  })

  return (
    <ThreeCanvas
      camera={{ position: [0, 16, 5], fov: 70, near: 0.1, far: 10000 }}
      shadows
    >
      <Sky distance={10000} sunPosition={sunPosition} />
      <ambientLight intensity={Math.PI / 2} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={Math.PI / 2}
        castShadow
      />

      <OrbitControls />

      <Suspense fallback={null}>
        <Physics gravity={[0, -15, 0]}>
          <FlatMap />
          <Diamond />
          <Text textSize={TextSize} text={TextV} />
        </Physics>
      </Suspense>
    </ThreeCanvas>
  );
}
