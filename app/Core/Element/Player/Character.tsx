import { classModelPath } from "@constants/default";
import { EnumPlayerOption } from "@constants/playerSelection";
import { ModelRenderer } from "@core/Utility/ModelRenderer";
import Ecctrl from "@packages/ecctrl/src/Ecctrl";
import { RapierRigidBody } from "@react-three/rapier";
import { usePlayerSelection } from "@resources/Hooks";
import { useRef } from "react";

// // Initialization of normalizeAngle
// const normalizeAngle = (angle: number) => {
//   return ((angle + Math.PI) % (2 * Math.PI)) - Math.PI;
// };

// // Initialization of lerp
// const lerpAngle = (start: number, end: number, t: number) => {
//   start = normalizeAngle(start);
//   end = normalizeAngle(end);

//   const delta = ((end - start + Math.PI) % (2 * Math.PI)) - Math.PI;
//   return normalizeAngle(start + delta * t);
// };

// Main Character Controller
export const Character = ({ defaultPlayer }: { defaultPlayer?: boolean }) => {
  const { player, updatePlayer } = usePlayerSelection();
  const rb = useRef<RapierRigidBody>(null);

  // Default Player
  updatePlayer(EnumPlayerOption.Character);
  let disableControl;
  let disableFollowCam;
  if (player !== EnumPlayerOption.Character) {
    disableControl = true;
    disableFollowCam = true;
  }

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
        disableControl={disableControl} //Désactiver les controles
        disableFollowCam={disableFollowCam} // Désactiver la camera sur le personnage.
        disableFollowCamPos={{ x: 0, y: 1, z: -5 }}
        disableFollowCamTarget={{ x: 0, y: 1, z: 0 }}
        // Caméra
        camInitDis={-3.5} // Distance plus immersive
        camMaxDis={-5} // Distance max
        camMinDis={-1.5} // Distance min
        camUpLimit={1.2}
        camLowLimit={-1}
        camInitDir={{ x: 0, y: 0 }}
        camTargetPos={{ x: 0, y: 0.5, z: 0 }}
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
        mode="FixedCamera"
        // Touches personnalisées
        controllerKeys={{
          forward: 12,
          backward: 13,
          leftward: 14,
          rightward: 15,
          jump: 2,
          action1: 11,
          action2: 3,
          action3: 1,
          action4: 0,
        }}
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
        <group position={[0, -0.75, 0]}>
          <ModelRenderer path={classModelPath + "Fox.glb"} />
        </group>
      </Ecctrl>
    </>
  );
};
