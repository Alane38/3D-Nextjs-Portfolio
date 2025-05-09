import { create } from "zustand";

export interface characterState {
    character: string;
    setCharacter: (character: string) => void;
}

export const useCharacterStore = create<characterState>((set) => ({
    character: "newalfox",
    setCharacter: (character) => set({ character }),
}));