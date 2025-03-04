import { useControls } from "leva";

// Leva Settings -> SunPosition
export const useSunPosition = () => {
  const { sunPosition } = useControls("Sun Position", {
    sunPosition: {
      value: [1, 2, 3],
      step: 1,
    },
  });
  return sunPosition;
};
