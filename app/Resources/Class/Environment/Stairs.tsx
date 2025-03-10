import { modelPath } from "@constants/default";
import { ModelRenderer } from "@core/Utility/ModelRenderer";
import { RigidBody } from "@react-three/rapier";
import { useMemo } from "react";
import { Entity } from "../Entity";
import EntitySingleton from "../EntitySingleton";

export class Stairs extends Entity {
  constructor(path: string = modelPath + "Stairs.glb") {
    super("Stairs");
    // Modify the default settings(Entity) :
    this.path = path;
    this.type = "fixed";
  }
  renderComponent() {
    return <StairsComponent model={this} />;
  }
}

export const StairsComponent = ({
  model,
  ...props
}: { model?: Stairs } & Partial<Stairs>) => {
  // Fusion of props and model
  const instance = model || EntitySingleton.getInstance(Stairs);
  const object = useMemo(() => ({ ...instance, ...props }), [model, props]);

  return (
    <RigidBody {...object}>
      <group>
        {/* Model */}
        <ModelRenderer path={object.path} />
      </group>
    </RigidBody>
  );
};
