import { useKeyboardControls } from "@react-three/drei";

export function InsideKeyboardControls() {
  try {
    return !!useKeyboardControls();
  } catch {
    return false;
  }
}
