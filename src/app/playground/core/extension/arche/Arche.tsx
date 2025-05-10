import { useWorldRigidBody } from "@/hooks/useWorldRigidBody";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import {
  forwardRef,
  ForwardRefRenderFunction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import { Vector3 } from "three";
import { useFollowCam } from "./hooks/useFollowCam";
import { useGame } from "./store/useGame";
import { useJoystick } from "./store/useJoystick";
import { ArcheProps, CharacterState, customRigidBody } from "./types/Arche";
import { getObjectDirection } from "./utils/getObjectDirection";
import { InsideKeyboardControls } from "./utils/insideKeyboardControls";
import { LockCamera } from "./utils/LockCamera";
import { RayColliderHit, Vector, Collider, QueryFilterFlags } from "@dimforge/rapier3d-compat";
import { CylinderCollider, quat, RigidBody, RigidBodyTypeString, RoundCuboidCollider, useRapier } from "@react-three/rapier";

/**
 * ARCHE - Advanced React Character Handling Engine
 *
 *
 * @param {React.ReactNode} children - React children rendered inside the ARCHE component.
 *
 * @param {boolean} defaultPlayer - If true, marks this entity as the default player.
 *
 * @param {number} hitboxHeight - Height of the collider hitbox.
 * @param {number} hitboxWidth - Width of the collider hitbox.
 * @param {number} hitboxLenght - Length of the collider hitbox. (Note: "Lenght" might be a typo for "Length")
 * @param {number} hitboxRadius - Radius of the collider hitbox.
 *
 * @param {boolean} floatMode - Enables floating behavior with spring physics.
 * @param {number} floatHeight - Height above the ground to float.
 * @param {number} floatingDis - Total floating distance (hitboxHeight + floatHeight).
 * @param {number} springK - Spring constant used when floatMode is enabled.
 * @param {number} dampingC - Damping constant for reducing spring oscillation.
 *
 * @param {number} characterInitDir - Initial direction of the character in radians.
 *
 * @param {boolean} enableControl - Enables or disables input controls.
 *
 * @param {boolean} enableFollowCam - Enables or disables follow camera.
 * @param {Vector3 | null} enableFollowCamPos - Initial position of the follow camera.
 * @param {Vector3 | null} enableFollowCamTarget - Initial target of the follow camera.
 *
 * @param {number} camInitDis - Initial distance of the camera from the target.
 * @param {number} camMaxDis - Maximum allowed distance of the camera.
 * @param {number} camMinDis - Minimum allowed distance of the camera.
 * @param {number} camUpLimit - Upper vertical rotation limit (in radians).
 * @param {number} camLowLimit - Lower vertical rotation limit (in radians).
 *
 * @param {{x: number, y: number}} camInitDir - Initial rotational direction of the camera.
 * @param {{x: number, y: number, z: number}} camTargetPos - The target position the camera follows.
 *
 * @param {number} camMoveSpeed - Speed at which the camera moves.
 * @param {number} camZoomSpeed - Speed of the camera zoom.
 *
 * @param {boolean} camCollision - Enables or disables camera collision.
 * @param {number} camCollisionOffset - Offset distance for collision checking.
 * @param {number} camCollisionSpeedMult - Speed multiplier when adjusting camera due to collision.
 *
 * @param {number} controlCamRotMult - Rotation multiplier for camera control.
 *
 * @param {number} camFollowMult - Follow interpolation multiplier for camera.
 * @param {number} camLerpMult - Lerp multiplier for smoother transitions.
 *
 * @param {boolean} followLight - Enables or disables follow lighting.
 * @param {{x: number, y: number, z: number}} followLightPos - Position of the follow light.
 *
 * @param {number} maxVelLim - Maximum velocity limit of the character.
 *
 * @param {number} turnVelMultiplier - Multiplier for turn velocity.
 * @param {number} turnSpeed - Base turn speed of the character.
 *
 * @param {number} sprintMult - Multiplier applied to movement velocity when sprinting.
 *
 * @param {number} jumpVel - Vertical velocity applied when jumping.
 * @param {number} jumpForceToGroundMult - Force applied to ground when jumping.
 * @param {number} slopJumpMult - Jump multiplier when on a slope.
 * @param {number} sprintJumpMult - Jump multiplier while sprinting.
 *
 * @param {number} airDragMultiplier - Drag applied while airborne.
 * @param {number} dragDampingC - Air damping constant while airborne.
 *
 * @param {number} accDeltaTime - Time factor used in acceleration interpolation.
 * @param {number} rejectVelMult - Multiplier to reject unwanted velocity.
 * @param {number} moveImpulsePointY - Y-axis point of impulse application.
 *
 * @param {number} fallingGravityScale - Gravity scale when falling.
 * @param {number} fallingMaxVel - Maximum fall speed.
 *
 * @param {boolean} autoFlip - Automatically flips character when changing direction.
 * @param {number} flipAngle - Angle threshold to trigger a flip.
 *
 * @param {number} wakeUpDelay - Delay before re-enabling rigidbody after sleeping.
 *
 * @param {{x: number, y: number, z: number}} rayOriginOffest - Offset of the ray used for floating detection.
 * @param {number} rayHitForgiveness - Allowed error margin before ray detects ground.
 * @param {number} rayLength - Length of the float detection ray.
 * @param {{x: number, y: number, z: number}} rayDir - Direction of the float detection ray.
 *
 * @param {boolean} showSlopeRayOrigin - Toggles visual debug for slope ray origin.
 * @param {number} slopeMaxAngle - Maximum slope angle the character can walk on (in radians).
 * @param {number} slopeRayOriginOffest - Offset of the ray used for slope detection.
 * @param {number} slopeRayLength - Length of the ray used for slope detection.
 * @param {{x: number, y: number, z: number}} slopeRayDir - Direction of the slope detection ray.
 * @param {number} slopeUpExtraForce - Additional force applied when going uphill.
 * @param {number} slopeDownExtraForce - Additional force applied when going downhill.
 *
 * @param {boolean} autoBalance - Enables or disables automatic balance correction.
 * @param {number} autoBalanceSpringK - Spring constant for auto-balancing.
 * @param {number} autoBalanceDampingC - Damping constant for auto-balancing.
 * @param {number} autoBalanceSpringOnY - Spring value specifically for Y-axis.
 * @param {number} autoBalanceDampingOnY - Damping value specifically for Y-axis.
 *
 * @param {boolean} animated - Enables or disables character animation.
 *
 * @param {string | null} camMode - Choose camera/movement Mode : "PointToMove", "OnlyCamera", "ControlCamera"(default)
 *
 * @param {Object} controllerKeys - Key bindings for controller input.
 * @param {number} controllerKeys.forward - Forward key.
 * @param {number} controllerKeys.back - Backward key.
 * @param {number} controllerKeys.left - Left key.
 * @param {number} controllerKeys.right - Right key.
 * @param {number} controllerKeys.jump - Jump key.
 * @param {number} controllerKeys.action1 - First action button.
 * @param {number} controllerKeys.action2 - Second action button.
 * @param {number} controllerKeys.action3 - Third action button.
 * @param {number} controllerKeys.action4 - Fourth action button.
 *
 * @param {[number, number]} bodySensorSize - Size of the body sensor for point-to-move input.
 * @param {{x: number, y: number, z: number}} bodySensorPosition - Position of the body sensor.
 *
 * @param {boolean} infiniteJump - Enables infinite jumping if true(-> canJump is always true).
 *
 * @returns {JSX.Element} The ARCHE character controller component.
 */
const ARCHE: ForwardRefRenderFunction<customRigidBody, ArcheProps> = (
  {
    // TypeScript interface for ARCHE component
    children,

    /** Player Selection */
    defaultPlayer = false,
    /** Colliders settings */
    hitboxHeight = 0.5,
    hitboxWidth = 0.3,
    hitboxLenght = 0.1,
    hitboxRadius = 0.3,

    /** Floatting settings */
    floatMode = false,
    floatHeight = 0,
    /** Floating Values */
    floatingDis = hitboxHeight + floatHeight,
    // Default values for a floatHeight of 1.
    springK = 5,
    dampingC = 1,

    /** Keyboards Control on/off */
    characterInitDir = 0, // Rad

    // Control I/O
    enableControl = false,

    /** Cameera on/off */
    enableFollowCam = false,
    enableFollowCamPos = null,
    enableFollowCamTarget = null,

    /**Follow camera settings */
    // - Camera distance/limit
    camInitDis = -5,
    camMaxDis = -7,
    camMinDis = -0.7,
    camUpLimit = 1.5, // Rad
    camLowLimit = -1.3, // Rad
    // - Camera direction
    camInitDir = { x: 0, y: 0 }, // Rad
    // - Camera target a position ?
    camTargetPos = { x: 0, y: 0, z: 0 },
    // - Camera speed
    camMoveSpeed = 1,
    camZoomSpeed = 1,
    // - Camera collision
    camCollision = true,
    camCollisionOffset = 0.7,
    camCollisionSpeedMult = 4,
    // - Camera control rotation
    controlCamRotMult = 1,

    /** Camera controls */
    camFollowMult = 11,
    camLerpMult = 25,

    /** Follow light */
    // - on/off
    followLight = false,
    // - position
    followLightPos = { x: 20, y: 30, z: 10 },

    /** Values Initializaion */
    maxVelLim = 2.5,
    // - Turn vel/speed
    turnVelMultiplier = 0.1,
    turnSpeed = 4,
    // - Sprint
    sprintMult = 2,
    // - Jump
    jumpVel = 8,
    jumpForceToGroundMult = 5,
    slopJumpMult = 0.25,
    sprintJumpMult = 1.1,
    // - Air drag
    airDragMultiplier = 0.2,
    dragDampingC = 0.15,
    // - acceleration --
    accDeltaTime = 8,
    rejectVelMult = 4,
    moveImpulsePointY = 0.5,

    /** Falling */
    fallingGravityScale = 3,
    fallingMaxVel = -20,
    /** autoFlip */
    autoFlip = true,
    flipAngle = 0.75,
    /** Wake up */
    wakeUpDelay = 100,
    /**  Floating Ray setups */
    rayOriginOffest = { x: 0, y: -hitboxWidth, z: 0 },
    rayHitForgiveness = 0.1,
    rayLength = hitboxHeight,
    rayDir = { x: 0, y: -1, z: 0 },
    /** Slope Ray setups */
    showSlopeRayOrigin = false,
    slopeMaxAngle = 1, // in rad
    slopeRayOriginOffest = hitboxHeight - 0.03,
    slopeRayLength = hitboxHeight + 2,
    slopeRayDir = { x: 0, y: -1, z: 0 },
    slopeUpExtraForce = 0.05,
    slopeDownExtraForce = 0.2,
    /** AutoBalance setups */
    autoBalance = true,
    autoBalanceSpringK = 0.5,
    autoBalanceDampingC = 0.2,
    autoBalanceSpringOnY = 0.1,
    autoBalanceDampingOnY = 0.01,
    /** Animation on/off */
    animated = false,
    /** Camera mode */
    camMode = null,
    /** Controller settings */
    controllerKeys = {
      forward: 12,
      back: 13,
      left: 14,
      right: 15,
      jump: 2,
      action1: 11,
      action2: 3,
      action3: 1,
      action4: 0,
    },
    /** Point-to-move setups */
    bodySensorSize = [hitboxHeight / 2, hitboxWidth],
    bodySensorPosition = { x: 0, y: 0, z: hitboxWidth / 2 },

    /** Additionnal Props */
    infiniteJump = false,

    ...props
  }: ArcheProps,
  ref,
) => {
  // World setup
  const { rapier, world } = useRapier();

  // Character setup
  const characterRef = useRef<customRigidBody>(null);
  const characterModelRef = useRef<THREE.Group>(null!);
  const characterModelIndicator = useMemo(() => new THREE.Object3D(), []);
  const defaultControllerKeys = {
    forward: 12,
    back: 13,
    left: 14,
    right: 15,
    jump: 2,
    action1: 11,
    action2: 3,
    action3: 1,
    action4: 0,
  };

  const characterRigidBody = useWorldRigidBody(characterRef);

  const [bodyType, setBodyType] = useState<RigidBodyTypeString>(() =>
    defaultPlayer ? "fixed" : "fixed"
  );

  /** Move and Camera mode */
  const setMoveToPoint = useGame((state) => state.setMoveToPoint);
  const modeSet = new Set(camMode?.split(" ") || []);

  // Point to Move Props
  let functionKeyDown: boolean = false;
  /** Controller Modes */
  const isModePointToMove = modeSet.has("PointToMove"); // ControlCamera: Have a third person camera, with a automatic movement system 
  const isModeOnlyCamera = modeSet.has("OnlyCamera"); // ControlCamera: Have a third person camera, with basic movement system, right, left, back controls are disabled, you only control the character with Z/W and mouse.
  const isModeControlCamera = modeSet.has("ControlCamera"); // ControlCamera: Have a third person camera, with a brutal movement system(similar to ThirdCamera) 
  const isModeThirdCamera = modeSet.has("ThirdCamera"); // ThirdCamera(default): Have a third person camera, with a smooth movement system

  /** LockCamera props */
  const { camera, gl } = useThree();

  /** Body collider */
  const Vector3Factory = () => useMemo(() => new THREE.Vector3(), []);

  const modelFacingVec = Vector3Factory();
  const bodyFacingVec = Vector3Factory();
  const bodyBalanceVec = Vector3Factory();
  const bodyBalanceVecOnX = Vector3Factory();
  const bodyFacingVecOnY = Vector3Factory();
  const bodyBalanceVecOnZ = Vector3Factory();
  const crossVecOnX = Vector3Factory();
  const crossVecOnY = Vector3Factory();
  const crossVecOnZ = Vector3Factory();
  const bodyContactForce = Vector3Factory();
  const slopeRayOriginUpdatePosition = Vector3Factory();
  const camBasedMoveCrossVecOnY = Vector3Factory();

  const vectorY = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const vectorZ = useMemo(() => new THREE.Vector3(0, 0, 1), []);

  // Initialization
  const idle = useGame((state) => state.idle);
  const walk = useGame((state) => state.walk);
  const run = useGame((state) => state.run);
  const jump = useGame((state) => state.jump);
  const jumpIdle = useGame((state) => state.jumpIdle);
  const fall = useGame((state) => state.fall);
  const action1 = useGame((state) => state.action1);
  const action2 = useGame((state) => state.action2);
  const action3 = useGame((state) => state.action3);
  const action4 = useGame((state) => state.action4);

  // Animation
  const idleAnimation = animated ? idle : null;
  const walkAnimation = animated ? walk : null;
  const runAnimation = animated ? run : null;
  const jumpAnimation = animated ? jump : null;
  const jumpIdleAnimation = animated ? jumpIdle : null;
  const fallAnimation = animated ? fall : null;
  const action1Animation = animated ? action1 : null;
  const action2Animation = animated ? action2 : null;
  const action3Animation = animated ? action3 : null;
  const action4Animation = animated ? action4 : null;

  // Check if controls exists
  const inKeyboardControls = InsideKeyboardControls();
  const keyboardControls = useKeyboardControls();

  // Keyboard controls
  const [subscribeKeys, getKeys] = inKeyboardControls
    ? keyboardControls
    : [null];

  const presetKeys = {
    forward: false,
    back: false,
    left: false,
    right: false,
    jump: false,
    run: false,
  };

  // // Joystick controls setup
  const getJoystickValues = useJoystick((state) => state.getJoystickValues);
  const pressButton1 = useJoystick((state) => state.pressButton);
  const pressButton2 = useJoystick((state) => state.pressButton);
  const pressButton3 = useJoystick((state) => state.pressButton);
  const pressButton4 = useJoystick((state) => state.pressButton);
  const pressButton5 = useJoystick((state) => state.pressButton);
  const releaseAllButtons = useJoystick((state) => state.releaseAllButtons);
  const setJoystick = useJoystick((state) => state.setJoystick);
  const resetJoystick = useJoystick((state) => state.resetJoystick);

  // // Gamepad controls setup
  const [controllerIndex, setControllerIndex] = useState<number | null>(null);
  const gamepadKeys = {
    forward: false,
    back: false,
    left: false,
    right: false,
  };
  const gamepadJoystickVec2: THREE.Vector2 = useMemo(
    () => new THREE.Vector2(),
    [],
  );
  let gamepadJoystickDis: number = 0;
  let gamepadJoystickAng: number = 0;
  const gamepadConnect = (e: GamepadEvent) => {
    setControllerIndex(e.gamepad.index);
  };
  const gamepadDisconnect = () => {
    setControllerIndex(null);
  };
  const mergedKeys = useMemo(
    () => Object.assign({}, defaultControllerKeys, controllerKeys),
    [controllerKeys],
  );
  const handleButtons = (buttons: readonly GamepadButton[]) => {
    gamepadKeys.forward = buttons[mergedKeys.forward].pressed;
    gamepadKeys.back = buttons[mergedKeys.back].pressed;
    gamepadKeys.left = buttons[mergedKeys.left].pressed;
    gamepadKeys.right = buttons[mergedKeys.right].pressed;

    // Gamepad trigger the EcctrlJoystick buttons to play animations
    if (buttons[mergedKeys.action4].pressed) {
      pressButton2(2);
    } else if (buttons[mergedKeys.action3].pressed) {
      pressButton4(4);
    } else if (buttons[mergedKeys.jump].pressed) {
      pressButton1(1);
    } else if (buttons[mergedKeys.action2].pressed) {
      pressButton3(3);
    } else if (buttons[mergedKeys.action1].pressed) {
      pressButton5(5);
    } else {
      releaseAllButtons();
    }
  };

  const handleSticks = (axes: readonly number[]) => {
    // Gamepad first joystick trigger the EcctrlJoystick event to move the character
    if (Math.abs(axes[0]) > 0 || Math.abs(axes[1]) > 0) {
      gamepadJoystickVec2.set(axes[0], -axes[1]);
      gamepadJoystickDis = Math.min(
        Math.sqrt(
          Math.pow(gamepadJoystickVec2.x, 2) +
            Math.pow(gamepadJoystickVec2.y, 2),
        ),
        1,
      );
      gamepadJoystickAng = gamepadJoystickVec2.angle();
      const runState = gamepadJoystickDis > 0.7;
      setJoystick(gamepadJoystickDis, gamepadJoystickAng, runState);
    } else {
      gamepadJoystickDis = 0;
      gamepadJoystickAng = 0;
      resetJoystick();
    }
    // Gamepad second joystick trigger the useFollowCam event to move the camera
    if (Math.abs(axes[2]) > 0 || Math.abs(axes[3]) > 0) {
      joystickCamMove(axes[2], axes[3]);
    }
  };

  // // Can jump State
  let canJump = false; // Not used only for jumping, it's used to check if the character can jump, is on groud, raycast, ....
  let isFalling = false;
  const initialGravityScale: number = useMemo(
    () => props.gravityScale ?? 1,
    [],
  );

  // // inMotion State
  let massRatio: number = 1;
  let inMotion: boolean = false;
  const standingForcePoint: THREE.Vector3 = useMemo(
    () => new THREE.Vector3(),
    [],
  );
  const movingObjectDragForce: THREE.Vector3 = useMemo(
    () => new THREE.Vector3(),
    [],
  );
  const movingObjectVelocity: THREE.Vector3 = useMemo(
    () => new THREE.Vector3(),
    [],
  );
  const movingObjectVelocityInCharacterDir: THREE.Vector3 = useMemo(
    () => new THREE.Vector3(),
    [],
  );
  const distanceFromCharacterToObject: THREE.Vector3 = useMemo(
    () => new THREE.Vector3(),
    [],
  );
  const objectAngvelToLinvel: THREE.Vector3 = useMemo(
    () => new THREE.Vector3(),
    [],
  );
  const velocityDiff: THREE.Vector3 = useMemo(() => new THREE.Vector3(), []);

  // // Follow cam initial setups
  const cameraSetups = {
    enableFollowCam,
    enableFollowCamPos,
    enableFollowCamTarget,
    camInitDis,
    camMaxDis,
    camMinDis,
    camUpLimit,
    camLowLimit,
    camInitDir,
    camCollisionOffset,
    camCollisionSpeedMult,
  };

  // // Load camera pivot and character move
  const { pivot, followCam, cameraCollisionDetect, joystickCamMove } =
    useFollowCam(cameraSetups);
  const pivotPosition: THREE.Vector3 = useMemo(() => new THREE.Vector3(), []);
  const pivotXAxis: THREE.Vector3 = useMemo(
    () => new THREE.Vector3(1, 0, 0),
    [],
  );
  const pivotYAxis: THREE.Vector3 = useMemo(
    () => new THREE.Vector3(0, 1, 0),
    [],
  );
  const pivotZAxis: THREE.Vector3 = useMemo(
    () => new THREE.Vector3(0, 0, 1),
    [],
  );
  const followCamPosition: THREE.Vector3 = useMemo(
    () => new THREE.Vector3(),
    [],
  );
  const modelEuler: THREE.Euler = useMemo(() => new THREE.Euler(), []);
  const modelQuat: THREE.Quaternion = useMemo(() => new THREE.Quaternion(), []);
  const moveImpulse: THREE.Vector3 = useMemo(() => new THREE.Vector3(), []);
  const movingDirection: THREE.Vector3 = useMemo(() => new THREE.Vector3(), []);
  const moveAccNeeded: THREE.Vector3 = useMemo(() => new THREE.Vector3(), []);
  const jumpVelocityVec: THREE.Vector3 = useMemo(() => new THREE.Vector3(), []);
  const jumpDirection: THREE.Vector3 = useMemo(() => new THREE.Vector3(), []);
  const currentVel: THREE.Vector3 = useMemo(() => new THREE.Vector3(), []);
  const currentPos: THREE.Vector3 = useMemo(() => new THREE.Vector3(), []);
  const dragForce: THREE.Vector3 = useMemo(() => new THREE.Vector3(), []);
  const dragAngForce: THREE.Vector3 = useMemo(() => new THREE.Vector3(), []);
  const wantToMoveVel: THREE.Vector3 = useMemo(() => new THREE.Vector3(), []);
  const rejectVel: THREE.Vector3 = useMemo(() => new THREE.Vector3(), []);

  // // Ray Force
  const springDirVec: THREE.Vector3 = useMemo(() => new THREE.Vector3(), []);
  const characterMassForce: THREE.Vector3 = useMemo(
    () => new THREE.Vector3(),
    [],
  );
  const rayOrigin: THREE.Vector3 = useMemo(() => new THREE.Vector3(), []);
  const rayCast = new rapier.Ray(rayOrigin, rayDir);
  let rayHit: RayColliderHit | null = null;

  // Slope Detection Ray
  let slopeAngle: number = 0;
  let actualSlopeNormal: Vector;
  const actualSlopeAngle: number = 0;
  const actualSlopeNormalVec: THREE.Vector3 = useMemo(
    () => new THREE.Vector3(),
    [],
  );

  // Slope Ray
  const slopeRayOriginRef = useRef<THREE.Mesh>(null!);
  const slopeRayorigin: THREE.Vector3 = useMemo(() => new THREE.Vector3(), []);
  const slopeRayCast = new rapier.Ray(slopeRayorigin, slopeRayDir);
  let slopeRayHit: RayColliderHit | null = null;

  /** Point to Move Mode */
  // Need to be let instead of const !
  let isBodyHitWall = false;
  let isPointMoving = false;
  // Point to Move consts initializations
  const crossVector: THREE.Vector3 = useMemo(() => new THREE.Vector3(), []);
  const pointToPoint: THREE.Vector3 = useMemo(() => new THREE.Vector3(), []);
  const getMoveToPoint = useGame((state) => state.getMoveToPoint);
  const bodySensorRef = useRef<Collider>(null!);
  const handleOnIntersectionEnter = () => {
    isBodyHitWall = true;
  };
  const handleOnIntersectionExit = () => {
    isBodyHitWall = false;
  };

  // //  Move Character
  let characterRotated: boolean = true;
  const moveCharacter = (
    _: number,
    run: boolean,
    slopeAngle: number,
    movingObjectVelocity: THREE.Vector3,
  ) => {
    // Setup Moving Direction
    // Only apply slope angle to moving direction
    // when slope angle is between 0.2rad and slopeMaxAngle,
    // and actualSlopeAngle < slopeMaxAngle
    if (
      actualSlopeAngle < slopeMaxAngle &&
      Math.abs(slopeAngle) > 0.2 &&
      Math.abs(slopeAngle) < slopeMaxAngle
    ) {
      movingDirection.set(0, Math.sin(slopeAngle), Math.cos(slopeAngle));
    }
    // If on a slopeMaxAngle slope, only apply small a mount of forward direction
    else if (actualSlopeAngle >= slopeMaxAngle) {
      movingDirection.set(
        0,
        Math.sin(slopeAngle) > 0 ? 0 : Math.sin(slopeAngle),
        Math.sin(slopeAngle) > 0 ? 0.1 : 1,
      );
    } else {
      movingDirection.set(0, 0, 1);
    }

    /** Apply character quaternion to moving into character direction */
    movingDirection.applyQuaternion(characterModelIndicator.quaternion);

    /** Moving object conditions */
    // Calculate moving object velocity direction according to character moving direction
    movingObjectVelocityInCharacterDir
      .copy(movingObjectVelocity)
      .projectOnVector(movingDirection)
      .multiply(movingDirection);
    // Calculate angle between moving object velocity direction and character moving direction
    const angleBetweenCharacterDirAndObjectDir =
      movingObjectVelocity.angleTo(movingDirection);

    /** Setup Rejection Velocity */
    const wantToMoveMeg = currentVel.dot(movingDirection);
    wantToMoveVel.set(
      movingDirection.x * wantToMoveMeg,
      0,
      movingDirection.z * wantToMoveMeg,
    );
    rejectVel.copy(currentVel).sub(wantToMoveVel);

    /**
     * Calculate required accelaration and force: a = Δv/Δt
     * If it's on a moving/rotating platform, apply platform velocity to Δv accordingly
     * Also, apply reject velocity when character is moving opposite of it's moving direction
     */
    moveAccNeeded.set(
      (movingDirection.x *
        (maxVelLim * (run ? sprintMult : 1) +
          movingObjectVelocityInCharacterDir.x) -
        (currentVel.x -
          movingObjectVelocity.x *
            Math.sin(angleBetweenCharacterDirAndObjectDir) +
          rejectVel.x * (inMotion ? 0 : rejectVelMult))) /
        accDeltaTime,
      0,
      (movingDirection.z *
        (maxVelLim * (run ? sprintMult : 1) +
          movingObjectVelocityInCharacterDir.z) -
        (currentVel.z -
          movingObjectVelocity.z *
            Math.sin(angleBetweenCharacterDirAndObjectDir) +
          rejectVel.z * (inMotion ? 0 : rejectVelMult))) /
        accDeltaTime,
    );

    let moveForceNeeded;
    if (characterRigidBody) {
      moveForceNeeded = moveAccNeeded.multiplyScalar(characterRigidBody.mass());

      // Check if character complete turned to the wanted direction
      characterRotated =
        Math.sin(characterModelIndicator.rotation.y).toFixed(3) ==
        Math.sin(modelEuler.y).toFixed(3);

      // If character hasn't complete turning, change the impulse quaternion follow characterModelIndicator quaternion
      if (!characterRotated) {
        moveImpulse.set(
          moveForceNeeded.x *
            turnVelMultiplier *
            (canJump ? 1 : airDragMultiplier), // if it's in the air, give it less control
          slopeAngle === null || slopeAngle == 0 // if it's on a slope, apply extra up/down force to the body
            ? 0
            : movingDirection.y *
                turnVelMultiplier *
                (movingDirection.y > 0 // check it is on slope up or slope down
                  ? slopeUpExtraForce
                  : slopeDownExtraForce) *
                (run ? sprintMult : 1),
          moveForceNeeded.z *
            turnVelMultiplier *
            (canJump ? 1 : airDragMultiplier), // if it's in the air, give it less control
        );
      }
      // If character complete turning, change the impulse quaternion default
      else {
        moveImpulse.set(
          moveForceNeeded.x * (canJump ? 1 : airDragMultiplier),
          slopeAngle === null || slopeAngle == 0 // if it's on a slope, apply extra up/down force to the body
            ? 0
            : movingDirection.y *
                (movingDirection.y > 0 // check it is on slope up or slope down
                  ? slopeUpExtraForce
                  : slopeDownExtraForce) *
                (run ? sprintMult : 1),
          moveForceNeeded.z * (canJump ? 1 : airDragMultiplier),
        );
      }

      if (characterRigidBody) {
        // Move character at proper direction (important)
        characterRigidBody.applyImpulseAtPoint(
          moveImpulse,
          {
            x: currentPos.x,
            y: currentPos.y + moveImpulsePointY,
            z: currentPos.z,
          },
          true,
        );
      }
    }
  };

  // Detect Moving Platform and apply movement to character
  let isOnMovingPlatform = false;
  const movingPlatformVelocity = new Vector3();

  // Detect if the character is on a moving platform and get the platform velocity
  const detectPlatformUnderPlayer = () => {
    if (!characterRigidBody) return;

    isOnMovingPlatform = false;
    movingPlatformVelocity.set(0, 0, 0);

    const rayDirection = new Vector3(0, -1, 0); // Raycast vers le bas
    const translation = characterRigidBody.translation();
    const widthOffset = 0.3; // Écart pour créer une grille sous le personnage

    // Grille 3x3 de points sous le personnage (x et z)
    const offsets = [-widthOffset, 0, widthOffset];
    for (const dx of offsets) {
      for (const dz of offsets) {
        const rayOrigin = new Vector3(
          translation.x + dx,
          translation.y + 0.2, // Départ légèrement au-dessus
          translation.z + dz,
        );

        const ray = new rapier.Ray(rayOrigin, rayDirection);
        const raycastResult = world.castRay(
          ray,
          1.5,
          true,
          QueryFilterFlags.ONLY_KINEMATIC,
        );

        if (raycastResult && raycastResult.collider) {
          const otherBody = raycastResult.collider.parent();
          if (!otherBody || otherBody === characterRigidBody) continue;

          const normal = raycastResult.collider.castRayAndGetNormal(
            ray,
            1.5,
            false,
          )?.normal;
          if (normal && normal.y > 0.5) {
            isOnMovingPlatform = true;

            const platformVel = otherBody.linvel();
            movingPlatformVelocity.set(
              platformVel.x,
              platformVel.y,
              platformVel.z,
            );
            return; // Dès qu'on détecte une plateforme correcte, on arrête
          }
        }
      }
    }
  };

  /** Character Auto Balance function */
  const autoBalanceCharacter = () => {
    if (!characterRigidBody) return;
    // Match body component to character model rotation on Y
    bodyFacingVec
      .set(0, 0, 1)
      .applyQuaternion(quat(characterRigidBody.rotation()));
    bodyBalanceVec
      .set(0, 1, 0)
      .applyQuaternion(quat(characterRigidBody.rotation()));

    bodyBalanceVecOnX.set(0, bodyBalanceVec.y, bodyBalanceVec.z);
    bodyFacingVecOnY.set(bodyFacingVec.x, 0, bodyFacingVec.z);
    bodyBalanceVecOnZ.set(bodyBalanceVec.x, bodyBalanceVec.y, 0);

    // Check if is camera only movement
    if (isModeOnlyCamera) {
      modelEuler.y = pivot.rotation.y;
      pivot.getWorldDirection(modelFacingVec);
      // Update slopeRayOrigin to new positon
      slopeRayOriginUpdatePosition.set(movingDirection.x, 0, movingDirection.z);
      camBasedMoveCrossVecOnY
        .copy(slopeRayOriginUpdatePosition)
        .cross(modelFacingVec);
      slopeRayOriginRef.current.position.x =
        slopeRayOriginOffest *
        Math.sin(
          slopeRayOriginUpdatePosition.angleTo(modelFacingVec) *
            (camBasedMoveCrossVecOnY.y < 0 ? 1 : -1),
        );
      slopeRayOriginRef.current.position.z =
        slopeRayOriginOffest *
        Math.cos(
          slopeRayOriginUpdatePosition.angleTo(modelFacingVec) *
            (camBasedMoveCrossVecOnY.y < 0 ? 1 : -1),
        );
    } else {
      characterModelIndicator.getWorldDirection(modelFacingVec);
    }
    crossVecOnX.copy(vectorY).cross(bodyBalanceVecOnX);
    crossVecOnY.copy(modelFacingVec).cross(bodyFacingVecOnY);
    crossVecOnZ.copy(vectorY).cross(bodyBalanceVecOnZ);

    dragAngForce.set(
      (crossVecOnX.x < 0 ? 1 : -1) *
        autoBalanceSpringK *
        bodyBalanceVecOnX.angleTo(vectorY) -
        characterRigidBody.angvel().x * autoBalanceDampingC,
      (crossVecOnY.y < 0 ? 1 : -1) *
        autoBalanceSpringOnY *
        modelFacingVec.angleTo(bodyFacingVecOnY) -
        characterRigidBody.angvel().y * autoBalanceDampingOnY,
      (crossVecOnZ.z < 0 ? 1 : -1) *
        autoBalanceSpringK *
        bodyBalanceVecOnZ.angleTo(vectorY) -
        characterRigidBody.angvel().z * autoBalanceDampingC,
    );

    // Apply balance torque impulse
    characterRigidBody.applyTorqueImpulse(dragAngForce, true);
  };

  /** Character sleep function */
  const sleepCharacter = () => {
    if (characterRigidBody) {
      if (document.visibilityState === "hidden") {
        characterRigidBody.sleep();
      } else {
        setTimeout(() => {
          if (characterRigidBody) {
            characterRigidBody.wakeUp();
          }
        }, wakeUpDelay);
      }
    }
  };

  /** Point-to-move function */
  const pointToMove = (
    delta: number,
    slopeAngle: number,
    movingObjectVelocity: THREE.Vector3,
    functionKeyDown: boolean,
  ) => {
    const moveToPoint = getMoveToPoint().moveToPoint;
    if (moveToPoint) {
      pointToPoint.set(
        moveToPoint.x - currentPos.x,
        0,
        moveToPoint.z - currentPos.z,
      );
      crossVector.crossVectors(pointToPoint, vectorZ);
      // Rotate character to moving direction
      modelEuler.y =
        (crossVector.y > 0 ? -1 : 1) * pointToPoint.angleTo(vectorZ);
      // If mode is also set to Control Camera. Keep the camera on the back of character.
      if (isModeControlCamera || isModeThirdCamera)
        pivot.rotation.y = THREE.MathUtils.lerp(
          pivot.rotation.y,
          modelEuler.y,
          controlCamRotMult * delta * 3,
        );
      // Once character close to the target point (distance<0.3),
      // Or character close to the wall (bodySensor intersects)
      // stop moving
      if (characterRigidBody) {
        if (pointToPoint.length() > 0.3 && !isBodyHitWall && !functionKeyDown) {
          moveCharacter(delta, false, slopeAngle, movingObjectVelocity);
          isPointMoving = true;
        } else {
          setMoveToPoint(new THREE.Vector3(0, 0, 0));
          isPointMoving = false;
        }
      }
    }
  };

  /** Stop character movement: used to stop the character movement when you stop press a key. */
  const resetAnimation = useGame((state) => state.reset);
  const characterStopMove = () => {
    if (!characterRigidBody) return;
    // Reset character velocity
    characterRigidBody.setLinvel({ x: 0, y: currentVel.y, z: 0 }, true);
    characterRigidBody.setAngvel({ x: 0, y: 0, z: 0 }, false);
    resetAnimation();
  };

  /** Rotate camera function */
  // eslint-disable-next-line
  const rotateCamera = (x: number, y: number) => {
    pivot.rotation.y += y;
    followCam.rotation.x = Math.min(
      Math.max(followCam.rotation.x + x, camLowLimit),
      camUpLimit,
    );
  };

  /** Rotate character on Y */
  // eslint-disable-next-line
  const rotateCharacterOnY = (rad: number) => {
    modelEuler.y += rad;
  };

  /** If inside keyboardcontrols, active subscribeKeys */
  useEffect(() => {
    if (!inKeyboardControls || !defaultPlayer) return;
    // Action 1 key subscribe for special animation
    const unSubscribeAction1 = subscribeKeys?.(
      (state) => state.action1,
      (value) => {
        if (value) {
          if (animated) action1Animation?.();
        }
      },
    );

    // Action 2 key subscribe for special animation
    const unSubscribeAction2 = subscribeKeys?.(
      (state) => state.action2,
      (value) => {
        if (value) {
          if (animated) action2Animation?.();
        }
      },
    );

    // Action 3 key subscribe for special animation
    const unSubscribeAction3 = subscribeKeys?.(
      (state) => state.action3,
      (value) => {
        if (value) {
          if (animated) action3Animation?.();
        }
      },
    );

    // Trigger key subscribe for special animation
    const unSubscribeAction4 = subscribeKeys?.(
      (state) => state.action4,
      (value) => {
        if (value) {
          if (animated) action4Animation?.();
        }
      },
    );

    /** Handlers */
    if (!defaultPlayer) return; // Only active for default player
    // Initialize character facing direction
    modelEuler.y = characterInitDir;

    window.addEventListener("visibilitychange", sleepCharacter);
    window.addEventListener("gamepadconnected", gamepadConnect);
    window.addEventListener("gamepaddisconnected", gamepadDisconnect);

    return () => {
      unSubscribeAction1?.();
      unSubscribeAction2?.();
      unSubscribeAction3?.();
      unSubscribeAction4?.();

      window.removeEventListener("visibilitychange", sleepCharacter);
      window.removeEventListener("gamepadconnected", gamepadConnect);
      window.removeEventListener("gamepaddisconnected", gamepadDisconnect);
    };
  }, []);

  /** Auto balance & Reset Rotations */
  useEffect(() => {
    if (!defaultPlayer) return; // Only active for default player
    if (!characterRigidBody) return;
    // Lock character rotations at Y axis
    characterRigidBody.setEnabledRotations(
      autoBalance ? true : false,
      autoBalance ? true : false,
      autoBalance ? true : false,
      false,
    );

    // Reset character quaternion
    return () => {
      if (characterRigidBody && characterModelRef.current) {
        characterModelRef.current.quaternion.set(0, 0, 0, 1);
        characterRigidBody.setRotation({ x: 0, y: 0, z: 0, w: 1 }, false);
      }
    };
    
  }, [autoBalance]);

  useEffect(() => {
    if (defaultPlayer) {
      const timer = setTimeout(() => {
        setBodyType("dynamic");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [defaultPlayer]);

  /** Character movement, Slope Management, Animations */
  useFrame((state, delta) => {
    if (!characterRigidBody) return;
    /**  Move character with the moving platform */
    detectPlatformUnderPlayer(); // Update isOnMovingPlatform and movingPlatformVelocity

    if (isOnMovingPlatform) {
      const platformDeltaPosition = new Vector3();
      platformDeltaPosition.set(
        movingPlatformVelocity.x * delta,
        movingPlatformVelocity.y * delta,
        movingPlatformVelocity.z * delta,
      );

      const currentTranslation = new THREE.Vector3(
        characterRigidBody.translation().x,
        characterRigidBody.translation().y,
        characterRigidBody.translation().z,
      );

      characterRigidBody.setTranslation(
        currentTranslation.add(platformDeltaPosition),
        true,
      );
    }

    if (delta > 1) delta %= 1;
    if (!defaultPlayer) return; // Only active for default player
    if (!characterRigidBody) return;

    // // Character current position/velocity
    if (characterRigidBody) {
      currentPos.copy(characterRigidBody.translation() as THREE.Vector3);
      currentVel.copy(characterRigidBody.linvel() as THREE.Vector3);
      // Assign userDate properties
      if (characterRigidBody.userData) {
        (characterRigidBody.userData as CharacterState).canJump = canJump;
        (characterRigidBody.userData as CharacterState).slopeAngle = slopeAngle;
        (characterRigidBody.userData as CharacterState).characterRotated =
          characterRotated;
        (characterRigidBody.userData as CharacterState).inMotion = inMotion;
      }
    }

    /** Camera movement */
    pivotXAxis.set(1, 0, 0);
    pivotXAxis.applyQuaternion(pivot.quaternion);
    pivotZAxis.set(0, 0, 1);
    pivotZAxis.applyQuaternion(pivot.quaternion);
    pivotPosition
      .copy(currentPos)
      .addScaledVector(pivotXAxis, camTargetPos.x)
      .addScaledVector(
        pivotYAxis,
        camTargetPos.y + (hitboxHeight + hitboxWidth / 2),
      )
      .addScaledVector(pivotZAxis, camTargetPos.z);
    pivot.position.lerp(pivotPosition, 1 - Math.exp(-camFollowMult * delta));

    if (enableFollowCam) {
      followCam.getWorldPosition(followCamPosition);
      state.camera.position.lerp(
        followCamPosition,
        1 - Math.exp(-camLerpMult * delta),
      );
      state.camera.lookAt(pivot.position);
    }

    /** Camera collision detect */
    if (camCollision) cameraCollisionDetect(delta);

    // // Getting all the useful keys from useKeyboardControls
    const { forward, back, left, right, jump, run } = inKeyboardControls
      ? (getKeys?.() ?? presetKeys)
      : presetKeys;

    // If enableControl is true, skip all following features
    if (!enableControl) return;

    if (!forward && !back && !left && !right && !jump && !run) {
      // if no key pressed, the character stop move
      characterStopMove();
    }

    /** Getting all gamepad control values */
    if (controllerIndex !== null) {
      const gamepad = navigator.getGamepads()[controllerIndex];
      if (!gamepad) return;
      handleButtons(gamepad.buttons);
      handleSticks(gamepad.axes);
      // Getting moving directions (IIFE)
      modelEuler.y = ((movingDirection) =>
        movingDirection === null ? modelEuler.y : movingDirection)(
        getObjectDirection(forward, back, left, right, pivot),
      );
    }

    /** Getting all joystick control values */
    const { joystickDis, joystickAng, runState, button1Pressed } =
      getJoystickValues();

    /** Move character to the moving direction (joystick controls) */
    if (joystickDis > 0) {
      // Apply camera rotation to character model
      modelEuler.y = pivot.rotation.y + (joystickAng - Math.PI / 2);
      moveCharacter(delta, runState, slopeAngle, movingObjectVelocity);
    }

    /** Getting moving directions (IIFE) */
    modelEuler.y = ((movingDirection) =>
      movingDirection === null ? modelEuler.y : movingDirection)(
      getObjectDirection(forward, back, left, right, pivot),
    );

    /** Move character to the moving direction */
    if (
      forward ||
      back ||
      left ||
      right ||
      gamepadKeys.forward ||
      gamepadKeys.back ||
      gamepadKeys.left ||
      gamepadKeys.right
    )
      moveCharacter(delta, run, slopeAngle, movingObjectVelocity);

    /** Jump */
    if ((jump || button1Pressed) && (canJump || infiniteJump)) {
      // If floatmode, temporary disable floatmode
      if (floatMode === true) {
        floatMode = false;

        // Wait 0.5s before re-enabling floatmode
        setTimeout(() => {
          floatMode = true;
        }, 500);
      }

      // Jump force value
      const jumpStrength =
        (run ? sprintJumpMult * jumpVel : jumpVel) * slopJumpMult;
      jumpVelocityVec.set(
        currentVel.x,
        run ? sprintJumpMult * jumpVel : jumpVel,
        currentVel.z,
      );

      // Action
      characterRigidBody.setLinvel(
        jumpDirection
          .set(0, jumpStrength, 0)
          .projectOnVector(actualSlopeNormalVec)
          .add(jumpVelocityVec),
        true,
      );

      /** Apply jump force to the ground */
      characterMassForce.y *= jumpForceToGroundMult;
      rayHit?.collider
        .parent()
        ?.applyImpulseAtPoint(characterMassForce, standingForcePoint, true);
      // If infiniteJump is false, the character can't jump again if it's not on the ground
      if (!infiniteJump) canJump = false;
    }

    /**
     * Character model rotate to the moving direction
     */
    // Determine if the character should rotate based on the input keys and joystick
    const shouldRotate =
      forward ||
      back ||
      left ||
      right ||
      gamepadKeys.forward ||
      gamepadKeys.back ||
      gamepadKeys.left ||
      gamepadKeys.right ||
      joystickDis > 0 ||
      isPointMoving;

    if (shouldRotate) {
      // Get the quaternion from the Euler angles, need to be set to the model
      modelQuat.setFromEuler(modelEuler);
      // Calculate the angle difference between the current quaternion and the target quaternion
      const angleDifference =
        characterModelIndicator.quaternion.angleTo(modelQuat);
      // Determine the effective turn speed based on the angle difference
      const effectiveTurnSpeed = Math.min(angleDifference, delta * turnSpeed);

      // Rotate towards the target quaternion with the effective turn speed
      characterModelIndicator.quaternion.rotateTowards(
        modelQuat,
        effectiveTurnSpeed * (isModeThirdCamera ? 0.5 : 1), // If is mode ThirdCamera set to 0.5 to smooth the rotation.
      );
    }

    /** Auto Balance Management */
    if (!autoBalance) {
      characterModelRef.current.quaternion.copy(
        isModeOnlyCamera
          ? pivot.quaternion
          : characterModelIndicator.quaternion,
      );
    }

    /** Ray casting detect if on ground */
    rayOrigin.addVectors(currentPos, rayOriginOffest as THREE.Vector3);
    rayHit = world.castRay(
      rayCast,
      rayLength,
      false,
      QueryFilterFlags.EXCLUDE_SENSORS,
      undefined,
      undefined,
      characterRigidBody,
      // this exclude any collider with CharacterState: excluseRay
      ((collider: Collider) =>
        collider.parent()?.userData &&
        !(collider.parent()?.userData as CharacterState).excludeRay) as (
        collider: Collider,
      ) => boolean,
    );

    /** Character Flip */
    // Check if the character is flipped based on its rotation
    if (autoFlip && characterRigidBody) {
      const rotation = characterRigidBody?.rotation?.();
      if (rotation) {
        const isFlipped = rotation.x > flipAngle || rotation.x < -flipAngle;
        if (isFlipped) {
          rotation.x = 0;
        }
      }
    }

    if (rayHit && rayHit.timeOfImpact < floatingDis + rayHitForgiveness) {
      if (slopeRayHit && actualSlopeAngle < slopeMaxAngle) {
        canJump = true;
      } else {
        canJump = false;
      }
    }

    /** Ray detect if on rigid body or dynamic platform, then apply the linear velocity and angular velocity to character */
    if (rayHit && canJump) {
      const parent = rayHit.collider.parent();
      if (!parent) return;

      standingForcePoint.set(
        rayOrigin.x,
        rayOrigin.y - rayHit.timeOfImpact,
        rayOrigin.z,
      );
      const bodyType = parent.bodyType(),
        bodyMass = parent.mass();
      if (!bodyMass) return;

      massRatio = characterRigidBody.mass() / bodyMass;

      if (bodyType === 0 || bodyType === 2) {
        inMotion = true;
        distanceFromCharacterToObject
          .copy(currentPos)
          .sub(parent.translation());
        const movingObjectLinvel = parent.linvel(),
          movingObjectAngvel = parent.angvel();
        movingObjectVelocity
          .set(
            movingObjectLinvel.x +
              objectAngvelToLinvel.crossVectors(
                movingObjectAngvel,
                distanceFromCharacterToObject,
              ).x,
            movingObjectLinvel.y,
            movingObjectLinvel.z +
              objectAngvelToLinvel.crossVectors(
                movingObjectAngvel,
                distanceFromCharacterToObject,
              ).z,
          )
          .multiplyScalar(Math.min(1, 1 / massRatio));

        velocityDiff.subVectors(movingObjectVelocity, currentVel);
        if (velocityDiff.length() > 30)
          movingObjectVelocity.multiplyScalar(1 / velocityDiff.length());

        if (bodyType === 0) {
          movingObjectDragForce
            .copy(
              !forward &&
                !back &&
                !left &&
                !right &&
                canJump &&
                joystickDis === 0 &&
                !isPointMoving &&
                !gamepadKeys.forward &&
                !gamepadKeys.back &&
                !gamepadKeys.left &&
                !gamepadKeys.right
                ? bodyContactForce.multiplyScalar(delta)
                : moveImpulse,
            )
            .multiplyScalar(Math.min(1, 1 / massRatio))
            .negate();

          bodyContactForce.set(0, 0, 0);
          parent.applyImpulseAtPoint(
            movingObjectDragForce,
            standingForcePoint,
            true,
          );
        }
      } else {
        inMotion = false;
        bodyContactForce.set(0, 0, 0);
        movingObjectVelocity.set(0, 0, 0);
      }
    } else {
      massRatio = 1;
      inMotion = false;
      bodyContactForce.set(0, 0, 0);
      movingObjectVelocity.set(0, 0, 0);
    }

    /** Slope ray casting detect if on slope */
    slopeRayOriginRef.current.getWorldPosition(slopeRayorigin);
    slopeRayorigin.y = rayOrigin.y;
    slopeRayHit = world.castRay(
      slopeRayCast,
      slopeRayLength,
      false,
      QueryFilterFlags.EXCLUDE_SENSORS,
      undefined,
      undefined,
      characterRigidBody,
      // this exclude any collider with userData
      ((collider: Collider) =>
        collider.parent()?.userData &&
        !(collider.parent()?.userData as CharacterState).excludeRay) as (
        collider: Collider,
      ) => boolean,
    );

    // Calculate slope angle
    if (slopeRayHit) {
      const rayNormal = slopeRayHit.collider.castRayAndGetNormal(
        slopeRayCast,
        slopeRayLength,
        false,
      );

      if (rayNormal?.normal) {
        actualSlopeNormal = rayNormal.normal as THREE.Vector3;
        actualSlopeNormalVec?.copy(actualSlopeNormal);
      }
    }

    if (
      slopeRayHit &&
      rayHit &&
      slopeRayHit.timeOfImpact < floatingDis + 0.5 &&
      canJump
    ) {
      slopeAngle = Number(
        Math.atan(
          (rayHit.timeOfImpact - slopeRayHit.timeOfImpact) /
            slopeRayOriginOffest,
        ).toFixed(2),
      );
    }

    if (floatMode && canJump) {
      if (slopeRayHit && slopeRayHit.collider.parent()) {
        const currentDistance = slopeRayHit.timeOfImpact; // timeOfImpact is the correct property
        const targetDistance = floatingDis;

        const displacement = targetDistance - currentDistance;
        const verticalVelocity = characterRigidBody.linvel().y;

        const floatingForce =
          springK * displacement - dampingC * verticalVelocity;

        // Apply floating force up
        springDirVec.set(0, floatingForce, 0);
        characterRigidBody.applyImpulse(springDirVec, false);

        // Optionnal : Apply floating force down
        if (floatingForce > 0) {
          characterMassForce.set(0, -floatingForce, 0);
          slopeRayHit.collider
            .parent()
            ?.applyImpulseAtPoint(characterMassForce, standingForcePoint, true);
        }
      }
    }

    // Apply drag force if it's not moving
    if (
      !forward &&
      !back &&
      !left &&
      !right &&
      canJump &&
      joystickDis === 0 &&
      !isPointMoving &&
      !gamepadKeys.forward &&
      !gamepadKeys.back &&
      !gamepadKeys.left &&
      !gamepadKeys.right
    ) {
      const isMovingObject = inMotion;
      const velocityDiffX = isMovingObject
        ? movingObjectVelocity.x - currentVel.x
        : -currentVel.x;
      const velocityDiffZ = isMovingObject
        ? movingObjectVelocity.z - currentVel.z
        : -currentVel.z;

      dragForce.set(
        velocityDiffX * dragDampingC,
        0,
        velocityDiffZ * dragDampingC,
      );
      characterRigidBody.applyImpulse(dragForce, isMovingObject);
    }

    /** Detect character falling state */
    isFalling = currentVel.y < 0 && !canJump ? true : false;

    /** Setup max falling speed && extra falling gravity */
    // Remove gravity if falling speed higher than fallingMaxVel (negetive number so use "<")
    if (!characterRigidBody) return;

    const currentGravity = characterRigidBody.gravityScale();

    if (currentVel.y < fallingMaxVel) {
      if (currentGravity !== 0) {
        characterRigidBody.setGravityScale(0, true);
      }
    } else {
      const targetGravity = isFalling
        ? fallingGravityScale
        : initialGravityScale;
      if (currentGravity !== targetGravity) {
        characterRigidBody.setGravityScale(targetGravity, true);
      }
    }

    /** Apply auto balance force to the character */
    if (autoBalance && characterRigidBody) autoBalanceCharacter();

    /** Point to move feature */
    if (isModePointToMove) {
      functionKeyDown =
        forward ||
        back ||
        left ||
        right ||
        joystickDis > 0 ||
        gamepadKeys.forward ||
        gamepadKeys.back ||
        gamepadKeys.left ||
        gamepadKeys.right ||
        jump ||
        button1Pressed;
      pointToMove(delta, slopeAngle, movingObjectVelocity, functionKeyDown);
    }

    /** Camera rotation */
    // Rotate left ?
    const isRotatingLeft =
      left ||
      gamepadKeys.left ||
      ((joystickDis > 0 || gamepadJoystickDis > 0) &&
        ((joystickAng > (2 * Math.PI) / 3 && joystickAng < (4 * Math.PI) / 3) ||
          (gamepadJoystickAng > (2 * Math.PI) / 3 &&
            gamepadJoystickAng < (4 * Math.PI) / 3)));

    // Rotate right ?
    const isRotatingRight =
      right ||
      gamepadKeys.right ||
      ((joystickDis > 0 || gamepadJoystickDis > 0) &&
        (joystickAng < Math.PI / 3 ||
          joystickAng > (5 * Math.PI) / 3 ||
          gamepadJoystickAng < Math.PI / 3 ||
          gamepadJoystickAng > (5 * Math.PI) / 3));

    // Apply Camera Rotation
    if (isModeControlCamera || isModeThirdCamera) {
      const rotationSpeed =
        delta *
        controlCamRotMult *
        (isModeControlCamera ? (run ? sprintMult : 1) : 1);
      if (isRotatingLeft) {
        pivot.rotation.y += rotationSpeed;
      } else if (isRotatingRight) {
        pivot.rotation.y -= rotationSpeed;
      }
    }

    /** Apply all the animations */
    if (animated) {
      const isJumping = (jump || button1Pressed) && canJump;
      const isIdle =
        !forward &&
        !back &&
        !left &&
        !right &&
        !jump &&
        !button1Pressed &&
        joystickDis === 0 &&
        !isPointMoving &&
        !gamepadKeys.forward &&
        !gamepadKeys.back &&
        !gamepadKeys.left &&
        !gamepadKeys.right &&
        canJump;
      const isMoving =
        (forward ||
          back ||
          left ||
          right ||
          joystickDis > 0 ||
          isPointMoving ||
          gamepadKeys.forward ||
          gamepadKeys.back ||
          gamepadKeys.left ||
          gamepadKeys.right) &&
        canJump;

      if (isIdle) {
        idleAnimation?.();
      }
      if (isJumping) {
        jumpAnimation?.();
      } else if (isMoving) {
        if (rayHit !== null || floatMode === true) {
          if (run || runState) {
            runAnimation?.();
          } else {
            walkAnimation?.();
          }
        }
      } else if (!canJump) {
        jumpIdleAnimation?.();
      }
      // Falling animation
      if (rayHit == null && isFalling) {
        fallAnimation?.();
      }
    }
  });

  return (
    <RigidBody
      ref={characterRef}
      type={bodyType}
      position={props.position || [0, 5, 0]}
      friction={props.friction || -0.5}
      mass={props.mass || 100}
      onContactForce={(e) =>
        bodyContactForce.set(e.totalForce.x, e.totalForce.y, e.totalForce.z)
      }
      onCollisionExit={() => bodyContactForce.set(0, 0, 0)}
      userData={{ canJump: false }}
      {...props}
    >
      <RoundCuboidCollider
        name="character-capsule-collider"
        args={[hitboxWidth, hitboxHeight, hitboxLenght, hitboxRadius]}
        position={[0, 0, 0]}
      />
      {/* Body collide sensor (only for point to move mode) */}
      {isModePointToMove && (
        <CylinderCollider
          ref={bodySensorRef}
          sensor
          mass={0}
          args={[bodySensorSize[0], bodySensorSize[1]]}
          position={[
            bodySensorPosition.x,
            bodySensorPosition.y,
            bodySensorPosition.z,
          ]}
          onIntersectionEnter={handleOnIntersectionEnter}
          onIntersectionExit={handleOnIntersectionExit}
        />
      )}
      <LockCamera camera={camera} renderer={gl} />
      <group ref={characterModelRef} userData={{ camExcludeCollision: true }}>
        {/* This mesh is used for positioning the slope ray origin */}
        <mesh
          position={[
            rayOriginOffest.x,
            rayOriginOffest.y,
            rayOriginOffest.z + slopeRayOriginOffest,
          ]}
          ref={slopeRayOriginRef}
          visible={showSlopeRayOrigin}
          userData={{ camExcludeCollision: true }} // this won't be collide by camera ray
        >
          <boxGeometry args={[0.15, 0.15, 0.15]} />
        </mesh>
        {/* Character model */}
        {children}
      </group>
    </RigidBody>
  );
};

export default forwardRef(ARCHE); // Used to create a reference. It allows access to a DOM Element.
