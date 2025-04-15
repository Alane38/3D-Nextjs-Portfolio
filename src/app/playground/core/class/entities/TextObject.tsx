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
