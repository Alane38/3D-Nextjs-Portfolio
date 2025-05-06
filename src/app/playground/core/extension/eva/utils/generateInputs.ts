/** 
 * Generate an ipunt and his setters from a store config who interact with a zustand store.
 * 
 * @utility
 * @param storeHook A function that returns the store
 * @param config The store config
 * @returns An array of input parameters
 */
export function generateInputs<T extends object>(
    storeHook: () => T,
    config: Record<string, any>
  ) {
    return Object.entries(config)
      .filter(([, meta]) => meta.type === "input")
      .map(([key]) => ({
        key,
        label: key.charAt(0).toUpperCase() + key.slice(1),
        value: (s: unknown) => (s as any)[key],
        setValue: (s: unknown) => (v: string | number) =>
          (s as any).setSky?.({ [key]: typeof v === "string" ? parseFloat(v) : v }),
        store: storeHook,
      }));
  }