import { create } from "zustand";
import { Entity } from "./Entity";

// Type of Zustand Store
interface EntityStoreState {
  entities: Entity[];
  setEntities: (entities: Entity[]) => void;
updateEntity: (entity: Entity) => void;
  reset: () => void;
}

// Zustand Store
export const useEntityStore = create<EntityStoreState>((set) => ({
  entities: [],
  setEntities: (entities: Entity[]) => set({ entities }),
  updateEntity: (entity: Entity) => set((state) => ({ entities: state.entities.map((e) => (e.entityId === entity.entityId ? entity : e)) })),
  reset: () => set({ entities: [] }),
}));
