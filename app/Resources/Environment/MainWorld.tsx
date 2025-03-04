import { CharacterController } from "@core/CharacterController";
import { Diamond, DiamondComponent } from "@resources/Class/Diamond";
import { Ground, GroundComponent } from "@resources/Class/Ground";
import { TextObject, TextObjectComponent } from "@resources/Class/TextObject";
import { TestComponent } from "../Class/Test";
import { KillBrickComponent } from "../Class/KillBrick";
import Character2 from "@/app/Core/Character2";
import DynamicPlatforms from "@/app/Core/DynamicPlatforms";
import { Vector3 } from "three";
import Steps from "@/app/Core/Steps";

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
      <CharacterController />
      <GroundComponent model={ground} />
      <GroundComponent model={pathGround} />
      {/* <Character2 /> */}
      <TextObjectComponent model={modelText} />
      <DiamondComponent position={new Vector3(3, 2, 0)} />
      <TestComponent />

      <KillBrickComponent position={new Vector3(0, 2, 6)} />
      <DynamicPlatforms />
      <Steps />
      {/* <KeyboardControls map={vehicleControls}>
                        <ArcadeVehicle position={[15, 2, 0]} />
                    </KeyboardControls> */}
    </>
  );
};
