import { RigidBody } from "@react-three/rapier";
import { Entity } from "./Entity";
import { Plane } from "@react-three/drei";

export class Ground extends Entity {
  constructor() {
    super("Ground");
    this.scale = 100;
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
