import { RigidBodyProps } from "@react-three/rapier";
import { ReactNode } from "react";
import { camListenerTargetType } from "../Galaad";

export interface GalaadProps extends RigidBodyProps {
  children?: ReactNode;

  defaultPlayer?: boolean;
  // Colliders settings
  hitboxHeight?: number;
  hitboxWidth?: number;
  hitboxLenght?: number;
  hitboxRadius?: number;

  floatMode?: boolean;
  floatHeight?: number;

  // Character initial
  characterInitDir?: number;

  // Control I/O
  enableControl?: boolean;

  // Camera I/O
  enableFollowCam?: boolean;
  enableFollowCamPos?: { x: number; y: number; z: number } | null;
  enableFollowCamTarget?: { x: number; y: number; z: number } | null;

  // Follow camera settings
  // Camera distance/limit
  camInitDis?: number;
  camMinDis?: number;
  camMaxDis?: number;
  camLowLimit?: number;
  camUpLimit?: number;
  // Camera direction
  camInitDir?: { x: number; y: number };
  // Camera target a position ?
  camTargetPos?: { x: number; y: number; z: number };
  // Camera speed
  camMoveSpeed?: number;
  camZoomSpeed?: number;
  // Camera collision
  camCollision?: boolean;
  camCollisionOffset?: number;
  camCollisionSpeedMult?: number;
  // Camera fixed rotation
  controlCamRotMult?: number;
  // Follow light settings
  // Follow Light I/O
  followLight?: boolean;
  // Follow light position
  followLightPos?: { x: number; y: number; z: number };

  // Controls settings
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
  floatingDis?: number;
  springK?: number;
  dampingC?: number;
  // Slope Ray setups
  showSlopeRayOrigin?: boolean;
  slopeMaxAngle?: number;
  slopeRayOriginOffest?: number;
  slopeRayLength?: number;
  slopeRayDir?: { x: number; y: number; z: number };
  slopeUpExtraForce?: number;
  slopeDownExtraForce?: number;
  // Head Ray setups
  showHeadRayOrigin?: boolean;
  headRayOriginOffest?: number;
  headRayLength?: number;
  headRayDir?: { x: number; y: number; z: number };
  // AutoBalance Force etups
  autoBalance?: boolean;
  autoBalanceSpringK?: number;
  autoBalanceDampingC?: number;
  autoBalanceSpringOnY?: number;
  autoBalanceDampingOnY?: number;
  // Animation I/O
  animated?: boolean;
  // Camera mode
  camMode?: string | null;
  camListenerTarget: camListenerTargetType;
  // Controller settings
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
  // Point-to-move setups
  bodySensorSize?: Array<number>;
  bodySensorPosition?: { x: number; y: number; z: number };

  // Additionnal Props
  infiniteJump?: boolean;

  props?: RigidBodyProps;
}
