import { defaultFont } from "@constants/default";
import { Text3D  } from "@react-three/drei";
import { RigidBody, RigidBodyOptions } from "@react-three/rapier";
import { useMemo } from "react";
import { Entity } from "../Entity";
import { TextProps } from "@type/TextProps";

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
    return <TextObjectComponent model={this} />;
  }
}

export const TextObjectComponent = ({
  model,
  ...props
}: { model?: TextObject } & Partial<TextObject>) => {
  const object = useMemo(() => {
    return { ...new TextObject(), ...model, ...props };
  }, [model, props]);

  return (
    <RigidBody {...object}>
      <Text3D
        font={object.TextProps.font || defaultFont}
        position={object.position}
        size={object.TextProps.size}
        bevelEnabled
      >
        {object.TextProps.text}
        <meshNormalMaterial attach="material" />
      </Text3D>
    </RigidBody>
  );
};
