import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StoreState, StoryEntry } from "../types/default";


/** 
 * Generate an ipunt and his setters from a store config.
 * 
 * @utility
 * @param storeHook A function that returns the store
 * @param config The store config
 * @returns An array of input parameters
 */
export const EvaSelect = (stories: { selects: StoryEntry[] | null }) => {
  if (!stories.selects) return null;
  return stories.selects.map(
    ({ key, label, value, setValue, store, options }) => {
      if (!setValue || !options) return null;
      const state = store() as StoreState;
      const val = value(state);
      const onChange = setValue(state);

      return (
        <div
          key={key}
          className="bg-background flex w-4/5 flex-col items-center justify-center gap-4 rounded-sm p-4 shadow-sm"
        >
          <Label htmlFor={key} className="font-semibold text-foreground uppercase">
            {label}
          </Label>
          <Select
            value={String(val)}
            onValueChange={(v) => {
              const selected = options.find((o) => String(o.value) === v);
              if (!selected) return;
              onChange(selected.value);
            }}
          >
            <SelectTrigger className="rounded border border-gray-600 bg-gray-800 text-foreground">
              <SelectValue placeholder={`Select ${label}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem
                  key={String(opt.value)}
                  value={String(opt.value)}
                  className="flex items-center justify-center"
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    },
  );
};
