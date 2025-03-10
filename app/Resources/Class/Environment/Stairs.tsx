import { modelPath } from "@constants/default";
import { ModelRenderer } from "@core/Utility/ModelRenderer";
import { RigidBody } from "@react-three/rapier";
import { useMemo } from "react";
import { Entity } from "../Entity";

export class Stairs extends Entity {
  constructor(path: string = modelPath + "Stairs.glb") {
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
