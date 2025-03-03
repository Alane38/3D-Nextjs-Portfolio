import { CharacterController } from "@core/CharacterController";
import { Diamond, DiamondComponent } from "@resources/Class/Diamond";
import { GroundComponent } from "@resources/Class/Ground";
import {
  TextObject,
  TextObjectComponent,
} from "@/app/Resources/Class/TextObject";

export const MainWorld = () => {
  const modelText = new TextObject();
  modelText.position.set(3, 1, 0);

  const modelDiamond = new Diamond();
  modelDiamond.position.set(3, 2, 0);

  return (
    <>
      <GroundComponent />
      <CharacterController />
      <TextObjectComponent model={modelText} />
      <DiamondComponent model={modelDiamond} />
    </>
  );
};
