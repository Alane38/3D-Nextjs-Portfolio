import { Entity } from "./Entity";
import { RigidBody } from "@react-three/rapier";
import { ModelRenderer } from "@core/ModelRenderer";
import { classModelPath } from "@/constants/class";

export class Test extends Entity {
  constructor(path: string = classModelPath + "Car.glb") {
    super("Tokyo");
    this.path = path;
    this.scale = 0.5;
    this.type = "fixed";
    this.position.set(20, 0, 0);
  }
  renderComponent() {
    return <TestComponent model={this} />;
  }
}

export const TestComponent = ({ model }: { model?: Test }) => {
  const object = model || new Test();
  return (
    <RigidBody
      ref={object.ref}
      colliders={object.colliders}
      mass={object.mass}
      position={object.position}
      scale={object.scale}
      type={object.type}
    >
      <group onPointerDown={() => object.applyImpulse({ x: 0, y: 20, z: 0 })}>
        <ModelRenderer path={object.path} />
      </group>
    </RigidBody>
  );
};
