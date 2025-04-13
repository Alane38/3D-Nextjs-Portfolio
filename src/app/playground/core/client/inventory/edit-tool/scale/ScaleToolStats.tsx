import { useEditToolStore } from "../store/useEditTool.store";

export const ScaleToolStats = ({ active }: { active: boolean }) => {
  const { scale, scaleMode, setScaleMode } = useEditToolStore();

  if (!active) return null;

  return (
    <>
      <div className="fixed top-4 left-1/2 z-50 flex -translate-x-1/2 flex-col font-mono text-xl text-white">
        <button
          onClick={() =>
            setScaleMode(scaleMode === "free" ? "uniform" : "free")
          }
          className="mb-2 rounded bg-gray-800 p-2 hover:bg-gray-700"
        >
          Mode: {scaleMode}
        </button>

        <p>
          Scale: {scale.x.toFixed(2)} x {scale.y.toFixed(2)} x{" "}
          {scale.z.toFixed(2)} ({scaleMode})
        </p>
      </div>
    </>
  );
};
