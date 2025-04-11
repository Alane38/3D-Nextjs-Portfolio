import { WheelInfo } from "@/app/modules/player/character/vehicles/racingCar/use-vehicle-controller";
import * as THREE from "three";

// Racing Vehicle Spawn
export const spawn = {
  position: [0, 2, 0] as THREE.Vector3Tuple,
  rotation: [0, Math.PI / 2, 0] as THREE.Vector3Tuple,
};

// Racing Vehicle Wheels
export const wheelInfo: Omit<WheelInfo, "position"> = {
  axleCs: new THREE.Vector3(0, 0, -1),
  suspensionRestLength: 0.125,
  suspensionStiffness: 24,
  maxSuspensionTravel: 1,
  radius: 0.15,
};

//Racing Vehicle Wheels Position
export const wheels: WheelInfo[] = [
  // front
  { position: new THREE.Vector3(-0.65, -0.15, -0.45), ...wheelInfo },
  { position: new THREE.Vector3(-0.65, -0.15, 0.45), ...wheelInfo },
  // rear
  { position: new THREE.Vector3(0.65, -0.15, -0.45), ...wheelInfo },
  { position: new THREE.Vector3(0.65, -0.15, 0.45), ...wheelInfo },
];
