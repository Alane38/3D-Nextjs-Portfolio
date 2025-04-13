// src/stores/useMoveToolStore.ts

import { Group } from "three";
import { create } from "zustand";

type Axis = "x" | "y" | "z" | null;
type Vec3 = { x: number; y: number; z: number };

interface MoveToolState {
  mooveToolEnabled: boolean;
  selectedGroup: Group | null;
  // selectedModel: Entity | null; 
  axis: Axis;
  dragging: boolean;
  setMooveToolEnabled: (enabled: boolean) => void;
  setSelectedGroup: (body: Group | null) => void;
  // setSelectedModel: (model: Entity | null) => void;
  setAxis: (axis: Axis) => void;
  setDragging: (dragging: boolean) => void;
  reset: () => void;

  position: Vec3;
  setPosition: (pos: Vec3 | ((prev: Vec3) => Vec3)) => void;
}

export const useMoveToolStore = create<MoveToolState>((set) => ({
  mooveToolEnabled: false,
  selectedGroup: null,
  selectedModel: null,
  axis: null,
  dragging: false,
  setMooveToolEnabled: (enabled) => set({ mooveToolEnabled: enabled }),
  setSelectedGroup: (selectedGroup) => set({ selectedGroup }),
  // setSelectedModel: (selectedModel) => set({ selectedModel }), 
  setAxis: (axis) => set({ axis }),
  setDragging: (dragging) => set({ dragging }),
  reset: () => set({ selectedGroup: null, axis: null, dragging: false }),

  position: { x: 0, y: 0, z: 0 },
  setPosition: (pos) => {
    if (typeof pos === "function") {
      set((state) => ({
        position: pos(state.position),
      }));
    } else {
      set({ position: pos });
    }
  },
}));
