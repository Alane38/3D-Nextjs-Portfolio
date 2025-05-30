import { useGLTF } from "@react-three/drei";
import { ThreeElements, useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody, RigidBodyProps } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import { Mesh } from "three";
import { GLTF } from "three-stdlib";
import { useResetOrbitControls } from "../../hooks/use-reset-orbit-controls";
import { useSuzanne } from "../all-shapes/AllShapesExample";

type GroupProps = ThreeElements["group"];

const useBendy = () => {
  return useGLTF(
    new URL("../../3d/glb/bendy.glb", import.meta.url).toString(),
  ) as unknown as GLTF & {
    nodes: {
      BezierCurve: Mesh;
    };
  };
};

const Monkae = ({
  onDead,
  ...props
}: RigidBodyProps & {
  onDead: (pos: { x: number; y: number; z: number }) => void;
}) => {
  const {
    nodes: { Suzanne },
  } = useSuzanne();

  const monmon = useRef<RapierRigidBody>(null);

  useFrame(() => {
    if (monmon.current && monmon.current.translation().y < -10) {
      onDead(monmon.current.translation());
    }
  });

  return (
    <RigidBody {...props} type="dynamic" ref={monmon} colliders="hull">
      <mesh geometry={Suzanne.geometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          ior={1.5}
          transmission={0}
          thickness={0.2}
          roughness={0}
          color={"orange"}
        />
      </mesh>
    </RigidBody>
  );
};

const Emitter = (props: GroupProps & { time?: number }) => {
  const [monkaes, setMonkaes] = useState<
    { key: number; position: [number, number, number] }[]
  >(() => []);

  const removeMonkae = (id: number) => {
    setMonkaes((monkaes) => monkaes.filter((monkae) => monkae.key !== id));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setMonkaes((monkaes) => [
        ...monkaes,
        {
          key: Math.random(),
          position: [
            Math.random() * 10 - 5,
            Math.random(),
            Math.random() * 10 - 5,
          ],
        },
      ]);
    }, props.time || 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <group {...props}>
      {monkaes.map((m, i) => (
        <Monkae
          key={m.key}
          position={m.position}
          onDead={() => removeMonkae(m.key)}
        />
      ))}
    </group>
  );
};

const Bendy = (props: GroupProps) => {
  const { nodes } = useBendy();

  return (
    <group {...props}>
      <RigidBody colliders={"trimesh"} type="fixed">
        <mesh geometry={nodes.BezierCurve.geometry} castShadow>
          <meshPhysicalMaterial
            ior={1.5}
            transmission={0.99}
            thickness={2}
            roughness={0}
            color={"orange"}
          />
        </mesh>
      </RigidBody>
    </group>
  );
};

export const PerformanceExample = () => {
  useResetOrbitControls(15);

  return (
    <group>
      <Bendy position={[0, 0, 0]} />
      <Bendy position={[0, 0, 4]} scale={0.5} />
      <Bendy position={[-3, 0, 2]} scale={0.5} />

      <Emitter time={50} scale={0.3} position={[0, 4, 0]} />
    </group>
  );
};
