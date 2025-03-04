"use client";

import { KeyboardControls } from "@react-three/drei";
import { CanvasLayout } from "./CanvasLayout";
import { MainWorld } from "@resources/Environment/MainWorld";
import { Leva } from "leva";
import { characterControls } from "@/constants/character";

export function Canvas() {
  return (
    <>
      <Leva collapsed={true} />

      <KeyboardControls map={characterControls}>
        <CanvasLayout>
          <MainWorld />
        </CanvasLayout>
      </KeyboardControls>
    </>
  );
}
