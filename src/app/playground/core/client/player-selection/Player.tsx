import { useCharacterStore } from "./store/useCharacterStore";
import { useThree } from "@react-three/fiber";
import { RacingVehicle } from "../../character/vehicles/racing-car/RacingVehicle";
import { createRef, useEffect, useRef } from "react";
import { ThirdControllerCharacter } from "../../character/ThirdControllerCharacter";
import { CharacterDataType, charactersData } from "./data/charactersData";
import { CharacterRef } from "../../character/character.type";

/**
 * Player component manages character selection and camera control in the 3D scene.
 *
 * @returns {JSX.Element}
 */
export const Player = () => {
  // Get the currently selected character from the store
  const { character } = useCharacterStore();

  // Access the camera from Three.js
  const { camera } = useThree();

  // Create a ref object to store all character references
  const characterRefs = useRef<Record<string, React.RefObject<CharacterRef>>>({});

  // Initialize refs for all characters
  useEffect(() => {
    // Flatten the character data for easy access
    const flattenedCharactersData = Object.values(charactersData)
      .flat()
      .reduce((acc, char) => {
        acc[char.id] = char;
        return acc;
      }, {} as Record<string, CharacterDataType>);

    // Create a ref for each character
    Object.keys(flattenedCharactersData).forEach(id => {
      characterRefs.current[id] = characterRefs.current[id] || createRef<CharacterRef>();
    });

    // Add vehicle ref
    characterRefs.current["vehicle"] = characterRefs.current["vehicle"] || createRef<CharacterRef>();
    
  }, []);

  // Update camera when character changes
  useEffect(() => {
    if (!character || !characterRefs.current[character]) return;

    let interval: ReturnType<typeof setInterval>;
    let attempts = 0;
    const MAX_ATTEMPTS = 50; // Limit check attempts

    const checkAndSetCamera = () => {
      attempts++;
      const currentRef = characterRefs.current[character];
      
      if (!currentRef?.current) {
        if (attempts >= MAX_ATTEMPTS) {
          console.warn("Failed to find character reference after multiple attempts");
          clearInterval(interval);
        }
        return;
      }

      const isReady = currentRef.current.isReady();
      if (isReady) {
        const target = currentRef.current.getCameraTarget();
        if (target) {
          // Position camera relative to character
          camera.position.set(target.x + 5, target.y + 5, target.z + 5);
          camera.lookAt(target);
        }
        clearInterval(interval);
      } else if (attempts >= MAX_ATTEMPTS) {
        console.warn("Character never reported ready state");
        clearInterval(interval);
      }
    };

    // Check regularly until camera is positioned
    interval = setInterval(checkAndSetCamera, 100);

    return () => clearInterval(interval);
  }, [character, camera]);

  return (
    <>
      {/* Render third-person characters */}
      {charactersData.thirdController.map((c) => (
        <ThirdControllerCharacter
          key={c.id}
          name="Player"
          ref={characterRefs.current[c.id]}
          path={c.path}
          position={c.position}
          defaultPlayer={character === c.id}
        />
      ))}

      {/* Render vehicle */}
      <RacingVehicle
        ref={characterRefs.current["vehicle"]}
        position={[0, 1.5, 5]}
        rotation={[0, 0, 0]}
        defaultPlayer={character === "vehicle"}
      />
    </>
  );
};