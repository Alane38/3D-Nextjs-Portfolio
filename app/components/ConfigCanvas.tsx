"use client";

import { OrbitControls, Sky } from "@react-three/drei";
import { Canvas as ThreeCanvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { ReactNode, Suspense } from "react";
import { useSunPosition } from "../Resources/Settings/useSunPosition";

export function ConfigCanvas({ children }: { children: ReactNode }) {
  const sunPosition = useSunPosition();

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
        <Physics gravity={[0, -15, 0]}>{children}</Physics>
      </Suspense>
    </ThreeCanvas>
  );
}
