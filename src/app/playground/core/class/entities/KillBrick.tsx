import { Box, Text } from "@react-three/drei";
import { useState, RefObject } from "react";
import { Euler, Vector3 } from "three";
import { Entity } from "../Entity";
import { EntityComponent } from "../EntityComponent";
import { RapierRigidBody } from "@react-three/rapier";

/**
 * An entity class
 *
 * @class
 * @extends Entity
 */
export class KillBrick extends Entity {
  /** Color */
  color: string;

  /**
   * Creates a new instance
   * Initializes with default values for physics and appearance
   */
  constructor() {
    super("KillBrick");
    this.type = "dynamic";
    this.scale = [1, 1, 1];
    this.color = "red";
    this.position = new Vector3(0, 0.5, 0);
    this.rotation = new Euler(0, Math.PI, 0);
  }

  renderComponent() {
    return <KillBrickComponent entity={this} />;
  }
}

/**
 * KillBrick renderer 
 *
 * @component
 * @param {KillBrickRenderer} instance - An entity from the Entity parent
 */
const KillBrickRenderer = ({
  instance,
  rigidBodyRef,
}: {
  instance: Entity;
  rigidBodyRef: RefObject<RapierRigidBody | null>;
}) => {
  const [color, setColor] = useState(instance.color);

  instance.onCollisionEnter = ({ other }) => {
    if (other.rigidBodyObject?.name === "Player") {
      setColor("green");
    }
  };

  return (
    <>
      <Box scale={instance.scale}>
        <meshStandardMaterial attach="material" color={color} />
      </Box>

      <group ref={rigidBodyRef} position={[0, 1.5, 0]}>
        <Text scale={0.5} color="red" maxWidth={10} textAlign="center">
          Touch me to kill!
        </Text>
      </group>
    </>
  );
};

/**
 * Component responsible for rendering the entity
 *
 * @component
 * @param  {KillBrickComponent} entity - Contains all the default props of the entity
 * @returns {JSX.Element} The rendered 3D object
 */
export const KillBrickComponent = EntityComponent(
  KillBrick,
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
      <KillBrickRenderer instance={instance} rigidBodyRef={rigidBodyRef} />
    );
  },
);
