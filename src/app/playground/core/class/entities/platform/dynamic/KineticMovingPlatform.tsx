import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import { Entity } from "../../../Entity";
import { EntityComponent } from "../../../EntityComponent";

export class KinematicMovingPlatformEntity extends Entity {
  constructor() {
    super("KinematicMovingPlatform");
    this.type = "kinematicPosition";
    this.position = new Vector3(-12, 0.7, -10);
  }

  renderComponent() {
    return <KinematicMovingPlatformComponent objectProps={this} />;
  }
}

/**
 * Renders the 3D model.
 *
 * @component
 * @param {KinematicMovingPlatformEntity} object - An entity from the Entity parent.
 * @param {KinematicMovingPlatformEntity} rigidBodyRef - Reference to the RapierRigidBody instance.
 * @returns {JSX.Element}
 */
export const KinematicMovingPlatformComponent = EntityComponent(
  KinematicMovingPlatformEntity,
  (object, rigidBodyRef) => {
    useFrame((state) => {
      const time = state.clock.elapsedTime;
      rigidBodyRef.current?.setNextKinematicTranslation({
        x: 5 * Math.sin(time / 2) + object.position.x,
        y: object.position.y,
        z: object.position.z,
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
  },
);
