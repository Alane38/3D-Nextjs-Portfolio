import { RapierRigidBody } from "@react-three/rapier";
import { Vector3 } from "three";

// RapierObject<RapierRigidBody> or <RapierRigidBody>
export interface customRigidBody extends RapierRigidBody {
  rotateCamera?: (x: number, y: number) => void;
  rotateCharacterOnY?: (rad: number) => void;
}
