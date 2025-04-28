import { useSky } from "@/hooks";
import { Sky } from "@react-three/drei";
import { useControls } from "leva";
import { Fragment } from "react";
import { Euler, Vector3 } from "three";
import { Character } from "../core/character/Character";
import {
  Diamond,
  DiamondComponent,
  Ground,
  GroundComponent,
  KillBrick,
  KillBrickComponent,
  NeonDoor,
  NeonDoorComponent,
  Object,
  ObjectComponent,
  RestaurantSign,
  RestaurantSignComponent,
  Spinner,
  SpinnerComponent,
  Stairs,
  StairsComponent
} from "../core/class";
import { KinematicMovingPlatformComponent, KinematicMovingPlatformEntity } from "../core/class/entities/platform/dynamic/KineticMovingPlatform";
import { FPPushtoMove, FPPushtoMoveComponent } from "../core/class/entities/platform/floating/FPPushtoMove";
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
      <GroundComponent entity={new Ground()}/>
      {/* Entity Importations */}
      <group>
        {/* <TextObjectComponent
          position={new Vector3(3, 1, 0)}
          TextProps={{ text: "NEWALFOX" }}
        /> */}

        <DiamondComponent position={new Vector3(18, 2, 10)} entity={new Diamond()} />
        <DiamondComponent position={new Vector3(14, 2, 10)} entity={new Diamond()} />
        <ObjectComponent position={new Vector3(0, 0.75, 0)} entity={new Object()} />
      </group>
      <group>
        {/* Entity Importations */}
        {/* <Steps /> */}
        <SpinnerComponent
          position={new Vector3(10, 1, 20)}
          speed={rotateSpeed.speed}
          entity={new Spinner()}
        />
        <KillBrickComponent
          position={new Vector3(15, 1, 15)}
          entity={new KillBrick()}
        />
        <RestaurantSignComponent
          position={new Vector3(6, 0.75, 6)}
          rotation={new Euler(0, Math.PI / 4, 0)}
          entity={new RestaurantSign()}
        />
      </group>
      <group>
        {/* Platforms Events Examples */}
        <FPPushtoMoveComponent position={new Vector3(30, 5, 0)} entity={new FPPushtoMove()} />
        <KinematicMovingPlatformComponent position={new Vector3(20, 5, 20)} entity={new KinematicMovingPlatformEntity()}/>
      </group>
      {/* OTHERS */}
      <StairsComponent
        position={new Vector3(-30, 0, 15)}
        rotation={new Euler(0, 0, 0)}
        entity={new Stairs()}
      />
      {/* <RacingVehicle position={[15, 2, 0]} rotation={[0, Math.PI / 2, 0]} /> */}
      {/* <Vehicle position={[8, 2, 0]} /> */}
      <NeonDoorComponent position={new Vector3(11.0, 0.34, -7.0)} scale={2} entity={new NeonDoor()}/>
      <EditTool />
    </>
  );
}
