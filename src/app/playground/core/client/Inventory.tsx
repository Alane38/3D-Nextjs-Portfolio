import { useState } from "react";

export const Inventory = () => {
  const [items, setItems] = useState(Array(10).fill(null));

  const addItemToSlot = (index: number, item: string) => {
    const newItems = [...items];
    newItems[index] = item;
    setItems(newItems);
  };

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full p-4">
      <div className="flex items-center justify-center space-x-2">
        <div className="grid grid-cols-10 gap-2">
          {items.map((item, index) => (
            <div
              key={index}
              className="group relative h-16 w-16 transform rounded-lg border border-neutral-600 bg-gradient-to-r from-neutral-800 to-neutral-900 shadow-lg transition-all hover:scale-105"
              onClick={() => addItemToSlot(index, "item-icon")}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                {item && (
                  <img
                    src={"/assets/images/slot.png"}
                    alt={`${index}`}
                    className="h-8 w-8 object-contain opacity-100 transition-opacity"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Inventory;
