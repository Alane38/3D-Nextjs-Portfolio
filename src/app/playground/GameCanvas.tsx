import { useDebugState } from "@/hooks/leva";
import { Bvh, Grid } from "@react-three/drei";
import { Camera, Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Physics } from "@react-three/rapier";
import { useControls } from "leva";
import { Perf } from "r3f-perf";
import React, { ReactNode, Suspense, useEffect, useState } from "react";

export function GameCanvas({ children }: { children: ReactNode }) {
  const debugState = useDebugState();
  const shadowCameraRef = React.useRef<Camera>(null);

  /**
   * Delay physics activate
   */
  const [pausedPhysics, setPausedPhysics] = useState(true);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setPausedPhysics(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  const { intensity, luminanceSmoothing, luminanceThreshold } = useControls({
    intensity: { value: 0.15, min: 0, max: 1.5, step: 0.01 },
    luminanceSmoothing: { value: 0, min: 0, max: 1.5, step: 0.01 },
    luminanceThreshold: { value: 1.14, min: 0, max: 1.5, step: 0.01 },
  });

  return (
    <Canvas
      camera={{ position: [0, 16, 5], fov: 70, near: 0.1, far: 10000 }}
      shadows
      gl={{ powerPreference: "high-performance" }}
    >
      <Suspense fallback={null}>
        <Bvh firstHitOnly>
          {/* <OrbitControls /> */}

          {/* Light Settings */}
          <ambientLight intensity={Math.PI / 2} />
          <directionalLight position={[5, 5, 5]} intensity={Math.PI / 2}>
            <orthographicCamera
              left={22}
              right={22}
              top={10}
              bottom={-20}
              ref={shadowCameraRef}
              attach={"shadow-camera"}
            />
          </directionalLight>

          {/* <Suspense fallback={null}> */}
          {/* Performance Monitor */}
          <Perf position="top-left" minimal />

          {/* Debug Grid */}
          <Grid
            infiniteGrid
            fadeDistance={100}
            followCamera
            sectionColor={"blue"}
            cellColor={"gray"}
            position={[0, 0.28, 0]}
          />
          <Physics
            gravity={[0, -15, 0]}
            debug={debugState}
            timeStep={"vary"}
            paused={pausedPhysics}
          >
            {children}
          </Physics>
          {/* </Suspense> */}
          <EffectComposer multisampling={0}>
            <Bloom
              mipmapBlur={true}
              luminanceThreshold={luminanceThreshold}
              luminanceSmoothing={luminanceSmoothing}
              intensity={intensity}
            />
          </EffectComposer>
        </Bvh>
      </Suspense>
    </Canvas>
  );
}
