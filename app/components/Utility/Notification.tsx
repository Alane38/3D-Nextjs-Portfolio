import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface NotificationProps {
  title: string;
  message: string;
  description?: string;
  color?: string;
  icon?: React.ReactNode;
  duration?: number;
}

export const Notification = ({
  title,
  message,
  description,
  color = "neutral",
  icon,
  duration = 4000,
}: NotificationProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible) return null;

  return (
    <motion.div
      className={`fixed right-4 bottom-4 z-50 flex w-80 max-w-sm items-start space-x-3 rounded-lg bg-${color}-900 p-4 text-white shadow-lg`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-1">
        <h1 className="text-sm font-semibold">{title}</h1>
        <p className="text-xs">{message}</p>
        {description && <p className="mt-1 text-xs opacity-75">{description}</p>}
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="text-white opacity-50 hover:opacity-100 focus:outline-none"
      >
        ✕
      </button>
    </motion.div>
  );
};
