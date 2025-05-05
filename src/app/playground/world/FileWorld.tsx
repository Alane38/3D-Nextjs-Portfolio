import { Sky } from "@react-three/drei";
import { Fragment } from "react";
import { Vector3 } from "three";
import { Character } from "../core/character/Character";
import {
    Diamond,
    DiamondComponent,
    Ground,
    GroundComponent,
} from "../core/class";
import { useEntityStore } from "../core/class/entity.store";
import { EditTool } from "../core/client/tool-bar/edit-tool/EditTool";
import { useSky } from "@/hooks/Leva/useSky";

export function FileWorld() {
  /* Leva Settings */
  const sky = useSky();
  const entities = useEntityStore((state) => state.entities);

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
      <GroundComponent entity={new Ground()} />

      <Character
        name="Player"
        path="FoxPam.fbx"
        position={[0, 10, 0]}
        defaultPlayer
      />

      <DiamondComponent
        position={new Vector3(8, 5, 15)}
        entity={new Diamond()}
      />
      <DiamondComponent
        position={new Vector3(12, 5, 10)}
        entity={new Diamond()}
      />

      <EditTool />

      {entities.map((entity, i) => (
        <Fragment key={i}>{entity.renderComponent()}</Fragment>
      ))}
    </>
  );
}
