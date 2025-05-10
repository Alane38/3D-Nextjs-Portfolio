import { useState } from "react";
import { CharacterSelection } from "./client/player-selection/CharacterSelection";
import ToolBar from "./client/tool-bar/ToolBar";
import { Eva } from "./extension/eva/Eva";
import { Button } from "@/components/ui/button";

/**
 * Groups and positions the various shortcuts for accessing character selection or EVA.
 *
 * @component
 * @returns {JSX.Element}
 */
export const Navigation = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="fixed right-0 bottom-0 z-10 w-full">
      {!isCollapsed && (
        <div className="flex items-center justify-center gap-4 rounded-2xl p-8">
          <CharacterSelection />
          <Eva collapsed={true} />
          <ToolBar />
        </div>
      )}
      <Button className="absolute w-24 h-8 left-1/2 transform -translate-x-1/2 -bottom-4 bg-background hover:bg-background/80 rounded-sm hover:scale-110" onClick={() => setIsCollapsed(!isCollapsed)}/>
    </div>
  );
};
