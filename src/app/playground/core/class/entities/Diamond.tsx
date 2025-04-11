import { vectorArrayToVector3 } from "@/lib/rapier/react-three-rapier/src/utils/utils";
import { useFrame } from "@react-three/fiber";
import { euler, quat, RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useMemo, useRef } from "react";
import { modelPath } from "src/constants/default";
import { Object3D } from "three";
import { Entity } from "../Entity";
import EntitySingleton from "../EntitySingleton";
import { BallSpring } from "./Spring";
import { ModelLoader } from "../rendering/ModelLoader";

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

export const DiamondComponent = ({
  model,
  ...props
}: { model?: Diamond } & Partial<Diamond>) => {
  // Fusion of props and model
  const instance = model || EntitySingleton.getInstance(Diamond);
  const object = useMemo(() => ({ ...instance, ...props }), [model, props]);

  const groupRef = useRef<Object3D>(null);
  const diamondRef = useRef<RapierRigidBody>(null);

  useFrame(() => {
    if (!groupRef.current || object.springed) return;
    let rot = performance.now() / 1000;
    groupRef.current!.setRotationFromQuaternion(
      quat().setFromEuler(euler({ x: 0, y: rot, z: 0 })),
    );

    groupRef.current!.position.y = Math.sin(rot * 2) * 0.07;
    groupRef.current!.rotation.y += 0.01;
  });

  return (
    <group>
      {/* <mesh
        position={[object.position.x, object.position.y + 2, object.position.z]}
      >
        <RigidBody type="fixed" collisionGroups={interactionGroups(2)}>
          <Attractor
            strength={5}
            range={2}
            collisionGroups={interactionGroups(2, 2)}
          />
        </RigidBody>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="white" wireframe />
      </mesh> */}
      {/* Fixed Anchor Point */}
      {object.springed && (
        <BallSpring
          type="fixed"
          ref={diamondRef}
          position={vectorArrayToVector3([0, 5, 0])}
          mass={1}
          jointNum={0}
          total={30}
        />
      )}

      {/* Diamond Object */}
      <RigidBody
        ref={diamondRef}
        enabledRotations={
          !object.springed ? [true, true, true] : [true, false, true]
        }
        lockTranslations={!object.springed && true}
        {...object}
      >
        <group
          ref={groupRef}
          onPointerDown={() =>
            diamondRef.current?.applyImpulse({ x: 0, y: 20, z: 0 }, true)
          }
        >
          <ModelLoader path={object.path} />
        </group>
      </RigidBody>

      {/* <Attractor range={0.03} strength={3} /> */}
    </group>
  );
};
