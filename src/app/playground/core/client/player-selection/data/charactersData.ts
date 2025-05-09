
/**
 * A list of characters available in the game.
 */
export type CharacterDataType = {
  id: string;
  label: string;
  path?: string;
  position: [number, number, number];
};

export const charactersData: {
  thirdController: CharacterDataType[];
  firstController: CharacterDataType[];
  otherController: CharacterDataType[];
} = {
  thirdController: [
    {
      id: "newalfox",
      label: "Newalfox",
      path: "FoxPam.fbx",
      position: [0, 10, 0],
    },
    {
      id: "pamacea",
      label: "Pamacea",
      path: "PamFox.fbx",
      position: [5, 1.5, 0],
    },
  ],
  firstController: [],
  otherController: [],
};
