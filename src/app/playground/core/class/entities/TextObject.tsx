import { Text3D } from "@react-three/drei";
import { RigidBodyOptions } from "@react-three/rapier";
import { defaultFont } from "src/constants/default";
import { Entity } from "../Entity";
import { EntityComponent } from "../EntityComponent";

// Basic Type for Text3D
interface TextProps {
  text: string;
  font?: string;
  size?: number;
}

export class TextObject extends Entity {
      /**
   * Add custom entity Props 
   * @param {string} text - text
   * @param {string} font - Font of the text
   * @param {number} size - Size of the text
   */
  TextProps: TextProps;
  constructor(type: RigidBodyOptions["type"] = "fixed") {
    super("Text");
    this.type = type;
    this.TextProps = {
      text: "Text",
      size: 1,
    };
  }
  renderComponent() {
    return <TextObjectComponent objectProps={this} />;
  }
}

/**
 * Renders the 3D model.
 *
 * @component
 * @param {Steps} object - An entity from the Entity parent.
 * @param {Steps} rigidBodyRef - Reference to the RapierRigidBody instance.
 * @returns {JSX.Element}
 */
export const TextObjectComponent = EntityComponent(TextObject, (object) => {
  return (
      <Text3D
        font={object.TextProps.font || defaultFont}
        position={object.position}
        size={object.TextProps.size}
        bevelEnabled
      >
        {object.TextProps.text}
        <meshNormalMaterial attach="material" />
      </Text3D>
  );
});
