import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StoreState, StoryEntry } from "../types/default";


export const EvaInputs = (stories: { inputs: StoryEntry[] | null }) => {
  if (!stories.inputs) return null;
  return stories.inputs.map(({ key, label, value, setValue, store }) => {
    if (!setValue) return null;
    const state = store() as StoreState;
    const val = value(state);
    const onChange = setValue(state);

    return (
      <div key={key} className="flex flex-col justify-center items-center w-4/5 gap-4 bg-input p-4 rounded-sm shadow-sm">
        <Label htmlFor={key} className="font-semibold text-foreground uppercase">
          {label}
        </Label>
        <Input
          id={key}
          type="text"
          value={typeof val === "boolean" ? String(val) : val}
          onChange={(e) => onChange(e.target.value)}
          className="rounded border border-gray-600 bg-gray-800 p-2 text-foreground"
        />
      </div>
    );
  });
};