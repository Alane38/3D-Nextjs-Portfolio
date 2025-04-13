import { ModelLoader } from "@/app/playground/core/class/rendering/ModelLoader";
import { RigidBody } from "@react-three/rapier";
import { modelPath } from "src/constants/default";
import { Euler, Vector3 } from "three";
import { Entity } from "../Entity";
import { EntityComponent } from "../EntityComponent";

export class NeonDoor extends Entity {
  constructor(path: string = modelPath + "NeonDoor.glb") {
    super("NeonDoor");
    // Modify the default settings(Entity) :
    this.path = path;
    this.type = "fixed";
    this.colliders = "trimesh";
  }

  renderComponent() {
    return <NeonDoorComponent model={this} />;
  }
}

export const NeonDoorComponent = EntityComponent(NeonDoor, (object) => {

  //don't pick rotation and position from object
  object.rotation = new Euler(0, 0, 0);
  object.position = new Vector3(0, 0, 0);

  return (
    <group>
      {/* NeonDoor Object */}
      <RigidBody {...object}>
        <ModelLoader path={object.path} />
      </RigidBody>
    </group>
  );
});
