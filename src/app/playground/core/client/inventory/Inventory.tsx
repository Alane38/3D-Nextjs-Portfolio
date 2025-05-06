import { allEntities } from "../../class";
import { Entity } from "../../class/Entity";
import { InventoryModeEnum } from "./inventory.type";

type InventoryProps = {
  mode: InventoryModeEnum;
};

type EntityCardProps = {
  entity: Partial<Entity>;
};

const EntityCard = ({ entity }: EntityCardProps) => {
  function spawnSelectedEntity(entity: Partial<Entity>) {
    console.log(entity.entityName, "SPAWNED");
  }
  
  return (
    <div
      onClick={() => spawnSelectedEntity(entity)}
      className="w-auto cursor-pointer border p-2 transition duration-250 ease-in-out hover:scale-105 hover:bg-white/30"
    >
      {/* <img src={Entity.image} alt={Entity.name} /> */}
      <h3>{entity.entityName}</h3>
    </div>
  );
};

/**
 *
 * @returns {JSX.Element}
 */
export const Inventory = ({ mode }: InventoryProps) => {
  if (mode !== InventoryModeEnum.CREATIVE) return null;

  return (
    <div className="flex flex-wrap h-30 w-1/2 items-start gap-2 border p-2">
      {allEntities.map((entity: Partial<Entity>) => (
        <EntityCard key={entity.entityName} entity={entity} />
      ))}
    </div>
  );
};
