import React from "react";

export const Loading = ({ progress }: { progress: number }) => {
  return (
    <div className="bg-opacity-80 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="relative flex h-72 w-72 items-center justify-center rounded-full bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 animate-gradient-x shadow-2xl">
        <div className="absolute h-full w-full rounded-full bg-gray-800 opacity-60 blur-md" />
        <div className="relative z-10 flex items-center justify-center">
          {/* Loading spinner */}
          <div className="h-32 w-32 animate-spin-slow rounded-full border-8 border-t-8 border-neutral-600 border-t-transparent animate-spin transition-all duration-300 ease-out"></div>
          <div className="absolute text-3xl font-bold text-white animate-fade-in">
            <p>{progress}%</p> {/* Progress percentage */}
          </div>
        </div>
      </div>
    </div>
  );
};
