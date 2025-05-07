import { Button } from "@/components/ui/button";
import { useCharacterStore } from "./store/useCharacterStore";

const characters = [
  { id: "newalfox", label: "Fox Pam", image: "/images/foxpam.png" },
  { id: "pamacea", label: "Pamacea", image: "/images/pamacea.png" },
  { id: "vehicle", label: "Vehicle", image: "/images/vehicle.png" },
];

export const PlayerSelection = () => {
  const { player, setPlayer } = useCharacterStore();
  return (
    <div className="flex flex-col gap-4 p-4 sm:flex-row">
      {characters.map((char) => (
        <Button
          key={char.id}
          onClick={() => setPlayer(char.id)}
          className={`rounded-xl px-6 py-3 font-semibold text-white transition ${
            player === char.id ? "bg-blue-600" : "bg-gray-500 hover:bg-gray-600"
          }`}
        >
          {char.label}
        </Button>
      ))}
    </div>
  );
};
