import { RapierRigidBody, RigidBodyOptions } from "@react-three/rapier";
import { createRef } from "react";
import { Euler, Group, Vector3 } from "three";

export class Entity {
  name: string;
  path: string = "";
  position: Vector3 = new Vector3(0, 0, 0);
  rotation: Euler = new Euler(0, 0, 0);
  mass: number = 1;
  type: RigidBodyOptions["type"] = "fixed";
  colliders: RigidBodyOptions["colliders"] = "hull";
  scale: number | [number, number, number] = 1;
  rigidBody?: RapierRigidBody; // Reference to the physics body

  constructor(name: string) {
    this.name = name;
    // console.log(`${name} initialized`);
  }

  // Métodos simplificados para setters
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