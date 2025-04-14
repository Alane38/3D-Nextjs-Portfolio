import { Diamond, KillBrick } from "./class";
import { Entity } from "./class/Entity";

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
    return data.map((entry: any) => {
      const EntityClass = ENTITY_TYPES[entry.name];
      if (!EntityClass) {
        console.warn(`Unknown entity type: ${entry.name}`);
        return null;
      }
      const entity = new EntityClass();
      entity.entityId = entry.entityId;
      entity.position.fromArray(entry.position?.toArray() || [0, 0, 0]);
      entity.rotation.fromArray(entry.rotation?.toArray() || [0, 0, 0]);
      entity.scale = entry.scale || 1;
      entity.type = entry.type || "fixed";
      entity.path = entry.path;
      return entity;
    }).filter(Boolean) as Entity[];
  }
}
