import { CollisionEnterHandler, RapierRigidBody, RigidBodyOptions } from "@react-three/rapier";
import { useRef } from "react";
import { Euler, Vector3 } from "three";

export class Entity {
  rigidBodyRef: React.RefObject<RapierRigidBody | null> = useRef<RapierRigidBody>(null);
  name: string;
  path: string = "";
  position: Vector3 = new Vector3(0, 0, 0);
  rotation: Euler = new Euler(0, 0, 0);
  mass: number = 1;
  type: RigidBodyOptions["type"] = "fixed";
  colliders: RigidBodyOptions["colliders"] = "hull";
  scale: number | [number, number, number] = 1;
  rigidBody?: RapierRigidBody;
  ccd: boolean = false;
  canSleep: boolean = true;
  lockTranslations: boolean = false;
  enabledRotations: [boolean, boolean, boolean] = [true, true, true];

  onCollisionEnter?: CollisionEnterHandler;

  constructor(name: string) {
    this.name = name;
    this.position = new Vector3();
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

  setScale(scale: number) {
    this.scale = scale;
  }

  setPath(path: string) {
    this.path = path;
  }
}