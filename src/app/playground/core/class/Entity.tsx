import {
  CollisionEnterHandler,
  RapierRigidBody,
  RigidBodyOptions,
} from "@react-three/rapier";
import { JSX } from "react";
import { Euler, EulerOrder, Vector3 } from "three";

/**
 * Type used for serializing an Entity instance.
 */
export type EntitySerializableType = {
  entityName: string;
  type: RigidBodyOptions["type"];
  path: string;
  position: [number, number, number];
  rotation: (number | EulerOrder | undefined)[];
  scale: number | [number, number, number];
};

/**
 * Base 3D entity class with physics and transformation properties.
 * Extend this class to create interactive components.
 */
export class Entity {
  entityName: string;
  entityId: number | undefined = undefined;
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

  // Physics constraints
  lockTranslations: boolean = false;
  lockRotations: boolean = false;
  enabledRotations: [boolean, boolean, boolean] = [true, true, true];
  setEnabledRotations?: (x: boolean, y: boolean, z: boolean) => void;
  setLinvel?: (vel: Vector3, wakeup: boolean) => void;

  // Event hooks
  onCollisionEnter?: CollisionEnterHandler;

  constructor(name: string) {
    this.entityName = name;
  }

  /**
   * Set the entity's position.
   * @param position - A THREE.Vector3 instance
   */
  setPosition(position: Vector3) {
    this.position.copy(position);
  }

  /**
   * Set the entity's rotation.
   * @param rotation - A THREE.Euler instance
   */
  setRotation(rotation: Euler) {
    this.rotation.copy(rotation);
  }

  /**
   * Set the entity's mass.
   * @param mass - A number representing the entity's mass
   */
  setMass(mass: number) {
    this.mass = mass;
  }

  /**
   * Set the entity's scale.
   * Accepts a number (uniform scale) or a tuple for non-uniform scaling.
   * @param scale - Uniform or non-uniform scale
   */
  setScale(scale: number | [number, number, number]) {
    this.scale = Array.isArray(scale) ? scale : [scale, scale, scale];
  }

  /**
   * Set the entity's model or resource path.
   * @param path - URL or relative path to a 3D model
   */
  setPath(path: string) {
    this.path = path;
  }

  /**
   * Serialize the entity to a plain object for storage or transmission.
   */
  toSerializable(): EntitySerializableType {
    return {
      entityName: this.entityName,
      type: this.type,
      path: this.path,
      // TODO: this.position.toArray() is not a function
      position: this.position.toArray(),
      rotation: this.rotation.toArray().slice(0, 3),
      scale: Array.isArray(this.scale)
        ? this.scale
        : [this.scale, this.scale, this.scale],
    };
  }

  /**
   * Create an Entity instance from a serialized object.
   * @param data - Serialized entity data
   */
  public static fromSerialized(data: EntitySerializableType): Entity {
    const entity = new Entity(data.entityName);
    entity.path = data.path;
    entity.type = data.type;
    entity.position.fromArray(data.position);

    // Only use the first 3 elements for the Euler rotation
    if (Array.isArray(data.rotation)) {
      entity.rotation.fromArray(
        data.rotation.slice(0, 3) as [number, number, number],
      );
    }

    entity.scale = data.scale;
    return entity;
  }

  /**
   * Render the entity's visual component.
   * Should be overridden by subclasses.
   */
  renderComponent(): JSX.Element {
    return <></>;
  }
}
