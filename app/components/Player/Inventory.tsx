import React, { useState } from "react";

export const Inventory = () => {
  const [items, setItems] = useState(Array(10).fill(null));

  const addItemToSlot = (index: number, item: string) => {
    const newItems = [...items];
    newItems[index] = item;
    setItems(newItems);
  };

  return (
    <div className="fixed bottom-0 left-0 w-full p-4 z-50">
      <div className="flex justify-center items-center space-x-2">
        <div className="grid grid-cols-10 gap-2">
          {items.map((item, index) => (
            <div
              key={index}
              className="relative group w-16 h-16 bg-gradient-to-r from-neutral-800 to-neutral-900 border border-neutral-600 rounded-lg shadow-lg hover:scale-105 transform transition-all"
              onClick={() => addItemToSlot(index, "item-icon")}
            >
              <div className="absolute inset-0 flex justify-center items-center">
                {item && (
                  <img
                    src={"/assets/images/slot.png"}
                    alt={`${index}`}
                    className="w-8 h-8 object-contain opacity-100 transition-opacity"
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
