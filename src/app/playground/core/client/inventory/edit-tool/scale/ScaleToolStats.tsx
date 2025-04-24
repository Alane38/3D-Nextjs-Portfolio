import { Button } from "@/components/ui/button";
import { useEditToolStore } from "../store/useEditTool.store";

/**
 * Show values related to the scale tool
 *
 * @component
 * @param {boolean} active - Whether the scale tool is active
 * @returns {JSX.Element}
 */
export const ScaleToolStats = ({ active }: { active: boolean }) => {
  // Store initialization
  const { scale, scaleMode, setScaleMode } = useEditToolStore();

  if (!active) return null;

  return (
    <>
      <div className="fixed bottom-4 z-50 flex flex-col px-4 font-mono text-xl text-white">
        <div className="flex flex-col items-start justify-center gap-2">
          <div className="flex rounded-lg text-sm font-bold hover:scale-105">
            <Button
              variant="default"
              onClick={() =>
                setScaleMode(scaleMode === "free" ? "uniform" : "free")
              }
              className="uppercase"
            >
              Mode {scaleMode}
            </Button>
          </div>

          <div className="bg-primary flex gap-2 rounded-lg p-2 text-sm font-bold uppercase">
            <p>Scale</p>
            <p>
              {scale.x.toFixed(2)} x {scale.y.toFixed(2)} x{" "}
              {scale.z.toFixed(2)}{" "}
            </p>
            <p>({scaleMode})</p>
          </div>
        </div>
      </div>
    </>
  );
};
