import { create } from "zustand";
import { Entity } from "./Entity";

interface EntityStoreState {
  entities: Entity[];
  setEntities: (entities: Entity[]) => void;
  reset: () => void;
}

export const useEntityStore = create<EntityStoreState>((set) => ({
  entities: [],
  setEntities: (entities: Entity[]) => set({ entities }),
  reset: () => set({ entities: [] }),
}));
