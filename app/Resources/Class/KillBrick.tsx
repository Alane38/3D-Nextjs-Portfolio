import { RapierRigidBody, RigidBody, RigidBodyOptions } from "@react-three/rapier";
import { Entity } from "./Entity";
import { Box } from "@react-three/drei";
import { Euler, Vector3 } from "three";
import { useState } from "react";

export class KillBrick extends Entity {
  color: string;
  constructor() {
    super("KillBrick");
    this.type = "dynamic";
    this.scale = [1, 1, 1];
    this.rotation = new Euler(Math.PI * 1.5, 0, 0); // Math.PI * 1.5 = degtoRad(270)
    this.color = "red";
    this.position = new Vector3(0, 0.5, 0);
  }

  renderComponent() {
    return <KillBrickComponent model={this} />;
  }
}

export const KillBrickComponent = ({ model }: { model?: KillBrick }) => {
    const object = model || new KillBrick();
    
    const [color, setColor] = useState(object.color);

  const playerCollision = () => {
    console.log("Collision with Player");
    if (object.ref.current) {
        object.ref.current.setBodyType(1, true);
    }
    // Change color to green
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
      <Box scale={object.scale}>
        {/* Utilisation de la couleur dynamique */}
        <meshStandardMaterial attach="material" color={color} />
      </Box>
    </RigidBody>
  );
};
