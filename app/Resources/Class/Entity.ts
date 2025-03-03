import { createRef } from "react";
import { RapierRigidBody, RigidBodyOptions } from "@react-three/rapier";
import { Euler, Vector3 } from "three"; // Utilisation de Vector3 directement de Three.js

export class Entity {
  ref = createRef<RapierRigidBody>();
  path: string;
  position: Vector3; // Utilisation de Vector3 pour la position
  rotation: Euler;
  mass: number;
  type: RigidBodyOptions["type"];
  colliders: RigidBodyOptions["colliders"];
  scale: number;

  constructor(name: string) {
    this.path = "";
    this.position = new Vector3(0, 0, 0); // Initialisation avec un Vector3
    this.rotation = new Euler(0, 0, 0);
    this.mass = 1;
    this.type = "dynamic"; // Default to dynamic
    this.colliders = "trimesh"; // Default to trimesh
    this.scale = 1;
    console.log(`${name} initialized`);
  }

  // Add any common logic or helpers here
  applyImpulse(impulse: { x: number; y: number; z: number }) {
      this.ref.current?.applyImpulse(impulse, false);
  }

  setPosition(position: Vector3) {
    this.position.copy(position); // Utilisation de la méthode copy() pour mettre à jour la position
  }

  setRotation(rotation: Euler) {
    this.rotation.copy(rotation); // Utilisation de la méthode copy() pour mettre à jour la rotation
  }

  setMass(mass: number) {
    this.mass = mass;
  }

  setScale(scale: number) {
    this.scale = scale;
    console.log(scale);
  }

  setPath(path: string) {
    this.path = path;
  }
}
