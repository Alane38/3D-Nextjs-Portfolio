import { useControls } from "leva";

// Leva Settings -> Debug
export const useDebugState = () => {
  const { debugState } = useControls("Debug State", {
    debugState: false,
  });
  return debugState;
};
