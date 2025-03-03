"use client";

import { OrthographicCamera, Sky } from "@react-three/drei";
import { Canvas as ThreeCanvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import React, { ReactNode, Suspense } from "react";
import { useSunPosition } from "@resources/Settings/useSunPosition";
import { GroundComponent } from "../Resources/Class/Ground";

/* const maps: {
  [key: string]: { scale: number; position: [number, number, number] };
} = {
  flatmap: {
    scale: 1,
    position: [0, 0, 0],
  },
};
 */
export function ConfigCanvas({ children }: { children: ReactNode }) {
  const sunPosition = useSunPosition();
  const shadowCameraRef = React.useRef<any>(null);

  /* const { map } = useControls("Map", {
    map: {
      value: "flatmap",
      options: Object.keys(maps),
    },
  }); */

  return (
    <ThreeCanvas
      camera={{ position: [0, 16, 5], fov: 70, near: 0.1, far: 10000 }}
      shadows
    >
      <Sky distance={10000} sunPosition={sunPosition} />
      <ambientLight intensity={Math.PI / 2} />
      <directionalLight position={[5, 5, 5]} intensity={Math.PI / 2} castShadow>
        <OrthographicCamera
          left={22}
          right={22}
          top={10}
          bottom={-20}
          ref={shadowCameraRef}
          attach={"shadow-camera"}
        />
      </directionalLight>
      <Suspense fallback={null}>
        <Physics gravity={[0, -15, 0]} debug>
          {/* <Map
            scale={maps[map].scale}
            position={maps[map].position}
            model={`${classModelPath}/${map}.glb`}
          /> */}
          <GroundComponent />
          {children}
        </Physics>
      </Suspense>
    </ThreeCanvas>
  );
}
