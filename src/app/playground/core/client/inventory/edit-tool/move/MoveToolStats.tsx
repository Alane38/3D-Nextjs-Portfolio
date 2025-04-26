import { useEffect } from "react";
import { useEditToolStore } from "../store/useEditTool.store";

/**
 * Show values related to the move tool
 *
 * @component
 * @param {boolean} active - Whether the move tool is active
 * @returns {JSX.Element}
 */
export const MoveToolStats = ({ active }: { active: boolean }) => {
  // Store initialization
  const { position, selectedEntity, setPosition } = useEditToolStore();

  // Event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setPosition((prev) => {
        const delta = 0.5; // you can adjust this step size

        switch (e.key) {
          case "ArrowUp":
            return { ...prev, z: prev.z - delta };
          case "ArrowDown":
            return { ...prev, z: prev.z + delta };
          case "ArrowLeft":
            return { ...prev, x: prev.x - delta };
          case "ArrowRight":
            return { ...prev, x: prev.x + delta };
          case "PageUp":
            return { ...prev, y: prev.y + delta };
          case "PageDown":
            return { ...prev, y: prev.y - delta };
          default:
            return prev;
        }
      });
    };

    if (active) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [active, setPosition]);

  if (!active) return null;

  // TODO: position.x is undefined 

  return (
    <>
      <div className="fixed bottom-4 z-50 flex flex-col gap-2 font-mono text-xl text-white">
        <div className="flex flex-col items-start justify-center gap-4 px-4">
          <div className="bg-popover-foreground flex gap-2 rounded-lg p-2 text-sm font-bold uppercase">
            <p>selected</p>
            <p className="text-orange-400">{selectedEntity?.entityId}</p>
          </div>
          <div className="bg-popover-foreground flex gap-2 rounded-lg p-2 text-sm font-bold uppercase">
            <p>Position</p>
            <p>
              {" "}
              ({position.x.toFixed(2)}, {position.y.toFixed(2)},{" "}
              {position.z.toFixed(2)})
            </p>
          </div>
          <div className="bg-popover-foreground flex gap-2 rounded-lg p-2 text-sm font-bold uppercase">
            <p>new Vector3</p>
            <p>
              ({position.x.toFixed(2)}, {position.y.toFixed(2)},{" "}
              {position.z.toFixed(2)})
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
