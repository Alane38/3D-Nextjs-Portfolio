import { characterControllerConfig } from "@/constants/character";
import { Box, useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  CapsuleCollider,
  RapierRigidBody,
  RigidBody,
  useRapier,
} from "@react-three/rapier";
import { useControls } from "leva";
import { useEffect, useRef, useState } from "react";
import { MathUtils, Vector3 } from "three";
import * as THREE from "three";

const normalizeAngle = (angle: number) => {
  return ((angle + Math.PI) % (2 * Math.PI)) - Math.PI;
};

const lerpAngle = (start: number, end: number, t: number) => {
  start = normalizeAngle(start);
  end = normalizeAngle(end);

  const delta = ((end - start + Math.PI) % (2 * Math.PI)) - Math.PI;
  return normalizeAngle(start + delta * t);
};

export const CharacterController = () => {
  const { rapier, world } = useRapier();

  const {
    WALK_SPEED,
    RUN_SPEED,
    JUMP_FORCE,
    ROTATION_SPEED,
    MOUSE,
    INFINITE_JUMP,
  } = useControls("Character Control", characterControllerConfig);

  const rb = useRef<RapierRigidBody>(null);
  const container = useRef<THREE.Object3D>(null);
  const character = useRef<THREE.Object3D>(null);

  const grounded = useRef<boolean>(false);
  /* const jumpTime = useRef<number>(0); */

  const [animation, setAnimation] = useState("idle");

  const characterRotationTarget = useRef(0);
  const rotationTarget = useRef(0);
  const cameraTarget = useRef<THREE.OrthographicCamera>(null);
  const cameraPosition = useRef<THREE.OrthographicCamera>(null);
  const cameraWorldPosition = useRef(new Vector3());
  const cameraLookAtWorldPosition = useRef(new Vector3());
  const cameraLookAt = useRef(new Vector3());

  const [, get] = useKeyboardControls();
  const isClicking = useRef(false);

  useEffect(() => {
    const onMouseDown = () => (isClicking.current = true);
    const onMouseUp = () => (isClicking.current = false);

    const onTouchStart = () => (isClicking.current = true);
    const onTouchEnd = () => (isClicking.current = false);

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

  useFrame(({ camera, mouse }) => {
    // Movement Forward_Backward
    if (rb.current) {
      const vel = rb.current.linvel();
      const movement = { x: 0, y: 0, z: 0 };

      if (get().forward) movement.z = 1;
      if (get().backward) movement.z = -1;

      //Movement Left_Right and Run
      let speed = get().run ? RUN_SPEED : WALK_SPEED;

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

      // Ground Check
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
      if (get().jump && (grounded.current || INFINITE_JUMP === true)) {
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

      if (character.current) {
        character.current.rotation.y = lerpAngle(
          character.current.rotation.y,
          characterRotationTarget.current,
          0.1,
        );
      }

      rb.current.setLinvel(vel, true);
    }

    if (container.current) {
      container.current.rotation.y = MathUtils.lerp(
        container.current.rotation.y,
        rotationTarget.current,
        0.1,
      );
    }

    //Camera
    if (cameraPosition.current) {
      cameraPosition.current.getWorldPosition(cameraWorldPosition.current);
      camera.position.lerp(cameraWorldPosition.current, 0.1);
    }

    if (cameraTarget.current) {
      cameraTarget.current.getWorldPosition(cameraLookAtWorldPosition.current);
      cameraLookAt.current.lerp(cameraLookAtWorldPosition.current, 0.1);
      camera.lookAt(cameraLookAt.current);
    }
  });

  return (
    <>
      <RigidBody
        name="Player"
        colliders="cuboid"
        lockRotations
        ref={rb}
        position={[0, 10, 0]}
        onCollisionEnter={({ other }) => {
          if (other.rigidBodyObject?.name === "KillBrick") {
          } else if (other.rigidBodyObject?.name === "Spinner") {
            // console.log("collision with Spinner");
            rb.current?.applyImpulse({ x: 5, y: 5, z: 5 }, true);
            
          }
        }}
        onCollisionExit={({ other }) => {
          if (other.rigidBodyObject?.name === "KillBrick") {
          } else if (other.rigidBodyObject?.name === "Spinner") {
            // console.log("collision with Spinner");
            rb.current?.applyImpulse({ x: 5, y: 5, z: 5 }, true);
            
          }
        }}
      >
        <group ref={container}>
          <group ref={cameraTarget} position-z={1.5} />
          <group ref={cameraPosition} position-y={3} position-z={-4} />
          <group ref={character}>
            <Box>
              <meshStandardMaterial color={"cyan"} />
            </Box>
          </group>
        </group>
        <CapsuleCollider args={[0.1, 0.7]} />
      </RigidBody>
    </>
  );
};
