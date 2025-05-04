import { vectorArrayToVector3 } from "@/lib/rapier/react-three-rapier/src/utils/utils";
import { modelPath } from "src/constants/default";
import { Entity } from "../Entity";
import { EntityComponent } from "../EntityComponent";
import { ModelLoader } from "../rendering/ModelLoader";
import { BallSpring } from "./Spring";

/**
 * An entity class
 *
 * @class
 * @extends Entity
 */
export class Diamond extends Entity {
  /** Whether the diamond is spring-attached */
  springed?: boolean;

  /**
   * Creates a new instance
   * Initializes with default values for physics and appearance
   */
  constructor(path: string = modelPath + "Diamond.glb") {
    super("Diamond");
    this.path = path;
    this.type = "dynamic";
    this.springed = false;
    this.lockTranslations = !this.springed;
    this.enabledRotations = this.springed
      ? [true, false, true]
      : [true, true, true];
  }

  renderComponent() {
    return <DiamondComponent entity={this} />;
  }
}

/**
 * Component responsible for rendering the entity
 *
 * @component
 * @param  {DiamondComponent} entity - Contains all the default props of the entity
 * @returns {JSX.Element} The rendered 3D object
 */
export const DiamondComponent = EntityComponent(Diamond, (instance) => {
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
    <>
      {instance.springed && (
        <BallSpring
          type="fixed"
          position={vectorArrayToVector3([0, 5, 0])}
          mass={1}
          jointNum={0}
          total={30}
        />
      )}
      <ModelLoader path={instance.path} />
    </>
  );
});
