import { useSky } from "@/hooks/leva/useSky";
import { OrbitControls, Sky } from "@react-three/drei";
import { Fragment } from "react";
import {
  Ground,
  GroundComponent
} from "../core/class";
import { useEntityStore } from "../core/class/entity.store";
import { EditTool } from "../core/client/tool-bar/edit-tools/EditTool";

export function CreativeWorld() {
  /* Eva Settings */
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

      {/* TODO: Orbital Camera with flying system */}
      <OrbitControls />
      <EditTool />

      {entities.map((entity, i) => (
        <Fragment key={i}>{entity.renderComponent()}</Fragment>
      ))}
    </>
  );
}
