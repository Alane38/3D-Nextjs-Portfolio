import { classModelPath } from "@/constants/class";
import { ModelRenderer } from "@core/ModelRenderer";
import { RigidBody } from "@react-three/rapier";
import { Entity } from "./Entity";

export class Diamond extends Entity {
  path: string
  constructor(
    path: string = classModelPath + "/Diamond.glb",
  ) {
    super("Diamond");
    this.path = path
  }

  // Render method for the diamond component
  renderComponent() {
    return <DiamondComponent model={this} />;
  }
}

export const DiamondComponent = ({ model }: { model: Diamond }) => {
  const object = model || new Diamond();
  return (
    <RigidBody
      ref={object.ref}
      colliders={object.colliders}
      mass={object.mass}
      position={object.position}
      scale={object.scale}
      type={object.type}
    >
      <group
        onPointerDown={() => object.applyImpulse({ x: 0, y: 1000, z: 100 })}
      >
        <ModelRenderer path={object.path} />
      </group>
    </RigidBody>
  );
};