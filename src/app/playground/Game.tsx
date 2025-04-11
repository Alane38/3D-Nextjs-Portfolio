"use client";

import { useLoadingAssets } from "@/hooks";
import { KeyboardControls } from "@react-three/drei";
import { Leva } from "leva";
import { useState } from "react";
import { globalControls } from "src/constants/default";
import { Loading } from "../../components/Loading";
import { PerformanceWarning } from "../../components/PerformanceWarning";

import { MainWorld } from "./world/MainWorld";
import { GameCanvas } from "./GameCanvas";

export function Game() {
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
        <GameCanvas>
           {/* Put the world scene here */}
          <MainWorld />
          {/* <TestWorld /> */}
          {/* <JumpGame /> */}
        </GameCanvas>
      </KeyboardControls>
    </>
  );
}
