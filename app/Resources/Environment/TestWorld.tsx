import { CharacterController } from "@/app/Core/Player/CharacterController";
import { Ground, GroundComponent } from "../Class/Ground";
import { KeyboardControls } from "@react-three/drei";
import { RacingVehicle, racingVehicleControls } from "@/app/Core/Player/Vehicles/RacingCar/RacingVehicle";

export const TestWorld = () => {
  const ground = new Ground();

  return (
    <>
      <GroundComponent model={ground} />

      {/* <CharacterController /> */}

      <KeyboardControls map={racingVehicleControls}>
        <RacingVehicle position={[4, 2, 0]} rotation={[0, Math.PI / 2, 0]} />
      </KeyboardControls>
    </>
  );
};
