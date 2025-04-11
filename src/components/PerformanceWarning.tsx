import { useEffect, useState } from "react";
import WebGPU from "three/examples/jsm/capabilities/WebGPU.js";
import { Notification } from "./Notification"; // Import the Notification component

export const PerformanceWarning = () => {
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClosed(true);
    }, 5000); // Duration of the warning before auto-close
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosed(true);
  };

  // If WebGPU is available or if the warning is closed, do not show the notification
  if (WebGPU.isAvailable() || isClosed) return null;

  return (
    <Notification
      title="WebGPU not supported"
      message="For optimal performance, use a browser that supports WebGPU."
      description="Browsers like Chrome, Edge, and Firefox Beta offer the best experience."
      color="red"
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>
      }
      duration={5000} // Set the duration for how long the notification is visible
    />
  );
};
