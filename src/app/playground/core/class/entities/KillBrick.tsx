import { Box, Text } from "@react-three/drei";
import { useState, RefObject } from "react";
import { Euler, Vector3 } from "three";
import { Entity } from "../Entity";
import { EntityComponent } from "../EntityComponent";
import { RapierRigidBody } from "@react-three/rapier";

type KillBrickProps = {
  instance: Entity;
  rigidBodyRef: RefObject<RapierRigidBody | null>;
};

export class KillBrick extends Entity {
  color: string;
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

// Composant stable contenant vos hooks
const KillBrickRenderer   = ({ instance, rigidBodyRef }: KillBrickProps) => {
  const [color, setColor] = useState(instance.color);
  
  // Assigner onCollisionEnter à l'instance
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

// Utilisez ce composant stable dans EntityComponent
export const KillBrickComponent = EntityComponent(
  KillBrick,
  (instance, rigidBodyRef) => {
    return <KillBrickRenderer  instance={instance} rigidBodyRef={rigidBodyRef} />;
  },
);