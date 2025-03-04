import { Entity } from "./Entity";
import { RigidBody } from "@react-three/rapier";
import { ModelRenderer } from "@core/ModelRenderer";
import { classModelPath } from "@/constants/class";

export class RestaurantSign extends Entity {
  constructor(path: string = classModelPath + "RestaurantSign.glb") {
    super("RestaurantSign");
    this.path = path;
    this.scale = 0.3;
  }
  renderComponent() {
    return <RestaurantSignComponent model={this} />;
  }
}

export const RestaurantSignComponent = ({
  model,
  ...props
}: { model?: RestaurantSign } & Partial<RestaurantSign>) => {
  const object = { ...new RestaurantSign(), ...model, ...props };

  return (
    <RigidBody
      ref={object.ref}
      colliders={object.colliders}
      mass={object.mass}
      position={object.position}
      rotation={object.rotation}
      scale={object.scale}
      type={object.type}
    >
      <group
        onPointerDown={() =>
          object.ref.current?.applyImpulse({ x: 0, y: 20, z: 0 }, true)
        }
      >
        <ModelRenderer path={object.path} />
      </group>
    </RigidBody>
  );
};
