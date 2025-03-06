import React, { useState, useEffect } from "react";
import WebGPU from "three/examples/jsm/capabilities/WebGPU.js";
import { motion } from "framer-motion";

export const PerformanceWarning = () => {
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClosed(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosed(true);
  };

  if (!WebGPU.isAvailable() && !isClosed) {
    return (
      <motion.div
        className="fixed top-4 left-1/2 z-10000 w-full max-w-lg -translate-x-1/2 transform rounded-lg bg-gradient-to-r from-red-500 to-red-700 p-4 shadow-2xl"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <svg
              className="h-6 w-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7h2a4 4 0 01-4 4H7M13 7V3m0 4l4-4m0 4l-4-4M17 3h2a4 4 0 00-4 4M3 3v18h18V3H3z"
              />
            </svg>
          </div>
          <div className="flex-1 text-white">
            <h1 className="text-lg font-semibold">WebGPU not supported</h1>
            <p className="text-sm">
              For optimal performance, use a browser that supports WebGPU.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-300 focus:outline-none"
          >
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="mt-2 text-xs text-white opacity-80">
          <p>
            Browsers like Chrome, Edge, and Firefox Beta offer the best
            experience.
          </p>
        </div>
      </motion.div>
    );
  }

  return null;
};
