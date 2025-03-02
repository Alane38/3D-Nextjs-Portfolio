import { useControls } from "leva";

export const useSunPosition = () => {
const { sunPosition } = useControls("Sun Position", {
    sunPosition: {
      value: [1, 2, 3],
      step: 1,
    },
  });
  return sunPosition;
}