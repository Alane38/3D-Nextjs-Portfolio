import { degToRad } from "three/src/math/MathUtils.js";

// Controls
export const characterControls = [ 
  { name: "forward", keys: ["ArrowUp", "z", "Z"] },
  { name: "backward", keys: ["ArrowDown", "s", "S"] },
  { name: "left", keys: ["ArrowLeft", "q", "Q"] },
  { name: "right", keys: ["ArrowRight", "d", "D"] },
  { name: "run", keys: ["ShiftLeft"] },
  { name: "jump", keys: ["Space"] },
];

// Character Value Config
export const characterControllerConfig = {
  WALK_SPEED: { value: 4, min: 0.1, max: 4, step: 0.1 },
  RUN_SPEED: { value: 6, min: 0.2, max: 12, step: 0.1 },
  JUMP_FORCE: { value: 2.5, min: 0.1, max: 10, step: 0.1 },
  ROTATION_SPEED: {
    value: degToRad(0.5),
    min: degToRad(0.1),
    max: degToRad(5),
    step: degToRad(0.1),
  },
  MOUSE: true,
  INFINITE_JUMP: false,
};
