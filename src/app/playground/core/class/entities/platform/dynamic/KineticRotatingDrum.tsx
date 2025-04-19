import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CylinderCollider } from "@react-three/rapier";
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
export class KinematicRotatingDrumEntity extends Entity {
    /**
   * Creates a new instance
   * Initializes with default values for physics and appearance
   */
  constructor() {
    super("KinematicRotatingDrum");
    this.type = "kinematicPosition";
    this.position = new THREE.Vector3(-15, -0.5, -15);
  }

  renderComponent() {
    return <KinematicRotatingDrumComponent entity={this} />;
  }
}

/**
 * Component responsible for rendering the entity
 *
 * @component
 * @param  {KinematicRotatingDrumComponent} entity - Contains all the default props of the entity
 * @returns {JSX.Element} The rendered 3D object
 */
export const KinematicRotatingDrumComponent = EntityComponent(
  KinematicRotatingDrumEntity,
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
    const xAxis = useMemo(() => new THREE.Vector3(1, 0, 0), []);
    const quaternion = useMemo(() => new THREE.Quaternion(), []);

    useFrame((state) => {
      const time = state.clock.elapsedTime;
      ref.current?.setNextKinematicRotation(
        quaternion.setFromAxisAngle(xAxis, time * 0.5),
      );
    });

    return (
      <>
        <Text
          scale={0.5}
          color="black"
          maxWidth={10}
          textAlign="center"
          position={[instance.position.x, 2.5, instance.position.z]}
        >
          Kinematic Rotating Drum
        </Text>
          <group rotation={[0, 0, Math.PI / 2]}>
            <CylinderCollider args={[5, 1]} />
            <mesh receiveShadow>
              <cylinderGeometry args={[1, 1, 10]} />
              <meshStandardMaterial color="white" />
            </mesh>
          </group>
      </>
    );
  },
);
