import * as THREE from "three";
import { AnimationSet } from "./AnimationSet";

export interface State {
  moveToPoint: THREE.Vector3;
  curAnimation: string;
  animationSet: AnimationSet;
  
  initializeAnimationSet: (animationSet: AnimationSet) => void;
  reset: () => void;
  setAnimation: (animation: string, condition?: boolean) => void;
  
  idle: () => void;
  walk: () => void;
  run: () => void;
  jump: () => void;
  jumpIdle: () => void;
  jumpLand: () => void;
  fall: () => void;
  action1: () => void;
  action2: () => void;
  action3: () => void;
  action4: () => void;
  
  setMoveToPoint: (point: THREE.Vector3) => void;
  getMoveToPoint: () => { moveToPoint: THREE.Vector3 };
}