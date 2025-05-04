import { ModelLoader } from "@/app/playground/core/class/rendering/ModelLoader";
import { modelPath } from "src/constants/default";
import { Entity } from "../Entity";
import { EntityComponent } from "../EntityComponent";

/**
 * An entity class
 * 
 * @class
 * @extends Entity
 */
export class NeonDoor extends Entity {
  /**
   * Creates a new instance
   * Initializes with default values for physics and appearance
   */
  constructor(path: string = modelPath + "NeonDoor.glb") {
    super("NeonDoor");
    this.path = path;
    this.type = "fixed";
    this.colliders = "trimesh";
  }

  renderComponent() {
    return <NeonDoorComponent entity={this} />;
  }
}

/**
 * Component responsible for rendering the entity
 *
 * @component
 * @param  {NeonDoorComponent} entity - Contains all the default props of the entity
 * @returns {JSX.Element} The rendered 3D object
 */
export const NeonDoorComponent = EntityComponent(NeonDoor, (instance) => {
    /** 
   * Renders the 3D model
   * 
   * @function
   * @param {EntityComponent} EntityTemplate - A default entity class
   * @param {Ground} instance - An entity from the Entity parent
   * @param {RapierRigidBody} rigidBodyRef - Reference to the RapierRigidBody instance
   * @param {THREE.Group} visualRef - Reference to the THREE.Group instance
   */
  return (
    <group>
      <ModelLoader path={instance.path} />
    </group>
  );
});
