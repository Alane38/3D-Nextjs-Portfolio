import { create } from "zustand";
import { Entity } from "./Entity";

// Type of Zustand Store
interface EntityStoreState {
  entities: Entity[];
  tempEntities: Entity[];
  setEntities: (entities: Entity[]) => void;
  reset: () => void;
}

// Zustand Store
export const useEntityStore = create<EntityStoreState>((set) => ({
  entities: [],
  tempEntities: [],
  setEntities: (entities: Entity[]) => set({ entities }),
  reset: () => set({ entities: [] }),
}));
