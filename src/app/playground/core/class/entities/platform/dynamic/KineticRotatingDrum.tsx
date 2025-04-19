import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CylinderCollider } from "@react-three/rapier";
import { useMemo } from "react";
import * as THREE from "three";
import { Entity } from "../../../Entity";
import { EntityComponent } from "../../../EntityComponent";

export class KinematicRotatingDrumEntity extends Entity {
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
 * Renders the 3D model.
 *
 * @component
 * @param {KinematicRotatingDrumEntity} instance - An entity from the Entity parent.
 * @param {KinematicRotatingDrumEntity} rigidBodyRef - Reference to the RapierRigidBody instance.
 * @returns {JSX.Element}
 */
export const KinematicRotatingDrumComponent = EntityComponent(
  KinematicRotatingDrumEntity,
  (instance, rigidBodyRef) => {
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
