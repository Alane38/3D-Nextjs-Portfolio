import { create } from "zustand";
import { CheckType } from "../types/default";

export interface DebugState {
    debugState: boolean;
    setDebugState: (state: boolean) => void;
}

export const useDebugStore = create<DebugState>((set) => ({
    debugState: false,
    setDebugState: (state: boolean) => {
        set(() => ({ debugState: state }));
    },
}));

// Auto-generation stories for EVA
export const debugStoreConfig: CheckType = {
    debugState: { type: "check" },
  };