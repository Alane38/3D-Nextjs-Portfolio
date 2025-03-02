import { RigidBodyOptions } from "@react-three/rapier";

export interface Text3DProps {
  textSize: number;
  text: string;
  type: RigidBodyOptions["type"];
  colliders: RigidBodyOptions["colliders"];
  mass: number;
  scale: number;
  position: [number, number, number];
  font: string;
  size: number;
  bevelEnabled: boolean;
  bevelThickness: number;
}
