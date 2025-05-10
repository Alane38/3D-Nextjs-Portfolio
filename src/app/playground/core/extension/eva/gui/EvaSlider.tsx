import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { StoreState, StoryEntry } from "../types/default";

export const EvaSlider = (stories: { sliders: StoryEntry[] | null}) => {
  if (!stories.sliders) return null;
  return stories.sliders.map(
    ({
      key,
      label,
      value,
      setValue,
      min = -1,
      max = 100,
      step = 0.1,
      store,
    }) => {
      if (!setValue) return null;
      const state = store() as StoreState;
      const val = value(state) as number;
      const onChange = setValue(state);

      return (
        <div key={key} className="flex flex-col justify-center items-center w-4/5 gap-4 bg-background p-4 rounded-sm shadow-sm">
          <Label htmlFor={key} className="text-foreground uppercase text-xs font-semibold">
            {label} <p className="text-sm text-primary">{val.toFixed(2)}</p>
          </Label>
          <Slider
            id={key}
            value={[val]}
            onValueChange={([v]) => onChange(v)}
            min={min}
            max={max}
            step={step}
          />
        </div>
      );
    },
  );
};
