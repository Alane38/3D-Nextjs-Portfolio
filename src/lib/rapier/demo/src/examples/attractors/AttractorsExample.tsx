import { Html, Sphere } from "@react-three/drei";
import {
    InstancedRigidBodies,
    interactionGroups,
    RapierRigidBody,
    RigidBody,
} from "@react-three/rapier";
import { Attractor } from "@react-three/rapier-addons";
import { useRef } from "react";
import { useResetOrbitControls } from "../../hooks/use-reset-orbit-controls";

const BALLS = 100;

export const AttractorExample = () => {
  const api = useRef<RapierRigidBody[]>(null);

  useResetOrbitControls(40);

  return (
    <group>
      <InstancedRigidBodies
        ref={api}
        instances={Array.from({ length: BALLS }, (_, i) => ({
          key: i,
          position: [Math.floor(i / 30) * 1, (i % 30) * 0.5, 0],
        }))}
        colliders={"ball"}
      >
        <instancedMesh args={[undefined, undefined, BALLS]} castShadow>
          <sphereGeometry args={[1]} />
          <meshPhysicalMaterial
            roughness={0.5}
            metalness={0.5}
            color={"green"}
          />
        </instancedMesh>
      </InstancedRigidBodies>

      <RigidBody
        position={[-21, 50, 0]}
        colliders="ball"
        collisionGroups={interactionGroups(1)}
      >
        <Sphere />
        <Html>Nested Attractor</Html>
        <Attractor strength={4} collisionGroups={interactionGroups(1, 2)} />
      </RigidBody>

      <group position={[20, 0, 0]}>
        <Attractor range={20} strength={-2} />
        <Html>Repeller</Html>
      </group>

      <group position={[-20, 0, 0]}>
        <Attractor range={20} strength={10} />
        <Html>Attractor</Html>
      </group>
    </group>
  );
};
