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
export class Stairs extends Entity {
  /**
   * Creates a new instance
   * Initializes with default values for physics and appearance
   */
  constructor(path: string = modelPath + "Stairs.glb") {
    super("Stairs");
    this.path = path;
    this.type = "fixed";
  }
  renderComponent() {
    return <StairsComponent entity={this} />;
  }
}

/**
 * Component responsible for rendering the entity
 *
 * @component
 * @param  {StairsComponent} entity - Contains all the default props of the entity
 * @returns {JSX.Element} The rendered 3D object
 */
export const StairsComponent = EntityComponent(Stairs, (instance) => {
  /** 
   * Renders the 3D model
   * 
   * @function
   * @param {EntityComponent} EntityTemplate - A default entity class
   * @param {Stairs} instance - An entity from the Entity parent
   * @param {RapierRigidBody} rigidBodyRef - Reference to the RapierRigidBody instance
   * @param {THREE.Group} visualRef - Reference to the THREE.Group instance
   */
  return (
    <group>
      {/* Model */}
      <ModelLoader path={instance.path} />
    </group>
  );
});
