import { Button } from "@/components/ui/button";
import { useCharacterStore } from "../store/useCharacterStore";
import { charactersData } from "../data/charactersData";

export const OtherController = () => {
  const { character, setCharacter } = useCharacterStore();
  return (
    <>
      {/* OTHERS CHARACTERS CONTROLLERS*/}
      {charactersData.otherController.length > 0 && (
                <div className="flex flex-col gap-2">
                  {charactersData.otherController.map((char) => (
                    <Button
                      key={char.id}
                      onClick={() => setCharacter(char.id)}
                      className={`w-full justify-start rounded-xl px-4 py-3 text-sm font-semibold transition shadow-sm ${
                        character === char.id
                          ? "bg-accent/50 text-foreground hover:bg-accent/80"
                          : "bg-accent/10 text-foreground hover:bg-accent/50"
                      }`}
                    >
                      {char.label}
                    </Button>
                  ))}
                </div>
              )}
    </>
  );
};
