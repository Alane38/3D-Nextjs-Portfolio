import { Entity } from "../Entity";
import { EntityComponent } from "../EntityComponent";

/**
 * An entity class
 * 
 * @class
 * @extends Entity
 */
export class Steps extends Entity {
  /**
   * Creates a new instance
   * Initializes with default collider settings
   */
  constructor() {
    super("Steps");
    this.type = "fixed";
    this.colliders = "cuboid";
  }

  renderComponent() {
    return <StepsComponent entity={this} />;
  }
}

/**
 * Component responsible for rendering the entity
 *
 * @component
 * @param  {StepsComponent} entity - Contains all the default props of the entity
 * @returns {JSX.Element} The rendered 3D object
 */
export const StepsComponent = EntityComponent(Steps, () => {
  /** 
   * Renders the 3D model
   * 
   * @function
   * @param {EntityComponent} EntityTemplate - A default entity class
   * @param {Steps} instance - An entity from the Entity parent
   * @param {RapierRigidBody} rigidBodyRef - Reference to the RapierRigidBody instance
   */
  return (
    <>
      {[5, 6, 7, 8].map((_, i) => (
        <mesh key={i} receiveShadow>
          <boxGeometry args={[4, 0.2, 0.2]} />
          <meshStandardMaterial color={"lightpink"} />
        </mesh>
      ))}
      <mesh receiveShadow>
        <boxGeometry args={[4, 0.2, 4]} />
        <meshStandardMaterial color={"lightpink"} />
      </mesh>
    </>
  );
});
