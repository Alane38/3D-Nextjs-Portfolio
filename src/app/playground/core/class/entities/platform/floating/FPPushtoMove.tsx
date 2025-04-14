import type { RayColliderHit } from "@dimforge/rapier3d-compat";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CuboidCollider, useRapier } from "@react-three/rapier";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { Vector3 } from "three";
import { Entity } from "../../../Entity";
import { EntityComponent } from "../../../EntityComponent";

// Floating Platform : Push to move
export class FPPushtoMove extends Entity {
  constructor() {
    super("FPPushtoMove");
    this.type = "dynamic";
    this.colliders = false;
    this.position = new Vector3(0, 5, -10);
  }

  renderComponent() {
    return <FPPushtoMoveComponent model={this} />;
  }
}

export const FPPushtoMoveComponent = EntityComponent(
  FPPushtoMove,
  (object, rigidBodyRef) => {
    const { world, rapier } = useRapier();
    const ref = rigidBodyRef;

    const rayLength = 0.8;
    const rayDir = { x: 0, y: -1, z: 0 };
    const floatingDis = 0.8;
    const springK = 2.5;
    const dampingC = 0.15;

    const origin = useMemo(() => new THREE.Vector3(), []);
    const impulseVec = useMemo(() => new THREE.Vector3(), []);
    const ray = new rapier.Ray(origin, rayDir);

    useEffect(() => {
      ref.current?.lockRotations(true, true);
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
        ref.current?.collider(0),
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
      <>
        <Text
          scale={0.5}
          color="black"
          position={[0, 2.5, 0]}
          maxWidth={10}
          textAlign="center"
        >
          Floating Platform push to move
        </Text>
        <CuboidCollider args={[2.5, 0.1, 2.5]} />
        <mesh receiveShadow castShadow>
          <boxGeometry args={[5, 0.2, 5]} />
          <meshStandardMaterial color="lightsteelblue" />
        </mesh>
      </>
    );
  },
);
