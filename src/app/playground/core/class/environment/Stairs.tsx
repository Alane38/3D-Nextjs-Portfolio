import { ModelLoader } from "@/app/playground/core/class/rendering/ModelLoader";
import { RigidBody } from "@react-three/rapier";
import { useMemo } from "react";
import { modelPath } from "src/constants/default";
import { Entity } from "../Entity";
import EntityManager from "../EntityManager";
import { EntityComponent } from "../EntityComponent";

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

export const StairsComponent = EntityComponent(Stairs, (object) => {
  return (
    <group>
      {/* Model */}
      <ModelLoader path={object.path} />
    </group>
  );
});
