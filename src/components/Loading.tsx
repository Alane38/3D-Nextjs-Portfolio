import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export const Loading = ({
  progress,
  onSkip,
}: {
  progress: number;
  onSkip: () => void;
}) => {
  const [visualProgress, setVisualProgress] = useState(0);

  // Smooth visual progress
  useEffect(() => {
    let raf: number;

    const updateProgress = () => {
      setVisualProgress((prev) => {
        const target = progress;
        const speed = 1; // Fill speed in %

        if (prev < target) {
          const next = Math.min(prev + speed, target);
          return next;
        }
        return prev;
      });

      raf = requestAnimationFrame(updateProgress);
    };

    raf = requestAnimationFrame(updateProgress);

    return () => cancelAnimationFrame(raf);
  }, [progress]);

  // Skip after 10 seconds(IMPORTANT)
  useEffect(() => {
    const timer = setTimeout(() => {
      onSkip();
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-popover absolute z-50 flex h-full w-full">
      <Image
        src="/assets/images/tridfolio_loading.png"
        alt="loading"
        fill
        className="w-full h-full absolute object-cover"
      />
      <div className="flex w-full flex-col items-center justify-end">
        {/* Loading bar animation (smooth visual progress) */}
        <motion.div
          className="bg-primary absolute bottom-0 left-0 z-60 h-2 max-w-full"
          initial={{ width: 0 }}
          animate={{ width: `${visualProgress}%` }}
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
