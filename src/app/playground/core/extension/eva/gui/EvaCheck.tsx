import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { StoreState, StoryEntry } from "../types/default";

export const EvaCheck = (stories: { checks: StoryEntry[] | null }) => {
  if (!stories.checks) return null;
  return stories.checks.map(({ key, label, value, toggle, store }) => {
    if (!toggle) return null;
    const state = store() as StoreState;
    const checked = value(state);
    const onChange = toggle(state);

    return (
      <div
        key={key}
        className="bg-background flex w-4/5 items-center justify-center gap-4 rounded-sm p-4 shadow-sm"
      >
        <Checkbox
          id={key}
          checked={typeof checked === "boolean" ? checked : false}
          onCheckedChange={onChange}
          className="rounded bg-background p-2 text-foreground"
        />
        <Label htmlFor={key} className="font-semibold text-foreground uppercase">
          {label}
        </Label>
      </div>
    );
  });
};
