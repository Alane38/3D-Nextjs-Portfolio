import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useMemo, useRef } from "react";
import { Vector3 } from "three";
import { Entity } from "../../../Entity";
import EntitySingleton from "../../../EntitySingleton";

export class KinematicMovingPlatformEntity extends Entity {
  constructor() {
    super("KinematicMovingPlatform");
    this.type = "kinematicPosition";
    this.position = new Vector3(-12, 0.7, -10);
  }

  renderComponent() {
    return <KinematicMovingPlatformComponent model={this} />;
  }
}

export const KinematicMovingPlatformComponent = ({
  model,
  ...props
}: { model?: KinematicMovingPlatformEntity } & Partial<KinematicMovingPlatformEntity>) => {
  const instance = model || EntitySingleton.getInstance(KinematicMovingPlatformEntity);
  const object = useMemo(() => ({ ...instance, ...props }), [model, props]);

  const ref = useRef<any>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    ref.current?.setNextKinematicTranslation({
      x: 5 * Math.sin(time / 2) + object.position.x,
      y: object.position.y,
      z: object.position.z,
    });
  });

  return (
    <RigidBody ref={ref} {...object} >
      <Text scale={0.5} color="black" maxWidth={10} textAlign="center" position={[0, 2.5, 0]}>
        Kinematic Moving Platform
      </Text>
      <mesh receiveShadow>
        <boxGeometry args={[5, 0.2, 5]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </RigidBody>
  );
};
