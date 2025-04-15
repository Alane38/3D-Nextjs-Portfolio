import { Box, Text } from "@react-three/drei";
import { useState } from "react";
import { Euler, Vector3 } from "three";
import { Entity } from "../Entity";
import { EntityComponent } from "../EntityComponent";

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
    return <KillBrickComponent objectProps={this} />;
  }
}

export const KillBrickComponent = EntityComponent(
  KillBrick,
  (object, rigidBodyRef) => {
    const [color, setColor] = useState(object.color);

    // Add a function to the object
    object.onCollisionEnter = ({ other }) => {
      if (other.rigidBodyObject?.name === "Player") {
        setColor("green"); // React state update
      }
    };

    return (
      <>
        <Box scale={object.scale}>
          <meshStandardMaterial attach="material" color={color} />
        </Box>

        <group ref={rigidBodyRef} position={[0, 1.5, 0]}>
          <Text scale={0.5} color="red" maxWidth={10} textAlign="center">
            Touch me to kill!
          </Text>
        </group>
      </>
    );
  },
);
