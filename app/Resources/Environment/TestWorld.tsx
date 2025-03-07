import { PrismGeometryComponent } from "@core/Element/Mesh/PrismGeometry";
import { RacingVehicle } from "@core/Element/Player/Vehicles/RacingCar/RacingVehicle";
import { OrbitControls } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { Ground, GroundComponent } from "@resources/Class";
import { Vector2 } from "three";

export const TestWorld = () => {
  const ground = new Ground();
  // prism
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

      <RacingVehicle
        defaultPlayer
        position={[4, 2, 0]}
        rotation={[0, Math.PI / 2, Math.PI]}
      />
    </>
  );
};
