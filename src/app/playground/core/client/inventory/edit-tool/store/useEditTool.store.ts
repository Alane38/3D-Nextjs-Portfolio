import { RapierRigidBody } from "@react-three/rapier";
import { create } from "zustand";
import * as THREE from "three";

type Axis = "x" | "y" | "z" | null;
type Vec3 = { x: number; y: number; z: number };

interface EditToolState {
  // Move Tool
  moveToolEnabled: boolean;
  axis: Axis;
  dragging: boolean;
  setMoveToolEnabled: (enabled: boolean) => void;
  setAxis: (axis: Axis) => void;
  setDragging: (dragging: boolean) => void;

  // Scale Tool
  scaleToolEnabled: boolean;
  scale: Vec3;
  scaleMode: "uniform" | "free";
  setScaleToolEnabled: (enabled: boolean) => void;
  setScale: (scale: Vec3 | ((prev: Vec3) => Vec3)) => void;
  setScaleMode: (mode: "uniform" | "free") => void;

  // Global
  selectedGroup: RapierRigidBody | null;
  selectedVisual: THREE.Group | null;
  position: Vec3;
  setSelectedGroup: (body: RapierRigidBody | null) => void;
  setSelectedVisual: (visual: THREE.Group | null) => void;
  setPosition: (pos: Vec3 | ((prev: Vec3) => Vec3)) => void;

  reset: () => void;
}

export const useEditToolStore = create<EditToolState>((set) => ({
  // Move Tool
  moveToolEnabled: false,
  axis: null,
  dragging: false,
  setMoveToolEnabled: (enabled) => set({ moveToolEnabled: enabled }),
  setAxis: (axis) => set({ axis }),
  setDragging: (dragging) => set({ dragging }),

  // Scale Tool
  scaleToolEnabled: false,
  scale: { x: 1, y: 1, z: 1 },
  scaleMode: "uniform",
  setScaleToolEnabled: (enabled) => set({ scaleToolEnabled: enabled }),
  setScale: (scale) => {
    if (typeof scale === "function") {
      set((state) => ({ scale: scale(state.scale) }));
    } else {
      set({ scale });
    }
  },
  setScaleMode: (mode) => set({ scaleMode: mode }),

  // Global
  selectedGroup: null,
  selectedVisual: null,
  position: { x: 0, y: 0, z: 0 },
  setSelectedGroup: (selectedGroup) => set({ selectedGroup }),
  setSelectedVisual: (visual) => set({ selectedVisual: visual }),
  setPosition: (pos) => {
    if (typeof pos === "function") {
      set((state) => ({ position: pos(state.position) }));
    } else {
      set({ position: pos });
    }
  },

  reset: () =>
    set({
      selectedGroup: null,
      selectedVisual: null,
      axis: null,
      dragging: false,
      scale: { x: 1, y: 1, z: 1 },
    }),
}));