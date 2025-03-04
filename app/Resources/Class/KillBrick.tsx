import { RigidBody } from "@react-three/rapier";
import { Entity } from "./Entity";
import { Box, Text } from "@react-three/drei";
import { Euler, Vector3 } from "three";
import { useState } from "react";

export class KillBrick extends Entity {
  color: string;
  constructor() {
    super("KillBrick");
    this.type = "dynamic";
    this.scale = [1, 1, 1];
    this.rotation = new Euler(0, Math.PI, 0);
    this.color = "red";
    this.position = new Vector3(0, 0.5, 0);
  }

  renderComponent() {
    return <KillBrickComponent model={this} />;
  }
}

export const KillBrickComponent = ({
  model,
  ...props
}: { model?: KillBrick } & Partial<KillBrick>) => {
  // Fusion of props and model
  const object = { ...new KillBrick(), ...model, ...props };
  const [color, setColor] = useState(object.color);

  const playerCollision = () => {
    console.log("Collision with Player");
    setColor("green");
  };

  return (
    <RigidBody
      ref={object.ref}
      type={object.type}
      position={object.position}
      rotation={object.rotation}
      name={object.name}
      onCollisionEnter={({ manifold, target, other }) => {
        console.log(
          "Collision at world position ",
          manifold.solverContactPoint(0),
        );

        if (other.rigidBodyObject) {
          console.log(
            target.rigidBodyObject?.name,
            " collided with ",
            other.rigidBodyObject.name,
          );

          if (other.rigidBodyObject.name === "Player") {
            playerCollision();
          }
        }
      }}
    >
      <Text
        scale={0.5}
        color="red"
        maxWidth={10}
        textAlign="center"
        position={[0, 2.5, 0]}
      >
        Touch me to kill !
      </Text>

      <Box scale={object.scale}>
        <meshStandardMaterial attach="material" color={color} />
      </Box>
    </RigidBody>
  );
};
