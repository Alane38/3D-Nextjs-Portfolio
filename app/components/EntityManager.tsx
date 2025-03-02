import { Diamond } from "../Resources/Class/Diamond";
import NewalText from "../Resources/Class/NewalText";
import { FlatMap } from "../Resources/Environment/FlatMap";
import { useMainText } from "../Resources/Settings/useMainText";

export const EntityManagaer = () => {
  const { TextSize, TextV } = useMainText();
  const flatMap = new FlatMap(
    "/flatmap2.glb",
    [0, 0, 0],
    0,
    "fixed",
    "trimesh",
    1,
  );
  const diamond = new Diamond();
  const newaltext = new NewalText(
    TextSize,
    TextV,
    "fixed",
    "trimesh",
    1,
    1,
    [5, 5, 0],
    "/fonts/FontFlemme.json",
    1,
  );
  return (
    <>
      {flatMap.getComponent()}
      {diamond.getComponent()}
      {newaltext.getComponent()}
    </>
  );
};
