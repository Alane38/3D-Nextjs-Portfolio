import { Box } from "@react-three/drei";
import { Entity } from "../Entity";
import { EntityComponent } from "../EntityComponent";

export class Ground extends Entity {
    /**
   * Add custom entity Props
   * @param {string} color - Color of the ground
   * @param {string} depth - Depth of the ground
   */
  color: string;
  depth: number;
  constructor() {
    super("Ground");
    // Modify the default settings(Entity) :
    this.type = "fixed";
    this.colliders = "cuboid";
    this.scale = 50;
    this.depth = 0.01;
    this.color = "black";
  }

  renderComponent() {
    return <GroundComponent objectProps={this}/>;
  }
}

/**
 * Renders the 3D model.
 *
 * @component
 * @param {Ground} object - An entity from the Entity parent.
 * @param {Ground} rigidBodyRef - Reference to the RapierRigidBody instance.
 * @returns {JSX.Element}
 */
export const GroundComponent = EntityComponent(Ground, (object) => {
  return (
    // Body
    <>
      {/* Ground Mesh */}
      <Box
        args={[
          typeof object.scale === "number" ? object.scale : 1,
          typeof object.depth === "number" ? object.depth : 0.1,
          typeof object.scale === "number" ? object.scale : 1,
        ]}
      >
        <meshStandardMaterial attach="material" color={object.color} />
      </Box>
    </>
  );
});
