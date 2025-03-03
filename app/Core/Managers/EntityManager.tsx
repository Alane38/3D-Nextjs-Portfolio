import { Diamond, DiamondComponent } from "@resources/Class/Diamond";
import { CharacterController } from "../CharacterController";
import { useRef } from "react";
import * as THREE from "three";
import { OrthographicCamera } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import {
  TextObject,
  TextObjectComponent,
} from "@/app/Resources/Class/TextObject";
import { GroundComponent } from "@/app/Resources/Class/Ground";

export const EntityManagaer = () => {
  const shadowCameraRef = useRef<THREE.OrthographicCamera>(null);

  // Initializations
  const diamond = new Diamond();
  diamond.setPosition(new THREE.Vector3(3, 3, 0));

  const text = new TextObject();
  text.setPosition(new THREE.Vector3(2, 1, 0));

  const text1 = new TextObject();
  text1.setPosition(new THREE.Vector3(5, 1, 0));

  const text2 = new TextObject();
  text2.setPosition(new THREE.Vector3(8, 1, 0));

  return (
    <>
      {/* <OrbitControls /> */}
      {/* <Environment preset="sunset" /> */}
      <directionalLight
        intensity={0.65}
        castShadow
        position={[-15, 10, 15]}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.00005}
      >
        <OrthographicCamera
          left={-22}
          right={15}
          top={10}
          bottom={-20}
          ref={shadowCameraRef}
          attach={"shadow-camera"}
        />
      </directionalLight>
      <Physics debug>
        <CharacterController />
        {/* <DiamondComponent newDiamond={diamond} /> */}
        {/* <FlatMapComponent newFlatMap={flatmap} /> */}
        <GroundComponent />

        <DiamondComponent model={diamond} />

        <TextObjectComponent model={text} />
        <TextObjectComponent model={text1} />
        <TextObjectComponent model={text2} />
      </Physics>
    </>
  );
};