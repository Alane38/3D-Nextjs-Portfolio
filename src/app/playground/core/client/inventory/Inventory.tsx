import { MoveToolStats } from "./move-tool/MoveToolStats";
import { useMoveToolStore } from "./move-tool/store/useMoveTool.store";

const itemsData = [
  { name: "Move Tool", description: "Move Tool", image: "/assets/images/inventory/move-tool.png" },
  { name: "Item 2", description: "Description 2", image: "/assets/images/slot.png" },
  { name: "Item 3", description: "Description 3", image: "/assets/images/slot.png" },
  { name: "Item 4", description: "Description 4", image: "/assets/images/slot.png" },
  { name: "Item 4", description: "Description 4", image: "/assets/images/slot.png" },
  { name: "Item 4", description: "Description 4", image: "/assets/images/slot.png" },
  { name: "Item 4", description: "Description 4", image: "/assets/images/slot.png" },
  { name: "Item 4", description: "Description 4", image: "/assets/images/slot.png" },
  { name: "Item 4", description: "Description 4", image: "/assets/images/slot.png" },
  { name: "Item 4", description: "Description 4", image: "/assets/images/slot.png" },
];

export const Inventory = () => {
  const {mooveToolEnabled, setMooveToolEnabled} = useMoveToolStore((s) => s);

  const handleItemClick = (index: number) => {
    if (index === 0) {
      setMooveToolEnabled(!mooveToolEnabled); // Toggle move tool
    }
  };

  return (
    <>
      <MoveToolStats active={mooveToolEnabled} />

      <div className="fixed bottom-0 left-0 z-50 w-full p-4">
        <div className="flex items-center justify-center">
          <div className="grid grid-cols-10 gap-2">
            {itemsData.map((item, index) => (
              <div
                key={index}
                onClick={() => handleItemClick(index)}
                className="group relative h-16 w-16 transform rounded-lg border border-neutral-600 bg-gradient-to-r from-neutral-800 to-neutral-900 shadow-lg transition-all hover:scale-105 cursor-pointer"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  {item && (
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
