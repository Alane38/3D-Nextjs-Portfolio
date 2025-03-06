import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  CylinderCollider,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import { useRef, useMemo } from "react";
import * as THREE from "three";

export default function DynamicPlatforms() {
  const sideMovePlatformRef = useRef<RapierRigidBody>(null);
  const rotatePlatformRef = useRef<RapierRigidBody>(null);
  const rotationDrumRef = useRef<RapierRigidBody>(null);

  let time = null;
  const xRotationAxies = new THREE.Vector3(1, 0, 0);
  const yRotationAxies = new THREE.Vector3(0, 1, 0);
  const zRotationAxies = new THREE.Vector3(0, 0, 1);
  const quaternionRotation = useMemo(() => new THREE.Quaternion(), []);

  useFrame((state) => {
    time = state.clock.elapsedTime;

    // Move platform
    sideMovePlatformRef.current?.setNextKinematicTranslation({
      x: 5 * Math.sin(time / 2) - 12,
      y: 0.7,
      z: -10,
    });

    // Rotate platform
    rotatePlatformRef.current?.setNextKinematicRotation(
      quaternionRotation.setFromAxisAngle(yRotationAxies, time * 0.5),
    );

    // Rotate drum
    rotationDrumRef.current?.setNextKinematicRotation(
      quaternionRotation.setFromAxisAngle(xRotationAxies, time * 0.5),
    );
  });

  return (
    <>
      {/* Moving platform */}
      <RigidBody type="kinematicPosition" ref={sideMovePlatformRef}>
        <Text
          scale={0.5}
          color="black"
          maxWidth={10}
          textAlign="center"
          position={[0, 2.5, 0]}
        >
          Kinematic Moving Platform
        </Text>
        <mesh receiveShadow>
          <boxGeometry args={[5, 0.2, 5]} />
          <meshStandardMaterial color={"white"} />
        </mesh>
      </RigidBody>

      {/* Rotating Platform */}
      <RigidBody
        type="kinematicPosition"
        position={[-25, 1, -10]}
        ref={rotatePlatformRef}
      >
        <Text
          scale={0.5}
          color="black"
          maxWidth={10}
          textAlign="center"
          position={[0, 2.5, 0]}
        >
          Kinematic Rotating Platform
        </Text>
        <mesh receiveShadow>
          <boxGeometry args={[5, 0.2, 5]} />
          <meshStandardMaterial color={"white"} />
        </mesh>
      </RigidBody>

      {/* Rotating drum */}
      <Text
        scale={0.5}
        color="black"
        maxWidth={10}
        textAlign="center"
        position={[-15, 2.5, -15]}
      >
        Kinematic Rotating Drum
      </Text>
      <RigidBody
        colliders={false}
        type="kinematicPosition"
        position={[-15, -0.5, -15]}
        ref={rotationDrumRef}
      >
        <group rotation={[0, 0, Math.PI / 2]}>
          <CylinderCollider args={[5, 1]} />
          <mesh receiveShadow>
            <cylinderGeometry args={[1, 1, 10]} />
            <meshStandardMaterial color={"white"} />
          </mesh>
        </group>
      </RigidBody>
    </>
  );
}
