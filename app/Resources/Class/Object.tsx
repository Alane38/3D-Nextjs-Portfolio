import { Entity } from "./Entity";
import { RigidBody } from "@react-three/rapier";
import { ModelRenderer } from "@core/ModelRenderer";
import { classModelPath } from "@/constants/class";

export class Object extends Entity {
  constructor(path: string = classModelPath + "Entity.glb") {
    super("Entity");
    // Modify the default settings(Entity) :
    this.path = path;
    this.type = "dynamic";
  }
  renderComponent() {
    return <ObjectComponent model={this} />;
  }
}

export const ObjectComponent = ({
  model,
  ...props
}: { model?: Object } & Partial<Object>) => {
  // Fusion of props and model
  const object = { ...new Object(), ...model, ...props };

  return (
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
