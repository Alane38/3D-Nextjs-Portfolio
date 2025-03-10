import {
  Collider,
  QueryFilterFlags,
  RayColliderHit,
  Vector,
} from "@dimforge/rapier3d-compat";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  CylinderCollider,
  quat,
  RigidBody,
  RoundCuboidCollider,
  useRapier,
} from "@react-three/rapier";
import {
  forwardRef,
  ForwardRefRenderFunction,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import { useFollowCam } from "./Hooks/useFollowCam";
import { useGame } from "./Stores/useGame";
import { useJoystick } from "./Stores/useJoystick";
import { CharacterState } from "./types/CharacterState";
import { customRigidBody } from "./types/customRigidBody";
import { GalaadProps } from "./types/GalaadProps";
import { getObjectDirection } from "./Utils/getObjectDirection";
import { insideKeyboardControls } from "./Utils/insideKeyboardControls";

const Galaad: ForwardRefRenderFunction<customRigidBody, GalaadProps> = (
  {
    // TypeScript interface for Galaad component
    children,
    // Colliders settings
    hitboxHeight = 0.35,
    hitboxWidth = 0.3,
    hitboxLenght = 0.3,
    hitboxRadius = 0.3,

    floatHeight = 0.3,

    // Character initial direction
    characterInitDir = 0, // Rad

    // Control I/O
    disableControl = false,

    // Camera I/O
    disableFollowCam = false,
    disableFollowCamPos = null,
    disableFollowCamTarget = null,

    // Follow camera settings
    // Camera distance/limit
    camInitDis = -5,
    camMaxDis = -7,
    camMinDis = -0.7,
    camUpLimit = 1.5, // Rad
    camLowLimit = -1.3, // Rad
    // Camera direction
    camInitDir = { x: 0, y: 0 }, // Rad
    // Camera target a position ?
    camTargetPos = { x: 0, y: 0, z: 0 },
    // Camera speed
    camMoveSpeed = 1,
    camZoomSpeed = 1,
    // Camera collision
    camCollision = true,
    camCollisionOffset = 0.7,
    camCollisionSpeedMult = 4,
    // Camera control rotation
    controlCamRotMult = 0.5,
    // Follow light settings
    // Follow Light I/O
    followLight = false,
    // Follow light position
    followLightPos = { x: 20, y: 30, z: 10 },

    // Controls settings
    maxVelLim = 2.5,
    // Turn vel/speed
    turnVelMultiplier = 0.2,
    turnSpeed = 5,
    // Sprint
    sprintMult = 2,
    // Jump
    jumpVel = 6,
    jumpForceToGroundMult = 5,
    slopJumpMult = 0.25,
    sprintJumpMult = 1.2,
    // Air drag
    airDragMultiplier = 0.2,
    dragDampingC = 0.15,
    // acceleration --
    accDeltaTime = 8,
    rejectVelMult = 4,
    moveImpulsePointY = 0.5,
    // Camera controls
    camFollowMult = 11,
    camLerpMult = 25,
    // Falling
    fallingGravityScale = 2.5,
    fallingMaxVel = -20,
    // Wake up
    wakeUpDelay = 200,
    // Floating Ray setups
    rayOriginOffest = { x: 0, y: -hitboxWidth, z: 0 },
    rayHitForgiveness = 0.1,
    rayLength = hitboxHeight,
    rayDir = { x: 0, y: -1, z: 0 },
    floatingDis = hitboxHeight + floatHeight,
    springK = 1.2,
    dampingC = 0.08,
    // Slope Ray setups
    showSlopeRayOrigin = false,
    slopeMaxAngle = 1, // in rad
    slopeRayOriginOffest = hitboxHeight - 0.03,
    slopeRayLength = hitboxHeight + 3,
    slopeRayDir = { x: 0, y: -1, z: 0 },
    slopeUpExtraForce = 0.1,
    slopeDownExtraForce = 0.2,
    // AutoBalance Force setups
    autoBalance = true,
    autoBalanceSpringK = 0.3,
    autoBalanceDampingC = 0.03,
    autoBalanceSpringOnY = 0.5,
    autoBalanceDampingOnY = 0.015,
    // Animation I/O
    animated = false,
    // Mode setups
    camMode = null,
    camListenerTarget = "domElement",
    // Controller setups
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
    // Point-to-move setups
    bodySensorSize = [hitboxHeight / 2, hitboxWidth],
    bodySensorPosition = { x: 0, y: 0, z: hitboxWidth / 2 },
    // Other rigibody props from parent

    // custom props
    infiniteJump = false,

    ...props
  }: GalaadProps,
  ref,
) => {
  // //
  const characterRef = useRef<customRigidBody>(null!);
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
  // //
  useImperativeHandle(ref, () => {
    if (!characterRef.current) {
      throw new Error("characterRef is not initialized");
    }

    characterRef.current.rotateCamera = rotateCamera;
    characterRef.current.rotateCharacterOnY = rotateCharacterOnY;

    return characterRef.current;
  }, [characterRef]);

  // // Move and Camera mode
  const setMoveToPoint = useGame((state) => state.setMoveToPoint);
  const modeSet = new Set(camMode?.split(" ") || []);

  let functionKeyDown: boolean = false;
  const isModePointToMove = modeSet.has("PointToMove");
  const isModeOnlyCamera = modeSet.has("OnlyCamera");
  const isModeControlCamera = modeSet.has("ControlCamera");

  // // Body collider
  const vector3Factory = () => useMemo(() => new THREE.Vector3(), []);

  const modelFacingVec = vector3Factory();
  const bodyFacingVec = vector3Factory();
  const bodyBalanceVec = vector3Factory();
  const bodyBalanceVecOnX = vector3Factory();
  const bodyFacingVecOnY = vector3Factory();
  const bodyBalanceVecOnZ = vector3Factory();
  const crossVecOnX = vector3Factory();
  const crossVecOnY = vector3Factory();
  const crossVecOnZ = vector3Factory();
  const bodyContactForce = vector3Factory();
  const slopeRayOriginUpdatePosition = vector3Factory();
  const camBasedMoveCrossVecOnY = vector3Factory();

  const vectorY = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const vectorZ = useMemo(() => new THREE.Vector3(0, 0, 1), []);

  // Animation change functions
  const idleAnimation = !animated ? null : useGame((state) => state.idle);
  const walkAnimation = !animated ? null : useGame((state) => state.walk);
  const runAnimation = !animated ? null : useGame((state) => state.run);
  const jumpAnimation = !animated ? null : useGame((state) => state.jump);
  const jumpIdleAnimation = !animated
    ? null
    : useGame((state) => state.jumpIdle);
  const fallAnimation = !animated ? null : useGame((state) => state.fall);
  const action1Animation = !animated ? null : useGame((state) => state.action1);
  const action2Animation = !animated ? null : useGame((state) => state.action2);
  const action3Animation = !animated ? null : useGame((state) => state.action3);
  const action4Animation = !animated ? null : useGame((state) => state.action4);

  // World setup
  const { rapier, world } = useRapier();

  // Check if controls exists
  const inKeyboardControls = insideKeyboardControls();

  // Keyboard controls
  const [subscribeKeys, getKeys] = inKeyboardControls
    ? useKeyboardControls()
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
  const gamepadConnect = (e: any) => {
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
    disableFollowCam,
    disableFollowCamPos,
    disableFollowCamTarget,
    camInitDis,
    camMaxDis,
    camMinDis,
    camUpLimit,
    camLowLimit,
    camInitDir,
    camCollisionOffset,
    camCollisionSpeedMult,
    camListenerTarget,
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
  let floatingForce = null;
  const springDirVec: THREE.Vector3 = useMemo(() => new THREE.Vector3(), []);
  const characterMassForce: THREE.Vector3 = useMemo(
    () => new THREE.Vector3(),
    [],
  );
  const rayOrigin: THREE.Vector3 = useMemo(() => new THREE.Vector3(), []);
  const rayCast = new rapier.Ray(rayOrigin, rayDir);
  let rayHit: RayColliderHit | null = null;

  // // Slope Detection Ray
  let slopeAngle: number = 0;
  let actualSlopeNormal: Vector;
  let actualSlopeAngle: number = 0;
  const actualSlopeNormalVec: THREE.Vector3 = useMemo(
    () => new THREE.Vector3(),
    [],
  );
  const floorNormal: THREE.Vector3 = useMemo(
    () => new THREE.Vector3(0, 1, 0),
    [],
  );
  const slopeRayOriginRef = useRef<THREE.Mesh>(null!);
  const slopeRayorigin: THREE.Vector3 = useMemo(() => new THREE.Vector3(), []);
  const slopeRayCast = new rapier.Ray(slopeRayorigin, slopeRayDir);
  let slopeRayHit: RayColliderHit | null = null;

  // Point to Move
  let isBodyHitWall = false;
  let isPointMoving = false;
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

    // // Apply character quaternion to moving direction
    movingDirection.applyQuaternion(characterModelIndicator.quaternion);

    // // Moving object conditions
    // Calculate moving object velocity direction according to character moving direction
    movingObjectVelocityInCharacterDir
      .copy(movingObjectVelocity)
      .projectOnVector(movingDirection)
      .multiply(movingDirection);
    // Calculate angle between moving object velocity direction and character moving direction
    const angleBetweenCharacterDirAndObjectDir =
      movingObjectVelocity.angleTo(movingDirection);

    // // Setup Rejection Velocity
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

    // Wanted to move force function: F = ma
    const moveForceNeeded = moveAccNeeded.multiplyScalar(
      characterRef.current.mass(),
    );

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

    // Move character at proper direction and impulse
    characterRef.current.applyImpulseAtPoint(
      moveImpulse,
      {
        x: currentPos.x,
        y: currentPos.y + moveImpulsePointY,
        z: currentPos.z,
      },
      true,
    );
  };

  // // Character auto balance function
  const autoBalanceCharacter = () => {
    // Match body component to character model rotation on Y
    bodyFacingVec
      .set(0, 0, 1)
      .applyQuaternion(quat(characterRef.current.rotation()));
    bodyBalanceVec
      .set(0, 1, 0)
      .applyQuaternion(quat(characterRef.current.rotation()));

    bodyBalanceVecOnX.set(0, bodyBalanceVec.y, bodyBalanceVec.z);
    bodyFacingVecOnY.set(bodyFacingVec.x, 0, bodyFacingVec.z);
    bodyBalanceVecOnZ.set(bodyBalanceVec.x, bodyBalanceVec.y, 0);

    // Check if is camera based movement
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
        characterRef.current.angvel().x * autoBalanceDampingC,
      (crossVecOnY.y < 0 ? 1 : -1) *
        autoBalanceSpringOnY *
        modelFacingVec.angleTo(bodyFacingVecOnY) -
        characterRef.current.angvel().y * autoBalanceDampingOnY,
      (crossVecOnZ.z < 0 ? 1 : -1) *
        autoBalanceSpringK *
        bodyBalanceVecOnZ.angleTo(vectorY) -
        characterRef.current.angvel().z * autoBalanceDampingC,
    );

    // Apply balance torque impulse
    characterRef.current.applyTorqueImpulse(dragAngForce, true);
  };

  // // Character sleep function
  const sleepCharacter = () => {
    if (characterRef.current) {
      if (document.visibilityState === "hidden") {
        characterRef.current.sleep();
      } else {
        setTimeout(() => {
          characterRef.current.wakeUp();
        }, wakeUpDelay);
      }
    }
  };

  // // Point-to-move function
  // const pointToMove = (
  //   delta: number,
  //   slopeAngle: number,
  //   movingObjectVelocity: THREE.Vector3,
  //   functionKeyDown: boolean,
  // ) => {
  //   const moveToPoint = getMoveToPoint().moveToPoint;
  //   if (moveToPoint) {
  //     pointToPoint.set(
  //       moveToPoint.x - currentPos.x,
  //       0,
  //       moveToPoint.z - currentPos.z,
  //     );
  //     crossVector.crossVectors(pointToPoint, vectorZ);
  //     // Rotate character to moving direction
  //     modelEuler.y =
  //       (crossVector.y > 0 ? -1 : 1) * pointToPoint.angleTo(vectorZ);
  //     // If mode is also set to Control Camera. Keep the camera on the back of character.
  //     if (isModeControlCamera)
  //       pivot.rotation.y = THREE.MathUtils.lerp(
  //         pivot.rotation.y,
  //         modelEuler.y,
  //         controlCamRotMult * delta * 3,
  //       );
  //     // Once character close to the target point (distance<0.3),
  //     // Or character close to the wall (bodySensor intersects)
  //     // stop moving
  //     if (characterRef.current) {
  //       if (pointToPoint.length() > 0.3 && !isBodyHitWall && !functionKeyDown) {
  //         moveCharacter(delta, false, slopeAngle, movingObjectVelocity);
  //         isPointMoving = true;
  //       } else {
  //         setMoveToPoint(new THREE.Vector3(0, 0, 0));
  //         isPointMoving = false;
  //       }
  //     }
  //   }
  // };

  // // Stop character movement: used to stop the character movement when you stop press a key.
  const resetAnimation = useGame((state) => state.reset);
  const characterStopMove = () => {
    setTimeout(() => {
      characterRef.current.setLinvel({ x: 0, y: currentVel.y, z: 0 }, true);
      characterRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
    }, 200);
    resetAnimation();
  };

  // Rotate camera function
  const rotateCamera = (x: number, y: number) => {
    pivot.rotation.y += y;
    followCam.rotation.x = Math.min(
      Math.max(followCam.rotation.x + x, camLowLimit),
      camUpLimit,
    );
  };

  // // Rotate character on Y
  const rotateCharacterOnY = (rad: number) => {
    modelEuler.y += rad;
  };

  // // If inside keyboardcontrols, active subscribeKeys
  if (inKeyboardControls) {
    useEffect(() => {
      // Action 1 key subscribe for special animation
      const unSubscribeAction1 = subscribeKeys?.(
        (state) => state.action1,
        (value) => {
          if (value) {
            animated && action1Animation?.();
          }
        },
      );

      // Action 2 key subscribe for special animation
      const unSubscribeAction2 = subscribeKeys?.(
        (state) => state.action2,
        (value) => {
          if (value) {
            animated && action2Animation?.();
          }
        },
      );

      // Action 3 key subscribe for special animation
      const unSubscribeAction3 = subscribeKeys?.(
        (state) => state.action3,
        (value) => {
          if (value) {
            animated && action3Animation?.();
          }
        },
      );

      // Trigger key subscribe for special animation
      const unSubscribeAction4 = subscribeKeys?.(
        (state) => state.action4,
        (value) => {
          if (value) {
            animated && action4Animation?.();
          }
        },
      );

      return () => {
        unSubscribeAction1?.();
        unSubscribeAction2?.();
        unSubscribeAction3?.();
        unSubscribeAction4?.();
      };
    });
  }

  // //
  useEffect(() => {
    // Lock character rotations at Y axis
    characterRef.current.setEnabledRotations(
      autoBalance ? true : false,
      autoBalance ? true : false,
      autoBalance ? true : false,
      false,
    );

    // Reset character quaternion
    return () => {
      if (characterRef.current && characterModelRef.current) {
        characterModelRef.current.quaternion.set(0, 0, 0, 1);
        characterRef.current.setRotation({ x: 0, y: 0, z: 0, w: 1 }, false);
      }
    };
  }, [autoBalance]);
  // //
  useEffect(() => {
    // Initialize character facing direction
    modelEuler.y = characterInitDir;

    window.addEventListener("visibilitychange", sleepCharacter);
    window.addEventListener("gamepadconnected", gamepadConnect);
    window.addEventListener("gamepaddisconnected", gamepadDisconnect);

    return () => {
      window.removeEventListener("visibilitychange", sleepCharacter);
      window.removeEventListener("gamepadconnected", gamepadConnect);
      window.removeEventListener("gamepaddisconnected", gamepadDisconnect);
    };
  }, []);

  // //
  useFrame((state, delta) => {
    if (delta > 1) delta %= 1;

    // // Character current position/velocity
    if (characterRef.current) {
      currentPos.copy(characterRef.current.translation() as THREE.Vector3);
      currentVel.copy(characterRef.current.linvel() as THREE.Vector3);
      // Assign userDate properties
      (characterRef.current.userData as CharacterState).canJump = canJump;
      (characterRef.current.userData as CharacterState).slopeAngle = slopeAngle;
      (characterRef.current.userData as CharacterState).characterRotated =
        characterRotated;
      (characterRef.current.userData as CharacterState).inMotion = inMotion;
    }

    // // Camera movement
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

    if (!disableFollowCam) {
      followCam.getWorldPosition(followCamPosition);
      state.camera.position.lerp(
        followCamPosition,
        1 - Math.exp(-camLerpMult * delta),
      );
      state.camera.lookAt(pivot.position);
    }

    // // Camera collision detect
    camCollision && cameraCollisionDetect(delta);

    // // Getting all the useful keys from useKeyboardControls
    const { forward, back, left, right, jump, run } = inKeyboardControls
      ? (getKeys?.() ?? presetKeys)
      : presetKeys;

    // If disableControl is true, skip all following features
    if (disableControl) return;

    if (!forward && !back && !left && !right && !jump && !run) {
      // if no key pressed, the character stop move
      characterStopMove();
    }

    // // Getting all gamepad control values
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

    // // Getting all joystick control values
    const { joystickDis, joystickAng, runState, button1Pressed } =
      getJoystickValues();

    // Move character to the moving direction (joystick controls)
    if (joystickDis > 0) {
      // Apply camera rotation to character model
      modelEuler.y = pivot.rotation.y + (joystickAng - Math.PI / 2);
      moveCharacter(delta, runState, slopeAngle, movingObjectVelocity);
    }

    // Getting moving directions (IIFE)
    modelEuler.y = ((movingDirection) =>
      movingDirection === null ? modelEuler.y : movingDirection)(
      getObjectDirection(forward, back, left, right, pivot),
    );

    // // Move character to the moving direction
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

    // // Jump impulse

    if ((jump || button1Pressed) && (canJump || infiniteJump)) {
      const jumpStrength =
        (run ? sprintJumpMult * jumpVel : jumpVel) * slopJumpMult;
      jumpVelocityVec.set(
        currentVel.x,
        run ? sprintJumpMult * jumpVel : jumpVel,
        currentVel.z,
      );

      characterRef.current.setLinvel(
        jumpDirection
          .set(0, jumpStrength, 0)
          .projectOnVector(actualSlopeNormalVec)
          .add(jumpVelocityVec),
        true,
      );

      // // Apply jump force to the ground
      characterMassForce.y *= jumpForceToGroundMult;
      rayHit?.collider
        .parent()
        ?.applyImpulseAtPoint(characterMassForce, standingForcePoint, true);
      // If infiniteJump is false, the character can't jump again if it's not on the ground
      if (!infiniteJump) canJump = false;
    }

    // // Rotate character on Y
    modelQuat.setFromEuler(modelEuler);
    characterModelIndicator.quaternion.rotateTowards(
      modelQuat,
      delta * turnSpeed,
    );

    // // Auto Balance Gestion
    if (!autoBalance) {
      characterModelRef.current.quaternion.copy(
        isModeOnlyCamera
          ? pivot.quaternion
          : characterModelIndicator.quaternion,
      );
    }

    // // Ray casting detect if on ground
    rayOrigin.addVectors(currentPos, rayOriginOffest as THREE.Vector3);
    rayHit = world.castRay(
      rayCast,
      rayLength,
      false,
      QueryFilterFlags.EXCLUDE_SENSORS,
      undefined,
      undefined,
      characterRef.current,
      // this exclude any collider with CharacterState: excluseRay
      ((collider: Collider) =>
        collider.parent()?.userData &&
        !(collider.parent()?.userData as CharacterState).excludeRay) as (
        collider: Collider,
      ) => boolean,
    );

    // //  Test shape ray
    // rayHit = world.castShape(
    //   currentPos,
    //   { w: 0, x: 0, y: 0, z: 0 },
    //   {x:0,y:-1,z:0},
    //   shape,
    //   rayLength,
    //   true,
    //   null,
    //   null,
    //   characterRef.current
    // );

    if (rayHit && rayHit.timeOfImpact < floatingDis + rayHitForgiveness) {
      if (slopeRayHit && actualSlopeAngle < slopeMaxAngle) {
        canJump = true;
      } else {
        canJump = false;
      }
    }

    // // Ray detect if on rigid body or dynamic platform, then apply the linear velocity and angular velocity to character
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

      massRatio = characterRef.current.mass() / bodyMass;

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

    // // Slope ray casting detect if on slope
    slopeRayOriginRef.current.getWorldPosition(slopeRayorigin);
    slopeRayorigin.y = rayOrigin.y;
    slopeRayHit = world.castRay(
      slopeRayCast,
      slopeRayLength,
      false,
      QueryFilterFlags.EXCLUDE_SENSORS,
      undefined,
      undefined,
      characterRef.current,
      // this exclude any collider with userData: excludeEcctrlRay
      ((collider: Collider) =>
        collider.parent()?.userData &&
        !(collider.parent()?.userData as CharacterState).excludeRay) as (
        collider: Collider,
      ) => boolean,
    );

    // Calculate slope angle
    if (slopeRayHit) {
      actualSlopeNormal = slopeRayHit.collider.castRayAndGetNormal(
        slopeRayCast,
        slopeRayLength,
        false,
      )?.normal as THREE.Vector3;

      actualSlopeNormalVec?.copy(actualSlopeNormal);
      actualSlopeAngle = actualSlopeNormalVec?.angleTo(floorNormal);
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

    // // Apply floating force
    if (rayHit != null) {
      if (canJump && rayHit.collider.parent()) {
        floatingForce =
          springK * (floatingDis - rayHit.timeOfImpact) -
          characterRef.current.linvel().y * dampingC;
        characterRef.current.applyImpulse(
          springDirVec.set(0, floatingForce, 0),
          false,
        );

        // Apply opposite force to standing object (gravity g in rapier is 0.11 ?_?)
        characterMassForce.set(0, floatingForce > 0 ? -floatingForce : 0, 0);
        rayHit.collider
          .parent()
          ?.applyImpulseAtPoint(characterMassForce, standingForcePoint, true);
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
      characterRef.current.applyImpulse(dragForce, isMovingObject);
    }

    // // Detect character falling state
    isFalling = currentVel.y < 0 && !canJump ? true : false;

    // // Setup max falling speed && extra falling gravity
    // Remove gravity if falling speed higher than fallingMaxVel (negetive number so use "<")
    if (!characterRef.current) return;

    const currentGravity = characterRef.current.gravityScale();

    if (currentVel.y < fallingMaxVel) {
      if (currentGravity !== 0) {
        characterRef.current.setGravityScale(0, true);
      }
    } else {
      const targetGravity = isFalling
        ? fallingGravityScale
        : initialGravityScale;
      if (currentGravity !== targetGravity) {
        characterRef.current.setGravityScale(targetGravity, true);
      }
    }

    // // Apply auto balance force to the character
    if (autoBalance && characterRef.current) autoBalanceCharacter();

    // // // Point to move feature
    // if (isModePointToMove) {
    //   functionKeyDown =
    //     forward ||
    //     back ||
    //     left ||
    //     right ||
    //     joystickDis > 0 ||
    //     gamepadKeys.forward ||
    //     gamepadKeys.back ||
    //     gamepadKeys.left ||
    //     gamepadKeys.right ||
    //     jump ||
    //     button1Pressed;
    //   pointToMove(delta, slopeAngle, movingObjectVelocity, functionKeyDown);
    // }

    // // Camera
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

    // Camera Rotation
    if (isModeControlCamera) {
      const rotationSpeed = delta * controlCamRotMult * (run ? sprintMult : 1);
      if (isRotatingLeft) {
        pivot.rotation.y += rotationSpeed;
      } else if (isRotatingRight) {
        pivot.rotation.y -= rotationSpeed;
      }
    }

    // // Apply all the animations
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
        run || runState ? runAnimation?.() : walkAnimation?.();
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
      position={props.position || [0, 5, 0]}
      friction={props.friction || -0.5}
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

export default forwardRef(Galaad); // Used to create a reference It's allow to access to a DOM Element.

export type camListenerTargetType = "document" | "domElement";
