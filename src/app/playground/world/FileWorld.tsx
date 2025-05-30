import { Sky } from "@react-three/drei";
import { Fragment } from "react";
import { Vector3 } from "three";
import {
  Diamond,
  DiamondComponent,
  Ground,
  GroundComponent,
} from "../core/class";
import { useEntityStore } from "../core/class/entity.store";
import { EditTool } from "../core/client/tool-bar/edit-tool/EditTool";
import { useSkyStore } from "../core/extension/eva/store/useSkyStore";
import { Player } from "../core/client/player-selection/Player";

export function FileWorld() {
  /* Leva Settings */
  const sky = useSkyStore();
  const entities = useEntityStore((state) => state.entities);

  return (
    <>
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

      {/*  Entities */}
      <DiamondComponent
        position={new Vector3(8, 5, 15)}
        entity={new Diamond()}
      />
      <DiamondComponent
        position={new Vector3(12, 5, 10)}
        entity={new Diamond()}
      />

      {/* Automation & development tools */}
      <EditTool />

      {entities.map((entity, i) => (
        <Fragment key={i}>{entity.renderComponent()}</Fragment>
      ))}
    </>
  );
}
