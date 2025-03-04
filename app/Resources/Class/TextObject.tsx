import { Text3D } from "@react-three/drei";
import { RigidBody, RigidBodyOptions } from "@react-three/rapier";
import { Entity } from "./Entity";
import { Text3DProps } from "@/types/TextProps";
import { defaultFont } from "@/constants/default";

export class TextObject extends Entity {
  TextProps: Text3DProps;
  constructor(type: RigidBodyOptions["type"] = "fixed") {
    super("Main Text");
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

export const TextObjectComponent = ({ model, ...props }: { model?: TextObject } & Partial<TextObject>) => {
   const object = { ...new TextObject(), ...model, ...props };

  return (
    <RigidBody
      ref={object.ref}
      type={object.type}
      colliders={object.colliders}
      mass={object.mass}
      scale={object.scale}
      position={object.position}
      rotation={object.rotation}
    >
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
