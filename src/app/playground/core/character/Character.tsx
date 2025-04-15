
import { RapierRigidBody } from "@react-three/rapier";
import { useRef } from "react";
import { animationPrefix, characterPath } from "src/constants/default";
import { CharacterProps } from "../extension/arche/types/CharacterProps";
import { ArcheAnimation } from "../extension/arche/ArcheAnimation";
import Arche from "../extension/arche/Arche";

export const Character = ({
  name,
  position,
  defaultPlayer,
  path,
}: CharacterProps) => {
  const rb = useRef<RapierRigidBody>(null);

  const animationSet = {
    idle: animationPrefix + "idle",
    walk: animationPrefix + "walk",
    run: animationPrefix + "run",
    jump: animationPrefix + "jump",
    jumpIdle: animationPrefix + "jumpIdle",
    jumpLand: animationPrefix + "jumpLand",
  };

  let enableControl = true;
  let enableFollowCam = true;
  if (!defaultPlayer) {
    enableControl = false;
    enableFollowCam = false;
  }

  return (
    <>
      <Arche
        // Character
        name={name}
        defaultPlayer={defaultPlayer}
        position={position}
        infiniteJump={true}
        animated={true}
        floatMode={true}
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
        camMode="ControlCamera"
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
        camListenerTarget="domElement"
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
};
