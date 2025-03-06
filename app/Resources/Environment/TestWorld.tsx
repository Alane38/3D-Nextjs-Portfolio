import { Character } from "@core/Element/Player/Character";
import { RacingVehicle } from "@core/Element/Player/Vehicles/RacingCar/RacingVehicle";
import { Ground, GroundComponent } from "../Class";

export const TestWorld = () => {
  const ground = new Ground();

  return (
    <>
      <GroundComponent model={ground} />

      {/* <Character /> */}
      <RacingVehicle position={[4, 2, 0]} rotation={[0, Math.PI / 2, 0]} />
    </>
  );
};
