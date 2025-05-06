import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Label } from "@radix-ui/react-label";
import { Globe } from "lucide-react";
import { PlacementManager } from "../../../PlacementManager";
import { useEntityStore } from "../../../class/entity.store";

export const LoadSaveTool = () => {
  const { entities, setEntities } = useEntityStore();

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
  );
};
