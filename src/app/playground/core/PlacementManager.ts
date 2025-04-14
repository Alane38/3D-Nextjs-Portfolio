import { Diamond, KillBrick, RestaurantSign } from "./class";
import { Entity } from "./class/Entity";

export const ENTITY_TYPES: Record<string, new () => Entity> = {
  KillBrick,
  Diamond,
  // RestaurantSign,
  // ajoute d'autres entités ici si besoin
};

export class PlacementManager {
  // TODO: TO fix (work but not correctly)
  static save(entities: Entity[]): string {
    console.log("Saving entities:", entities);
    const serialized = entities.map((e: Entity) => e.toSerializable());
    return JSON.stringify(serialized, null, 2);
  }

  static load(json: string): Entity[] {
    const data = JSON.parse(json);
    return data.map((entry: any) => {
      const EntityClass = ENTITY_TYPES[entry.name];
      if (!EntityClass) {
        console.warn(`Unknown entity type: ${entry.name}`);
        return null;
      }
      const entity = new EntityClass();
      entity.position.fromArray(entry.position || [0, 0, 0]);
      entity.rotation.fromArray(entry.rotation || [0, 0, 0]);
      entity.scale = entry.scale || 1;
      entity.type = entry.type || "fixed";
      entity.path = entry.path;
      return entity;
    }).filter(Boolean) as Entity[];
  }
}
