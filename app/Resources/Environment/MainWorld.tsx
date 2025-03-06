import DynamicPlatforms from "@/app/Core/DynamicPlatforms";
import FloatingPlatform from "@/app/Core/FloatingPlatform";
import { CharacterController } from "@/app/Core/Player/CharacterController";
import Steps from "@/app/Core/Steps";
import { KeyboardControls } from "@react-three/drei";
import { DiamondComponent } from "@resources/Class/Diamond";
import { Ground, GroundComponent } from "@resources/Class/Ground";
import { TextObjectComponent } from "@resources/Class/TextObject";
import { Euler, Vector3 } from "three";
import { KillBrickComponent } from "../Class/KillBrick";
import { RestaurantSignComponent } from "../Class/RestaurantSign";
import { SpinnerComponent } from "../Class/Spinner";
import { StairsComponent } from "../Class/Stairs";
import { RacingVehicle, racingVehicleControls } from "@/app/Core/Player/Vehicles/RacingCar/RacingVehicle";

export const MainWorld = () => {
  /* INITIALIZATION */

  // Ground Class
  const ground = new Ground();

  /* Example of class integration.
  const pathGround = new Ground();
  pathGround.color = "white";
  pathGround.scale = [5, (ground.scale as number) / 1.2, 1];
  pathGround.position.set(0, ground.position.y + 0.01, 0); */

  return (
    <>
      {/* <ObjectComponent /> */}

      {/* <KeyboardControls map={vehicleControls}>
        <Vehicle position={[15, 2, 0]} />
      </KeyboardControls> */}
      <CharacterController />

      <group>
        {/* Ground */}
        <GroundComponent model={ground} /> {/* Default Ground  */}
        <GroundComponent
          color="white"
          args={[5, 0.1, (ground.scale as number) / 1.2]}
          position={new Vector3(0, ground.position.y + 0.01, 0)}
        />{" "}
        {/* Custom Ground with props includes */}
      </group>

      <group>
        {/* Entity Importations */}
        <TextObjectComponent
          position={new Vector3(3, 1, 0)}
          TextProps={{ text: "NEWALFOX" }}
        />

        <DiamondComponent position={new Vector3(3, 2, 0)} />
      </group>

      <group>
        {/* Entity Importations */}
        <Steps />
        <SpinnerComponent position={new Vector3(-7, 0, 0)} speed={10} />
        <KillBrickComponent position={new Vector3(0, 2, 6)} />
        <RestaurantSignComponent
          position={new Vector3(4, 0, 4)}
          rotation={new Euler(0, Math.PI / 4, 0)}
        />
      </group>

      <group>
        {/* Platforms Events Examples */}
        <FloatingPlatform />
        <DynamicPlatforms />
      </group>

      {/* OTHERS */}
      <StairsComponent
        position={new Vector3(-20, 0, 10)}
        rotation={new Euler(0, Math.PI / 2, 0)}
      />

      {/* <GlobalUI /> */}

       <KeyboardControls map={racingVehicleControls}>
        <RacingVehicle position={[15, 2, 0]} rotation={[0, Math.PI / 2, 0]} />
      </KeyboardControls>
    </>
  );
};
