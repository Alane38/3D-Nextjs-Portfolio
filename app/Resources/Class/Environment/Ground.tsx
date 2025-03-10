import { RigidBody } from "@react-three/rapier";
import { Box, Plane } from "@react-three/drei";
import { Euler } from "three";
import { useMemo } from "react";
import { Entity } from "../Entity";
import EntitySingleton from "../EntitySingleton";

export class Ground extends Entity {
  color: string;
  args: [number, number, number];
  depth: number;
  constructor() {
    super("Ground");
    // Modify the default settings(Entity) :
    this.type = "fixed";
    this.colliders = "cuboid";
    this.scale = 100;
    this.depth = 0.1;
    this.args = [this.scale, this.depth, this.scale];
    this.color = "black";
  }

  renderComponent() {
    return <GroundComponent model={this} />;
  }
}
export const GroundComponent = ({
  model,
  ...props
}: { model?: Ground } & Partial<Ground>) => {
  // Fusion of props and model
  const instance = model || EntitySingleton.getInstance(Ground);
  const object = useMemo(() => ({ ...instance, ...props }), [model, props]);

  return (
    // Body
    <RigidBody
      type={object.type}
      position={object.position}
      rotation={object.rotation}
      name={object.name}
      colliders={object.colliders}
    >
      {/* Ground Mesh */}
      <Box args={object.args}>
        <meshStandardMaterial attach="material" color={object.color} />
      </Box>
    </RigidBody>
  );
};
