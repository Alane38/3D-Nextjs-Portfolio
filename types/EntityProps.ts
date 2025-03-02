import { RigidBodyOptions } from "@react-three/rapier";

export interface EntityProps {
    position: [number, number, number];
    mass: number;
    type: RigidBodyOptions["type"];
    colliders: RigidBodyOptions["colliders"];
    scale: number;
  }
  