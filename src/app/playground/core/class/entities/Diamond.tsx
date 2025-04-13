import { vectorArrayToVector3 } from "@/lib/rapier/react-three-rapier/src/utils/utils";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import { modelPath } from "src/constants/default";
import { createEntityComponent } from "../createEntityComponent";
import { Entity } from "../Entity";
import { ModelLoader } from "../rendering/ModelLoader";
import { BallSpring } from "./Spring";

export class Diamond extends Entity {
  springed?: boolean;
  constructor(path: string = modelPath + "Diamond.glb") {
    super("Diamond");
    // Modify the default settings(Entity) :
    this.path = path;
    this.type = "dynamic";
    this.springed = false;
  }

  renderComponent() {
    return <DiamondComponent model={this} />;
  }
}

export const DiamondComponent = createEntityComponent(Diamond, (object) => {
  const diamondRef = useRef<RapierRigidBody>(null);

  return (
    <>
      {object.springed && (
        <BallSpring
          type="fixed"
          // ref={groupRef}
          position={vectorArrayToVector3([0, 5, 0])}
          mass={1}
          jointNum={0}
          total={30}
        />
      )}

      <RigidBody
        ref={diamondRef}
        enabledRotations={
          !object.springed ? [true, true, true] : [true, false, true]
        }
        lockTranslations={!object.springed && true}
      >
        <ModelLoader path={object.path} />
      </RigidBody>
    </>
  );
});
