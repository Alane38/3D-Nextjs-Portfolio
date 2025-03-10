import { EnumPlayerOption } from "@constants/playerSelection";
import { useControls } from "leva";
import { useState } from "react";

// Leva Settings -> Debug
export const usePlayerSelection = () => {
  const [player, setPlayer] = useState<EnumPlayerOption>(
    EnumPlayerOption.Character,
  ); // Default Player

  const controls = useControls("Player Selection", {
    Player: {
      value: player,
      options: Object.values(EnumPlayerOption) as EnumPlayerOption[],
      onChange: (value: EnumPlayerOption) => setPlayer(value),
    },
  });

  // Update player selection
  const updatePlayer = (newPlayer: EnumPlayerOption) => {
    if (newPlayer !== player) {
      setPlayer(newPlayer);
    }
  };

  return { player, updatePlayer };
};
