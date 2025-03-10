import { Entity } from "./Entity";

export default class EntitySingleton {
  private static instances: Map<string, Entity> = new Map();

  // Method to get an instance of the entity
  public static getInstance<T extends Entity>(
    entity: new (...args: any[]) => T,
  ): T {
    const entityName = entity.name;
    // console.log(entityName);

    // If the instance doesn't exist, create it
    if (!EntitySingleton.instances.has(entityName)) {
      console.log("soesn't exist",entityName);
      EntitySingleton.instances.set(entityName, new entity() as Entity);
    }

    return EntitySingleton.instances.get(entityName) as T;
  }

  // Method to remove an instance of the entity
  public static removeInstance(entityName: string): void {
    EntitySingleton.instances.delete(entityName);
  }

  // Method to remove all instances of the entity
  public static removeAllInstances(): void {
    EntitySingleton.instances.clear();
  }

  // Method to get all instances of the entity
  public static getAllInstances(): Map<string, Entity> {
    return EntitySingleton.instances;
  }

  // Method to get the number of instances of the entity
  public static getInstanceCount(): number {
    return EntitySingleton.instances.size;
  }

  // Method to check if an instance of the entity exists
  public static hasInstance(entityName: string): boolean {
    return EntitySingleton.instances.has(entityName);
  }

  // Method to get an instance of the entity by name
  public static getInstanceByName<T extends Entity>(entityName: string): T {
    return EntitySingleton.instances.get(entityName) as T;
  }
}
