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

/**
 * Renders the 3D model.
 *
 * @component
 * @param {Object} object - An entity from the Entity parent.
 * @param {Object} rigidBodyRef - Reference to the RapierRigidBody instance.
 * @returns {JSX.Element}
 */
export const ObjectComponent = EntityComponent(Object, (object) => {
  return (
    <>
      {/* Model */}
      <ModelLoader path={object.path} />
    </>
  );
});
