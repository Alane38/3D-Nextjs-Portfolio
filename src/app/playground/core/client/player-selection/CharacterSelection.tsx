import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, User } from "lucide-react";
import { useState } from "react";
import { ThirdController } from "./components/ThirdController";
import { FirstController } from "./components/FirstController";
import { OtherController } from "./components/OtherController";

/**
 * @description  A user interface that lets you interact with a character and/or controller change blind.
 * We arrange them by configuration controllers and controllers
 *
 * @component
 * @returns {JSX.Element}
 */
export const CharacterSelection = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <>
    <div className="absolute bottom-4 right-4">
      {!isCollapsed && (
        <Card className="bg-background h-auto w-64 rounded-2xl transition-all">
          <CardContent className="flex flex-col gap-2 px-6">
            <h2 className="text-primary mb-2 text-center text-lg font-semibold uppercase">
              Characters
            </h2>
            {/* THIRD PERSON CHARACTERS CONTROLLERS(default) */}
            <ThirdController />

            {/* FIRST PERSON CHARACTERS CONTROLLERS */}

            <FirstController />
            {/* OTHERS CHARACTERS CONTROLLERS */}

            <OtherController />
          </CardContent>
        </Card>
      )}
    </div>
      <Button
        className="bg-background hover:bg-background/80 text-foreground size-10 rounded-full shadow-sm"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <User size={18} /> : <ChevronDown size={18} />}
      </Button>
      </>
  );
};
