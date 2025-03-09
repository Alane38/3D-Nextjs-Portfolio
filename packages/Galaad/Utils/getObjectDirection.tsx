import * as THREE from "three";

// Get the direction of the object, specially a character. 
export type ObjectDirection = {
    forward: boolean;
    back: boolean;
    left: boolean;
    right: boolean;
    pivot: THREE.Object3D;
}

export const getObjectDirection = (forward: boolean,
  backward: boolean,
  leftward: boolean,
  rightward: boolean,
  pivot: THREE.Object3D)
  : number | null => {
  if (!forward && !backward && !leftward && !rightward) return null;
  if (forward && leftward) return pivot.rotation.y + Math.PI / 4;
  if (forward && rightward) return pivot.rotation.y - Math.PI / 4;
  if (backward && leftward) return pivot.rotation.y - Math.PI / 4 + Math.PI;
  if (backward && rightward) return pivot.rotation.y + Math.PI / 4 + Math.PI;
  if (backward) return pivot.rotation.y + Math.PI;
  if (leftward) return pivot.rotation.y + Math.PI / 2;
  if (rightward) return pivot.rotation.y - Math.PI / 2;
  if (forward) return pivot.rotation.y;

  return null // ✅ Ensures the function always returns a value
};