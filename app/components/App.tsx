"use client"

import React from "react";
import { Physics, useBox, usePlane, useSphere } from "@react-three/cannon";
import * as THREE from "three";
import { Canvas as Canvas2, useFrame } from "@react-three/fiber";

const positions: [number, number, number][] = [
  [0, 2, 3],
  [-1, 5, 16],
  [-2, 5, -10],
  [0, 12, 3],
  [-10, 5, 16],
  [8, 5, -10]
];

function Marble() {
  const [ref] = useSphere(() => ({
    mass: 10,
    position: [2, 5, 0]
  }));

  return (
    <mesh ref={ref} castShadow>
      <sphereGeometry
        attach="geometry"
        args={[1, 32, 32]}
      ></sphereGeometry>
      <meshStandardMaterial color="white" />
    </mesh>
  );
}

function Box({ position }: { position: [number, number, number] }) {
  const [ref] = useBox(() => ({
    mass: 10,
    position: position,
    args: [2, 2, 2]
  }));

  return (
    <mesh ref={ref} castShadow>
      <boxGeometry attach="geometry" args={[2, 2, 2]} />
      <meshStandardMaterial color="white" />
    </mesh>
  );
}

const Plane = () => {
  const [ref, api] = usePlane(() => ({
    mass: 1,
    position: [0, 0, 0],
    type: "Static",
    rotation: [-Math.PI / 2, 0, 0]
  }));
  useFrame(({ mouse }) => {
    api.rotation.set(-Math.PI / 2 - mouse.y * 0.2, 0 + mouse.x * 0.2, 0);
  });
  return (
    <mesh scale={200} ref={ref} receiveShadow>
      <planeGeometry />
      <meshStandardMaterial color="white" side={THREE.DoubleSide} />
    </mesh>
  );
};

export default function App() {
  return (
    <Canvas2 camera={{ position: [0, 20, 0], fov: 90 }} shadows>
      <color attach="background" args={["#94ebd8"]} />
      <fog attach="fog" args={["#94ebd8", 0, 40]} />
      <ambientLight intensity={0.1} />
      <directionalLight intensity={0.1} castShadow />
      <pointLight
        castShadow
        intensity={3}
        args={[0xff0000, 1, 100]}
        position={[-1, 3, 1]}
      />
      <spotLight
        castShadow
        intensity={1}
        args={["blue", 1, 100]}
        position={[-1, 4, -1]}
        penumbra={1}
      />

      <Physics>
        <Marble />
        <Plane />
        {positions.map((position, idx) => (
          <Box position={position} key={idx} />
        ))}
      </Physics>
    </Canvas2>
  );
}
