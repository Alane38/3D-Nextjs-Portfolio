import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Settings2 } from "lucide-react";
import { useState } from "react";
import { EvaCheck } from "./gui/EvaCheck";
import { EvaInputs } from "./gui/EvaInputs";
import { EvaSelect } from "./gui/EvaSelect";
import { EvaSlider } from "./gui/EvaSlider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { stories } from "./store/Stories";

interface EvaPanelProps {
  collapsed: boolean;
}

/**
 * The designed panel with the management of the different UI components and stories.
 *
 * @param collapsed If true, the panel is collapsed, if false, it is expanded.
 * @returns {JSX.Element}
 */
export const EvaPanel = ({ collapsed }: EvaPanelProps) => {
  // State management
  const [isCollapsed, setIsCollapsed] = useState(collapsed); // The panel
  const [showChecks, setShowChecks] = useState(false); // The checks
  const [showSliders, setShowSliders] = useState(false); // The sliders
  const [showInputs, setShowInputs] = useState(false); // The inputs
  const [showSelects, setShowSelects] = useState(false); // The selects

  return (
    <div className="fixed right-16 bottom-9 z-10">
      <div className="relative max-h-screen">
        <Button
          className="bg-muted hover:bg-accent text-foreground absolute top-1/2 -left-8 size-12 -translate-y-1/2 rounded-full shadow-sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <Settings2 size={18} /> : <ChevronRight size={18} />}
        </Button>

        {!isCollapsed && (
          <Card className="bg-popover h-auto max-h-screen w-80 rounded-2xl transition-all">
            <CardContent className="flex flex-col gap-2 px-6">
              <h2 className="text-primary mb-2 text-center text-lg font-semibold uppercase">
                EVA
              </h2>

              {/* Check Section */}
              {stories.checks && (
                <>
                  <Button
                    variant="ghost"
                    className="w-full justify-start py-2 text-sm font-semibold uppercase"
                    onClick={() => setShowChecks(!showChecks)}
                  >
                    Check {showChecks ? "▾" : "▸"}
                  </Button>
                  {showChecks && (
                    <ScrollArea className="h-64 w-full">
                      <div className="flex flex-col items-center justify-center gap-2 py-2">
                        <EvaCheck checks={stories.checks} />
                      </div>
                    </ScrollArea>
                  )}
                </>
              )}

              {/* Slider Section */}
              {stories.sliders && (
                <>
                  <Button
                    variant="ghost"
                    className="w-full justify-start py-2 text-sm font-semibold uppercase"
                    onClick={() => setShowSliders(!showSliders)}
                  >
                    Sliders {showSliders ? "▾" : "▸"}
                  </Button>
                  {showSliders && (
                    <ScrollArea className="h-64 w-full">
                      <div className="flex flex-col items-center justify-center gap-2 py-2">
                        <EvaSlider sliders={stories.sliders} />
                      </div>
                    </ScrollArea>
                  )}
                </>
              )}

              {/* Inputs Section */}
              {stories.inputs && (
                <>
                  <Button
                    variant="ghost"
                    className="w-full justify-start py-2 text-sm font-semibold uppercase"
                    onClick={() => setShowInputs(!showInputs)}
                  >
                    Inputs {showInputs ? "▾" : "▸"}
                  </Button>
                  {showInputs && (
                    <ScrollArea className="h-64 w-full">
                      <div className="flex flex-col items-center justify-center gap-2 py-2">
                        <EvaInputs inputs={stories.inputs} />
                      </div>
                    </ScrollArea>
                  )}
                </>
              )}

              {/* Select Section */}
              {stories.selects && (
                <>
                  <Button
                    variant="ghost"
                    className="w-full justify-start py-2 text-sm font-semibold uppercase"
                    onClick={() => setShowSelects(!showSelects)}
                  >
                    Selects {showSelects ? "▾" : "▸"}
                  </Button>
                  {showSelects && (
                    <ScrollArea className="h-64 w-full">
                      <div className="flex flex-col items-center justify-center gap-2 py-2">
                        <EvaSelect selects={stories.selects} />
                      </div>
                    </ScrollArea>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
