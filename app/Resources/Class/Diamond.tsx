import { Entity } from "./Entity";
import { RigidBody } from "@react-three/rapier";
import { ModelRenderer } from "@core/ModelRenderer";
import { classModelPath } from "@/constants/class";

export class Diamond extends Entity {
  constructor(path: string = classModelPath + "Diamond.glb") {
    super("Diamond");
    // Modify the default settings(Entity) : 
    this.path = path;
    this.type = "dynamic";
  }
  renderComponent() {
    return <DiamondComponent model={this} />;
  }
}

export const DiamondComponent = ({
  model,
  ...props
}: { model?: Diamond } & Partial<Diamond>) => {
  // Fusion of props and model
  const object = { ...new Diamond(), ...model, ...props };

  return (
    // Body
    <RigidBody
      ref={object.ref}
      colliders={object.colliders}
      mass={object.mass}
      position={object.position}
      rotation={object.rotation}
      scale={object.scale}
      type={object.type}
    >
      <group
        onPointerDown={() =>
          object.ref.current?.applyImpulse({ x: 0, y: 20, z: 0 }, true)
        }
      >
        {/* Model */}
        <ModelRenderer path={object.path} />
      </group>
    </RigidBody>
  );
};
