import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CylinderCollider, RigidBody } from "@react-three/rapier";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Entity } from "../../../Entity";
import EntitySingleton from "../../../EntitySingleton";

export class KinematicRotatingDrumEntity extends Entity {
  constructor() {
    super("KinematicRotatingDrum");
    this.type = "kinematicPosition";
    this.position = new THREE.Vector3(-15, -0.5, -15);
    this.colliders = false;
  }

  renderComponent() {
    return <KinematicRotatingDrumComponent model={this} />;
  }
}

export const KinematicRotatingDrumComponent = ({
  model,
  ...props
}: { model?: KinematicRotatingDrumEntity } & Partial<KinematicRotatingDrumEntity>) => {
  const instance = model || EntitySingleton.getInstance(KinematicRotatingDrumEntity);
  const object = useMemo(() => ({ ...instance, ...props }), [model, props]);

  const ref = useRef<any>(null);
  const xAxis = useMemo(() => new THREE.Vector3(1, 0, 0), []);
  const quaternion = useMemo(() => new THREE.Quaternion(), []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    ref.current?.setNextKinematicRotation(
      quaternion.setFromAxisAngle(xAxis, time * 0.5),
    );
  });

  return (
    <>
      <Text scale={0.5} color="black" maxWidth={10} textAlign="center" position={[object.position.x, 2.5, object.position.z]}>
        Kinematic Rotating Drum
      </Text>
      <RigidBody ref={ref} {...object}>
        <group rotation={[0, 0, Math.PI / 2]}>
          <CylinderCollider args={[5, 1]} />
          <mesh receiveShadow>
            <cylinderGeometry args={[1, 1, 10]} />
            <meshStandardMaterial color="white" />
          </mesh>
        </group>
      </RigidBody>
    </>
  );
};
