import { CharacterController } from "@core/CharacterController";
import { Diamond, DiamondComponent } from "@resources/Class/Diamond";
import { Ground, GroundComponent } from "@resources/Class/Ground";
import { TextObject, TextObjectComponent } from "@resources/Class/TextObject";
import { TestComponent } from "../Class/Test";
import { KillBrickComponent } from "../Class/KillBrick";

export const MainWorld = () => {
  const modelText = new TextObject();
  modelText.position.set(3, 1, 0);
  modelText.TextProps.text = "NEWALFOX";

  const modelDiamond = new Diamond();
  modelDiamond.position.set(3, 2, 0);

  // Ground
  const ground = new Ground();

  const pathGround = new Ground();
  pathGround.color = "white";
  pathGround.scale = [5, (ground.scale as number) / 1.2, 1];
  pathGround.position.set(0, ground.position.y + 0.01, 0);

  return (
    <>
      <GroundComponent model={ground} />
      <GroundComponent model={pathGround} />
      <CharacterController />
      <TextObjectComponent model={modelText} />
      {/* <DiamondComponent model={modelDiamond} /> */}
      <TestComponent />

      <KillBrickComponent />
    </>
  );
};
