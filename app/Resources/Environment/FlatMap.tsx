import { useGLTF } from "@react-three/drei";
import { RigidBody, RigidBodyOptions } from "@react-three/rapier";
import { GLBProps } from "@/types/GLBProps";
import { ModelRenderer } from "@/app/Core/ModelRenderer";
import { createRef } from "react";

export class FlatMap {
  GLBProps: GLBProps;
  ref: React.RefObject<any>;

  constructor(
    path: string = "/flatmat2.glb",
    position: [number, number, number] = [0, 0, 0],
    mass: number = 1,
    type: RigidBodyOptions["type"] = "fixed",
    colliders: RigidBodyOptions["colliders"] = "trimesh",
    scale: number = 1,
  ) {
    this.ref = createRef();

    this.GLBProps = {
      path,
      position,
      mass,
      type,
      colliders,
      scale,
    };
  }

  getComponent() {
    const { path, position, mass, type, colliders, scale } = this.GLBProps;
    return (
      <RigidBody
        type={type}
        colliders={colliders}
        mass={mass}
        scale={scale}
        position={position}
        ref={this.ref}
      >
        <group>
          <ModelRenderer path={path} />
        </group>
      </RigidBody>
    );
  }
}
