import { useEffect, useState } from "react";
import { PlacementManager } from "../../PlacementManager";
import { MoveToolStats } from "./edit-tool/move/MoveToolStats";
import { ScaleToolStats } from "./edit-tool/scale/ScaleToolStats";
import { useEditToolStore } from "./edit-tool/store/useEditTool.store";
import { useEntityStore } from "../../class/entity.store";

const itemsData = [
  {
    name: "Move Tool",
    description: "Move Tool",
    image: "/assets/images/inventory/move-tool.png",
  },
  {
    name: "Scale Tool",
    description: "Scale Tool",
    image: "/assets/images/inventory/scale-tool.png",
  },
  // Add more items/tools here.
];

export const Inventory = () => {
  const {
    // Move Tool
    moveToolEnabled,
    setMoveToolEnabled,

    // Scale Tool
    scaleToolEnabled,
    setScaleToolEnabled,
  } = useEditToolStore((s) => s);

  const { entities, setEntities } = useEntityStore();
  const [allRigidBodiesMounted, setAllRigidBodiesMounted] = useState(false);

  const handleItemClick = (index: number) => {
    // Disable other tools
    setMoveToolEnabled(false);
    setScaleToolEnabled(false);

    if (index === 0) {
      // Move Tool
      setMoveToolEnabled(!moveToolEnabled); // Toggle move tool
    } else if (index === 1) {
      // Scale Tool
      setScaleToolEnabled(!scaleToolEnabled); // Toggle scale tool
    }
  };

  useEffect(() => {
    setTimeout(() => {
      // Check if all RigidBodies are mounted
      const allMounted = entities.every(entity => {console.log(entity.entityId); return entity.entityId;}); // False
      // Return a boolean
      setAllRigidBodiesMounted(allMounted);
    }, 15000);
  }, []);

  useEffect(() => {
    console.log("CALL TO BE SAVED:", entities);
  }, [entities]);

  const handleSave = () => {
    // Check if all RigidBodies are mounted; if not you can't save the world.
    if (!allRigidBodiesMounted) {
      console.warn("⚠️ Some RigidBody are not mounted yet. Cannot save.");
      return;
    }

    // Synchronize all entities

    // Update the store with all entities (forcing => bad!)
    // setEntities([...entities]);
    // Save the world, create a file and download it
    const json = PlacementManager.save(entities);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "save.json";
    a.click();
  };

  return (
    <>
      <MoveToolStats active={moveToolEnabled} />
      <ScaleToolStats active={scaleToolEnabled} />

      <div className="fixed bottom-0 left-0 z-50 w-full p-4">
        <button
          onClick={handleSave}
          className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 font-bold text-white shadow-lg transition-all duration-300 hover:from-blue-600 hover:to-purple-700"
        >
          💾 Sauvegarder
        </button>

        <input
          type="file"
          accept=".json"
          className="hidden"
          id="file-input"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
              const loadedEntities = PlacementManager.load(
                event.target?.result as string,
              );
              // ici tu les places dans le monde
              setEntities(loadedEntities);
            };
            reader.readAsText(file);
          }}
        />
        <label
          htmlFor="file-input"
          className="cursor-pointer rounded-lg bg-gradient-to-r from-green-500 to-teal-600 px-4 py-2 font-bold text-white shadow-lg transition-all duration-300 hover:from-green-600 hover:to-teal-700"
        >
          📂 Charger un monde
        </label>

        <button
          onClick={() => {
            // if (!allRigidBodiesMounted) {
            //   console.warn("⚠️ Some RigidBody are not mounted yet. Cannot save.");
            //   return;
            // }
            // Synchroniser les entités avant de les sauvegarder
            const json = PlacementManager.save(entities);
            console.log(json);

            // create file 
            // const blob = new Blob([json], { type: "application/json" });
            // const url = URL.createObjectURL(blob);
            // const a = document.createElement("a");
            // a.href = url;
            // a.download = "save.json";
            // a.click();
          }}
          className="rounded-lg bg-gradient-to-r from-red-500 to-orange-600 px-4 py-2 font-bold text-white shadow-lg transition-all duration-300 hover:from-red-600 hover:to-orange-700"
        >
          🌍 Sauvegarder le Monde
        </button>

        <div className="flex items-center justify-center">
          <div className="grid grid-cols-10 gap-2">
            {itemsData.map((item, index) => (
              <div
                key={index}
                onClick={() => handleItemClick(index)}
                className="group relative h-16 w-16 transform cursor-pointer rounded-lg border border-neutral-600 bg-gradient-to-r from-neutral-800 to-neutral-900 shadow-lg transition-all hover:scale-105"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  {item && item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-8 w-8 object-contain"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Inventory;
