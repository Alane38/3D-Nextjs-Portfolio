import { useCharacterStore } from "./store/useCharacterStore";
import { useThree } from "@react-three/fiber";
import { RacingVehicle } from "../../character/vehicles/racing-car/RacingVehicle";
import { RigidBody } from "@dimforge/rapier3d-compat";
import { createRef, RefObject, useEffect, useRef } from "react";
import {
  CharacterRef,
  DefaultCharacter,
} from "../../character/DefaultCharacter";

/**
 * A list of characters available in the game.
 */
export type CharacterData = {
  id: string;
  label: string;
  path?: string;
  position: [number, number, number];
};

export const charactersData: {
  defaultCharacter: CharacterData[];
  thirdCharacter: CharacterData[];
  other: CharacterData[];
} = {
  defaultCharacter: [
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
  thirdCharacter: [],
  other: [
    {
      id: "vehicle",
      label: "RacingCar",
      position: [10, 1.5, 0],
    },
  ],
};

/**
 * By default or by user choice, it adds the character (followed by his controller and camera) to the 3D scene!
 *
 * @returns {JSX.Element}
 */
export const Player = () => {
  /**
   * The link between character selection and the character in the 3d scene.
   */
  const { character } = useCharacterStore();

  /**
   * This maintains the logic of the camera in the scene and avoids bugs such as a frozen camera or controls that don't work.
   */
  const { camera } = useThree();

  /**
   * We use a characterRef via a forwardRef to give the parent component access to the character.
   * This is mainly used to manage the camera, but also to interact with other systems:
   * to reset the character, control keyboard input, or read its position in real time.
   *
   * The characterRefs object is a map where the keys are the character ids and the values are the characterRef objects.
   */
  const characterRefs = useRef<Record<string, RefObject<CharacterRef | null>>>(
    charactersData.defaultCharacter.reduce(
      (acc, c) => {
        acc[c.id] = createRef<CharacterRef>();
        return acc;
      },
      {} as Record<string, RefObject<CharacterRef | null>>,
    ),
  );

  const vehicleRef = useRef<RigidBody | null>(null);

  /**
   * It is executed only once, when changing character.
   *  This way, you can be sure that the camera is actually changing targets,
   *  while letting the controller's camera modes and other systems take care of the rest.
   */
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    const checkAndSetCamera = () => {
      const currentRef = characterRefs.current[character];
      const isReady = currentRef?.current?.isReady();
      if (isReady) {
        const target = currentRef?.current?.getCameraTarget();
        if (target) {
          camera.position.set(target.x + 5, target.y + 5, target.z + 5);
          camera.lookAt(target);
        }
        clearInterval(interval);
      }
    };

    interval = setInterval(checkAndSetCamera, 100);

    return () => clearInterval(interval);
  }, [character]);

  return (
    <>
      {/* Render the character and his controller according to the chosen character */}
      {/* With the defaultPlayer props, from the Character component (the default controller), you can activate/deactivate the camera and character controls. */}
      {charactersData.defaultCharacter.map((c) => (
        <DefaultCharacter
          key={c.id}
          name="Player"
          ref={characterRefs.current[c.id]}
          path={c.path}
          position={c.position}
          defaultPlayer={character === c.id}
        />
      ))}

        <RacingVehicle
          ref={vehicleRef}
          position={[0, 10, 5]}
          rotation={[0, 0, 0]}
          defaultPlayer={character === "vehicle"}
        />
    </>
  );
};
