import { animationPrefix, characterPath } from "@/constants/default";
import { RapierRigidBody } from "@react-three/rapier";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Arche from "../extension/arche/Arche";
import { ArcheAnimation } from "../extension/arche/ArcheAnimation";
import { CharacterProps, CharacterRef } from "./character.type";
import { Vector3 } from "three";

export const ThirdControllerCharacter = forwardRef<
  CharacterRef,
  CharacterProps
>(({ name, position, defaultPlayer, path }, ref) => {
  if (!path) return null;

  const [loaded, setLoaded] = useState(false);
  const rb = useRef<RapierRigidBody>(null);

  // Set loaded state after a delay to ensure everything is properly initialized
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Expose methods for parent components via ref
  useImperativeHandle(
    ref,
    () => ({
      getCameraTarget: () => {
        if (!rb.current) return null;

        try {
          const pos = rb.current.translation();
          return pos ? new Vector3(pos.x, pos.y, pos.z) : null;
        } catch (e) {
          console.error("Error getting camera target:", e);
          return null;
        }
      },
      isReady: () => loaded && !!rb.current,
    }),
    [loaded],
  );

  // Configure animations based on whether this is the active player
  const animationSet = defaultPlayer
    ? {
        idle: animationPrefix + "idle",
        walk: animationPrefix + "walk",
        run: animationPrefix + "run",
        jump: animationPrefix + "jump",
        jumpIdle: animationPrefix + "jumpIdle",
        jumpLand: animationPrefix + "jumpLand",
      }
    : null;

  // Only enable controls for the active player
  const enableControl = defaultPlayer;
  const enableFollowCam = defaultPlayer;

  return (
    <Arche
      ref={rb}
      // ===== CHARACTER SETUP =====
      name={name || "Player"}
      defaultPlayer={defaultPlayer}
      position={position || [0, 0, 0]}
      infiniteJump={false}
      animated={true}
      // ===== COLLIDER - Hitbox stable et précise =====
      colliders="hull"
      hitboxHeight={0.5}
      hitboxWidth={0.3}
      hitboxLenght={0.1}
      hitboxRadius={0.3}
      // ===== FLOAT MODE - Désactivé pour physique réaliste =====
      floatMode={false}
      floatHeight={0.5}
      // ===== SPRING SYSTEM - Équilibre fondamental =====
      springK={5}
      dampingC={1}
      // ===== CONTROLS =====
      enableControl={enableControl}
      enableFollowCam={enableFollowCam}
      characterInitDir={0}
      // ===== CAMERA - Fluide et synchronisée =====
      camMode="ThirdCamera"
      camInitDis={-5}
      camMaxDis={-7}
      camMinDis={-2}
      camUpLimit={1.5}
      camLowLimit={-1.3}
      camInitDir={{ x: 0, y: 0 }}
      camTargetPos={{ x: 0, y: 0, z: 0 }}
      camMoveSpeed={1.5}
      camZoomSpeed={1.5}
      camCollision={true}
      camCollisionOffset={0.7}
      camCollisionSpeedMult={4}
      controlCamRotMult={1.8}
      camFollowMult={15}
      camLerpMult={30}
      // ===== PHYSICS - Mouvement stable et réactif =====
      maxVelLim={3}
      turnVelMultiplier={0.2}
      turnSpeed={5}
      sprintMult={1.8}
      jumpVel={6}
      jumpForceToGroundMult={5}
      slopJumpMult={0.25}
      sprintJumpMult={1.1}
      airDragMultiplier={0.3}
      dragDampingC={0.2}
      accDeltaTime={10}
      rejectVelMult={4}
      moveImpulsePointY={0.5}
      // ===== GRAVITY & FALLING - Naturel et contrôlé =====
      fallingGravityScale={2.5}
      fallingMaxVel={-20}
      wakeUpDelay={200}
      // ===== RAYCAST - Détection au sol précise =====
      rayOriginOffest={{ x: 0, y: -0.3, z: 0 }}
      rayHitForgiveness={0.1}
      rayLength={0.5}
      rayDir={{ x: 0, y: -1, z: 0 }}
      // ===== SLOPE DETECTION - Gestion des pentes =====
      slopeMaxAngle={1}
      slopeRayOriginOffest={0.47}
      slopeRayLength={2.5}
      slopeRayDir={{ x: 0, y: -1, z: 0 }}
      slopeUpExtraForce={0.05}
      slopeDownExtraForce={0.2}
      // ===== AUTO-BALANCE - Stabilité optimale =====
      autoBalance={true}
      autoBalanceSpringK={1.2}
      autoBalanceDampingC={0.08}
      autoBalanceSpringOnY={0.5}
      autoBalanceDampingOnY={0.05}
      // ===== COLLISION HANDLER =====
      onCollisionEnter={({ other }) => {
        if (other.rigidBodyObject?.name === "Spinner" && rb.current) {
          try {
            rb.current.applyImpulse({ x: 3, y: 3, z: 3 }, true);
          } catch (e) {
            console.error("Error applying impulse:", e);
          }
        }
      }}
    >
      {/* Import Model and Animation in FBX */}
      <ArcheAnimation
        path={characterPath + path} // Must have property
        animationSet={animationSet}
        rigidBodyProps={{
          scale: 0.013,
          position: [0, -0.7, 0],
        }}
      />
    </Arche>
  );
});

ThirdControllerCharacter.displayName = "Player";
