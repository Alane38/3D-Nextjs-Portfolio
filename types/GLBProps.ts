import { RigidBodyOptions } from "@react-three/rapier";

export interface GLBProps {
    path: string;
    position: [number, number, number];
    mass: number;
    type: RigidBodyOptions["type"];
    colliders: RigidBodyOptions["colliders"];
    scale: number;
  }
  