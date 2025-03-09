// Used to check the character state.
export interface CharacterState {
    canJump: boolean;
    inMotion: boolean;
    slopeAngle: number | null;
    characterRotated: boolean;
    excludeRay?: boolean;
  }
  