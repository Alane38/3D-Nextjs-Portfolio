"use client";

import { KeyboardControls } from "@react-three/drei";
import { CanvasLayout } from "./CanvasLayout";
import { MainWorld } from "@resources/Environment/MainWorld";
import { Leva } from "leva";
import { characterControls } from "@/constants/character";

export function Canvas() {
  return (
    <>
      <Leva collapsed={true} /> {/* Leva Panel Settings */}
      {/* Controls */}
      <KeyboardControls map={characterControls}>
        <CanvasLayout>
          <MainWorld /> {/* Children */}
        </CanvasLayout>
      </KeyboardControls>
    </>
  );
}
