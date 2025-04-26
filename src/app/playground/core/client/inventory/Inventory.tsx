import {
  ClipboardCopyIcon,
  ClipboardPasteIcon,
  CopyCheckIcon,
  EraserIcon,
  ExpandIcon,
  Globe,
  LucideIcon,
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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

// Inventory items
const itemsData: {
  name: string;
  description: string;
  image: string | LucideIcon;
}[] = [
  {
    name: "Move Tool",
    description: "Move Tool",
    image: MoveIcon,
  },
  {
    name: "Scale Tool",
    description: "Scale Tool",
    image: ExpandIcon,
  },
  {
    name: "Rotate Tool",
    description: "Rotate Tool",
    image: Rotate3DIcon,
  },
  {
    name: "Delete Tool",
    description: "Delete Tool",
    image: EraserIcon,
  },
  {
    name: "Duplicate Tool",
    description: "Duplicate Tool",
    image: ClipboardCopyIcon,
  },
  {
    name: "Copy Tool",
    description: "Copy Tool",
    image: CopyCheckIcon,
  },
  {
    name: "Paste Tool",
    description: "Paste Tool",
    image: ClipboardPasteIcon,
  },
  {
    name: "Undo Tool",
    description: "Undo Tool",
    image: Undo2Icon,
  },
  // Add more items/tools here.
];

/**
 * Inventory Bar
 *
 * @component
 * @returns {JSX.Element}
 */
export const Inventory = () => {
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
    <>
      <MoveToolStats active={moveToolEnabled} />
      <ScaleToolStats active={scaleToolEnabled} />

      <div className="fixed bottom-0 left-0 z-10 w-full p-4">
        <div className="flex items-center justify-center px-16">
          {/* World buttons */}
          <div className="flex justify-start px-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="default"
                  className="bg-popover-foreground h-11 w-12 rounded-lg hover:scale-105"
                >
                  <Globe />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="flex flex-col gap-4 px-2 py-2">
                <DropdownMenuItem>
                  <Button
                    variant="default"
                    onClick={handleSave}
                    className="bg-popover-foreground h9 w-36 cursor-pointer text-center"
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
                        // ici tu les places dans le monde
                        setEntities(loadedEntities);
                      };
                      reader.readAsText(file);
                    }}
                  />
                  <Label
                    htmlFor="file-input"
                    className="bg-popover-foreground text-primary-foreground hover:bg-popover-foreground/90 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex h-9 w-36 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md text-center text-sm font-medium whitespace-nowrap shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                  >
                    📂 Load world
                  </Label>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Button
                    variant="default"
                    className="bg-popover-foreground h9 w-36 cursor-pointer text-center"
                    onClick={() => {
                      // if (!allRigidBodiesMounted) {
                      //   console.warn("⚠️ Some RigidBody are not mounted yet. Cannot save.");
                      //   return;
                      // }
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
                  >
                    🌍 Save world
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Inventory items */}
          <div className="flex items-center justify-center">
            <div className="grid grid-cols-10 gap-2">
              {itemsData.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleItemClick(index)}
                  className="group bg-popover-foreground hover:bg-popover-foreground/90 relative h-11 w-12 transform cursor-pointer rounded-lg p-1 transition duration-300 ease-in-out hover:scale-105"
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
                          <IconComponent className="h-6 w-6 text-white" />
                        );
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

export default Inventory;
