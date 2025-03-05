import { RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { ModelRenderer } from "@core/ModelRenderer";
import { classModelPath } from "@/constants/class";
import { Entity } from "./Entity";
import { useMemo, useRef } from "react";

export class Diamond extends Entity {
  constructor(path: string = classModelPath + "Diamond.glb") {
    super("Diamond");
    // Modify the default settings(Entity) : 
    this.path = path;
    this.type = "dynamic";
  }

  renderComponent() {
    return <DiamondComponent model={this} />;
  }
}

export const DiamondComponent = ({
  model,
  ...props
}: { model?: Diamond } & Partial<Diamond>) => {
  // Memoize the Diamond object to avoid recreation on every render
  const object = useMemo(() => {
    return { ...new Diamond(), ...model, ...props };
  }, [model, props]);

  // Store time value in a ref to keep it stable across frames
  const timeRef = useRef(0);
  const groupRef = object.groupRef;

  useFrame(() => {
    if (groupRef.current) {
      // Update position and rotation based on time
      timeRef.current += 0.02;
      groupRef.current.position.y = Math.sin(timeRef.current * 2) * 0.07; // Floating motion
      groupRef.current.rotation.y += 0.01; 
    }
  });

  return (
    <RigidBody {...object}>
      <group
        ref={groupRef} // Attach groupRef to the group element
        onPointerDown={() =>
          object.ref.current?.applyImpulse({ x: 0, y: 20, z: 0 }, true)
        }
      >
        {/* Model */}
        <ModelRenderer path={object.path} />
      </group>
    </RigidBody>
  );
};
