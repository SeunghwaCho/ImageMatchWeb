export const GameStateType = {
  NONE: 0,
  IDLE: 1,
  PLAY: 2,
  PAUSE: 3,
  END: 4,
  GAMEOVER: 5,
} as const;

export type GameStateValue = typeof GameStateType[keyof typeof GameStateType];
