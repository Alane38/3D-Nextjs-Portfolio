import { KeyboardControls, OrbitControls } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import {
  Vector2
} from "three";
import { RacingVehicle, racingVehicleControls } from "../core/character/vehicles/racing-car/RacingVehicle";
import { Ground, GroundComponent } from "../core/class";
import { PrismGeometryComponent } from "../core/class/entities/mesh/PrismGeometry";

export const TestWorld = () => {
  const ground = new Ground();
  // prims
  const A = new Vector2(9, 1);
  const B = new Vector2(0, -4);

  return (
    <>
      <OrbitControls />

      <GroundComponent model={ground} />

      {/* <CharacterController /> */}

      <RigidBody
        type="fixed"
        colliders="hull"
        position={[0, 1, 7]}
        rotation={[0, Math.PI, Math.PI]}
      >
        <PrismGeometryComponent vertices={[A, B]} height={20} />
      </RigidBody>

      <KeyboardControls map={racingVehicleControls}>
        <RacingVehicle
          position={[4, 2, 0]}
          rotation={[0, 0, 0]}
        />
      </KeyboardControls>
    </>
  );
};