import { vectorArrayToVector3 } from "@/lib/rapier/react-three-rapier/src/utils/utils";
import { modelPath } from "src/constants/default";
import { Entity } from "../Entity";
import { EntityComponent } from "../EntityComponent";
import { ModelLoader } from "../rendering/ModelLoader";
import { BallSpring } from "./Spring";

export class Diamond extends Entity {
  springed?: boolean;
  constructor(path: string = modelPath + "Diamond.glb") {
    super("Diamond");
    this.path = path;
    this.type = "dynamic";
    this.springed = false;
    this.lockTranslations = !this.springed 
    this.enabledRotations = this.springed
      ? [true, false, true]
      : [true, true, true];
  }

  renderComponent() {
    return <DiamondComponent objectProps={this} />;
  }
}

export const DiamondComponent = EntityComponent(Diamond, (object) => {
  return (
    <>
      {object.springed && (
        <BallSpring
          type="fixed"
          position={vectorArrayToVector3([0, 5, 0])}
          mass={1}
          jointNum={0}
          total={30}
        />
      )}
      <ModelLoader path={object.path} />
    </>
  );
});