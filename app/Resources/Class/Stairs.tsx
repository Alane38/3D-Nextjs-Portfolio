import { Entity } from "./Entity";
import { RigidBody } from "@react-three/rapier";
import { ModelRenderer } from "@core/ModelRenderer";
import { classModelPath } from "@/constants/class";
import { useMemo } from "react";

export class Stairs extends Entity {
  constructor(path: string = classModelPath + "Stairs.glb") {
    super("Stairs");
    // Modify the default settings(Entity) :
    this.path = path;
    this.type = "fixed";
  }
  renderComponent() {
    return <StairsComponent model={this} />;
  }
}

export const StairsComponent = ({
  model,
  ...props
}: { model?: Stairs } & Partial<Stairs>) => {
  const object = useMemo(() => {
    return { ...new Stairs(), ...model, ...props };
  }, [model, props]);

  return (
    <RigidBody {...object}>
      <group
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
