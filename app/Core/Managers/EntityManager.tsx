import { CharacterController } from "@/app/Core/CharacterController";
import { Diamond, DiamondComponent } from "@/app/Resources/Class/Diamond";
import {
  TextObject,
  TextObjectComponent,
} from "@/app/Resources/Class/TextObject";

export const EntityManagaer = () => {
  
  const modelText = new TextObject();
  modelText.position.set(3, 1, 0);


  const modelDiamond = new Diamond();
  modelDiamond.position.set(3, 2, 0);

  return (
    <>
      <CharacterController />

      <TextObjectComponent model={modelText} />
      <DiamondComponent model={modelDiamond} />

    </>
  );
};