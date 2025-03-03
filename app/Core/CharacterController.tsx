import { Box, useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useControls } from "leva";
import { useEffect, useRef, useState } from "react";
import { MathUtils, Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils.js";
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
  const { WALK_SPEED, RUN_SPEED, ROTATION_SPEED } = useControls(
    "Character Control",
    {
      WALK_SPEED: { value: 4, min: 0.1, max: 4, step: 0.1 },
      RUN_SPEED: { value: 6, min: 0.2, max: 12, step: 0.1 },
      ROTATION_SPEED: {
        value: degToRad(1),
        min: degToRad(0.1),
        max: degToRad(5),
        step: degToRad(0.1),
      },
    },
  );

  const rb = useRef<RapierRigidBody>(null);
  const container = useRef<THREE.Object3D>(null);
  const character = useRef<THREE.Object3D>(null);

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
    if (rb.current) {
      const vel = rb.current.linvel();
      const movement = { x: 0, z: 0 };

      if (get().forward) movement.z = 1;
      if (get().backward) movement.z = -1;

      let speed = get().run ? RUN_SPEED : WALK_SPEED;

      if (isClicking.current) {
        // Use mouse position to calculate movement direction
        const cameraDirection = new Vector3();
        camera.getWorldDirection(cameraDirection);
        movement.x = -mouse.x * 10; // Adjust scaling factor
        movement.z = mouse.y * 10; // Adjust scaling factor

        if (Math.abs(movement.x) > 0.5 || Math.abs(movement.z) > 0.5) {
          speed = RUN_SPEED;
        }
      }

      if (get().left) movement.x = 1;
      if (get().right) movement.x = -1;

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

      if (character.current) {
        character.current.rotation.y = lerpAngle(
          character.current.rotation.y,
          characterRotationTarget.current,
          0.1,
        );
      }

      rb.current.setLinvel(vel, true);
    }

    // Update camera position smoothly
    if (container.current) {
      container.current.rotation.y = MathUtils.lerp(
        container.current.rotation.y,
        rotationTarget.current,
        0.1,
      );
    }

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
    <RigidBody colliders="trimesh" lockRotations ref={rb} position={[0, 1, 0]}>
      <group ref={container}>
        <group ref={cameraTarget} position-z={1.5} />
        <group ref={cameraPosition} position-y={4} position-z={-4} />
        <group ref={character}>
          <Box>
            <meshStandardMaterial />
          </Box>
        </group>
      </group>
    </RigidBody>
  );
};
