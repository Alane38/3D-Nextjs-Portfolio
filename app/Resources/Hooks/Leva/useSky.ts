import { useControls } from "leva";

// Leva Settings -> Sky
export const useSky = () => {
  const sky = useControls("Sky", {
    turbidity: { value: -1, step: 0.1 },
    rayleigh: { value: 17, step: 0.1 },
    mieCoefficient: { value: 4, step: 0.001 },
    mieDirectionalG: { value: 50, step: 0.1 },
    elevation: { value: -0, step: 1 },
    azimuth: { value: -88, step: 1 },
    distance: { value: 1000, step: 1 },
    sunPosition: { value: [-100, -100, 1], step: 1 }, // Best color for light sun : [1, -1, 1]
  });
  return sky;
};
