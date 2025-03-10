import { Box, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useMemo, useRef, useState } from "react";
import { Euler, Vector3 } from "three";
import { Entity } from "../Entity";
import * as THREE from "three";
import EntitySingleton from "../EntitySingleton";

export class KillBrick extends Entity {
  color: string;
  constructor() {
    super("KillBrick");
    this.type = "dynamic";
    this.scale = [1, 1, 1];
    this.rotation = new Euler(0, 0, 0);
    this.color = "red";
    this.position = new Vector3(0, 0.5, 0);
  }

  renderComponent() {
    return <KillBrickComponent model={this} />;
  }
}

export const KillBrickComponent = ({
  model,
  ...props
}: { model?: KillBrick } & Partial<KillBrick>) => {
  // Fusion of props and model
  const instance = model || EntitySingleton.getInstance(KillBrick);
  const object = useMemo(() => ({ ...instance, ...props }), [model, props]);

  const [color, setColor] = useState(object.color);

  const rbRef = useRef<RapierRigidBody>(null);
  const textRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    // Link the text element to Box's rigid body, copying all movements.
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
      <RigidBody
        {...object}
        ref={rbRef}
        onCollisionEnter={({ other }) => {
          if (other.rigidBodyObject?.name === "Player") {
            setColor("green");
          }
        }}
      >
        <Box scale={object.scale}>
          <meshStandardMaterial attach="material" color={color} />
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
