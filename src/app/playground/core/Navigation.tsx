import { CharacterSelection } from "./client/player-selection/CharacterSelection";
import { Eva } from "./extension/eva/Eva";

/**
 * Groups and positions the various shortcuts for accessing character selection or EVA.
 * 
 * @component
 * @returns {JSX.Element}
 */
export const Navigation = () => {
  return (
    <div className="fixed bottom-0 right-0 z-10 w-1/5 p-4">
      <div className="flex items-end justify-end gap-18 p-6">
        <CharacterSelection />
        <Eva collapsed={true} />
      </div>
    </div>
  );
};
