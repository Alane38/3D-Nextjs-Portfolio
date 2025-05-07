import { generateChecks } from "../utils/generateChecks";
import { generateSliders } from "../utils/generateSliders";
import { debugStoreConfig, useDebugStore } from "./useDebugStore";
import { skyStoreConfig, useSkyStore } from "./useSkyStore";
import { spinnerStoreConfig, useSpinnerStore } from "./useSpinnerStore";

/**
 * `stories` is a centralized configuration object that dynamically generates UI controls
 * (checkboxes, sliders, text inputs, and selects) from Zustand stores and their metadata configs.
 *
 * Each entry uses a specific generator function (`generateChecks`, `generateSliders`, etc.)
 * to build form components for debugging or runtime configuration.
 */
export const stories = {
  checks: generateChecks(useDebugStore, debugStoreConfig),
  sliders: [
    ...generateSliders(useSkyStore, skyStoreConfig),
    ...generateSliders(useSpinnerStore, spinnerStoreConfig),
  ],
  inputs: null,
  selects: null,
};
