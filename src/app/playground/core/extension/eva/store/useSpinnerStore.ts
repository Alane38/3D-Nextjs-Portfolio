import { create } from "zustand";
import { SliderType } from "../types/default";

export interface SpinnerState {
  speed: number;
  setSpeed: (speed: number) => void;
}

export const useSpinnerStore = create<SpinnerState>((set) => ({
  speed: 5,
  setSpeed: (speed: number) => set({ speed }),
}));

// Auto-generation for EVA
export const spinnerStoreConfig: SliderType = {
  speed: { type: "slider", min: 0, max: 20, step: 0.1 },
};
