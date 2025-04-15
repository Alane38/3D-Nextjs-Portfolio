import { Entity } from "../Entity";
import { EntityComponent } from "../EntityComponent";

export class Steps extends Entity {
  constructor() {
    super("Steps");
    this.type = "fixed";
    this.colliders = "cuboid";
  }

  renderComponent() {
    return <StepsComponent objectProps={this} />;
  }
}

/**
 * Renders the 3D model.
 *
 * @component
 * @param {Steps} object - An entity from the Entity parent.
 * @param {Steps} rigidBodyRef - Reference to the RapierRigidBody instance.
 * @returns {JSX.Element}
 */
export const StepsComponent = EntityComponent(Steps, (object, rigidBodyRef) => {
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
