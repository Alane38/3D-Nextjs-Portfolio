"use client";

import { KeyboardControls } from "@react-three/drei";
import { ConfigCanvas } from "./ConfigCanvas";
import { EntityManagaer } from "@core/Managers/EntityManager";

export function Canvas() {
  return (
    <KeyboardControls
      map={[
        { name: "forward", keys: ["ArrowUp", "z", "Z"] },
        { name: "backward", keys: ["ArrowDown", "s", "S"] },
        { name: "left", keys: ["ArrowLeft", "q", "Q"] },
        { name: "right", keys: ["ArrowRight", "d", "D"] },
        { name: "run", keys: ["ShiftLeft"] },
        { name: "jump", keys: ["Space"] },
      ]}>
    <ConfigCanvas>
       <EntityManagaer /> *
    </ConfigCanvas>
    </KeyboardControls>
  );
}