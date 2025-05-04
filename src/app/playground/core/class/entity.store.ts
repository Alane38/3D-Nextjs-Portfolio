import { create } from "zustand";
import { Entity } from "./Entity";

// Type of Zustand Store
interface EntityStoreState {
  entities: Entity[];
  setEntities: (entities: Entity[]) => void;
  updateEntity: (updater: (entity: Entity) => Entity) => void;
  reset: () => void;
}

// Zustand Store
export const useEntityStore = create<EntityStoreState>((set) => ({
  entities: [],
  setEntities: (entities: Entity[]) => set({ entities }),
  updateEntity: (updater: (entity: Entity) => Entity) =>
    set((state) => ({
      entities: state.entities.map(updater),
    })),
  reset: () => set({ entities: [] }),
}));
