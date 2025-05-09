import { useRef, createRef, RefObject } from 'react';
import { CharacterDataType } from '../data/charactersData';
import { CharacterRef } from '../../../character/character.type';

/**
 * Custom hook to manage character references
 * 
 * This hook creates and maintains stable references to character components,
 * which are critical for camera control and interactions
 * 
 * @param characters Record of character data
 * @returns Record of character refs
 */
export const useCharacterRefs = (characters: Record<string, CharacterDataType>) => {
  const refs = useRef<Record<string, RefObject<CharacterRef | null>>>({});
  
  // Ensure refs object is initialized with all characters
  if (Object.keys(refs.current).length === 0) {
    // Create refs for all characters
    Object.keys(characters).forEach(id => {
      refs.current[id] = createRef<CharacterRef>();
    });
    
    // Add vehicle ref
    refs.current["vehicle"] = createRef<CharacterRef>();
  }
  
  return refs;
};