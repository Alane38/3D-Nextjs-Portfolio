import { ModelLoader } from "@/app/playground/core/class/rendering/ModelLoader";
import { useVideoTexture } from "@react-three/drei";
import { modelPath } from "src/constants/default";
import { Entity } from "../Entity";
import { EntityComponent } from "../EntityComponent";

export class RestaurantSign extends Entity {
      /**
   * Constructs a Killbrick entity.
   * @param {string} [path=modelPath + "NeonDoor.glb"] - Path to the .glb 3D model file.
   */
  constructor(path: string = modelPath + "RestaurantSign.glb") {
    super("RestaurantSign");
    // Modify the default settings(Entity) :
    this.path = path;
    this.scale = 0.3;
  }
  renderComponent() {
    return <RestaurantSignComponent objectProps={this} />;
  }
}

/**
 * Renders the 3D model.
 *
 * @component
 * @param {RestaurantSign} object - An entity from the Entity parent.
 * @param {RestaurantSign} rigidBodyRef - Reference to the RapierRigidBody instance.
 * @returns {JSX.Element}
 */
export const RestaurantSignComponent = EntityComponent(
  RestaurantSign,
  (object, rigidBodyRef) => {
    const videoTexture = useVideoTexture(
      "/assets/videos/newalfox-compressed.webm",
    );

    return (
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
    );
  },
);
