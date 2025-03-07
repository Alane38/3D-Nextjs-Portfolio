import { characterControllerConfig } from "@constants/character";
import { classModelPath } from "@constants/default";
import { EnumPlayerOption } from "@constants/playerSelection";
import Truc from "@core/Truc";
import { ModelRenderer } from "@core/Utility/ModelRenderer";
import Ecctrl from "@packages/ecctrl/src/Ecctrl";
import { Box, useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  CapsuleCollider,
  RapierRigidBody,
  RigidBody,
  useRapier,
} from "@react-three/rapier";
import { usePlayerSelection } from "@resources/Hooks";
import { useControls } from "leva";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { MathUtils, Vector3 } from "three";

// Initialization of normalizeAngle
const normalizeAngle = (angle: number) => {
  return ((angle + Math.PI) % (2 * Math.PI)) - Math.PI;
};

// Initialization of lerp
const lerpAngle = (start: number, end: number, t: number) => {
  start = normalizeAngle(start);
  end = normalizeAngle(end);

  const delta = ((end - start + Math.PI) % (2 * Math.PI)) - Math.PI;
  return normalizeAngle(start + delta * t);
};

// Main Character Controller
export const Character = ({ defaultPlayer }: { defaultPlayer?: boolean }) => {
  const { rapier, world } = useRapier(); // Import Rappier for Colliders Events*
  const { player, updatePlayer } = usePlayerSelection();

  // Import Character Value
  const {
    WALK_SPEED,
    RUN_SPEED,
    JUMP_FORCE,
    ROTATION_SPEED,
    MOUSE,
    INFINITE_JUMP,
  } = useControls("Character Control", characterControllerConfig);

  const rb = useRef<RapierRigidBody>(null);
  const character = useRef<THREE.Object3D>(null);

  const grounded = useRef<boolean>(false);

  const [animation, setAnimation] = useState("idle");

  // Character Rotation & Camera Settings
  const characterRotationTarget = useRef(0);
  const rotationTarget = useRef(0);

  const lookAtVec = new THREE.Vector3(0, 0, 0);
  const cameraVector = new THREE.Vector3(0, 0, 0);

  // Keyboard Controls
  const [, get] = useKeyboardControls();
  const isClicking = useRef(false);

  // Events Listeners
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const onMouseDown = () => {
      timer = setTimeout(() => (isClicking.current = true), 1000);
    };
    const onMouseUp = () => {
      clearTimeout(timer);
      isClicking.current = false;
    };

    const onTouchStart = () => {
      timer = setTimeout(() => (isClicking.current = true), 1000);
    };
    const onTouchEnd = () => {
      clearTimeout(timer);
      isClicking.current = false;
    };

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("touchstart", onTouchStart);
    document.addEventListener("touchend", onTouchEnd);

    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  // Initialize default player
  defaultPlayer && updatePlayer(EnumPlayerOption.Character);

  // MOVEMENT, CAMERA, COLLISION DETECTION
  useFrame(({ camera, mouse }, delta) => {
    if (player !== EnumPlayerOption.Character) return;
    // Initialize default player
    updatePlayer(EnumPlayerOption.Character);

    const t = 1.0 - Math.pow(0.01, delta);

    // Movement Forward_Backward
    if (rb.current) {
      const vel = rb.current.linvel();
      const movement = { x: 0, y: 0, z: 0 };

      if (get().forward) movement.z = 1;
      if (get().backward) movement.z = -1;

      // Movement Left_Right and Run
      let speed = get().run ? RUN_SPEED : WALK_SPEED;

      // Movement Mouse
      if (isClicking.current && MOUSE) {
        const cameraDirection = new Vector3();
        camera.getWorldDirection(cameraDirection);
        movement.x = -mouse.x * 10;
        movement.z = mouse.y * 10;

        if (Math.abs(movement.x) > 0.5 || Math.abs(movement.z) > 0.5) {
          speed = RUN_SPEED;
        }
      }

      if (get().left) movement.x = 1;
      if (get().right) movement.x = -1;

      // Ground Checker
      const groundRayResult = world.castRay(
        new rapier.Ray(rb.current.translation(), { x: 0, y: -1, z: 0 }),
        1,
        false,
        undefined,
        undefined,
        undefined,
        rb.current,
      );
      grounded.current = groundRayResult !== null;

      // Jump
      if (get().jump_brake && (grounded.current || INFINITE_JUMP === true)) {
        movement.y = JUMP_FORCE;
        grounded.current = false;
      }

      // Movement Rotation
      if (movement.x !== 0)
        rotationTarget.current += ROTATION_SPEED * movement.x;

      if (movement.x !== 0 || movement.z !== 0) {
        characterRotationTarget.current = Math.atan2(movement.x, movement.z);
        vel.x =
          Math.sin(rotationTarget.current + characterRotationTarget.current) *
          speed;
        vel.z =
          Math.cos(rotationTarget.current + characterRotationTarget.current) *
          speed;
        setAnimation(speed === RUN_SPEED ? "run" : "walk");
      } else {
        setAnimation("idle");
      }

      if (movement.y !== 0) {
        characterRotationTarget.current = Math.atan2(movement.x, movement.z);
        vel.y = movement.y * JUMP_FORCE;
      }

      // Character Rotation
      if (character.current) {
        character.current.rotation.y = lerpAngle(
          character.current.rotation.y,
          characterRotationTarget.current,
          0.1,
        );
      }

      rb.current.setLinvel(vel, true);

      if (character.current && rb.current) {
        // Interpolation pour lisser la rotation
        const targetRotation = new THREE.Quaternion();
        targetRotation.setFromAxisAngle(
          new THREE.Vector3(0, 1, 0),
          rotationTarget.current,
        );

        character.current.quaternion.slerp(targetRotation, 0.1);

        // Appliquer cette rotation au rigidbody
        rb.current.setRotation(character.current.quaternion, true);
      }
    }

    if (character.current) {
      character.current.rotation.y = MathUtils.lerp(
        character.current.rotation.y,
        rotationTarget.current,
        0.1,
      );
    }

    if (character.current && rb.current) {
      const boxPos = rb.current.translation();
      console.log(boxPos);
      lookAtVec.set(boxPos.x, boxPos.y, boxPos.z);
      cameraVector.lerp(lookAtVec, 0.1);
      camera.lookAt(cameraVector);
      camera.updateProjectionMatrix();
    }
  });

  return (
    <>
      <Ecctrl
  debug
  name="Player"
  infiniteJump={false} // Désactiver le saut infini
  capsuleHalfHeight={0.5} // Taille plus réaliste du capsule
  capsuleRadius={0.3} // Rayon du capsule
  floatHeight={0} // Désactiver la flottabilité
  characterInitDir={0}
  followLight={false}
  disableControl={false}
  disableFollowCam={false}
  disableFollowCamPos={{ x: 0, y: 1, z: -5 }}
  disableFollowCamTarget={{ x: 0, y: 1, z: 0 }}
  
  // Caméra
  camInitDis={-3.5} // Distance plus immersive
  camMaxDis={-5} // Distance max
  camMinDis={-1.5} // Distance min
  camUpLimit={1.2} 
  camLowLimit={-1} 
  camInitDir={{ x: 0, y: 0 }}
  camTargetPos={{ x: 0, y: 1, z: 0 }}
  camMoveSpeed={1.5} 
  camZoomSpeed={1.2} 
  camCollision={true}
  camCollisionOffset={0.5}
  camCollisionSpeedMult={5}
  fixedCamRotMult={1.5}
  camListenerTarget="domElement"
  
  // Mouvement
  maxVelLimit={5} // Vitesse max plus élevée
  turnVelMultiplier={0.1} // Moins de glissement
  turnSpeed={12} // Vitesse de rotation plus naturelle
  sprintMult={1.8} // Sprint plus rapide
  jumpVel={4.5} // Saut naturel
  jumpForceToGroundMult={1} // Éviter les rebonds
  slopJumpMult={0} // Pas d'impact sur les pentes
  sprintJumpMult={1}
  airDragMultiplier={0.1} // Moins de résistance dans l'air
  dragDampingC={0.1} // Moins de ralentissement abrupt
  accDeltaTime={5} // Accélération plus fluide
  rejectVelMult={1} // Pas de rejet violent
  moveImpulsePointY={0.3}
  camFollowMult={10}
  camLerpMult={20}
  fallingGravityScale={3.5} // Gravité plus forte
  fallingMaxVel={-25} // Chute rapide et réaliste
  wakeUpDelay={100}
  
  // Raycasts pour les contacts
  rayOriginOffest={{ x: 0, y: -0.5, z: 0 }}
  rayHitForgiveness={0.05}
  rayLength={1.5}
  rayDir={{ x: 0, y: -1, z: 0 }}
  floatingDis={0}
  springK={1.5}
  dampingC={0.1}
  
  // Pentes
  slopeMaxAngle={0.7} // Inclinaison plus réaliste
  slopeRayOriginOffest={0.2}
  slopeRayLength={2}
  slopeRayDir={{ x: 0, y: -1, z: 0 }}
  slopeUpExtraForce={0.05}
  slopeDownExtraForce={0.1}
  
  // Auto-équilibre (évite de tomber en pente)
  autoBalance={true}
  autoBalanceSpringK={0.5}
  autoBalanceDampingC={0.05}
  autoBalanceSpringOnY={0.5}
  autoBalanceDampingOnY={0.02}
  
  // Animation
  animated={true}
  
  // Mode de mouvement
  mode="CameraBasedMovement"
  
  // Touches personnalisées
  controllerKeys={{ forward: 12, backward: 13, leftward: 14, rightward: 15, jump: 2, action1: 11, action2: 3, action3: 1, action4: 0 }}
  
  // Gestion des collisions
  onCollisionEnter={({ other }) => {
    if (other.rigidBodyObject?.name === "KillBrick") {
      // Mort du joueur
    } else if (other.rigidBodyObject?.name === "Spinner") {
      rb.current?.applyImpulse({ x: 3, y: 3, z: 3 }, true);
    }
  }}
  onCollisionExit={({ other }) => {
    if (other.rigidBodyObject?.name === "KillBrick") {
      // Rien
    } else if (other.rigidBodyObject?.name === "Spinner") {
      rb.current?.applyImpulse({ x: 3, y: 3, z: 3 }, true);
    }
  }}
>
        {/* <group ref={character}> */}
        {/* <group ref={character}> */}
        <group position={[0, -0.75, 0]}>
        <ModelRenderer path={classModelPath + "Fox.glb"} />
        </group>
        {/* <Truc /> */}
        {/* Enables obstacle management */}
        {/* </group> */}
        {/* <CapsuleCollider args={[0.1, 0.7]} /> */}
      </Ecctrl>
    </>
  );
};
