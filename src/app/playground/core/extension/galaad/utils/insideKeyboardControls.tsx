import { useKeyboardControls } from "@react-three/drei";

export function insideKeyboardControls() {
  try {
    return !!useKeyboardControls();
  } catch {
    return false;
  }
}
