import { capitalize } from "./capitalize";

/**
 * Generate sliders and their setters from a store config interacting with a Zustand store.
 *
 * @utility
 * @param storeHook A function that returns the Zustand store.
 * @param config Configuration object mapping each property to slider metadata.
 * @returns An array of slider story entries.
 */
export function generateSliders<T extends object>(
  storeHook: () => T,
  config: Record<
    string,
    {
      type: "slider";
      min?: number;
      max?: number;
      step?: number;
    }
  >
) {
  return Object.entries(config)
    .filter(([, meta]) => meta.type === "slider")
    .map(([key, meta]) => {
      return {
        key,
        label: capitalize(key),
        value: (s: unknown) => (s as any)[key],
        setValue: (s: unknown) => (v: string | number) => {
          // Try specific setter first: setSpeed
          const specificSetter = (s as any)[`set${capitalize(key)}`];
          if (typeof specificSetter === "function") {
            return specificSetter(v);
          }

          // Else, fallback to a global setter like setSky
          const globalSetter = Object.entries(s as any).find(
            ([name, val]) =>
              name.startsWith("set") && typeof val === "function"
          )?.[1];

          if (typeof globalSetter === "function") {
            return globalSetter({ [key]: v });
          }

          console.warn(`No setter found for ${key}`);
        },
        store: storeHook,
        ...(meta.min !== undefined && { min: meta.min }),
        ...(meta.max !== undefined && { max: meta.max }),
        ...(meta.step !== undefined && { step: meta.step }),
      };
    });
}
