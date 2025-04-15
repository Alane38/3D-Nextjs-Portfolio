import { ModelLoader } from "@/app/playground/core/class/rendering/ModelLoader";
import { modelPath } from "src/constants/default";
import { Entity } from "../Entity";
import { EntityComponent } from "../EntityComponent";

export class Object extends Entity {
  constructor() {
    super("Object");
    // Modify default settings of Entity:
    this.path = modelPath + "Demo.glb";
    this.type = "fixed";
    this.colliders = "trimesh";
  }
  renderComponent() {
    return <ObjectComponent objectProps={this} />;
  }
}

export const ObjectComponent = EntityComponent(Object, (object) => {
  return (
    <>
      {/* Model */}
      <ModelLoader path={object.path} />
    </>
  );
});
