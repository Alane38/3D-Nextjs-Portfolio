import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import { Entity } from "../../../Entity";
import { EntityComponent } from "../../../EntityComponent";
import { RapierRigidBody } from "@react-three/rapier";
import { RefObject } from "react";
import { useWorldRigidBody } from "@/hooks/useWorldRigidBody";

/**
 * An entity class
 * 
 * @class
 * @extends Entity
 */
export class KinematicMovingPlatformEntity extends Entity {
    /**
   * Creates a new instance
   * Initializes with default values for physics and appearance
   */
  constructor() {
    super("KinematicMovingPlatform");
    this.type = "kinematicPosition";
    this.position = new Vector3(-12, 0.7, -10);
  }

  renderComponent() {
    return <KinematicMovingPlatformComponent entity={this} />;
  }
}

const KinematicMovingPlatformRenderer = ({
  instance,
  rigidBodyRef,
}: {
  instance: Entity;
  rigidBodyRef: RefObject<RapierRigidBody | null>;
}) => {
  const rigidBody = useWorldRigidBody(rigidBodyRef);

  useFrame((state) => {
    if (!rigidBody) return;

    const time = state.clock.elapsedTime;
    rigidBody.setNextKinematicTranslation({
      x: 5 * Math.sin(time / 2) + instance.position.x,
      y: instance.position.y,
      z: instance.position.z,
    });
  });

  return (
    <>
      <Text
        scale={0.5}
        color="black"
        maxWidth={10}
        textAlign="center"
        position={[0, 2.5, 0]}
      >
        Kinematic Moving Platform
      </Text>
      <mesh receiveShadow>
        <boxGeometry args={[5, 0.2, 5]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </>
  );
}

/**
 * Component responsible for rendering the entity
 *
 * @component
 * @param  {KinematicMovingPlatformComponent} entity - Contains all the default props of the entity
 * @returns {JSX.Element} The rendered 3D object
 */
export const KinematicMovingPlatformComponent = EntityComponent(
  KinematicMovingPlatformEntity,
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
      <KinematicMovingPlatformRenderer instance={instance} rigidBodyRef={rigidBodyRef} />
    );
  },
);
