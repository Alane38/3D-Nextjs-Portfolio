import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { StoreState, StoriesType } from "../types/default";




export const useInputs = () => {


    const evaCheck = ( stories : StoriesType ) => {
        {/* Checkbox Input State */}
        {stories.check.map(({ key, label, value, toggle, store }) => {
          const state = store() as StoreState;
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
    };

    return { evaCheck };

};