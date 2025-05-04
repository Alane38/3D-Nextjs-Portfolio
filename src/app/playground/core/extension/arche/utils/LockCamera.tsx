import { useEffect, useRef, useCallback } from "react";
import { LockCameraProps } from "../types/LockCamera";
import { PointerLockControls } from "three/examples/jsm/Addons.js";
import { useEditToolStore } from "../../../client/inventory/edit-tool/store/useEditTool.store";

export const useLockCamera = ({ camera, renderer }: LockCameraProps) => {
  const controls = useRef<PointerLockControls | null>(null);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (controls.current && controls.current.isLocked) {
        camera.rotation.y -= event.movementX * 0.002; // Sensitivity
        camera.rotation.x -= event.movementY * 0.002;
        camera.rotation.x = Math.max(
          -Math.PI / 2,
          Math.min(Math.PI / 2, camera.rotation.x),
        );
      }
    },
    [camera],
  );

  const handlePointerLockChange = useCallback(() => {
    const isLocked = document.pointerLockElement === renderer.domElement;
    console.log(`Pointer lock ${isLocked ? "enabled" : "disabled"}`);
  }, [renderer]);

  const enablePointerLock = useCallback(() => {
    if (renderer?.domElement && camera) {
      renderer.domElement.requestPointerLock();
    }
  }, [renderer, camera]);

  return {
    handleMouseMove,
    handlePointerLockChange,
    enablePointerLock,
    controls,
  };
};

export const LockCamera = ({ camera, renderer }: LockCameraProps) => {
  const {
    handleMouseMove,
    handlePointerLockChange,
    enablePointerLock,
    controls,
  } = useLockCamera({ camera, renderer });

  // edit tool State
  const { moveToolEnabled, scaleToolEnabled } = useEditToolStore();

  useEffect(() => {
    if (!renderer?.domElement || !camera) return;

    controls.current = new PointerLockControls(camera, renderer.domElement);

    const togglePointerLock = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        if (controls.current?.isLocked) {
          document.exitPointerLock();
        } else {
          enablePointerLock();
        }
      }
    };

    const handleClick = () => {
      if (moveToolEnabled || scaleToolEnabled) return;
      enablePointerLock();
    };

    document.addEventListener("keydown", togglePointerLock);
    document.addEventListener("pointerlockchange", handlePointerLockChange);
    document.addEventListener("mousemove", handleMouseMove);
    renderer.domElement.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("keydown", togglePointerLock);
      document.removeEventListener(
        "pointerlockchange",
        handlePointerLockChange,
      );
      document.removeEventListener("mousemove", handleMouseMove);
      renderer.domElement.removeEventListener("click", handleClick);
    };
  }, [
    camera,
    renderer,
    handleMouseMove,
    handlePointerLockChange,
    enablePointerLock,
    moveToolEnabled,
    scaleToolEnabled,
  ]);

  return null;
};
