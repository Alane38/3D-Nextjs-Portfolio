import { Entity } from "./Entity";
import { RigidBody } from "@react-three/rapier";
import { ModelRenderer } from "@core/ModelRenderer";
import { classModelPath } from "@/constants/class";
import { useMemo } from "react";

export class Object extends Entity {
  constructor(path: string = classModelPath + "Object.glb") {
    super("Object");
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
  const object = useMemo(() => {
    return { ...new Object(), ...model, ...props };
  }, [model, props]);

  return (
    <RigidBody {...object}>
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
