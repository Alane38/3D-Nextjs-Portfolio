import { RapierRigidBody } from "@react-three/rapier";

// RapierObject<RapierRigidBody> or <RapierRigidBody>
export interface customRigidBody extends RapierRigidBody {
  rotateCamera?: (x: number, y: number) => void;
  rotateCharacterOnY?: (rad: number) => void;
}
