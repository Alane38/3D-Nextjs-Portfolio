import { create } from "zustand";
import { SliderType } from "../types/default";

export interface SkyState {
  turbidity: number;
  rayleigh: number;
  mieCoefficient: number;
  mieDirectionalG: number;
  elevation: number;
  azimuth: number;
  distance: number;
  sunPosition: [number, number, number];
  setSky: (newState: Partial<Omit<SkyState, "setSky">>) => void;
}

export const useSkyStore = create<SkyState>((set) => ({
  turbidity: -1,
  rayleigh: 17,
  mieCoefficient: 4,
  mieDirectionalG: 50,
  elevation: 0,
  azimuth: -88,
  distance: 1000,
  sunPosition: [-100, -100, 1],
  setSky: (newState) => set((state) => ({ ...state, ...newState })),
}));


// Auto-generation for EVA
export const skyStoreConfig: SliderType = {
  turbidity: { type: "slider", min: -100, max: 100, step: 0.1 },
  rayleigh: { type: "slider", min: 0, max: 20, step: 0.1 },
  mieCoefficient: { type: "slider" },
  mieDirectionalG: { type: "slider" },
  elevation: { type: "slider" },
  azimuth: { type: "slider" },
};
