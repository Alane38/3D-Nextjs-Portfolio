import { Text3DProps } from "@/types/Text3DProps";
import { Text3D } from "@react-three/drei";
import { RigidBody, RigidBodyOptions } from "@react-three/rapier";

export class NewalText {
  Text3DProps: Text3DProps;

  constructor(
    textSize: number = 0.1,
    text: string = "Newal",
    type: RigidBodyOptions["type"] = "fixed",
    colliders: RigidBodyOptions["colliders"] = "trimesh",
    mass: number = 1,
    scale: number = 1,
    position: [number, number, number] = [50, 20, 0],
    font: string = "/fonts/FontFlemme.json",
    size: number = 1,
  ) {
    this.Text3DProps = {
      textSize,
      text,
      type,
      colliders,
      mass,
      scale,
      position,
      font,
      size,
      bevelEnabled: true,
      bevelThickness: textSize,
    };
  }

  getComponent() {
    const {
      textSize,
      text,
      type,
      colliders,
      mass,
      scale,
      position,
      font,
      size,
    } = this.Text3DProps;

    return (
      <RigidBody
        type={type}
        colliders={colliders}
        mass={mass}
        scale={scale}
        position={position}
      >
        <Text3D
          font={font}
          position={position}
          size={size}
          bevelEnabled
          bevelThickness={textSize}
        >
          {text}
          <meshNormalMaterial attach="material" />
        </Text3D>
      </RigidBody>
    );
  }
}

export default NewalText;
