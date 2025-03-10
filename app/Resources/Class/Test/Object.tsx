import { modelPath } from "@constants/default";
import { ModelRenderer } from "@core/Utility/ModelRenderer";
import { RigidBody } from "@react-three/rapier";
import { useMemo } from "react";
import { Entity } from "../Entity";
import EntitySingleton from "../EntitySingleton";

export class Object extends Entity {
  constructor() {
    super("Object");
    // Modify default settings of Entity:
    this.path = modelPath + "Object.glb";
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
  const instance = model || EntitySingleton.getInstance(Object);
  const object = useMemo(() => ({ ...instance, ...props }), [model, props]);

  return (
    <RigidBody {...object}>
      {/* Model */}
      <ModelRenderer path={object.path} />
    </RigidBody>
  );
};
