import {
  Grid,
  OrbitControls,
  OrthographicCamera,
  Sky,
} from "@react-three/drei";
import { Canvas as ThreeCanvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import React, { ReactNode, Suspense } from "react";
import { useSunPosition } from "@resources/Settings/useSunPosition";
import { useDebugState } from "@resources/Settings/useDebugState";
import { Perf } from "r3f-perf";

export function CanvasLayout({ children }: { children: ReactNode }) {
  const debugState = useDebugState();
  const sunPosition = useSunPosition();
  const shadowCameraRef = React.useRef<any>(null);

  return (
    <ThreeCanvas
      camera={{ position: [0, 16, 5], fov: 70, near: 0.1, far: 10000 }}
      shadows
    >
      {/* <OrbitControls /> */}
      <Sky distance={10000} sunPosition={sunPosition} />

      {/* Light Settings */}
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
        {/* Performance Monitor */}
        <Perf position="top-left" />

        {/* Debug Grid */}
        <Grid
          infiniteGrid
          followCamera
          sectionColor={"lightgray"}
          cellColor={"gray"}
          position={[0, 0.01, 0]}
        />
        <Physics gravity={[0, -15, 0]} debug={debugState}>
          {children} {/* Put the world scene here */}
        </Physics>
      </Suspense>
    </ThreeCanvas>
  );
}
