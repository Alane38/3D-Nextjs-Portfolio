// Floating Platform : Push to Rotate

import type { RayColliderHit } from "@dimforge/rapier3d-compat";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CuboidCollider, RigidBody, useRapier } from "@react-three/rapier";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Entity } from "../../../Entity";
import EntitySingleton from "../../../EntitySingleton";

export class FPPushtoRotate extends Entity {
  constructor() {
    super("FPPushtoRotate");
    this.type = "dynamic";
    this.colliders = false;
    this.position = new THREE.Vector3(7, 5, -10);
  }

  renderComponent() {
    return <FPPushtoRotateComponent model={this} />;
  }
}

export const FPPushtoRotateComponent = ({
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

  const origin = useMemo(() => new THREE.Vector3(), []);
  const impulseVec = useMemo(() => new THREE.Vector3(), []);
  const ray = new rapier.Ray(origin, rayDir);

  useEffect(() => {
    ref.current?.lockRotations(true);
    ref.current?.lockTranslations(true);
    ref.current?.setEnabledRotations(false, true, false);
    ref.current?.setEnabledTranslations(false, true, false);
  }, []);

  useFrame(() => {
    if (!ref.current) return;

    origin.set(
      ref.current.translation().x,
      ref.current.translation().y,
      ref.current.translation().z,
    );

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
        Floating Platform push to rotate
      </Text>
      <CuboidCollider args={[2.5, 0.1, 2.5]} />
      <mesh receiveShadow castShadow>
        <boxGeometry args={[5, 0.2, 5]} />
        <meshStandardMaterial color="lightsteelblue" />
      </mesh>
    </RigidBody>
  );
};
