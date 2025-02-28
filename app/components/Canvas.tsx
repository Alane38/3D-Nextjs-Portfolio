"use client";

import { Canvas as ThreeCanvas } from "@react-three/fiber";
import { OrbitControls, Sky, useGLTF } from "@react-three/drei";
import { useControls } from "leva";

function Model() {
  const { scene } = useGLTF("/assets/model/FlatMap.glb");
  return <primitive object={scene} />;
}

export function Canvas() {
  const { sunPosition} = useControls("Sun Position", {
    sunPosition: {
      value: [1, 2, 3],
      step: 1,
     },
  })
  return (
    <ThreeCanvas
      camera={{ position: [0, 2, 5], fov: 70, near: 0.1, far: 10000 }}
      shadows
    >
      <Sky distance={10000} sunPosition={sunPosition} />
      <ambientLight intensity={Math.PI / 2} />&
      <directionalLight position={[5, 5, 5]} intensity={Math.PI / 2} />
      <Model />
      <OrbitControls />
    </ThreeCanvas>
  );
}
