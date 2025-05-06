import { useDebugStore } from "../store/useDebugStore";
import { useSkyStore } from "../store/useSkyStore";

export type DebugState = ReturnType<typeof useDebugStore>;
export type SkyState = ReturnType<typeof useSkyStore>;

export type StoreState = DebugState & SkyState;

export interface StoryEntry {
  key: string;
  label: string;
  value: (s: StoreState) => boolean | number | string;
  store: () => Partial<StoreState>;
  // Boolean mode
  toggle?: (s: StoreState) => () => void;
  //  Value mode
  setValue?: (s: StoreState) => (v: string | number) => void;
  // Slider mode
  min?: number;
  max?: number;
  step?: number;
  // Select mode
  options?: { label: string; value: string | number }[];
}

export interface StoriesType {
  checks: StoryEntry[] | null;
  sliders: StoryEntry[] | null;
  inputs: StoryEntry[] | null;
  selects: StoryEntry[] | null;
}

export interface SelectType {
  [key: string]: { type: "select"; options: { label: string; value: string | number }[] };
}

export interface SliderType { [key: string]: {
  type: "slider";
  min?: number;
  max?: number;
  step?: number;
}
};

export interface CheckType { [key: string]: {
  type: "check";
}
};

export interface InputType { [key: string]: {
  type: "input";
}
};


