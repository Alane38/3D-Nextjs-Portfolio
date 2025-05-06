import React from "react";
import { useDebugStore, DebugState } from "./store/useDebugStore";
import { useSkyStore, SkyState } from "./store/useSkyStore";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

// Configuration centralisée des options
const options = {
  check: [
    {
      key: "debugState",
      label: "Debug Mode",
      value: (s: DebugState) => s.debugState,
      toggle: (s: DebugState) => () => s.setDebugState(!s.debugState),
      store: useDebugStore,
    },
    {
      key: "debugstate2",
      label: "Debug Mode",
      value: (s: DebugState) => s.debugState,
      toggle: (s: DebugState) => () => s.setDebugState(!s.debugState),
      store: useDebugStore,
    },
  ],
  slide: [
    {
      key: "turbidity",
      label: "Turbidity > 0",
      value: (s: SkyState) => s.turbidity > 0,
      toggle: (s: SkyState) => () =>
        s.setSky({ turbidity: s.turbidity > 0 ? -1 : 10 }),
      store: useSkyStore,
    },
    {
      key: "rayleigh",
      label: "Rayleigh > 10",
      value: (s: SkyState) => s.rayleigh > 10,
      toggle: (s: SkyState) => () =>
        s.setSky({ rayleigh: s.rayleigh > 10 ? 1 : 20 }),
      store: useSkyStore,
    },
  ],
};

export const Controls = () => {
  return (
    <div className="fixed top-0 left-0 z-10 w-full p-4">
      {/* Eva Interface */}
      <Card className="w-64  flex flex-col items-center justify-center gap-4 rounded-2xl bg-secondary p-6 ">
        {/* Checkbox Input State */}
        {options.check.map(({ key, label, value, toggle, store }) => {
          const state = store() as DebugState & SkyState;
          const checked = value(state);
          const onChange = toggle(state);

          return (
            <div key={key} className="flex items-center space-x-2">
              <Checkbox id={key} checked={checked} onCheckedChange={onChange} />
              <Label htmlFor={key} className="text-white">
                {label}
              </Label>
            </div>
          );
        })}
        {/* Input Input State */}
        {/* Slider Input State */}
      </Card>
    </div>
  );
};
