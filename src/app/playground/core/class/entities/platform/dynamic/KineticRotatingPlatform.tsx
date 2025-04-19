import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { Entity } from "../../../Entity";
import { EntityComponent } from "../../../EntityComponent";

/**
 * An entity class
 * 
 * @class
 * @extends Entity
 */
export class KinematicRotatingPlatformEntity extends Entity {
    /**
   * Creates a new instance
   * Initializes with default values for physics and appearance
   */
  constructor() {
    super("KinematicRotatingPlatform");
    this.type = "kinematicPosition";
    this.position = new THREE.Vector3(-25, 1, -10);
  }

  renderComponent() {
    return <KinematicRotatingPlatformComponent entity={this} />;
  }
}

/**
 * Component responsible for rendering the entity
 *
 * @component
 * @param  {KinematicRotatingPlatformComponent} entity - Contains all the default props of the entity
 * @returns {JSX.Element} The rendered 3D object
 */
export const KinematicRotatingPlatformComponent = EntityComponent(
  KinematicRotatingPlatformEntity,
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
    const ref = rigidBodyRef;
    const yAxis = useMemo(() => new THREE.Vector3(0, 1, 0), []);
    const quaternion = useMemo(() => new THREE.Quaternion(), []);

    useFrame((state) => {
      const time = state.clock.elapsedTime;
      ref.current?.setNextKinematicRotation(
        quaternion.setFromAxisAngle(yAxis, time * 0.5),
      );
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
          Kinematic Rotating Platform
        </Text>
        <mesh receiveShadow>
          <boxGeometry args={[5, 0.2, 5]} />
          <meshStandardMaterial color="white" />
        </mesh>
      </>
    );
  },
);
