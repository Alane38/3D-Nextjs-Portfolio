import { Entity } from "./Entity";

class EntityManager {
  private static _instance: EntityManager;
  private entityMap: Map<string, Map<string, Entity>> = new Map();

  private constructor() {}

  public static getInstance(): EntityManager {
    if (!EntityManager._instance) {
      EntityManager._instance = new EntityManager();
    }
    return EntityManager._instance;
  }

  public createEntity<T extends Entity>(EntityClass: new () => T): T {
    const entity = new EntityClass();
    const name = entity.name;
    const entityId = entity.entityId;

    if (!this.entityMap.has(name)) {
      this.entityMap.set(name, new Map());
    }
    this.entityMap.get(name)!.set(entityId, entity);
    return entity;
  }

  public remove(name: string, entityId: string): void {
    if (this.entityMap.has(name)) {
      this.entityMap.get(name)!.delete(entityId);
      if (this.entityMap.get(name)!.size === 0) {
        this.entityMap.delete(name);
      }
    }
  }

  public getById<T extends Entity>(name: string, entityId: string): T | undefined {
    return this.entityMap.get(name)?.get(entityId) as T | undefined;
  }

  public getAllByName<T extends Entity>(name: string): T[] {
    return Array.from(this.entityMap.get(name)?.values() ?? []) as T[];
  }

  public getAll(): Entity[] {
    return Array.from(
      [...this.entityMap.values()].flatMap((map) => Array.from(map.values())),
    );
  }

  public clear(): void {
    this.entityMap.clear();
  }
}

export default EntityManager; // 👈 THIS is an instance, not the class
