import { Entity } from "./Entity";


/**
 * Singleton class to manage entities
 * 
 * @function getInstance - Get the single instance of EntityManager
 * @function createEntity - Create a new entity and add it to the list
 * @function addEntity - Add an entity to the list
 * @function getEntityByName - Get entity by class name
 * @function getEntityById - Get entity by ID
 * @function getAllEntities - Get all entities
 * @function removeEntity - Remove entity
 * 
 */
export class EntityManager {
  private static instance: EntityManager;
  private entities: Entity[] = [];
  private static nextId = 1;
  private constructor() {}

  // Singleton pattern to get the single instance of EntityManager
  static getInstance(): EntityManager {
    if (!EntityManager.instance) {
      EntityManager.instance = new EntityManager();
    }
    return EntityManager.instance;
  }

  // Create a new entity and add it to the list
  static createEntity<T extends Entity>(EntityClass: new () => T): T {
    const entityManager = EntityManager.getInstance();

    // Create new entity and set unique ID
    const entity = new EntityClass();
    entity.entityId = EntityManager.nextId++;

    // Add to entity collection
    entityManager.entities.push(entity);
    return entity;
  }

  static addEntity<T extends Entity>(entity: T) {
    EntityManager.getInstance().entities.push(entity);
  }

  static generateIdToEntity(entity: Entity): number {
    const entityManager = EntityManager.getInstance();
    do {
      entity.entityId = EntityManager.nextId++;
    } while (
      entityManager.entities.some(e => e.entityId === entity.entityId)
    );

    return entity.entityId;
  }
  // Get all entities
  static getAllEntities(): Entity[] {
    return EntityManager.getInstance().entities;
  }

  // Get entity by name
  static getEntityByName(name: string): Entity | undefined {
    return EntityManager.getInstance().entities.find(
      (entity) => entity.constructor.name === name,
    );
  }

  // Get entity by name and id
  static getEntityByNameAndId(name: string, id: number): Entity | undefined {
    return EntityManager.getInstance().entities.find(
      (entity) => entity.constructor.name === name && entity.entityId === id,
    );
  }

  // Get the first entity by name
  static getFirstEntityByName(
    name: string,
  ): Entity | undefined {
    return EntityManager.getInstance().entities.find(
      (entity) => entity.entityName === name,
    );
  }

  // Get entity by id
  static getEntityById(id: number): Entity | undefined {
    return EntityManager.getInstance().entities.find(
      (entity) => entity.entityId === id,
    );
  }

  // Remove an entity
  static removeEntity(entity: Entity): void {
    const entityManager = EntityManager.getInstance();

    const index = entityManager.entities.indexOf(entity);
    if (index !== -1) {
      entityManager.entities.splice(index, 1);
    } else {
      console.error("Entity not found in EntityManager");
    }
  }

  // Remove an entity by id
  static removeEntityById(id: number): void {
    const entityManager = EntityManager.getInstance();

    const index = entityManager.entities.findIndex(
      (entity) => entity.entityId === id,
    );
    console.log("Removing entity", id, "from EntityManager");
    if (index !== -1) {
      entityManager.entities.splice(index, 1);
    }
  }
}
