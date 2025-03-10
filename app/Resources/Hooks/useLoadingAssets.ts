import { useEffect, useState } from "react";
import { DefaultLoadingManager } from "three";

export const useLoadingAssets = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const originalOnProgress = DefaultLoadingManager.onProgress;

    DefaultLoadingManager.onProgress = (item, loaded, total) => {
      if (typeof originalOnProgress === "function") {
        originalOnProgress(item, loaded, total);
      }
      setProgress((loaded / total) * 100);
    };

    return () => {
      DefaultLoadingManager.onProgress = originalOnProgress;
    };
  }, []);

  useEffect(() => {
    if (!navigator.gpu) {
      console.warn(
        "WebGPU non disponible, utilisation du CPU pour le chargement des assets.",
      );

      let interval = setInterval(() => {
        setProgress((prev) => (prev < 100 ? prev + 5 : 100));
      }, 500);

      return () => clearInterval(interval);
    }
  }, []);

  return Number(progress.toFixed());
};
