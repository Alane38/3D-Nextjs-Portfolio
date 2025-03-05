import { Entity } from "./Entity";
import { RigidBody } from "@react-three/rapier";
import { ModelRenderer } from "@core/ModelRenderer";
import { classModelPath } from "@/constants/class";
import { useVideoTexture } from "@react-three/drei";
import { useMemo } from "react";

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
  const object = useMemo(() => {
    return { ...new RestaurantSign(), ...model, ...props };
  }, [model, props]);
  const videoTexture = useVideoTexture("/assets/videos/newalfox-compressed.webm");

  return (
    <RigidBody {...object}>
      <group
        onPointerDown={() =>
          object.ref.current?.applyImpulse({ x: 0, y: 20, z: 0 }, true)
        }
      >
        <ModelRenderer path={object.path} />
        <mesh position={[0, 1, 0]}>
          <boxGeometry args={[2.5, 1.5, 0.2]} />
          <meshStandardMaterial color="black" />
        </mesh>
        <mesh position={[0, 4.35, -0.7]} rotation={[0.14, 3.15, 0]}>
          <planeGeometry args={[2.8, 6.2]} />
          <meshBasicMaterial map={videoTexture} />
        </mesh>
      </group>
    </RigidBody>
  );
};
