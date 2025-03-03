import { useControls } from "leva";

export const useDebugState = () => {
  const { debugState } = useControls("Debug State", {
    debugState: false,
  });
  return debugState;
};
