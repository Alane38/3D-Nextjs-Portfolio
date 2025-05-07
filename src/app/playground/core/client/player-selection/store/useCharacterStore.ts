import { create } from "zustand";

export interface characterState {
    player: string;
    setPlayer: (player: string) => void;
}

export const useCharacterStore = create<characterState>((set) => ({
    player: "newalfox" as "newalfox" | "pamacea" | "vehicle",
    setPlayer: (player) => set({ player }),
}));