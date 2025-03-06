import { degToRad } from "three/src/math/MathUtils.js";

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
  INFINITE_JUMP: true,
};
