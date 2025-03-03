import { RigidBody } from "@react-three/rapier";
import { Entity } from "./Entity";
import { Plane } from "@react-three/drei";
import { Euler } from "three";

export class Ground extends Entity {
  constructor() {
    super("Ground");
    this.scale = 100;
    this.rotation = new Euler(Math.PI / 2, 0, 0);
  }

  renderComponent() {
    return <GroundComponent model={this} />;
  }
}
export const GroundComponent = ({ model }: { model?: Ground }) => {
  const object = model || new Ground();

  return (
    <RigidBody
      type="fixed"
      position={object.position}
      rotation={object.rotation}
    >
      <Plane scale={object.scale}>
        <meshStandardMaterial attach="material" color={"black"} />
      </Plane>
    </RigidBody>
  );
};
