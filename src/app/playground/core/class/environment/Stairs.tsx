import { ModelLoader } from "@/app/playground/core/class/rendering/ModelLoader";
import { modelPath } from "src/constants/default";
import { Entity } from "../Entity";
import { EntityComponent } from "../EntityComponent";

/**
 * An entity class
 *
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
 * @param   {Stairs} instance - The instance that contains the properties of the entity
 * @returns {JSX.Element} The rendered 3D object
 */
export const StairsComponent = EntityComponent(Stairs, (instance) => {
  return (
    <group>
      {/* Model */}
      <ModelLoader path={instance.path} />
    </group>
  );
});
