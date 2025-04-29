import { useEffect, useRef } from "react";
import { LockCameraProps } from "../types/LockCamera";
import { PointerLockControls } from "three/examples/jsm/Addons.js";

export const useLockCamera = ({ camera, renderer }: LockCameraProps) => {
  const controls = useRef<PointerLockControls | null>(null);

  const handleMouseMove = (event: MouseEvent) => {
    if (controls.current && controls.current.isLocked) {
      camera.rotation.y -= event.movementX * 0.002; // Sensivity
      camera.rotation.x -= event.movementY * 0.002;
      camera.rotation.x = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, camera.rotation.x),
      ); // Inclination limit
    }
  };

  const handlePointerLockChange = () => {
    if (document.pointerLockElement === renderer.domElement) {
      // Verrouillage réussi
      console.log("Pointer lock enabled");
    } else {
      // Verrouillage annulé
      console.log("Pointer lock disabled");
    }
  };

  const enablePointerLock = () => {
    if (!renderer?.domElement || !camera) return;
    renderer.domElement.requestPointerLock();
  };

  return { 
    handleMouseMove, 
    handlePointerLockChange, 
    enablePointerLock,
    controls 
  };
};

export const LockCamera = ({ camera, renderer }: LockCameraProps) => {
  const { handleMouseMove, handlePointerLockChange, enablePointerLock, controls } =
    useLockCamera({ camera, renderer });

  useEffect(() => {
    if (!renderer?.domElement || !camera) return;

    controls.current = new PointerLockControls(camera, renderer.domElement);

    const togglePointerLock = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        if (controls.current && controls.current.isLocked) {
          document.exitPointerLock();
        } else {
          enablePointerLock();
        }
      }
    };

    // Fonction pour verrouiller la caméra au clic
    const handleClick = () => {
      enablePointerLock();
    };

    document.addEventListener("keydown", togglePointerLock);
    document.addEventListener("pointerlockchange", handlePointerLockChange);
    document.addEventListener("mousemove", handleMouseMove);
    renderer.domElement.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("keydown", togglePointerLock);
      document.removeEventListener("pointerlockchange", handlePointerLockChange);
      document.removeEventListener("mousemove", handleMouseMove);
      renderer.domElement.removeEventListener("click", handleClick);
    };
  }, [camera, renderer, handleMouseMove, handlePointerLockChange, enablePointerLock]);

  return null;
};