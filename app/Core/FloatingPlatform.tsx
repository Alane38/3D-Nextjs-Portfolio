import { RapierRigidBody, RigidBody, useRapier } from "@react-three/rapier";
import { useEffect, useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";

export default function FloatingPlatform() {
  // Preset
  const floatingPlateRef = useRef<RapierRigidBody>(null);
  const floatingPlateRef2 = useRef<RapierRigidBody>(null);
  const { rapier, world } = useRapier();
  const rapierWorld = world;

  /**
   * Ray setup
   */
  // Platform 1
  const rayLength = 0.8;
  const rayDir = { x: 0, y: -1, z: 0 };
  const springDirVec = useMemo(() => new THREE.Vector3(), []);
  const origin = useMemo(() => new THREE.Vector3(), []);
  const floatingDis = 0.8;
  const springK = 2.5;
  const dampingC = 0.15;
  // Platform 2
  const springDirVec2 = useMemo(() => new THREE.Vector3(), []);
  const origin2 = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    // Loack platform 1 rotation
    floatingPlateRef.current?.lockRotations(true, false);

    // Loack platform 2 translation
    floatingPlateRef2.current?.lockRotations(true, false);
    floatingPlateRef2.current?.lockTranslations(true, false);
    floatingPlateRef2.current?.setEnabledRotations(false, true, false, false);
    floatingPlateRef2.current?.setEnabledTranslations(
      false,
      true,
      false,
      false,
    );
  }, []);

  useFrame(() => {
    /**
     * Ray casting detect if on ground
     */
    // Ray cast for platform 1
    if (!floatingPlateRef.current) return;
    origin.set(
      floatingPlateRef.current.translation().x,
      floatingPlateRef.current.translation().y,
      floatingPlateRef.current.translation().z,
    );
    const rayCast = new rapier.Ray(origin, rayDir);
    const rayHit = rapierWorld.castRay(
      rayCast,
      rayLength,
      true,
      undefined,
      undefined,
      floatingPlateRef.current.collider(1),
      floatingPlateRef.current,
    );
    // Ray cast for platform 2
    origin2.set(
      floatingPlateRef2.current.translation().x,
      floatingPlateRef2.current.translation().y,
      floatingPlateRef2.current.translation().z,
    );
    const rayCast2 = new rapier.Ray(origin2, rayDir);
    const rayHit2 = rapierWorld.castRay(
      rayCast2,
      rayLength,
      true,
      null,
      null,
      floatingPlateRef2.current,
      floatingPlateRef2.current,
    );

    /**
     * Apply floating force
     */
    // Ray for platform 1
    if (rayHit) {
      if (rayHit != null) {
        const floatingForce =
          springK * (floatingDis - rayHit.timeOfImpact) -
          floatingPlateRef.current.linvel().y * dampingC;
        floatingPlateRef.current.applyImpulse(
          springDirVec.set(0, floatingForce, 0),
          true,
        );
      }
    }

    // Ray for platform 2
    if (rayHit2) {
      if (rayHit2 != null) {
        const floatingForce2 =
          springK * (floatingDis - rayHit2.timeOfImpact) -
          floatingPlateRef2.current.linvel().y * dampingC;
        floatingPlateRef2.current.applyImpulse(
          springDirVec2.set(0, floatingForce2, 0),
          true,
        );
      }
    }
  });

  return (
    <>
      {/* Platform 1 */}
      <RigidBody position={[0, 5, -10]} mass={1} ref={floatingPlateRef}>
        <Text
          scale={0.5}
          color="black"
          maxWidth={10}
          textAlign="center"
          position={[0, 2.5, 0]}
        >
          Floating Platform push to move
        </Text>
        <mesh receiveShadow>
          <boxGeometry args={[5, 0.2, 5]} />
          <meshStandardMaterial color={"lightsteelblue"} />
        </mesh>
      </RigidBody>

      {/* Platform 2 */}
      <RigidBody position={[7, 5, -10]} mass={1} ref={floatingPlateRef2}>
        <Text
          scale={0.5}
          color="black"
          maxWidth={10}
          textAlign="center"
          position={[0, 2.5, 0]}
        >
          Floating Platform push to rotate
        </Text>
        <mesh receiveShadow>
          <boxGeometry args={[5, 0.2, 5]} />
          <meshStandardMaterial color={"lightsteelblue"} />
        </mesh>
      </RigidBody>
    </>
  );
}
