import { RigidBodyProps } from "@react-three/rapier";
import { AnimationSet } from "./AnimationSet";

export type ArcheAnimationProps = {
  path: string;
  animationSet: AnimationSet;
  children?: React.ReactNode;
  rigidBodyProps: RigidBodyProps;
};
