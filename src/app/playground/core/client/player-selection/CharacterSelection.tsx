import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, User } from "lucide-react";
import { useState } from "react";
import { ThirdController } from "./components/ThirdController";
import { FirstController } from "./components/FirstController";
import { OtherController } from "./components/OtherController";

/**
 * A user interface that lets you interact with a character and/or controller change blind.
 *
 * @component
 * @returns {JSX.Element}
 */
export const CharacterSelection = () => {
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

            {/* LIST OF CHARACTERS BY CONTROLLERS CATEGORY */}
            <div className="flex flex-col gap-4">
              {/* THIRD PERSON CHARACTERS CONTROLLERS*/}
              <ThirdController />
              {/* FIRST PERSON CHARACTERS CONTROLLERS*/}
              <FirstController />
              {/* OTHERS CHARACTERS CONTROLLERS*/}
              <OtherController />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
