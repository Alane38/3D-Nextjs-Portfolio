import { Character } from "../../character/Character";
import { Vehicle } from "../../character/vehicles/car/Vehicle";
import { useCharacterStore } from "./store/useCharacterStore";

export const Player = () => {
  const { player } = useCharacterStore();

  return (
    <>
      {player === "newalfox" && (
        <Character name="Player" path="FoxPam.fbx" position={[0, 10, 0]} />
      )}

      {player === "pamacea" && (
        <Character name="Player" path="Pamacea.fbx" position={[0, 10, 0]} />
      )}

      {player === "vehicle" && (
        <Vehicle />
      )}
    </>
  );
};
