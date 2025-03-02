import { createRef } from "react";
import { RigidBody } from "@react-three/rapier";
import { Text3D, Text3DProps } from "@react-three/drei";
import { useControls } from "leva";

// font={"/fonts/FontFlemme.json"}
//         position={[0, 0, 0]}
//         size={1}
//         bevelEnabled
//         bevelThickness={textSize}

export class TextObject implements Text3DProps {
  font: string;
  position: [number, number, number];
  textSize: number;
  scale: number;
  text: string;
  ref: React.RefObject<any>;

  constructor(font: string = "/fonts/FontFlemme.json", position: [number, number, number] = [0, 0, 0], textSize: number = 1, scale: number = 1, text: string = "Text") {
    this.font = font;
    this.position = position;
    this.textSize = textSize;
    this.scale = scale;
    this.text = text;
    
    this.ref = createRef(); // Stocke la référence du RigidBody
  }

  applyForce(force: [number, number, number]) {
    if (this.ref.current) {
      this.ref.current.applyImpulse(force, true);
    }
  }

  getComponent() {
    const controls = useControls(`Text: ${this.text}`, {
      position: { value: this.position, step: 0.1 },
      textSize: { value: this.textSize, min: 0.1, max: 5, step: 0.1 },
      text: { value: this.text },
    });

    const { position, textSize, text } = controls;

    return (
      <RigidBody ref={this.ref} type="fixed" colliders="trimesh" mass={0.1} position={position} scale={this.scale}>
        <Text3D font="/fonts/FontFlemme.json" bevelEnabled bevelThickness={textSize}>
          {text}
          <meshNormalMaterial attach="material" />
        </Text3D>
      </RigidBody>
    );
  }
}
