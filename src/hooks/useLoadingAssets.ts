import { useEffect, useState } from "react";
import { DefaultLoadingManager } from "three";

/**
 * This custom React hook, useLoadingAssets, is designed to track the loading of resources in a Three.js scene 
 * (via DefaultLoadingManager) and return a percentage of loading progress.
 * 
 * @returns {number}
 */
export const useLoadingAssets = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Save the onProgress function
    const originalOnProgress = DefaultLoadingManager.onProgress;

    DefaultLoadingManager.onProgress = (item, loaded, total) => {
      if (typeof originalOnProgress === "function") {
        originalOnProgress(item, loaded, total);
      }

      setProgress((loaded / total) * 100);
    };

    return () => {
      // Reset the onProgress function
      DefaultLoadingManager.onProgress = originalOnProgress;
    };
  }, []);
  
  return Number(progress.toFixed());
};