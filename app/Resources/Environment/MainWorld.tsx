import Steps from "@core/Element/Environment/Steps";
import DynamicPlatforms from "@core/Element/Objects/DynamicPlatforms";
import FloatingPlatform from "@core/Element/Objects/FloatingPlatform";
import { Character } from "@core/Element/Player/Character";
import { Vehicle } from "@core/Element/Player/Vehicles/Car/Vehicle";
import { RacingVehicle } from "@core/Element/Player/Vehicles/RacingCar/RacingVehicle";
import {
  DiamondComponent,
  Ground,
  GroundComponent,
  KillBrickComponent,
  RestaurantSignComponent,
  SpinnerComponent,
  StairsComponent,
  TextObjectComponent,
} from "@resources/Class";
import { Euler, Vector3 } from "three";

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

      <Character path="FoxPam.fbx" defaultPlayer />

      <group>
        {/* Ground */}
        <GroundComponent model={ground} /> {/* Default Ground  */}
        <GroundComponent
          color="white"
          args={[5, 0.1, (ground.scale as number) / 1.2]}
          position={new Vector3(0, ground.position.y + 0.01, 0)}
        />
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
      <RacingVehicle position={[15, 2, 0]} rotation={[0, Math.PI / 2, 0]} />
      {/* <Vehicle position={[8, 2, 0]} /> */}
    </>
  );
};
