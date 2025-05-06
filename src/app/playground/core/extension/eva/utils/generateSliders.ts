/** 
 * Generate a slider and his setters from a store config who interact with a zustand store.
 * 
 * @utility
 * @param storeHook A function that returns the store
 * @param config The store config
 * @returns An array of sliders parameters
 */
export function generateSliders<T extends object>(
    storeHook: () => T,
    config: Record<string, any>
  ) {
    const sliders = Object.entries(config)
      .filter(([, meta]) => meta.type === "slider")
      .map(([key, meta]) => ({
        key,
        label: key.charAt(0).toUpperCase() + key.slice(1),
        value: (s: unknown) => (s as any)[key],
        setValue: (s: unknown) => (v: string | number) =>
          (s as any).setSky({ [key]: typeof v === "string" ? parseFloat(v) : v }),
        store: storeHook,
        ...(meta.min !== undefined && { min: meta.min }),
        ...(meta.max !== undefined && { max: meta.max }),
        ...(meta.step !== undefined && { step: meta.step }),
      }));
    return sliders;
  }
  