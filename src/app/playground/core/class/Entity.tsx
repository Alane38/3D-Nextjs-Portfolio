import {
  CollisionEnterHandler,
  RapierRigidBody,
  RigidBodyOptions,
} from "@react-three/rapier";
import { createRef, JSX } from "react";
import { Euler, EulerOrder, Vector3 } from "three";

// Type for serialization
export type EntitySerializableType = {
  name: string;
  type: RigidBodyOptions["type"];
  path: string;
  position: [number, number, number];
  rotation: (number | EulerOrder | undefined)[];
  scale: number | [number, number, number];
};

// 3D Object class, extends to create the EntityComponent.
export class Entity {
  rigidBodyRef?: React.RefObject<RapierRigidBody | null> = createRef();
  name: string;
  entityId: number = 1;
  path: string = "";
  position: Vector3 = new Vector3(0, 0, 0);
  rotation: Euler = new Euler(0, 0, 0);
  args: [number, number, number] = [1, 1, 1];
  mass: number = 1;
  depth: number = 0;
  color: string = "white";
  type: RigidBodyOptions["type"] = "fixed";
  colliders: RigidBodyOptions["colliders"] = "hull";
  scale: number | [number, number, number] = 1;
  rigidBody?: RapierRigidBody;
  ccd: boolean = false;
  canSleep: boolean = true;
  // Physics
  lockTranslations: boolean = false;
  lockRotations: boolean = false;
  enabledRotations: [boolean, boolean, boolean] = [true, true, true];
  setEnabledRotations?: (x: boolean, y: boolean, z: boolean) => void;
  setLinvel?: (vel: Vector3, wakeup: boolean) => void;

  // Events props
  onCollisionEnter?: CollisionEnterHandler;

  constructor(name: string, entityId?: number) {
    this.name = name;
    this.entityId = entityId || 1;
  }

  // Setters
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

  // Convert an Entity Object to a JSON object
  toSerializable(): EntitySerializableType {
    return {
      name: this.name,
      type: this.type,
      path: this.path,
      position: this.position.toArray(),
      rotation: this.rotation.toArray().slice(0, 3),
      scale: Array.isArray(this.scale)
        ? this.scale
        : [this.scale, this.scale, this.scale],
    };
  }

  // Convert a JSON object to an Entity Object
  public static fromSerialized(data: EntitySerializableType): Entity {
    const entity = new Entity(data.name);
    entity.path = data.path;
    entity.type = data.type;
    entity.position.fromArray(data.position);

    // Fix: ne passer que les 3 premiers éléments à Euler
    if (Array.isArray(data.rotation)) {
      entity.rotation.fromArray(
        data.rotation.slice(0, 3) as [number, number, number],
      );
    }

    entity.scale = data.scale;
    return entity;
  }

  renderComponent(): JSX.Element {
    return <></>; // Override in subclass
  }
}
