import { create } from "zustand";
import { SelectType } from "../types/default";

export interface playerState {
    player: string;
    setPlayer: (player: string) => void;
}

export const usePlayerStore = create<playerState>((set) => ({
    player: "newalfox",
    setPlayer: (player) => set({ player }),
}));

export const playerStoreConfig: SelectType = {
  player: {
    type: "select",
    options: [
      { label: "Newalfox", value: "newalfox" },
      { label: "Pamacea", value: "pamacea" },
      { label: "Vehicle", value: "vehicle" },
    ],
  },
};
