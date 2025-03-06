import { classModelPath } from "@constants/default";
import { BallSpring } from "@core/Element/Objects/Spring";
import { ModelRenderer } from "@core/Utility/ModelRenderer";
import { vectorArrayToVector3 } from "@packages/rapier/react-three-rapier/src/utils/utils";
import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, quat, euler, RigidBody } from "@react-three/rapier";
import { useMemo, useRef } from "react";
import { Object3D } from "three";
import { Entity } from "../Entity";

export class Diamond extends Entity {
  springed?: boolean;
  constructor(path: string = classModelPath + "Diamond.glb") {
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
  const object = useMemo(
    () => ({ ...new Diamond(), ...model, ...props }),
    [model, props],
  );

  const timeRef = useRef<number>(0);
  const groupRef = useRef<Object3D>(null);
  const globalGroupRef = useRef<Object3D>(null);
  const diamondRef = useRef<RapierRigidBody>(object.ref.current!);

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
        enabledRotations={
          !object.springed ? [true, true, true] : [true, false, true]
        }
        lockTranslations={!object.springed && true}
        {...object}
        ref={diamondRef}
      >
        <group
          ref={groupRef}
          onPointerDown={() =>
            diamondRef.current?.applyImpulse({ x: 0, y: 20, z: 0 }, true)
          }
        >
          <ModelRenderer path={object.path} />
        </group>
      </RigidBody>

      {/* <Attractor range={0.03} strength={3} /> */}
    </group>
  );
};
