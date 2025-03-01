"use client";

import { Canvas as ThreeCanvas } from "@react-three/fiber";
import { OrbitControls, Sky, useGLTF } from "@react-three/drei";
import { useControls } from "leva";
import { Physics, useBox, usePlane, useTrimesh } from "@react-three/cannon";
import * as THREE from "three";
import { Suspense, useEffect, useMemo, useRef } from "react";
// import { Diamond } from "./Model";

const Box = ({
  onCollide,
  position,
  mass = 1,
  args = [2, 2, 2],
  wireframe = false,
  isTrigger = false,
  opacity = 1,
  type = "Static",
  ref2=null
}: any) => {
  const [ref] = useBox(() => ({
    isTrigger,
    mass,
    args,
    position,
    onCollide,
    type,
  }));

  useEffect(() => {
    if (ref.current) {
     console.log("Box", ref.current.scale)
    }
  }, [wireframe, opacity]);

  return (
    <mesh ref={ref2 || ref} position={position} castShadow={opacity > 0}>
      <boxGeometry args={args} />
      <meshBasicMaterial
        wireframe={wireframe}
        transparent
        opacity={opacity}
        color={"red"}
      />
    </mesh>
  );
};

const Model = ({
  position,
  mass = 1,
  isTrigger = false,
  opacity = 1,
  type = "Dynamic",
  glb = "/assets/model/FlatMap.glb",
}: any) => {
  const { nodes } = useGLTF(glb) as any;

  const geometry = (nodes.Cube as THREE.Mesh).geometry;

  const positionArray = geometry.attributes.position.array as
    | ArrayLike<number>
    | undefined;
  const indexArray = geometry.index?.array as ArrayLike<number> | undefined;

  if (!positionArray) {
    throw new Error("Position array is undefined");
  }

  const [ref] = useTrimesh(() => ({
    isTrigger,
    mass,
    args: [positionArray, indexArray || []],
    position,
    type,
  }));
  return (
    <mesh
      ref={ref}
      position={position}
      castShadow={opacity > 0}
      geometry={geometry}
      material={nodes.Cube.material}
      scale={[300, 1, 300]}
    >
      <meshLambertMaterial wireframe={false} transparent opacity={opacity} />
    </mesh>
  );
};

function Plane({
  type = "Static" as "Static" | "Dynamic" | "Kinematic",
  position = [0, 0, 0] as [number, number, number],
  args = [1, 1, 1] as [number, number, number],
  wireframe = true,
  rotation = [Math.PI / 2, 0, 0] as [number, number, number],
}) {
  const [ref] = usePlane(() => ({ type, position, rotation, mass: 0, args }));

  console.log(ref);
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry />
      <meshNormalMaterial wireframe={wireframe} />
    </mesh>
  );
}

function FlatMap(props: any) {
  const { nodes } = useGLTF("/assets/model/flatmap.glb") as any;
  const [ref, api] = useTrimesh(
    () => ({
      args: [
        (nodes.Cube as THREE.Mesh)?.geometry?.attributes?.position?.array || [],
        (nodes.Cube as THREE.Mesh)?.geometry?.index?.array || [],
      ],
      mass: 1,
      ...props,
    }),
    useRef(null),
  );

  useEffect(() => {
    if (ref.current) {
      console.log("Flatmap", ref.current);
      console.log(ref.current.position);
      console.log("FlatMap", ref.current.scale);
      console.log([nodes.Cube.scale[0], nodes.Cube.scale[2], nodes.Cube.scale[1]])
    }
  })

  return (
    <>
      <Box ref={ref}
        position={[0, 0, 0]}
        args={[90, 1, 90]}
        wireframe
      />
    <group
      ref={ref}
      {...props}
      dispose={null}
      // onPointerDown={() => api.velocity.set(0, 5, 7)}
    >
      <mesh
        castShadow
        geometry={nodes.Cube.geometry}
        material={useMemo(() => nodes.Cube.material, [])}
      />
    </group>
    </>
  );
}

export function Canvas() {
  const { sunPosition } = useControls("Sun Position", {
    sunPosition: {
      value: [1, 2, 3],
      step: 1,
    },
  });

  return (
    <ThreeCanvas
      camera={{ position: [0, 2, 5], fov: 70, near: 0.1, far: 10000 }}
      shadows
    >
      <Sky distance={10000} sunPosition={sunPosition} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />

      <Suspense fallback={null}>
        <Physics>
          <Box position={[0, 4, -60]} type="Dynamic" />
          <FlatMap position={[0, 0, 0]} type="Static" />
        </Physics>
      </Suspense>

      <OrbitControls makeDefault />
    </ThreeCanvas>
  );
}

// Ground with physics
// function Ground() {
//   const [ref] = useBox(() => ({
//     position: [0, -1.1, 0],
//     args: [20, 1, 20],
//     type: "Static",
//   }));

//   return (
//     <mesh ref={ref} receiveShadow>
//       <boxGeometry args={[20, 1, 20]} />
//       <meshStandardMaterial color="gray" />
//     </mesh>
//   );
// }

// Interactive Box with physics
function InteractiveBox() {
  const [ref, api] = useBox(() => ({
    position: [0, 5, 0],
    args: [1, 1, 1],
    mass: 10,
  }));

  return (
    <mesh ref={ref} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
}
