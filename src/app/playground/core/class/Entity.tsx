import {
  CollisionEnterHandler,
  RapierRigidBody,
  RigidBodyOptions,
} from "@react-three/rapier";
import { createRef, JSX } from "react";
import { Euler, Vector3 } from "three";

// export type EntityProps = JSX.IntrinsicElements["group"] & {
//   entity: Entity;
// };

// 3D Object class, extends to create the EntityComponent.
export class Entity {
  rigidBodyRef?: React.RefObject<RapierRigidBody | null> = createRef();
  name: string;
  entityId: string = Entity.name + Math.random();
  path: string = "";
  position: Vector3 = new Vector3(0, 0, 0);
  rotation: Euler = new Euler(0, 0, 0);
  args: [number, number, number] = [1, 1, 1];
  mass: number = 1;
  type: RigidBodyOptions["type"] = "fixed";
  colliders: RigidBodyOptions["colliders"] = "hull";
  scale: number | [number, number, number] = 1;
  rigidBody?: RapierRigidBody;
  ccd: boolean = false;
  canSleep: boolean = true;
  lockTranslations: boolean = false;
  lockRotations: boolean = false;
  enabledRotations: [boolean, boolean, boolean] = [true, true, true];
  
  onCollisionEnter?: CollisionEnterHandler;
  setEnabledRotations?: (x: boolean, y: boolean, z: boolean) => void;
  setLinvel?:  (vel: Vector3, wakeup: boolean) => void;

  constructor(name: string) {
    this.name = name;
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

  // Entity.ts

  // Convert an Entity Object to a JSON object
  toSerializable() {
    return {
      name: this.name,
      entityId: this.entityId,
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
  public static fromSerialized(data: any): Entity {
    const entity = new Entity(data.name);
    entity.entityId = data.entityId;
    entity.path = data.path;
    entity.type = data.type;
    entity.position.fromArray(data.position);

    // Fix: ne passer que les 3 premiers éléments à Euler
    if (Array.isArray(data.rotation)) {
      entity.rotation.fromArray(data.rotation.slice(0, 3));
    }

    entity.scale = data.scale;
    return entity;
  }

  renderComponent(): JSX.Element {
    return <></>; // override in subclass
  }
}
