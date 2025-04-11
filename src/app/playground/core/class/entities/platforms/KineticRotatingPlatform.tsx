import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Entity } from "../../Entity";
import EntitySingleton from "../../EntitySingleton";

export class KinematicRotatingPlatformEntity extends Entity {
  constructor() {
    super("KinematicRotatingPlatform");
    this.type = "kinematicPosition";
    this.position = new THREE.Vector3(-25, 1, -10);
  }

  renderComponent() {
    return <KinematicRotatingPlatformComponent model={this} />;
  }
}

export const KinematicRotatingPlatformComponent = ({
  model,
  ...props
}: { model?: KinematicRotatingPlatformEntity } & Partial<KinematicRotatingPlatformEntity>) => {
  const instance = model || EntitySingleton.getInstance(KinematicRotatingPlatformEntity);
  const object = useMemo(() => ({ ...instance, ...props }), [model, props]);

  const ref = useRef<any>(null);
  const yAxis = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const quaternion = useMemo(() => new THREE.Quaternion(), []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    ref.current?.setNextKinematicRotation(
      quaternion.setFromAxisAngle(yAxis, time * 0.5),
    );
  });

  return (
    <RigidBody ref={ref} {...object}>
      <Text scale={0.5} color="black" maxWidth={10} textAlign="center" position={[0, 2.5, 0]}>
        Kinematic Rotating Platform
      </Text>
      <mesh receiveShadow>
        <boxGeometry args={[5, 0.2, 5]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </RigidBody>
  );
};
