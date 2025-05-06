import { cn } from "@/lib/utils";
import {
  ClipboardCopyIcon,
  ClipboardPasteIcon,
  CopyCheckIcon,
  EraserIcon,
  ExpandIcon,
  LucideIcon,
  MoveIcon,
  Rotate3DIcon,
  Undo2Icon
} from "lucide-react";
import Image from "next/image";
import { MoveToolStats } from "./edit-tools/move/MoveToolStats";
import { ScaleToolStats } from "./edit-tools/scale/ScaleToolStats";
import { useEditToolStore } from "./edit-tools/store/useEditTool.store";
import { LoadSaveTool } from "./load-save-tool/LoadSaveTool";


// ToolBar items
const itemsData: {
  name: string;
  description: string;
  image: string | LucideIcon;
  active?: boolean;
}[] = [
  {
    name: "Move Tool",
    description: "Move Tool",
    image: MoveIcon,
    active: true,
  },
  {
    name: "Scale Tool",
    description: "Scale Tool",
    image: ExpandIcon,
    active: true,
  },
  {
    name: "Rotate Tool",
    description: "Rotate Tool",
    image: Rotate3DIcon,
    active: false,
  },
  {
    name: "Delete Tool",
    description: "Delete Tool",
    image: EraserIcon,
    active: false,
  },
  {
    name: "Duplicate Tool",
    description: "Duplicate Tool",
    image: ClipboardCopyIcon,
    active: false,
  },
  {
    name: "Copy Tool",
    description: "Copy Tool",
    image: CopyCheckIcon,
    active: false,
  },
  {
    name: "Paste Tool",
    description: "Paste Tool",
    image: ClipboardPasteIcon,
    active: false,
  },
  {
    name: "Undo Tool",
    description: "Undo Tool",
    image: Undo2Icon,
    active: false,
  },
  // Add more items/tools here.
];

/**
 * ToolBar Bar
 *
 * @component
 * @returns {JSX.Element}
 */
export const ToolBar = () => {
  // Store initialization
  const {
    // Move Tool
    moveToolEnabled,
    setMoveToolEnabled,

    // Scale Tool
    scaleToolEnabled,
    setScaleToolEnabled,
  } = useEditToolStore((s) => s);

  // Click on an item
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

      <div className="fixed bottom-0 left-0 z-10 w-full p-4">
        <div className="flex items-center justify-center px-16">
          {/* World buttons */}
          <LoadSaveTool />

          {/* Edit Tools items */}
          <div className="flex items-center justify-center">
            <div className="grid grid-cols-10 gap-2">
              {itemsData.map((item, index) => (
                <div
                  key={index}
                  onClick={
                    item.active ? () => handleItemClick(index) : undefined
                  }
                  className={cn(
                    item.active
                      ? "group bg-popover-foreground hover:bg-popover-foreground/90 relative h-11 w-12 transform cursor-pointer rounded-lg p-1 transition duration-300 ease-in-out hover:scale-105"
                      : "group bg-popover-foreground relative h-11 w-12 transform cursor-pointer rounded-lg p-1 opacity-25 transition duration-300 ease-in-out hover:scale-105",
                  )}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    {typeof item.image === "string" ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={32}
                        height={32}
                        className="h-6 w-6 object-contain"
                      />
                    ) : (
                      (() => {
                        const IconComponent = item.image;
                        return <IconComponent className="h-6 w-6 text-white" />;
                      })()
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ToolBar;
