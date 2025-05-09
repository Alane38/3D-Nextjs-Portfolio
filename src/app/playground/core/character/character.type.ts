import { Vector3 } from "three";

export type CharacterProps = {
    name: string;
    position?: [number, number, number];
    defaultPlayer?: boolean;
    path?: string;
  };

  export type CharacterRef = {
    getCameraTarget: () => Vector3 | null;
    isReady: () => boolean;
  };