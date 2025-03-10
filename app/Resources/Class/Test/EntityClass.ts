import { RapierRigidBody, RigidBodyOptions } from "@react-three/rapier";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { Euler, Group, Vector3 } from "three";

export class EntityTest {
  ref = useRef<RapierRigidBody | null>(null);
  groupRef = useRef<Group | null>(null);
  optionsRef = useRef<RigidBodyOptions | null>(null);
  name: string;
  path: string;
  position: Vector3;
  rotation: Euler;
  mass: number;
  type: RigidBodyOptions["type"];
  colliders: RigidBodyOptions["colliders"];
  scale: number | [number, number, number];

  constructor(name: string) {
    this.name = name;
    this.path = "";
    this.position = new Vector3(0, 0, 0);
    this.rotation = new Euler(0, 0, 0);
    this.mass = 1;
    this.type = "fixed";
    this.colliders = "hull";
    this.scale = 1;
  }

  applyImpulse(impulse: { x: number; y: number; z: number }) {
    this.ref.current?.applyImpulse(impulse, true);
  }

  setPosition(position: Vector3) {
    this.position.copy(position);
  }

  setRotation(rotation: Euler) {
    this.rotation.copy(rotation);
  }

  setMass(mass: number) {
    this.mass = mass;
  }

  setScale(scale: number | [number, number, number]) {
    this.scale = scale;
  }

  setPath(path: string) {
    this.path = path;
  }

  getRigidBody() {
    return this.ref.current;
  }

  getRigidBodyOptions() {
    return this.optionsRef.current;
  }

  setRigidBodyOptions(options: RigidBodyOptions) {
    this.optionsRef.current = options;
  }
}

export const EntityTestWrapper = forwardRef<EntityTest, { name: string }>((props, ref) => {
  const entity = new EntityTest(props.name);

  useImperativeHandle(ref, () => entity);

  return null;
});
