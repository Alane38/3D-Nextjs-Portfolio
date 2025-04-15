import { ModelLoader } from "@/app/playground/core/class/rendering/ModelLoader";
import { modelPath } from "src/constants/default";
import { Entity } from "../Entity";
import { EntityComponent } from "../EntityComponent";

export class NeonDoor extends Entity {
  constructor(path: string = modelPath + "NeonDoor.glb") {
    super("NeonDoor");
    // Modify the default settings(Entity) :
    this.path = path;
    this.type = "fixed";
    this.colliders = "trimesh";
  }

  renderComponent() {
    return <NeonDoorComponent objectProps={this} />;
  }
}

export const NeonDoorComponent = EntityComponent(NeonDoor, (object) => {
  return (
    <group>
      {/* NeonDoor Object */}
        <ModelLoader path={object.path} />
    </group>
  );
});
