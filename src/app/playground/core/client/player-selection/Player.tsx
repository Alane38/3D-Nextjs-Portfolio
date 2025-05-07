import { useCharacterStore } from "./store/useCharacterStore";
import { useThree } from "@react-three/fiber";
import { Character, CharacterRef } from "../../character/Character";
import { RacingVehicle } from "../../character/vehicles/racing-car/RacingVehicle";
import { RigidBody } from "@dimforge/rapier3d-compat";
import { useEffect, useRef } from "react";

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
   */
  const characterRef = useRef<CharacterRef>(null);
  const vehicleRef = useRef<RigidBody | null>(null);

  /**
   * It is executed only once, when changing character.
   *  This way, you can be sure that the camera is actually changing targets,
   *  while letting the controller's camera modes and other systems take care of the rest.
   */
  useEffect(() => {
    // Retrieves the camera target from the character via its ref
    const target = characterRef.current?.getCameraTarget();

    // If a target is defined, adjusts the camera position and orients it towards the target
    if (target) {
      camera.position.set(target.x + 5, target.y + 5, target.z + 5); // Sets the camera position 5 units around the target
      camera.lookAt(target); // Orients the camera to look at the target
    }
  }, [character]); // Re-runs this effect whenever the character changes

  return (
    <>
      {/* Render the character and his controller according to the chosen character */}
      {/* With the defaultPlayer props, from the Character component (the default controller), you can activate/deactivate the camera and character controls. */}
      {character === "newalfox" && (
        <Character
          ref={characterRef}
          name="character"
          path="FoxPam.fbx"
          position={[0, 10, 0]}
          defaultPlayer
        />
      )}

      {character === "pamacea" && (
        <Character
          ref={characterRef}
          name="character"
          path="FoxPam.fbx"
          position={[0, 10, 0]}
          defaultPlayer
        />
      )}
      {character === "vehicle" && (
        <RacingVehicle
          ref={vehicleRef}
          position={[0, 10, 0]}
          rotation={[0, 0, 0]}
        />
      )}
    </>
  );
};
