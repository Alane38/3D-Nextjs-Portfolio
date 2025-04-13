import { useEffect } from "react";
import { useEditToolStore } from "../store/useEditTool.store";

export const MoveToolStats = ({ active }: { active: boolean }) => {
  const { position, setPosition } = useEditToolStore();

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

  return (
    <>
      <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 text-white font-mono text-xl">
        Position: ({position.x.toFixed(2)}, {position.y.toFixed(2)}, {position.z.toFixed(2)})
      </div>
      <div className="fixed top-10 left-1/2 z-50 -translate-x-1/2 text-white font-mono text-xl">
        new Vector3({position.x.toFixed(2)}, {position.y.toFixed(2)}, {position.z.toFixed(2)})
      </div>
    </>
  );
};