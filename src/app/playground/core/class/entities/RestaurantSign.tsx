import { ModelLoader } from "@/app/playground/core/class/rendering/ModelLoader";
import { useVideoTexture } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useMemo } from "react";
import { modelPath } from "src/constants/default";
import { Entity } from "../Entity";
import EntitySingleton from "../EntitySingleton";

export class RestaurantSign extends Entity {
  constructor(path: string = modelPath + "RestaurantSign.glb") {
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
  const instance = model || EntitySingleton.getInstance(RestaurantSign);
  const object = useMemo(() => ({ ...instance, ...props }), [model, props]);

  const videoTexture = useVideoTexture(
    "/assets/videos/newalfox-compressed.webm",
  );

  return (
    <RigidBody {...object}>
      <group>
        {/* Model */}
        <ModelLoader path={object.path} />
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
