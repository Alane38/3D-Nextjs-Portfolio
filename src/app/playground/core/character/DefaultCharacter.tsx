import { animationPrefix, characterPath } from "@/constants/default";
import { RapierRigidBody } from "@react-three/rapier";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import Arche from "../extension/arche/Arche";
import { ArcheAnimation } from "../extension/arche/ArcheAnimation";
import { CharacterProps } from "./character.type";
import { Vector3 } from "three";

export type CharacterRef = {
  getCameraTarget: () => Vector3 | null;
  isReady: () => boolean;
};

export const DefaultCharacter = forwardRef<CharacterRef, CharacterProps>(
  ({ name, position, defaultPlayer, path }, ref) => {
    if (!path) return;
    
    const [loaded, setLoaded] = useState(false);
    const rb = useRef<RapierRigidBody>(null);
    
    useEffect(() => {
      const timer = setTimeout(() => setLoaded(true), 500); 
      return () => clearTimeout(timer);
    }, []);
  

    useImperativeHandle(ref, () => ({
      getCameraTarget: () => {
        const pos = rb.current?.translation();
        return pos ? new Vector3(pos.x, pos.y, pos.z) : null;
      },
      isReady: () => loaded,
    }));

    const animationSet = defaultPlayer ?{
      idle: animationPrefix + "idle",
      walk: animationPrefix + "walk",
      run: animationPrefix + "run",
      jump: animationPrefix + "jump",
      jumpIdle: animationPrefix + "jumpIdle",
      jumpLand: animationPrefix + "jumpLand",
    } : null;
  
  const enableControl = defaultPlayer ? true : false;
  const enableFollowCam = defaultPlayer ? true : false;

  return (
    <>
      <Arche
        ref={rb}
        // Character
        name={name}
        defaultPlayer={defaultPlayer}
        position={position}
        infiniteJump={true}
        animated={true}
        floatMode={false}
        // Collider
        colliders="hull"
        hitboxHeight={0.4}
        hitboxWidth={0.05}
        hitboxLenght={0.8}
        hitboxRadius={0.3}
        floatHeight={1}
        // Control & Camera
        enableControl={enableControl}
        enableFollowCam={enableFollowCam}
        // Direction & Camera
        camMode="ThirdCamera"
        characterInitDir={0}
        camInitDis={-3.5}
        camMaxDis={-5}
        camMinDis={-1.5}
        camUpLimit={1.2}
        camLowLimit={-1}
        camInitDir={{ x: 0, y: 0 }}
        camTargetPos={{ x: 0, y: 0.5, z: 0 }}
        camMoveSpeed={1.5}
        camZoomSpeed={1.2}
        camCollision={true}
        camCollisionOffset={0.5}
        camCollisionSpeedMult={5}
        controlCamRotMult={1}
        camFollowMult={10}
        camLerpMult={20}
        // Follow light
        followLight={false}
        // Physics
        maxVelLim={5}
        turnVelMultiplier={0.1}
        turnSpeed={4}
        sprintMult={1.8}
        jumpVel={8}
        jumpForceToGroundMult={1}
        slopJumpMult={0}
        sprintJumpMult={1.1}
        airDragMultiplier={0.1}
        dragDampingC={0.1}
        accDeltaTime={5}
        rejectVelMult={1}
        moveImpulsePointY={0.3}
        fallingGravityScale={3}
        fallingMaxVel={-25}
        wakeUpDelay={100}
        rayOriginOffest={{ x: 0, y: -0.5, z: 0 }}
        rayHitForgiveness={1}
        rayLength={0.35}
        rayDir={{ x: 0, y: -1, z: 0 }}
        springK={5}
        dampingC={1}
        slopeMaxAngle={0.7}
        slopeRayOriginOffest={0.2}
        slopeRayLength={2}
        slopeRayDir={{ x: 0, y: -1, z: 0 }}
        slopeUpExtraForce={0.05}
        slopeDownExtraForce={0.1}
        // Auto balance
        autoBalance={true}
        autoBalanceSpringK={1}
        autoBalanceDampingC={0.05}
        autoBalanceSpringOnY={0.1}
        autoBalanceDampingOnY={0.01}
        onCollisionEnter={({ other }) => {
          if (other.rigidBodyObject?.name === "Spinner") {
            rb.current?.applyImpulse({ x: 3, y: 3, z: 3 }, true);
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
      </>
    );
  }
);

DefaultCharacter.displayName = "Character";
