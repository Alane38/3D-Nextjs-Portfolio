import { Diamond, KillBrick } from "./class";
import { Entity, EntitySerializableType } from "./class/Entity";

export const ENTITY_TYPES: Record<string, new () => Entity> = {
  Diamond,
  KillBrick,
  // Add more entity types here
};

export class PlacementManager {
  // Save registered entities to a JSON file
  static save(entities: Entity[]): string {
    console.log("Saving entities:", entities);
    // For all entities, get his props and add it to the serialized array
    const serialized = entities.map((e: Entity) => e.toSerializable());
    console.log("Serialized entities:", serialized);
    // Return the serialized array, create a JSON 
    return JSON.stringify(serialized, null, 2);
  }

  // Load a json file and return an array of entities
  static load(json: string): Entity[] {
    const data = JSON.parse(json);
    return data.map((entry: EntitySerializableType & { entityId?: number }) => {
      const EntityClass = ENTITY_TYPES[entry.entityName];
      if (!EntityClass) {
        console.warn(`Unknown entity type: ${entry.entityName}`);
        return null;
      }
  
      // Create a new instance of the entity class
      const entity = new EntityClass();
  
      // Deserialize the entity using the fromSerialized method
      const baseEntity = Entity.fromSerialized(entry);
  
      // Copy the properties from the base entity to the new entity
      entity.position.copy(baseEntity.position);
      entity.rotation.copy(baseEntity.rotation);
      entity.scale = baseEntity.scale;
      entity.type = baseEntity.type;
      entity.path = baseEntity.path;
  
      // Set the entityId if it exists in the entry
      if (entry.entityId !== undefined) {
        entity.entityId = entry.entityId;
      }
  
      return entity;
    }).filter(Boolean) as Entity[];
  }
}
