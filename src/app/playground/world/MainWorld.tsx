import { Sky } from "@react-three/drei";
import { useControls } from "leva";
import { Fragment, useMemo } from "react";
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
  StairsComponent,
} from "../core/class";
import {
  KinematicMovingPlatformComponent,
  KinematicMovingPlatformEntity,
} from "../core/class/entities/platform/dynamic/KineticMovingPlatform";
import {
  FPPushtoMove,
  FPPushtoMoveComponent,
} from "../core/class/entities/platform/floating/FPPushtoMove";
import { useEntityStore } from "../core/class/entity.store";
import { EditTool } from "../core/client/tool-bar/edit-tool/EditTool";
import { useSkyStore } from "../core/extension/eva/store/useSkyStore";
import { useSpinnerStore } from "../core/extension/eva/store/useSpinnerStore";
import { Player } from "../core/client/player-selection/Player";

export function MainWorld() {
  // Leva Const initialization
  const spinnerSpeed = useSpinnerStore((state) => state.speed);

  const sky = useSkyStore();

  // Store initialization
  const { entities } = useEntityStore();

  // Entity initialization(not necessary but useful for performance and avoid bugs(like the rotation speed of the spinner don't update when changing the speed))
  const spinnerEntity = useMemo(() => new Spinner(), []);

  return (
    <>
      {/* Load Entities */}
      {entities?.map((entity, i) => (
        <Fragment key={i}>{entity.renderComponent()}</Fragment>
      ))}
      {/* Soil & Sky */}
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
      <GroundComponent entity={new Ground()} />

      {/* Player */}
      <Player />

      {/* Entity Importations */}
      <group>
        {/* TODO: Fix auto generated id of entity, if u put multiple diamonds, it's crash all the game. */}
        <DiamondComponent
          position={new Vector3(14, 2, 10)}
          entity={new Diamond()}
        />
        <ObjectComponent
          position={new Vector3(0, 0.75, 0)}
          entity={new Object()}
        />
      </group>

      <group>
        <SpinnerComponent
          position={new Vector3(10, 1, 20)}
          speed={spinnerSpeed}
          entity={spinnerEntity}
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
        <FPPushtoMoveComponent
          position={new Vector3(30, 5, 0)}
          entity={new FPPushtoMove()}
        />
        <KinematicMovingPlatformComponent
          position={new Vector3(20, 5, 20)}
          entity={new KinematicMovingPlatformEntity()}
        />
      </group>

      {/* OTHERS */}
      <StairsComponent
        position={new Vector3(-30, 0, 15)}
        rotation={new Euler(0, 0, 0)}
        entity={new Stairs()}
      />
      <NeonDoorComponent
        position={new Vector3(11.0, 0.34, -7.0)}
        scale={2}
        entity={new NeonDoor()}
      />

      {/* Automation & development tools */}
      <EditTool />
    </>
  );
}
