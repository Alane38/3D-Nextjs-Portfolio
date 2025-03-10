import * as THREE from "three";
import { AnimationSet } from "./AnimationSet";

export type State = {
  moveToPoint: THREE.Vector3;
  curAnimation: string;
  animationSet: AnimationSet;
  initializeAnimationSet: (animationSet: AnimationSet) => void;
  reset: () => void;
  setMoveToPoint: (point: THREE.Vector3) => void;
  getMoveToPoint: () => {
    moveToPoint: THREE.Vector3;
  };
  setAnimation: (animation: string, condition?: boolean) => void; // Ajout explicite de `setAnimation`
} & {
  [key in keyof AnimationSet]: () => void;
};
