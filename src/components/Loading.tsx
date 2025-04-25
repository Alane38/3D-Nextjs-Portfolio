import { useEffect } from "react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

export const Loading = ({
  progress,
  onSkip,
}: {
  progress: number;
  onSkip: () => void;
}) => {

  // Skip after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
        onSkip();
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-popover-foreground absolute z-50 flex h-full w-full">
      <div className="flex w-full flex-col items-center justify-end">
      {/* Loading bar animation (if shown), works with progress value */}
        <motion.div
          className="bg-primary absolute bottom-0 left-0 z-60 h-2 max-w-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ ease: "easeOut", duration: 0.2 }}
        />

        {/* Skip button */}
        <Button
          onClick={onSkip}
          className="absolute bottom-0 h-12 w-full cursor-pointer rounded-none bg-black/50 px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-black/80"
        >
          (skip)
        </Button>
      </div>
    </div>
  );
};
