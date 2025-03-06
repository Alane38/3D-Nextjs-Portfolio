import { useControls } from "leva";

// Leva Settings -> Debug
export const usePlayerSelection = () => {
  const { Player } = useControls("Player Selection", {
    Player: { value: "Character", options: ["Character", "Racing Car", "Car"] },
  });
  return Player;
};
