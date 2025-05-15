import { create } from "zustand";
import { CheckType } from "../types/default";

interface NoClipState {
  noClip: boolean;
  setNoClip: (state: boolean) => void;
}

export const useNoClipStore = create<NoClipState>((set) => ({
  noClip: false,
  setNoClip: (state: boolean) => set({ noClip: state }),
}));

// Auto-generation stories for EVA
export const noClipStoreConfig: CheckType = {
    noClip: { type: "check" },
  };