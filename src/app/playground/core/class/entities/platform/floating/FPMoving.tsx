import type { RayColliderHit } from "@dimforge/rapier3d-compat";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CuboidCollider, RigidBody, useRapier } from "@react-three/rapier";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Entity } from "../../../Entity";
import EntitySingleton from "../../../EntitySingleton";
import { FPPushtoRotate } from "./FPPushToRotate";

export class FPMoving extends Entity {
  constructor() {
    super("FloatingMovingPlatform");
    this.type = "dynamic";
    this.colliders = false;
    this.position = new THREE.Vector3(0, 5, -17);
  }

  renderComponent() {
    return <FPMovingComponent model={this} />;
  }
}

export const FPMovingComponent = ({
  model,
  ...props
}: {
  model: FPPushtoRotate;
}) => {
  // Fusion of props and model
  const instance = model || EntitySingleton.getInstance(FPPushtoRotate);
  const object = useMemo(() => ({ ...instance, ...props }), [model, props]);

  const { world, rapier } = useRapier();
  const ref = useRef<any>(null);

  const rayLength = 0.8;
  const rayDir = { x: 0, y: -1, z: 0 };
  const floatingDis = 0.8;
  const springK = 2.5;
  const dampingC = 0.15;
  const moveSpeed = 2;

  const origin = useMemo(() => new THREE.Vector3(), []);
  const impulseVec = useMemo(() => new THREE.Vector3(), []);
  const movingVel = useMemo(() => new THREE.Vector3(), []);
  const ray = new rapier.Ray(origin, rayDir);

  let movingDir = useRef(1);

  useEffect(() => {
    ref.current?.setEnabledRotations(false, true, false);
    ref.current?.setEnabledTranslations(true, true, false);
  }, []);

  useFrame(() => {
    if (!ref.current) return;

    // Update movement direction
    const x = ref.current.translation().x;
    if (x > 10) movingDir.current = -1;
    if (x < -5) movingDir.current = 1;

    ref.current.setLinvel(
      movingVel.set(movingDir.current * moveSpeed, ref.current.linvel().y, 0),
    );

    // Apply floating force
    origin.set(x, ref.current.translation().y, ref.current.translation().z);
    const hit: RayColliderHit | null = world.castRay(
      ray,
      rayLength,
      false,
      undefined,
      undefined,
      ref.current,
      ref.current,
    );

    if (hit?.collider?.parent()) {
      const force =
        springK * (floatingDis - hit.timeOfImpact) -
        ref.current.linvel().y * dampingC;
      ref.current.applyImpulse(impulseVec.set(0, force, 0), true);
    }
  });

  return (
    <RigidBody
      ref={ref}
      position={model.position.toArray()}
      mass={1}
      colliders={false}
    >
      <Text
        scale={0.5}
        color="black"
        position={[0, 2.5, 0]}
        maxWidth={10}
        textAlign="center"
      >
        Floating & Moving Platform (rigidbody)
      </Text>
      <CuboidCollider args={[1.25, 0.1, 1.25]} />
      <mesh receiveShadow castShadow>
        <boxGeometry args={[2.5, 0.2, 2.5]} />
        <meshStandardMaterial color="lightsteelblue" />
      </mesh>
    </RigidBody>
  );
};
