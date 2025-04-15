import { RapierRigidBody, RigidBodyProps } from "@react-three/rapier";
import { ReactNode } from "react";
import * as THREE from "three";
import { AnimationSet } from "./AnimationSet";

export interface ArcheProps extends RigidBodyProps {
  children?: ReactNode;

  /** Player Selection */
  defaultPlayer?: boolean;
  /** Colliders settings */
  hitboxHeight?: number;
  hitboxWidth?: number;
  hitboxLenght?: number;
  hitboxRadius?: number;

  /** Floatting settings */
  floatMode?: boolean;
  floatHeight?: number;
  /** Floatings Values */
  floatingDis?: number;
  springK?: number;
  dampingC?: number;

  /** Character initial */
  characterInitDir?: number;

  /** Keyboards Control on/off */
  enableControl?: boolean;

  /** Cameera on/off */
  enableFollowCam?: boolean;
  enableFollowCamPos?: { x: number; y: number; z: number } | null;
  enableFollowCamTarget?: { x: number; y: number; z: number } | null;

  /**Follow camera settings */
  // - Camera distance/limit
  camInitDis?: number;
  camMinDis?: number;
  camMaxDis?: number;
  camLowLimit?: number;
  camUpLimit?: number;
  // - Camera direction
  camInitDir?: { x: number; y: number };
  // - Camera target a position ?
  camTargetPos?: { x: number; y: number; z: number };
  // - Camera speed
  camMoveSpeed?: number;
  camZoomSpeed?: number;
  // - Camera collision
  camCollision?: boolean;
  camCollisionOffset?: number;
  camCollisionSpeedMult?: number;
  // - Camera fixed rotation
  controlCamRotMult?: number;
  /** Follow light */
  // - on/off
  followLight?: boolean;
  // - position
  followLightPos?: { x: number; y: number; z: number };

  /** Values Initializaion */
  maxVelLim?: number;
  // Turn vel/speed
  turnVelMultiplier?: number;
  turnSpeed?: number;
  // Sprint
  sprintMult?: number;
  // Jump
  jumpVel?: number;
  jumpForceToGroundMult?: number;
  slopJumpMult?: number;
  sprintJumpMult?: number;
  // Air drag
  airDragMultiplier?: number;
  dragDampingC?: number;
  // acceleration --
  accDeltaTime?: number;
  rejectVelMult?: number;
  moveImpulsePointY?: number;
  // Camera controls
  camFollowMult?: number;
  camLerpMult?: number;
  // Falling
  fallingGravityScale?: number;
  fallingMaxVel?: number;
  // Flipped
  autoFlip?: boolean;
  flipAngle?: number;
  // Wake up
  wakeUpDelay?: number;
  // Floating Ray setups
  rayOriginOffest?: { x: number; y: number; z: number };
  rayHitForgiveness?: number;
  rayLength?: number;
  rayDir?: { x: number; y: number; z: number };
  /** Slope Ray setups */
  showSlopeRayOrigin?: boolean;
  slopeMaxAngle?: number;
  slopeRayOriginOffest?: number;
  slopeRayLength?: number;
  slopeRayDir?: { x: number; y: number; z: number };
  slopeUpExtraForce?: number;
  slopeDownExtraForce?: number;
  /** Head Ray setups */
  showHeadRayOrigin?: boolean;
  headRayOriginOffest?: number;
  headRayLength?: number;
  headRayDir?: { x: number; y: number; z: number };
  /** AutoBalance setups */
  autoBalance?: boolean;
  autoBalanceSpringK?: number;
  autoBalanceDampingC?: number;
  autoBalanceSpringOnY?: number;
  autoBalanceDampingOnY?: number;
  /** Animation I/O */
  animated?: boolean;
  /** Camera mode */
  camMode?: string | null;
  /** Controller settings */
  controllerKeys?: {
    forward?: number;
    back?: number;
    left?: number;
    right?: number;
    jump?: number;
    action1?: number;
    action2?: number;
    action3?: number;
    action4?: number;
  };
  /** Point-to-move setups */
  bodySensorSize?: Array<number>;
  bodySensorPosition?: { x: number; y: number; z: number };

  /** Additionnal Props */
  infiniteJump?: boolean;

  props?: RigidBodyProps;
}

// Used to check the character state.
export interface CharacterState {
  canJump: boolean;
  inMotion: boolean;
  slopeAngle: number | null;
  characterRotated: boolean;
  excludeRay?: boolean;
}

// RapierObject<RapierRigidBody> or <RapierRigidBody>
export interface customRigidBody extends RapierRigidBody {
  rotateCamera?: (x: number, y: number) => void;
  rotateCharacterOnY?: (rad: number) => void;
}

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
