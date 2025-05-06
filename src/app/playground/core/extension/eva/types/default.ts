import { useDebugStore } from "../store/useDebugStore";
import { useSkyStore } from "../store/useSkyStore";

export type DebugState = ReturnType<typeof useDebugStore>;
export type SkyState = ReturnType<typeof useSkyStore>;

export type StoreState = DebugState & SkyState;

export interface OptionEntry {
  key: string;
  label: string;
  value: (s: StoreState) => boolean;
  toggle: (s: StoreState) => () => void;
  store: () => Partial<StoreState>;
}

export interface StoriesType {
  check: OptionEntry[];
  slide: OptionEntry[];
}
