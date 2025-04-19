import { ModelLoader } from "@/app/playground/core/class/rendering/ModelLoader";
import { modelPath } from "src/constants/default";
import { Entity } from "../Entity";
import { EntityComponent } from "../EntityComponent";

export class NeonDoor extends Entity {
  /**
   * Constructs a NeonDoor entity.
   * @param {string} [path=modelPath + "NeonDoor.glb"] - Path to the .glb 3D model file.
   */
  constructor(path: string = modelPath + "NeonDoor.glb") {
    super("NeonDoor");

    // Define fixed physics type and trimesh collider
    this.path = path;
    this.type = "fixed";
    this.colliders = "trimesh";
  }

  /**
   * Renders the associated React component for this entity.
   * @returns {JSX.Element} The React component representing the neon door.
   */
  renderComponent() {
    return <NeonDoorComponent entity={this} />;
  }
}

/**
 * Renders the 3D model.
 *
 * @component
 * @param {NeonDoor} instance - An entity from the Entity parent.
 * @param {NeonDoor} rigidBodyRef - Reference to the RapierRigidBody instance.
 * @returns {JSX.Element}
 */
export const NeonDoorComponent = EntityComponent(NeonDoor, (instance) => {
  return (
    <group>
      <ModelLoader path={instance.path} />
    </group>
  );
});
