import { Box } from "@react-three/drei";
import { Entity } from "../Entity";
import { EntityComponent } from "../EntityComponent";

export class Ground extends Entity {
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
