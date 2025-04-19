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

  /** Internal functions */
  private static addEntity<InstanceType extends Entity>(entity: InstanceType) {
    const existingEntity = EntityManager.getInstance().entities.find(
      (e) => e.entityId === entity.entityId,
    );
    if (existingEntity) {
      return;
    }
    EntityManager.getInstance().entities.push(entity);
  }

  /** Entity Manager */
  // Singleton pattern to get the single instance of EntityManager
  static getInstance(): EntityManager {
    if (!EntityManager.instance) {
      EntityManager.instance = new EntityManager();
    }
    return EntityManager.instance;
  }

  // Generate an ID and add the entity to the list
  static generateIdToEntity(entity: Entity): number {
    // If entity has an ID, use it
    if (entity.entityId !== undefined) {
      // Check if the entity is in the list
      const existingEntity = EntityManager.getInstance().entities.find(
        (e) => e.entityId === entity.entityId,
      );

      // If entity doesn't exist in EntityManager, add it
      if (!existingEntity) {
        EntityManager.addEntity(entity);
      }

      return entity.entityId;
    }

    // Generate an ID if the entity don't have.
    const entityManager = EntityManager.getInstance();
    do {
      entity.entityId = EntityManager.nextId++;
    } while (
      entityManager.entities.some((e) => e.entityId === entity.entityId)
    );

    // Add the entity to the list
    EntityManager.addEntity(entity);

    return entity.entityId;
  }

  /** Management functions */
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
  static getFirstEntityByName(name: string): Entity | undefined {
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
