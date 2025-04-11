import { RigidBody } from "@react-three/rapier";
import { useMemo } from "react";
import { Entity } from "../Entity";
import EntitySingleton from "../EntitySingleton";

export class Steps extends Entity {
  constructor() {
    super("Steps");
    this.type = "fixed";
    this.colliders = "cuboid";
  }

  renderComponent() {
    return <StepsComponent model={this} />;
  }
}

export const StepsComponent = ({
  model,
  ...props
}: { model?: Steps } & Partial<Steps>) => {
  const instance = model || EntitySingleton.getInstance(Steps);
  const stepData = useMemo(() => ({ ...instance, ...props }), [model, props]);

  return (
    <>
      {[5, 6, 7, 8].map((z, index) => (
        <RigidBody key={index} type={stepData.type} position={[0, 0, z]}>
          <mesh receiveShadow>
            <boxGeometry args={[4, 0.2, 0.2]} />
            <meshStandardMaterial color={"lightpink"} />
          </mesh>
        </RigidBody>
      ))}
      <RigidBody type={stepData.type} position={[0, 0, 11]}>
        <mesh receiveShadow>
          <boxGeometry args={[4, 0.2, 4]} />
          <meshStandardMaterial color={"lightpink"} />
        </mesh>
      </RigidBody>
    </>
  );
};
