import { useWorldRigidBody } from "@/hooks/useWorldRigidBody";
import type { RayColliderHit } from "@dimforge/rapier3d-compat";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  CuboidCollider,
  RapierRigidBody,
  useRapier,
} from "@react-three/rapier";
import { RefObject, useEffect, useMemo } from "react";
import * as THREE from "three";
import { Vector3 } from "three";
import { Entity } from "../../../Entity";
import { EntityComponent } from "../../../EntityComponent";

/**
 * An entity class
 *
 * @class
 * @extends Entity
 */
export class FPPushtoMove extends Entity {
  /**
   * Creates a new instance
   * Initializes with default values for physics and appearance
   */
  constructor() {
    super("FPPushtoMove");
    this.type = "dynamic";
    this.colliders = false;
    this.position = new Vector3(0, 5, -10);
  }

  renderComponent() {
    return <FPPushtoMoveComponent entity={this} />;
  }
}

const FPPushtoMoveRenderer = ({
  instance,
  rigidBodyRef,
}: {
  instance: Entity;
  rigidBodyRef: RefObject<RapierRigidBody | null>;
}) => {
  const { world, rapier } = useRapier();

  const rigidBody = useWorldRigidBody(rigidBodyRef);

  const rayLength = 0.8;
  const rayDir = { x: 0, y: -1, z: 0 };
  const floatingDis = 0.8;
  const springK = 2.5;
  const dampingC = 0.25;

  const origin = useMemo(() => new THREE.Vector3(), []);
  const impulseVec = useMemo(() => new THREE.Vector3(), []);
  const ray = new rapier.Ray(origin, rayDir);

  useEffect(() => {
    if (!rigidBody) return;
    rigidBody.lockRotations(true, true);
  }, []);

  useFrame(() => {
    if (!rigidBody) return;

    origin.set(
      rigidBody.translation().x,
      rigidBody.translation().y,
      rigidBody.translation().z,
    );

    const hit: RayColliderHit | null = world.castRay(
      ray,
      rayLength,
      false,
      undefined,
      undefined,
      rigidBody.collider(0),
      rigidBody,
    );

    if (hit?.collider?.parent()) {
      const force =
        springK * (floatingDis - hit.timeOfImpact) -
        rigidBody.linvel().y * dampingC;
      rigidBody.applyImpulse(impulseVec.set(0, force, 0), true);
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
};

/**
 * Component responsible for rendering the entity
 *
 * @component
 * @param  {FPPushtoMoveComponent} entity - Contains all the default props of the entity
 * @returns {JSX.Element} The rendered 3D object
 */
export const FPPushtoMoveComponent = EntityComponent(
  FPPushtoMove,
  (instance, rigidBodyRef) => {
    /**
     * Renders the 3D model
     *
     * @function
     * @param {EntityComponent} EntityTemplate - A default entity class
     * @param {Ground} instance - An entity from the Entity parent
     * @param {RapierRigidBody} rigidBodyRef - Reference to the RapierRigidBody instance
     * @param {THREE.Group} visualRef - Reference to the THREE.Group instance
     */
    return (
      <FPPushtoMoveRenderer instance={instance} rigidBodyRef={rigidBodyRef} />
    );
  },
);
