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
