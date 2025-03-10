import { modelPath } from "@constants/default";
import { ModelRenderer } from "@core/Utility/ModelRenderer";
import { RigidBody } from "@react-three/rapier";
import { useMemo } from "react";
import { Entity } from "../Entity";

export class Object extends Entity {
  constructor(path: string = modelPath + "Object.glb") {
    super("Object");
    // Modify the default settings(Entity) :
    this.path = path;
    this.type = "fixed";
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
