import { useSky } from "@/hooks";
import { Sky } from "@react-three/drei";
import { useControls } from "leva";
import { Fragment } from "react";
import { Euler, Vector3 } from "three";
import { Character } from "../core/character/Character";
import {
  DiamondComponent,
  GroundComponent,
  KillBrickComponent,
  NeonDoorComponent,
  ObjectComponent,
  RestaurantSignComponent,
  SpinnerComponent,
  StairsComponent
} from "../core/class";
import { KinematicMovingPlatformComponent } from "../core/class/entities/platform/dynamic/KineticMovingPlatform";
import { FPPushtoMoveComponent } from "../core/class/entities/platform/floating/FPPushtoMove";
import { useEntityStore } from "../core/class/entity.store";
import { EditTool } from "../core/client/inventory/edit-tool/EditTool";

export function MainWorld() {
  // Leva Const initialization
  const rotateSpeed = useControls("RotateSpeed", {
    speed: { value: 1, step: 0.3 },
  });
  const sky = useSky();

  // Store initialization
  const { entities } = useEntityStore();

  /* INITIALIZATION */

  // Ground Class
  // const ground = new Ground();

  /* Example of class integration.
  const pathGround = new Ground();
  pathGround.color = "white";
  pathGround.scale = [5, (ground.scale as number) / 1.2, 1];
  pathGround.position.set(0, ground.position.y + 0.01, 0); */

  // useEffect(() => {
  //   setTimeout(() => {
  //     EntityManager.removeInstanceByEntityName("Diamond2");
  //     console.log("Diamond2 removed");
  //   }, 10000)
  // }, [])

  return (
    <>
      {/* Load Entities */}
      {entities?.map((entity, i) => (
        <Fragment key={i}>{entity.renderComponent()}</Fragment>
      ))}
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
      {/* Ground */}
      <GroundComponent />
      {/* Entity Importations */}
      <group>
        {/* <TextObjectComponent
          position={new Vector3(3, 1, 0)}
          TextProps={{ text: "NEWALFOX" }}
        /> */}

        <DiamondComponent position={new Vector3(18, 2, 10)} />
        <DiamondComponent position={new Vector3(16, 2, 10)}  />
        <DiamondComponent position={new Vector3(14, 2, 10)}  />
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
        <KillBrickComponent
          position={new Vector3(15, 1, 10)}
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
      <NeonDoorComponent position={new Vector3(11.0, 0.34, -7.0)} scale={2} />
      <EditTool />
    </>
  );
}
