import { classModelPath } from "@constants/default";
import { ModelRenderer } from "@core/Utility/ModelRenderer";
import { Entity } from "./Entity";
import { RigidBody } from "@react-three/rapier";
import { ModelRenderer } from "@core/ModelRenderer";
import { classModelPath } from "@constants/class";
import { useVideoTexture } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useMemo } from "react";
import { Entity } from "../Entity";

export class RestaurantSign extends Entity {
  constructor(path: string = classModelPath + "RestaurantSign.glb") {
    super("RestaurantSign");
    // Modify the default settings(Entity) :
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
  // Fusion of props and model
  const object = useMemo(() => {
    return { ...new RestaurantSign(), ...model, ...props };
  }, [model, props]);
  const videoTexture = useVideoTexture(
    "/assets/videos/newalfox-compressed.webm",
  );

  return (
    <RigidBody {...object}>
      <group
        onPointerDown={() =>
          object.ref.current?.applyImpulse({ x: 0, y: 20, z: 0 }, true)
        }
      >
        {/* Model */}
        <ModelRenderer path={object.path} />
        <mesh position={[-1.14, 7.3, -0.2]}>
          <boxGeometry args={[0.5, 0.4, 0.21]} />
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
