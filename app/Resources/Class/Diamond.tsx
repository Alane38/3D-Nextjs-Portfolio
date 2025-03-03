import { Entity } from "./Entity";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { ModelRenderer } from "@core/ModelRenderer";
import { useEffect } from "react";
import { classModelPath } from "@/constants/class";
import { generateUUID } from "three/src/math/MathUtils.js";

export class Diamond extends Entity {
  constructor(path: string = classModelPath + "/Diamond.glb") {
    super("Diamond");
    this.path = path;
  }
  renderComponent() {
    return <DiamondComponent model={this} />;
  }
}

export const DiamondComponent = ({ model }: { model?: Diamond }) => {
  const object = model  || new Diamond();
  return (
    <RigidBody
      ref={object.ref}
      colliders={object.colliders}
      mass={object.mass}
      position={object.position}
      scale={object.scale}
      type={object.type}
    >
      <group
        onPointerDown={() => object.applyImpulse({ x: 0, y: 10, z: 0 })}
      >
        <ModelRenderer path={object.path} />
      </group>
    </RigidBody>
  );
};
