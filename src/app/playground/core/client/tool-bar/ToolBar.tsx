import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  ChevronDown,
  ClipboardCopyIcon,
  ClipboardPasteIcon,
  CopyCheckIcon,
  EraserIcon,
  ExpandIcon,
  Globe,
  LucideIcon,
  Move3D,
  MoveIcon,
  Rotate3DIcon,
  Undo2Icon,
} from "lucide-react";
import Image from "next/image";
import { useEntityStore } from "../../class/entity.store";
import { PlacementManager } from "../../PlacementManager";
import { MoveToolStats } from "./edit-tool/move/MoveToolStats";
import { ScaleToolStats } from "./edit-tool/scale/ScaleToolStats";
import { useEditToolStore } from "./edit-tool/store/useEditTool.store";
import { useState } from "react";

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
  const [isCollapsed, setIsCollapsed] = useState(true);
  // Store initialization
  const {
    // Move Tool
    moveToolEnabled,
    setMoveToolEnabled,

    // Scale Tool
    scaleToolEnabled,
    setScaleToolEnabled,
  } = useEditToolStore((s) => s);

  // const [allRigidBodiesMounted, setAllRigidBodiesMounted] = useState(false);
  const { entities, setEntities } = useEntityStore();

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

  // Save the world
  const handleSave = () => {
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
    <div>
      <MoveToolStats active={moveToolEnabled} />
      <ScaleToolStats active={scaleToolEnabled} />

      <div className="flex items-center justify-center">
        <Button
          className="bg-background hover:bg-background/80 text-foreground size-10 rounded-full shadow-sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <Move3D /> : <ChevronDown />}
        </Button>
        {/* World buttons */}
        {!isCollapsed && (
          <div className="flex justify-center gap-4 absolute bottom-20">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="default"
                    className="bg-background hover:bg-background/80 text-foreground size-10 rounded-full shadow-sm hover:scale-105"
                  >
                    <Globe />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="flex flex-col gap-4 px-2 py-2">
                  <DropdownMenuItem>
                    <Button
                      variant="default"
                      onClick={handleSave}
                      className="bg-background hover:bg-background/80 h9 text-foreground w-36 cursor-pointer text-center shadow-sm"
                    >
                      💾 Snapshot
                    </Button>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Input
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
                          setEntities(loadedEntities);
                        };
                        reader.readAsText(file);
                      }}
                    />
                    <Label
                      htmlFor="file-input"
                      className="bg-background hover:bg-background/80 text-foreground inline-flex h-9 w-36 cursor-pointer items-center justify-center gap-2 rounded-md text-center text-sm font-medium shadow-xs transition-all"
                    >
                      📂 Load world
                    </Label>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Button
                      variant="default"
                      className="bg-background hover:bg-background/80 h9 text-foreground w-36 cursor-pointer text-center shadow-sm"
                      onClick={() => {
                        const json = PlacementManager.save(entities);
                        console.log(json);
                      }}
                    >
                      🌍 Save world
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

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
                        ? "group bg-background hover:bg-background/80 relative size-10 transform cursor-pointer rounded-full p-1 shadow-sm transition duration-300 ease-in-out hover:scale-105"
                        : "group bg-background hover:bg-background/80 relative size-10 transform cursor-pointer rounded-full p-1 opacity-25 shadow-sm transition duration-300 ease-in-out hover:scale-105",
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
                          return (
                            <IconComponent className="text-foreground h-6 w-6" />
                          );
                        })()
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolBar;
