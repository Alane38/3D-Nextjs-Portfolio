import { create } from "zustand";
import { SliderType } from "../types/default";

  interface RacingVehicleState {
    accelerateForce: number;
    brakeForce: number;
    steerAngle: number;
  }

  export const useRacingVehicleStore = create<RacingVehicleState>()((set) => ({
    accelerateForce: 1,
    brakeForce: 0.05,
    steerAngle: Math.PI / 24,
    setRacingVehicleState: (state: RacingVehicleState) => set(state),
  }));

  // Auto-generation for EVA
  export const racingVehicleStoreConfig: SliderType = {
    accelerateForce: { type: "slider", min: 0, max: 10, step: 0.1 },
    brakeForce: { type: "slider", min: 0, max: 0.5, step: 0.01 },
    steerAngle: { type: "slider", min: 0, max: Math.PI / 12, step: 0.01 },
  };
  