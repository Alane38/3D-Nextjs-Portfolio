import { RapierRigidBody, RigidBodyOptions } from "@react-three/rapier";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { Euler, Group, Vector3 } from "three";

export type TypeEntityRef = {
  applyImpulse: (impulse: { x: number; y: number; z: number }) => void;
  setPosition: (position: Vector3) => void;
  setRotation: (rotation: Euler) => void;
  setMass: (mass: number) => void;
  setScale: (scale: number) => void;
  setPath: (path: string) => void;
  getRigidBody: () => RapierRigidBody | null;
  getRigidBodyOptions: () => RigidBodyOptions | null;
  setRigidBodyOptions: (options: RigidBodyOptions) => void;
};

export const EntityRefTest = forwardRef<TypeEntityRef, { name: string }>((props, ref) => {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const groupRef = useRef<Group>(null);
  const optionsRef = useRef<RigidBodyOptions | null>(null);

  let name = props.name;
  let path = "";
  let position = new Vector3(0, 0, 0);
  let rotation = new Euler(0, 0, 0);
  let mass = 1;
  let type: RigidBodyOptions["type"] = "fixed";
  let colliders: RigidBodyOptions["colliders"] = "hull";
  let scale: number | [number, number, number] = 1;

  useImperativeHandle(ref, () => ({
    applyImpulse: (impulse) => {
      rigidBodyRef.current?.applyImpulse(impulse, true);
    },
    setPosition: (newPosition) => {
      position.copy(newPosition);
    },
    setRotation: (newRotation) => {
      rotation.copy(newRotation);
    },
    setMass: (newMass) => {
      mass = newMass;
    },
    setScale: (newScale) => {
      scale = newScale;
    },
    setPath: (newPath) => {
      path = newPath;
    },
    getRigidBody: () => rigidBodyRef.current,
    getRigidBodyOptions: () => optionsRef.current,
    setRigidBodyOptions: (options) => {
      optionsRef.current = options;
    },
  }));

  return <group ref={groupRef}></group>;
});
