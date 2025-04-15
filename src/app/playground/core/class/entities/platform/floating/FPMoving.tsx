import type { RayColliderHit } from "@dimforge/rapier3d-compat";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CuboidCollider, useRapier } from "@react-three/rapier";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Entity } from "../../../Entity";
import { EntityComponent } from "../../../EntityComponent";

export class FPMoving extends Entity {
  constructor() {
    super("FloatingMovingPlatform");
    this.type = "dynamic";
    this.colliders = false;
    this.position = new THREE.Vector3(0, 5, -17);
  }

  renderComponent() {
    return <FPMovingComponent objectProps={this} />;
  }
}

/**
 * Renders the 3D model.
 *
 * @component
 * @param {FPMoving} object - An entity from the Entity parent.
 * @param {FPMoving} rigidBodyRef - Reference to the RapierRigidBody instance.
 * @returns {JSX.Element}
 */
export const FPMovingComponent = EntityComponent(
  FPMoving,
  (object, rigidBodyRef) => {
    const { world, rapier } = useRapier();
    const ref = rigidBodyRef;

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

    const movingDir = useRef(1);

    useEffect(() => {
      ref.current?.setEnabledRotations(false, true, false, false);
      ref.current?.setEnabledTranslations(true, true, false, false);
    }, []);

    useFrame(() => {
      if (!ref.current) return;

      // Update movement direction
      const x = ref.current.translation().x;
      if (x > 10) movingDir.current = -1;
      if (x < -5) movingDir.current = 1;

      ref.current.setLinvel(
        movingVel.set(movingDir.current * moveSpeed, ref.current.linvel().y, 0),
        false,
      );

      // Apply floating force
      origin.set(x, ref.current.translation().y, ref.current.translation().z);
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
          Floating & Moving Platform (rigidbody)
        </Text>
        <CuboidCollider args={[1.25, 0.1, 1.25]} />
        <mesh receiveShadow castShadow>
          <boxGeometry args={[2.5, 0.2, 2.5]} />
          <meshStandardMaterial color="lightsteelblue" />
        </mesh>
      </>
    );
  },
);
