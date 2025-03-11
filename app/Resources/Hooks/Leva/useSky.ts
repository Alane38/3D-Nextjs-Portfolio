import { useControls } from "leva";

// Leva Settings -> Sky
export const useSky = () => {
  const sky = useControls("Sky", {
    turbidity: { value: -222.9, step: 0.1 },
    rayleigh: { value: 4.0, step: 0.1 },
    mieCoefficient: { value: 0.01, step: 0.001 },
    mieDirectionalG: { value: -0.4, step: 0.1 },
    elevation: { value: -0, step: 1 },
    azimuth: { value: -88, step: 1 },
    distance: { value: 280, step: 1 },
    sunPosition: { value: [1, 1, 1], step: 1 }, // Best color for light sun : [1, -1, 1]
  });
  return sky;
};
