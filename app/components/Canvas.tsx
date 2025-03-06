"use client";

import { KeyboardControls } from "@react-three/drei";
import { CanvasLayout } from "./CanvasLayout";
import { MainWorld } from "@resources/Environment/MainWorld";
import { Leva } from "leva";
import { characterControls } from "@/constants/character";
import { Inventory } from "./Player/Inventory";
import { TestWorld } from "../Resources/Environment/TestWorld";
import { useLoadingAssets } from "../Resources/Settings/useLoadingAssets";
import { Loading } from "./Loading";
import { PerformanceWarning } from "./PerformanceWarning";

export function Canvas() {
  const loading = useLoadingAssets();

  return (
    <>
      {loading !== 100 && <Loading progress={loading} />}
      <PerformanceWarning />

      <Leva collapsed={true} /> {/* Leva Panel Settings */}

      {/* Player Inventory */}
      {/* <Inventory /> */}

      {/* Controls */}
      <KeyboardControls map={characterControls}>
        <CanvasLayout>
          {/* Children */}
          <MainWorld />
          {/* <TestWorld /> */}
        </CanvasLayout>
      </KeyboardControls>
    </>
  );
}
