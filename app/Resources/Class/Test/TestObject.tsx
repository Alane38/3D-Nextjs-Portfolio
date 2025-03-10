import { Box, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  RapierRigidBody,
  RigidBody,
  RigidBodyOptions,
} from "@react-three/rapier";
import React, { useRef } from "react";
import * as THREE from "three";
import { EntityTest, EntityTestWrapper } from "./EntityClass";

export class TestObject {
  entity = React.createRef<EntityTest>(); // Référence vers l'Entity
  color: string;
  type: RigidBodyOptions["type"];
  scale: [number, number, number];
  rotation: THREE.Euler;
  position: THREE.Vector3;

  constructor() {
    this.type = "dynamic";
    this.scale = [1, 1, 1];
    this.rotation = new THREE.Euler(0, 0, 0);
    this.color = "red";
    this.position = new THREE.Vector3(0, 0.5, 0);
  }

  applyImpulse(impulse: { x: number; y: number; z: number }) {
    this.entity.current?.applyImpulse(impulse);
  }

  renderComponent() {
    return <TestObjectComponent model={this} />;
  }
}

export const TestObjectComponent = ({ model }: { model?: TestObject }) => {
  const rbRef = useRef<RapierRigidBody>(null);
  const textRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (rbRef.current && textRef.current) {
      textRef.current.position.copy(
        new THREE.Vector3(
          rbRef.current.translation().x,
          rbRef.current.translation().y + Math.PI / 2,
          rbRef.current.translation().z,
        ),
      );
      textRef.current.rotation.set(0, rbRef.current.rotation().y + Math.PI, 0);
    }
  });

  return (
    <>
      {/* L'Entity est attaché à la référence */}
      <EntityTestWrapper ref={model?.entity} name="KillBrick" />

      <RigidBody
        ref={rbRef}
        type="dynamic"
        scale={model?.scale}
        onCollisionEnter={({ other }) => {
          if (other.rigidBodyObject?.name === "Player") {
            model?.entity.current?.setScale([2, 2, 2]); // Change la taille en cas de collision
          }
        }}
      >
        <Box scale={model?.scale}>
          <meshStandardMaterial attach="material" color={model?.color} />
        </Box>
      </RigidBody>

      <mesh ref={textRef}>
        <Text scale={0.5} color="red" maxWidth={10} textAlign="center">
          Touch me to kill!
        </Text>
      </mesh>
    </>
  );
};
