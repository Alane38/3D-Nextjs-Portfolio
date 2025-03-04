import { RigidBody } from "@react-three/rapier";
import { Entity } from "./Entity";
import { Plane } from "@react-three/drei";
import { Euler } from "three";

export class Ground extends Entity {
  color: string;
  constructor() {
    super("Ground");
    // Modify the default settings(Entity) :
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
  const object = { ...new Ground(), ...model, ...props };

  return (
    // Body
    <RigidBody
      type={object.type}
      position={object.position}
      rotation={object.rotation}
      name={object.name}
    >
      {/* Ground Mesh */}
      <Plane scale={object.scale}>
        <meshStandardMaterial attach="material" color={object.color} />
      </Plane>
    </RigidBody>
  );
};
