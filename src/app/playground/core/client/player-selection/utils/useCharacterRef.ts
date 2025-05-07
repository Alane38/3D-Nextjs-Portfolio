import { useRef, createRef, RefObject } from 'react';
import { CharacterRef } from '../../../character/ThirdControllerCharacter';
import { CharacterDataType } from '../data/charactersData';

export function useCharacterRefs(characters: Record<string, CharacterDataType>) {
  const characterRefs = useRef<Record<string, RefObject<CharacterRef | null>>>(
    Object.values(characters).reduce((acc, c) => {
      acc[c.id] = createRef<CharacterRef>();
      return acc;
    }, {} as Record<string, RefObject<CharacterRef | null>>)
  );

  return characterRefs;
}
