import { useSky } from "@/hooks";
import { Sky } from "@react-three/drei";
import { useControls } from "leva";
import { Euler, Vector3 } from "three";
import { Character } from "../core/character/Character";
import {
  DiamondComponent,
  Ground,
  GroundComponent,
  KillBrickComponent,
  NeonDoorComponent,
  ObjectComponent,
  RestaurantSignComponent,
  SpinnerComponent,
  StairsComponent,
} from "../core/class";
import { KinematicMovingPlatformComponent } from "../core/class/entities/platform/dynamic/KineticMovingPlatform";
import { FPPushtoMoveComponent } from "../core/class/entities/platform/floating/FPPushtoMove";
import { MoveTool } from "../core/client/inventory/move-tool/MoveTool";

export const MainWorld = () => {
  /* Leva Settings */
  const sky = useSky();

  const rotateSpeed = useControls("RotateSpeed", {
    speed: { value: 1, step: 0.3 },
  });

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
      <Sky
        turbidity={sky.turbidity}
        rayleigh={sky.rayleigh}
        mieCoefficient={sky.mieCoefficient}
        mieDirectionalG={sky.mieDirectionalG}
        azimuth={sky.azimuth}
        distance={sky.distance}
        inclination={0}
        sunPosition={sky.sunPosition}
      />
      <Character
        name="Player"
        path="FoxPam.fbx"
        position={[0, 20, 0]}
        defaultPlayer
      />

      <group>
        {/* Ground */}
        <GroundComponent model={ground} /> {/* Default Ground  */}
        <GroundComponent
          color="black"
          args={[5, 0.1, (ground.scale as number) / 1.2]}
          position={new Vector3(0, ground.position.y + 0.01, 0)}
        />
        {/* Custom Ground with props includes */}
      </group>

      <group>
        {/* Entity Importations */}
        {/* <TextObjectComponent
          position={new Vector3(3, 1, 0)}
          TextProps={{ text: "NEWALFOX" }}
        /> */}

        <DiamondComponent position={new Vector3(10, 2, 10)} />
        <ObjectComponent position={new Vector3(0, 0.5, 0)} />
      </group>

      <group>
        {/* Entity Importations */}
        {/* <Steps /> */}
        <SpinnerComponent
          position={new Vector3(10, 1, 20)}
          speed={rotateSpeed.speed}
        />
        <KillBrickComponent position={new Vector3(15, 1, 10)} />
        <RestaurantSignComponent
          position={new Vector3(6, 0.5, 6)}
          rotation={new Euler(0, Math.PI / 4, 0)}
        />
      </group>

      <group>
        {/* Platforms Events Examples */}
        <FPPushtoMoveComponent position={new Vector3(15, 5, 15)} />
        <KinematicMovingPlatformComponent position={new Vector3(20, 5, 20)} />
      </group>

      {/* OTHERS */}
      <StairsComponent
        position={new Vector3(-30, 0, 15)}
        rotation={new Euler(0, 0, 0)}
      />

      {/* <RacingVehicle position={[15, 2, 0]} rotation={[0, Math.PI / 2, 0]} /> */}
      {/* <Vehicle position={[8, 2, 0]} /> */}

      <NeonDoorComponent position={new Vector3(11.00, 0.34, -7.00)} scale={2} />

      <MoveTool />
    </>
  );
};
