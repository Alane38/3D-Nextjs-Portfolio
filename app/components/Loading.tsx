import { useProdEnv } from "@resources/Hooks";
import { useState, useEffect } from "react";


export const Loading = ({
  progress,
  onSkip,
}: {
  progress: number;
  onSkip: () => void;
}) => {
  const productionMode = useProdEnv();

  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      productionMode ? setShowSkip(true) : onSkip();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-opacity-80 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="animate-gradient-x relative flex h-72 w-72 items-center justify-center rounded-full bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 shadow-2xl">
        <div className="absolute h-full w-full rounded-full bg-gray-800 opacity-60 blur-md" />
        <div className="relative z-10 flex items-center justify-center">
          {/* Loading spinner */}
          <div className="animate-spin-slow h-32 w-32 animate-spin rounded-full border-8 border-t-8 border-neutral-600 border-t-transparent transition-all duration-300 ease-out"></div>
          <div className="animate-fade-in absolute text-3xl font-bold text-white">
            <p>{progress}%</p>
          </div>
        </div>
      </div>

      {/* Skip button (if shown) */}
      {showSkip && productionMode && (
        <button
          onClick={onSkip}
          className="absolute bottom-10 rounded-lg bg-white px-6 py-3 font-semibold text-black shadow-lg transition-all duration-300 hover:bg-gray-300"
        >
          Skip
        </button>
      )}
    </div>
  );
};
