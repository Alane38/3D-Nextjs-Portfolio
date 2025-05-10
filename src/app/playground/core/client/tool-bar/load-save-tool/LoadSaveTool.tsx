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
  const { entities, setEntities } = useEntityStore(state => state);

  const downloadJson = (json: string, filename: string) => {
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  };

  const handleSnapshot = () => {
    const json = PlacementManager.save(entities);
    downloadJson(json, "save.json");
  };

  const handleLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const loadedEntities = PlacementManager.load(result);
      setEntities(loadedEntities);
    };
    reader.readAsText(file);
  };

  const handleSaveWorld = () => {
    const json = PlacementManager.save(entities);
    console.log(json);

    // Optionally, you could enable download here
    // downloadJson(json, "world.json");
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
              onClick={handleSnapshot}
              className="bg-popover-foreground h9 w-36 cursor-pointer text-center"
            >
              💾 Snapshot
            </Button>
          </DropdownMenuItem>

          <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
            <div>
              <Input
                type="file"
                accept=".json"
                className="hidden"
                id="file-input"
                onChange={handleLoad}
              />
              <Label
                htmlFor="file-input"
                className="bg-popover-foreground text-primary-foreground hover:bg-popover-foreground/90 focus-visible:border-ring focus-visible:ring-ring/50 inline-flex h-9 w-36 cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium shadow-xs transition-all"
              >
                📂 Load world
              </Label>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Button
              variant="default"
              className="bg-popover-foreground h9 w-36 cursor-pointer text-center"
              onClick={handleSaveWorld}
            >
              🌍 Save world
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
