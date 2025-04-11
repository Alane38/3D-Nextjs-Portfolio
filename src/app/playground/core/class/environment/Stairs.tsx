import { ModelLoader } from "@/app/playground/core/class/rendering/ModelLoader";
import { RigidBody } from "@react-three/rapier";
import { useMemo } from "react";
import { modelPath } from "src/constants/default";
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
        <ModelLoader path={object.path} />
      </group>
    </RigidBody>
  );
};
