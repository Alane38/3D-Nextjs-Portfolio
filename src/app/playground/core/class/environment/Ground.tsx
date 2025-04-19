import { Box } from "@react-three/drei";
import { Entity } from "../Entity";
import { EntityComponent } from "../EntityComponent";

/**
 * An entity class
 * 
 * @class
 * @extends Entity
 */
export class Ground extends Entity {
  /** Color */
  color: string;
  
  /** Thickness/depth */
  depth: number;
  
  /**
   * Creates a new instance
   * Initializes with default values for physics and appearance
   */
  constructor() {
    super("Ground");
    this.type = "fixed";
    this.colliders = "cuboid";
    this.scale = 50;
    this.depth = 0.01;
    this.color = "black";
  }

  renderComponent() {
    return <GroundComponent entity={this} />;
  }
}

/**
 * Component responsible for rendering the entity
 *
 * @component
 * @param  {GroundComponent} entity - Contains all the default props of the entity
 * @returns {JSX.Element} The rendered 3D object
 */
export const GroundComponent = EntityComponent(Ground, (instance) => {
  /** 
   * Renders the 3D model
   * 
   * @function
   * @param {EntityComponent} EntityTemplate - A default entity class
   * @param {Ground} instance - An entity from the Entity parent
   * @param {RapierRigidBody} rigidBodyRef - Reference to the RapierRigidBody instance
   * @param {THREE.Group} visualRef - Reference to the THREE.Group instance
   */
  return (
    <>
      <Box
        args={[
          typeof instance.scale === "number" ? instance.scale : 1,
          typeof instance.depth === "number" ? instance.depth : 0.1,
          typeof instance.scale === "number" ? instance.scale : 1,
        ]}
      >
        <meshStandardMaterial attach="material" color={instance.color} />
      </Box>
    </>
  );
});