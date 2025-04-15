import { vectorArrayToVector3 } from "@/lib/rapier/react-three-rapier/src/utils/utils";
import { modelPath } from "src/constants/default";
import { Entity } from "../Entity";
import { EntityComponent } from "../EntityComponent";
import { ModelLoader } from "../rendering/ModelLoader";
import { BallSpring } from "./Spring";

export class Diamond extends Entity {
  /**
   * Indicates whether the diamond is spring-attached.
   * When enabled, it alters the physics behavior of the entity.
   */
  springed?: boolean;

  /**
   * Constructs a Diamond entity.
   * @param {string} [path=modelPath + "Diamond.glb"] - Path to the .glb 3D model file.
   */
  constructor(path: string = modelPath + "Diamond.glb") {
    super("Diamond");
    this.path = path;
    this.type = "dynamic";
    this.springed = false;

    // Lock translations if not springed
    this.lockTranslations = !this.springed;

    // Enable specific rotation axes depending on spring state
    this.enabledRotations = this.springed
      ? [true, false, true] // Y-axis rotation locked
      : [true, true, true]; // All rotations enabled
  }

  /**
   * Renders the associated React component for this entity.
   * @returns {JSX.Element} The React component representing the diamond.
   */
  renderComponent() {
    return <DiamondComponent objectProps={this} />;
  }
}

/**
 * If `springed` is true, attaches a fixed spring to it.
 *
 * @component
 * @param {Diamond} object - An entity from the Entity parent.
 * @param {Diamond} rigidBodyRef - Reference to the RapierRigidBody instance.
 * @returns {JSX.Element}
 */
export const DiamondComponent = EntityComponent(Diamond, (object) => {
  return (
    <>
      {object.springed && (
        <BallSpring
          type="fixed"
          position={vectorArrayToVector3([0, 5, 0])}
          mass={1}
          jointNum={0}
          total={30}
        />
      )}
      <ModelLoader path={object.path} />
    </>
  );
});
