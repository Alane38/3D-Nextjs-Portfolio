"use client";

import { OrbitControls, Sky, useGLTF } from "@react-three/drei";
import { Canvas as ThreeCanvas } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import { useControls } from "leva";
import { Suspense } from "react";
import { Diamond } from "../Resources/Class/Diamond";
import { TextObject } from "../Resources/Class/TextObject";

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

export function Canvas() {
  const { sunPosition } = useControls("Sun Position", {
    sunPosition: {
      value: [1, 2, 3],
      step: 1,
    },
  });

  const textNewalfox = new TextObject("/fonts/FontFlemme.json", [0, 30, 0], 0.2, 10, "NEWALFOX");

  const text1 = new TextObject("/fonts/FontFlemme.json", [0, 40, 0], 0.2, 10, "Text 1");
  const text2 = new TextObject("/fonts/FontFlemme.json", [0, 50, 0], 0.2, 10, "Text 2");
  const text3 = new TextObject("/fonts/FontFlemme.json", [0, 60, 0], 0.2, 10, "Text 3");
  const text4 = new TextObject("/fonts/FontFlemme.json", [0, 70, 0], 0.2, 10, "Text 4");

  const MyDiamond = new Diamond();

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
          {/* <Diamond /> */}
          {/* <Text textSize={TextSize} text={TextV} /> */}

          {MyDiamond.getComponent()}
          {textNewalfox.getComponent()}
          {text1.getComponent()}
          {text2.getComponent()}
          {text3.getComponent()}
          {text4.getComponent()}
        </Physics>
      </Suspense>
    </ThreeCanvas>
  );
}
