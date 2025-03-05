import { RigidBody } from "@react-three/rapier";
import { Entity } from "./Entity";
import { Plane } from "@react-three/drei";
import { Euler } from "three";
import { useMemo } from "react";

export class Ground extends Entity {
  color: string;
  constructor() {
    super("Ground");
    this.type = "fixed";
    this.scale = 100;
    this.rotation = new Euler(Math.PI * 1.5, 0, 0); // Math.PI * 1.5 = degtoRad(270)
    this.color = "black";
  }

  renderComponent() {
    return <GroundComponent model={this} />;
  }
}
export const GroundComponent = ({
  model,
  ...props
}: { model?: Ground } & Partial<Ground>) => {
  // Fusion of props and model
  const object = useMemo(() => {
    return { ...new Ground(), ...model, ...props };
  }, [model, props]);

  return (
    <RigidBody
      type={object.type}
      position={object.position}
      rotation={object.rotation}
      name={object.name}
    >
      <Plane scale={object.scale}>
        <meshStandardMaterial attach="material" color={object.color} />
      </Plane>
    </RigidBody>
  );
};
