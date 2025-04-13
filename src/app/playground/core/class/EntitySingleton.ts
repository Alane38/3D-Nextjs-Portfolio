import { Entity } from "./Entity";

export default class EntitySingleton {
  private static instances: Map<string, Entity> = new Map();

  // Method to get an instance of the entity
  public static getInstance<T extends Entity>(
    entity: new (...args: any[]) => T,
  ): T {
    const entityTemp = new entity();
    const entityName = entityTemp.name;
  
    if (!this.hasInstance(entityName)) {
      this.instances.set(entityName, entityTemp);
    }

    // console.log(entityName, "added");
  
    return this.instances.get(entityName) as T;
  }
  
  // Method to remove an instance of the entity
  public static removeInstance(instance: Entity): void {
    this.instances.delete(instance.name);
  }

  // Method to remove an instance of the entity by name
  public static removeInstanceByEntityName(entityInstanceName: string): void {
    console.log(entityInstanceName, "removed");
    for (const [key, instance] of this.instances) {
      if (instance.name === entityInstanceName) {
        this.instances.delete(key);
        break;
      }
    }
  }

  // Method to remove all instances of the entity
  public static removeAllInstances(): void {
    this.instances.clear();
  }

  // Method to get all instances of the entity
  public static getAllInstances(): Map<string, Entity> {
    return this.instances;
  }

  // Method to get the number of instances of the entity
  public static getInstanceCount(): number {
    return this.instances.size;
  }

  // Method to check if an instance of the entity exists
  public static hasInstance(entityName: string): boolean {
    return this.instances.has(entityName);
  }

  // Method to get an instance of the entity by name
  public static getInstanceByName<T extends Entity>(entityName: string): T {
    return this.instances.get(entityName) as T;
  }
}
