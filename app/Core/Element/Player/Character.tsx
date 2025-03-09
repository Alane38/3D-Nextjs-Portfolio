import { classModelPath } from "@constants/default";
import { EnumPlayerOption } from "@constants/playerSelection";
import { CharacterRenderer } from "@core/Utility/CharacterRenderer";
import Ecctrl, { EcctrlAnimation } from "@packages/ecctrl/src/Ecctrl";
import Galaad from "@packages/Galaad/Galaad";
import { GalaadAnimation } from "@packages/Galaad/GalaadAnimation";
import { RapierRigidBody } from "@react-three/rapier";
import { usePlayerSelection } from "@resources/Hooks";
import { useRef } from "react";

export const Character = ({
  defaultPlayer,
  path,
}: {
  defaultPlayer?: boolean;
  path: string;
}) => {
  const { player, updatePlayer } = usePlayerSelection();
  const rb = useRef<RapierRigidBody>(null);

  const animationPrefix = "rig|";
  const animationSet = {
    idle: animationPrefix + "idle",
    walk: animationPrefix + "walk",
    run: animationPrefix + "run",
    jump: animationPrefix + "jump",
    jumpIdle: animationPrefix + "jumpIdle",
    jumpLand: animationPrefix + "jumpLand",
  };


  let disableControl = player !== EnumPlayerOption.Character;
  let disableFollowCam = disableControl;

  return (
    <>
      <Galaad
        name="Player"
        colliders="trimesh"
        infiniteJump={false}
        hitboxHeight ={0.4}
        hitboxWidth={0.05}
        hitboxLenght={0.8}
        hitboxRadius={0.3}
        floatHeight={0}
        characterInitDir={0}
        followLight={false}
        disableControl={disableControl}
        disableFollowCam={disableFollowCam}
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
        controlCamRotMult={1.5}
        camListenerTarget="domElement"
        maxVelLim={5}
        turnVelMultiplier={0.1}
        turnSpeed={12}
        sprintMult={1.8}
        jumpVel={4.5}
        jumpForceToGroundMult={1}
        slopJumpMult={0}
        sprintJumpMult={1}
        airDragMultiplier={0.1}
        dragDampingC={0.1}
        accDeltaTime={5}
        rejectVelMult={1}
        moveImpulsePointY={0.3}
        camFollowMult={10}
        camLerpMult={20}
        fallingGravityScale={3.5}
        fallingMaxVel={-25}
        wakeUpDelay={100}
        rayOriginOffest={{ x: 0, y: -0.5, z: 0 }}
        rayHitForgiveness={0.05}
        rayLength={1.5}
        rayDir={{ x: 0, y: -1, z: 0 }}
        floatingDis={0}
        springK={1.5}
        dampingC={0.1}
        slopeMaxAngle={0.7}
        slopeRayOriginOffest={0.2}
        slopeRayLength={2}
        slopeRayDir={{ x: 0, y: -1, z: 0 }}
        slopeUpExtraForce={0.05}
        slopeDownExtraForce={0.1}
        autoBalance={true}
        autoBalanceSpringK={0.5}
        autoBalanceDampingC={0.05}
        autoBalanceSpringOnY={0.5}
        autoBalanceDampingOnY={0.02}
        animated={true}
        camMode="ControlCamera"
        controllerKeys={{
          forward: 12,
          back: 13,
          left: 14,
          right: 15,
          jump: 2,
          action1: 11,
          action2: 3,
          action3: 1,
          action4: 0,
        }}
        onCollisionEnter={({ other }) => {
          if (other.rigidBodyObject?.name === "Spinner") {
            rb.current?.applyImpulse({ x: 3, y: 3, z: 3 }, true);
          }
        }}
      >
        <GalaadAnimation
          characterURL={classModelPath + path} // Must have property
          animationSet={animationSet}
          rigidBodyProps={{
            scale: 0.013,
            position: [0, 0, 0],
            }}
        />
      </Galaad>
    </>
  );
};
