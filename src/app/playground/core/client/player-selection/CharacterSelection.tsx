import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, User } from "lucide-react";
import { useState } from "react";
import { useCharacterStore } from "./store/useCharacterStore";

const characters = [
  { id: "newalfox", label: "Fox Pam", image: "/images/foxpam.png" },
  { id: "pamacea", label: "Pamacea", image: "/images/pamacea.png" },
  { id: "vehicle", label: "Vehicle", image: "/images/vehicle.png" },
];

/**
 * A user interface that lets you interact with a character and/or controller change blind. 
 * 
 * @component
 * @returns {JSX.Element}
 */
export const CharacterSelection = () => {
  const { character, setCharacter } = useCharacterStore();
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
      <div className="relative max-h-screen">
        <Button
          className="bg-muted hover:bg-accent text-foreground absolute top-1/2 -left-9 size-12 -translate-y-1/2 rounded-full shadow-sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <User size={18} /> : <ChevronRight size={18} />}
        </Button>

        {!isCollapsed && (
          <Card className="bg-popover h-auto w-64 rounded-2xl transition-all">
            <CardContent className="flex flex-col gap-2 px-6">
              <h2 className="text-primary mb-2 text-center text-lg font-semibold uppercase">
                Characters
              </h2>

              <div className="flex flex-col gap-2">
                {characters.map((char) => (
                  <Button
                    key={char.id}
                    onClick={() => setCharacter(char.id)}
                    className={`w-full justify-start rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      character === char.id
                        ? "bg-primary/50 text-foreground"
                        : "bg-accent text-foreground hover:bg-accent/50"
                    }`}
                  >
                    {char.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
  );
};
