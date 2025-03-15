import { modelPath } from "@constants/default";
import { ModelRenderer } from "@core/Utility/ModelRenderer";
import { RigidBody } from "@react-three/rapier";
import { useMemo } from "react";
import { Entity } from "../Entity";
import EntitySingleton from "../EntitySingleton";

export class NeonDoor extends Entity {
  constructor(path: string = modelPath + "NeonDoor.glb") {
    super("NeonDoor");
    // Modify the default settings(Entity) :
    this.path = path;
    this.type = "fixed";
    this.colliders = "trimesh";
  }

  renderComponent() {
    return <NeonDoorComponent model={this} />;
  }
}

export const NeonDoorComponent = ({
  model,
  ...props
}: { model?: NeonDoor } & Partial<NeonDoor>) => {
  // Fusion of props and model
  const instance = model || EntitySingleton.getInstance(NeonDoor);
  const object = useMemo(() => ({ ...instance, ...props }), [model, props]);

  return (
    <group>
      {/* NeonDoor Object */}
      <RigidBody {...object}>
        <ModelRenderer path={object.path} />
      </RigidBody>
    </group>
  );
};
