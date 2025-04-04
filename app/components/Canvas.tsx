"use client";

import { globalControls } from "@constants/default";
import { KeyboardControls } from "@react-three/drei";
import { MainWorld } from "@resources/Environment/MainWorld";
import { useLoadingAssets } from "@resources/Hooks";
import { Leva } from "leva";
import { useState } from "react";
import { CanvasLayout } from "./CanvasLayout";
import { Loading } from "./Utility/Loading";
import { PerformanceWarning } from "./Utility/PerformanceWarning";

export function Canvas() {
  const [visible, setVisible] = useState(true);
  const loading = useLoadingAssets();

  return (
    <>
      {loading !== 100 && visible && (
        <Loading
          progress={loading}
          onSkip={() => {
            setVisible(false);
          }}
        />
      )}
      <PerformanceWarning />
      <Leva collapsed={true} /> {/* Leva Panel Settings */}
      {/* Player Inventory */}
      {/* <Inventory /> */}
      {/* Controls */}
      <KeyboardControls map={globalControls}>
        <CanvasLayout>
           {/* Put the world scene here */}
          <MainWorld />
          {/* <TestWorld /> */}
          {/* <JumpGame /> */}
        </CanvasLayout>
      </KeyboardControls>
    </>
  );
}
