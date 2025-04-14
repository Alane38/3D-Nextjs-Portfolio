import { useSky } from "@/hooks";
import { Sky } from "@react-three/drei";
import { Fragment } from "react";
import { Character } from "../core/character/Character";
import { GroundComponent } from "../core/class";
import { useEntityStore } from "../core/class/entity.store";
import { EditTool } from "../core/client/inventory/edit-tool/EditTool";

export function FileWorld() {
  /* Leva Settings */
  const sky = useSky();
  const { entities } = useEntityStore();

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
      <GroundComponent /> 
      <Character
        name="Player"
        path="FoxPam.fbx"
        position={[0, 20, 0]}
        defaultPlayer
      />

      <EditTool />

      {entities.map((entity, i) => (
        <Fragment key={i}>{entity.renderComponent()}</Fragment>
      ))}
    </>
  );
}
