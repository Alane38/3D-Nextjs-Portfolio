import { ModelLoader } from "@/app/playground/core/class/rendering/ModelLoader";
import { useVideoTexture } from "@react-three/drei";
import { modelPath } from "src/constants/default";
import { Entity } from "../Entity";
import { EntityComponent } from "../EntityComponent";

/**
 * An entity class
 * 
 * @class
 * @extends Entity
 */
export class RestaurantSign extends Entity {
  /**
   * Creates a new instance
   * Initializes with default 3D model and scale
   */
  constructor(path: string = modelPath + "RestaurantSign.glb") {
    super("RestaurantSign");
    this.path = path;
    this.scale = 0.3;
  }

  renderComponent() {
    return <RestaurantSignComponent entity={this} />;
  }
}

/**
 * Component responsible for rendering the entity
 *
 * @component
 * @param  {RestaurantSignComponent} entity - Contains all the default props of the entity
 * @returns {JSX.Element} The rendered 3D object
 */
export const RestaurantSignComponent = EntityComponent(
  RestaurantSign,
  (instance) => {
    /** 
     * Renders the 3D model
     * 
     * @function
     * @param {EntityComponent} EntityTemplate - A default entity class
     * @param {RestaurantSign} instance - An entity from the Entity parent
     * @param {RapierRigidBody} rigidBodyRef - Reference to the RapierRigidBody instance
     */
    const videoTexture = useVideoTexture(
      "/assets/videos/newalfox-compressed.webm",
    );

    return (
      <group>
        <ModelLoader path={instance.path} />
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
