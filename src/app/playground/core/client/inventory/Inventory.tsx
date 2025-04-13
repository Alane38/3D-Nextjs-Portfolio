import { MoveToolStats } from "./edit-tool/move/MoveToolStats";
import { ScaleToolStats } from "./edit-tool/scale/ScaleToolStats";
import { useEditToolStore } from "./edit-tool/store/useEditTool.store";

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
  {
    name: "Item 3",
    description: "Description 3",
  },
  {
    name: "Item 4",
    description: "Description 4",
  },
  {
    name: "Item 4",
    description: "Description 4",
  },
  {
    name: "Item 4",
    description: "Description 4",
  },
  {
    name: "Item 4",
    description: "Description 4",
  },
  {
    name: "Item 4",
    description: "Description 4",
  },
  {
    name: "Item 4",
    description: "Description 4",
  },
  {
    name: "Item 4",
    description: "Description 4",
  },
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

  return (
    <>
      <MoveToolStats active={moveToolEnabled} />
      <ScaleToolStats active={scaleToolEnabled} />

      <div className="fixed bottom-0 left-0 z-50 w-full p-4">
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
