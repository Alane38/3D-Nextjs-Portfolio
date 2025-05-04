import { Text3D } from "@react-three/drei";
import { RigidBodyOptions } from "@react-three/rapier";
import { defaultFont } from "src/constants/default";
import { Entity } from "../Entity";
import { EntityComponent } from "../EntityComponent";

/**
 * An entity class
 * 
 * @class
 * @extends Entity
 */
export class TextObject extends Entity {
  /** Text properties */
  TextProps: {
    /** The text to display */
    text: string;
    /** Font of the text */
    font?: string;
    /** Size of the text */
    size?: number;
  };

  /**
   * Creates a new instance
   * Initializes with default values for text rendering
   */
  constructor(type: RigidBodyOptions["type"] = "fixed") {
    super("Text");
    this.type = type;
    this.TextProps = {
      text: "Text",
      size: 1,
    };
  }

  renderComponent() {
    return <TextObjectComponent entity={this} />;
  }
}

/**
 * Component responsible for rendering the entity
 *
 * @component
 * @param  {TextObjectComponent} entity - Contains all the default props of the entity
 * @returns {JSX.Element} The rendered 3D object
 */
export const TextObjectComponent = EntityComponent(TextObject, (instance) => {
  /** 
   * Renders the 3D model
   * 
   * @function
   * @param {EntityComponent} EntityTemplate - A default entity class
   * @param {TextObject} instance - An entity from the Entity parent
   * @param {RapierRigidBody} rigidBodyRef - Reference to the RapierRigidBody instance
   */
  return (
    <Text3D
      font={instance.TextProps.font || defaultFont}
      position={instance.position}
      size={instance.TextProps.size}
      bevelEnabled
    >
      {instance.TextProps.text}
      <meshNormalMaterial attach="material" />
    </Text3D>
  );
});
