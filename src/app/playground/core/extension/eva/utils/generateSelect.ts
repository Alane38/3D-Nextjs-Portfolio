
/**
 * 
 * @param s A string
 * @returns A string with the first letter capitalized
 */
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** 
 * Generate select options and setters from a store config who interact with a zustand store.
 * 
 * @utility
 * @param storeHook A function that returns the store
 * @param config The store config
 * @returns An array of select options
 */
export function generateSelect<T extends object>(
  storeHook: () => T,
  config: Record<
    string,
    { type: "select"; options: { label: string; value: string | number }[] }
  >,
) {
  return Object.entries(config).map(([key, meta]) => ({
    key,
    label: capitalize(key),
    value: (s: unknown) => (s as any)[key],
    setValue: (s: unknown) => (v: string | number) =>
      (s as any)[`set${capitalize(key)}`]?.(v),
    store: storeHook,
    options: meta.options,
  }));
}

