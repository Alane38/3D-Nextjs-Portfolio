import { CharacterController } from "@core/CharacterController";
import { Diamond, DiamondComponent } from "@resources/Class/Diamond";
import { Ground, GroundComponent } from "@resources/Class/Ground";
import { TextObject, TextObjectComponent } from "@resources/Class/TextObject";
import { KillBrickComponent } from "../Class/KillBrick";
import DynamicPlatforms from "@/app/Core/DynamicPlatforms";
import { Euler, Vector3 } from "three";
import Steps from "@/app/Core/Steps";
import { RestaurantSignComponent } from "../Class/RestaurantSign";
import FloatingPlatform from "@/app/Core/FloatingPlatform";
import { KeyboardControls } from "@react-three/drei";
import { Stairs, StairsComponent } from "../Class/Stairs";
import { ObjectComponent } from "../Class/Object";

export const MainWorld = () => {
  const modelText = new TextObject();
  modelText.position.set(3, 1, 0);
  modelText.TextProps.text = "NEWALFOX";

  // Ground
  const ground = new Ground();

  const pathGround = new Ground();
  pathGround.color = "white";
  pathGround.scale = [5, (ground.scale as number) / 1.2, 1];
  pathGround.position.set(0, ground.position.y + 0.01, 0);

  return (
    <>
      {/* <ObjectComponent /> */}

      {/* <KeyboardControls map={vehicleControls}>
        <Vehicle position={[15, 2, 0]} />
      </KeyboardControls> */}
      <CharacterController />

      <group>
        <GroundComponent model={ground} />
        <GroundComponent model={pathGround} />
      </group>

      <TextObjectComponent model={modelText} />
      <DiamondComponent position={new Vector3(3, 2, 0)} />

      <FloatingPlatform />
      <DynamicPlatforms />

      <Steps />
      <KillBrickComponent position={new Vector3(0, 2, 6)} />
      <RestaurantSignComponent
        position={new Vector3(4, 0, 4)}
        rotation={new Euler(0, Math.PI / 4, 0)}
      />

      <StairsComponent
        position={new Vector3(-20, 0, 10)}
        rotation={new Euler(0, Math.PI / 2, 0)}
      />
    </>
  );
};
