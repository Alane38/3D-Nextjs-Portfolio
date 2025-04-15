import { ModelLoader } from "@/app/playground/core/class/rendering/ModelLoader";
import { modelPath } from "src/constants/default";
import { Entity } from "../Entity";
import { EntityComponent } from "../EntityComponent";

export class Stairs extends Entity {
        /**
   * Constructs a Killbrick entity.
   * @param {string} [path=modelPath + "NeonDoor.glb"] - Path to the .glb 3D model file.
   */
  constructor(path: string = modelPath + "Stairs.glb") {
    super("Stairs");
    // Modify the default settings(Entity) :
    this.path = path;
    this.type = "fixed";
  }
  renderComponent() {
    return <StairsComponent objectProps={this} />;
  }
}

/**
 * Renders the 3D model.
 *
 * @component
 * @param {Stairs} object - An entity from the Entity parent.
 * @param {Stairs} rigidBodyRef - Reference to the RapierRigidBody instance.
 * @returns {JSX.Element}
 */
export const StairsComponent = EntityComponent(Stairs, (object) => {
  return (
    <group>
      {/* Model */}
      <ModelLoader path={object.path} />
    </group>
  );
});
