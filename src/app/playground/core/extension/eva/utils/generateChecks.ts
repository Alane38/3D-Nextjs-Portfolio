/**
 * 
 * @param s A string
 * @returns A string with the first letter capitalized
 */
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** 
 * Generate a checkbox and his setters from a store config who interact with a zustand store.
 * 
 * @utility
 * @param storeHook A function that returns the store
 * @param config The store config
 * @returns  An array of checkbox parameters
 */
export function generateChecks<T extends object>(
    storeHook: () => T,
    config: Record<string, any>
  ) {
    return Object.entries(config)
      .filter(([, meta]) => meta.type === "check")
      .map(([key]) => ({
        key,
        label: key.charAt(0).toUpperCase() + key.slice(1),
        value: (s: unknown) => (s as any)[key],
        toggle: (s: unknown) => () => {
          const current = (s as any)[key];
          (s as any)[`set${capitalize(key)}`]?.(!current);
        },
        store: storeHook,
      }));
    }