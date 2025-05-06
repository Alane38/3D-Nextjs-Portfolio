import { create } from "zustand";

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