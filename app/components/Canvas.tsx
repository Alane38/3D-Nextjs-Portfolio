"use client";

import { KeyboardControls } from "@react-three/drei";
import { CanvasLayout } from "./CanvasLayout";
import { MainWorld } from "@resources/Environment/MainWorld";
import { Leva } from "leva";

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "z", "Z"] },
  { name: "backward", keys: ["ArrowDown", "s", "S"] },
  { name: "left", keys: ["ArrowLeft", "q", "Q"] },
  { name: "right", keys: ["ArrowRight", "d", "D"] },
  { name: "run", keys: ["ShiftLeft"] },
  { name: "jump", keys: ["Space"] },
];

export function Canvas() {
  return (
    <>
      <Leva collapsed={true} />
      <KeyboardControls map={keyboardMap}>
        <CanvasLayout>
          <MainWorld />
        </CanvasLayout>
      </KeyboardControls>
    </>
  );
}
