import * as THREE from "three";

// Racing Vehicle Props
export type VehicleProps = {
  defaultPlayer?: boolean;
  position: THREE.Vector3Tuple;
  rotation: THREE.Vector3Tuple;
};
