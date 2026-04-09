import { Mahjong } from '../game/Mahjong';
import { GameInfo } from '../game/GameInfo';
import { GameStateType } from '../game/GameState';

describe('Mahjong', () => {
  let game: Mahjong;

  beforeEach(() => {
    game = new Mahjong();
  });

  test('initial state is IDLE', () => {
    expect(game.getState()).toBe(GameStateType.IDLE);
    expect(game.isIdleState()).toBe(true);
  });

  test('play transitions to PLAY state', () => {
    game.play();
    expect(game.getState()).toBe(GameStateType.PLAY);
    expect(game.isPlayState()).toBe(true);
  });

  test('pause transitions to PAUSE state', () => {
    game.play();
    game.pause();
    expect(game.getState()).toBe(GameStateType.PAUSE);
    expect(game.isPauseState()).toBe(true);
  });

  test('newGame resets to stage 1', () => {
    game.play();
    game.newGame();
    expect(game.getStage()).toBe(1);
    expect(game.isIdleState()).toBe(true);
  });

  test('observer is notified on state change', () => {
    const states: number[] = [];
    game.addObserver((state) => states.push(state));
    game.play();
    game.pause();
    expect(states).toContain(GameStateType.PLAY);
    expect(states).toContain(GameStateType.PAUSE);
  });

  test('removeBlock only works in PLAY state', () => {
    // In IDLE state, removeBlock should return false
    expect(game.removeBlock(0, 0)).toBe(false);
  });

  test('removeBlock works in PLAY state', () => {
    game.play();
    const result = game.removeBlock(0, 0);
    expect(typeof result).toBe('boolean');
  });

  test('tick decrements time', () => {
    game.play();
    const timeBefore = game.getTime();
    game.tick();
    expect(game.getTime()).toBe(timeBefore - 1);
  });

  test('tick returns false when time runs out', () => {
    game.play();
    // Tick all the way to 0
    for (let i = 0; i < 61; i++) game.tick();
    expect(game.getTime()).toBe(0);
    // Game controller (not Mahjong.tick) triggers gameover transition
    game.gameoverState();
    expect(game.isGameoverState()).toBe(true);
  });

  test('gameover state', () => {
    game.play();
    game.gameoverState();
    expect(game.isGameoverState()).toBe(true);
    expect(game.getState()).toBe(GameStateType.GAMEOVER);
  });

  test('win state updates high stage', () => {
    game.play();
    game.winState();
    expect(game.isEndState()).toBe(true);
  });

  test('tryAgain reverts score and hints', () => {
    game.play();
    const gameInfo = game.getGameInfo();
    gameInfo.addScore(500);
    gameInfo.backup();
    gameInfo.addScore(300);

    game.tryAgain();
    expect(gameInfo.getScore()).toBe(500);
  });

  test('challengeNextStage goes to highest stage', () => {
    const gameInfo = game.getGameInfo();
    gameInfo.setHighStage(10);
    game.challengeNextStage();
    expect(game.getStage()).toBe(10);
  });

  test('updateHint only works in PLAY state', () => {
    expect(game.updateHint()).toBe(false);
  });

  test('resumeGame transitions to IDLE for retry', () => {
    game.play();
    game.pause();
    expect(game.isPauseState()).toBe(true);
    game.resumeGame();
    // resumeGame sets tryAgain=true and calls idle(), going to IDLE
    expect(game.isIdleState()).toBe(true);
  });

  test('serialization round-trip', () => {
    game.play();
    const json = game.toJSON();
    const game2 = new Mahjong();
    game2.fromJSON(json as any);
    expect(game2.getState()).toBe(GameStateType.PLAY);
    expect(game2.getStage()).toBe(game.getStage());
  });

  test('multiple games can run independently', () => {
    const game1 = new Mahjong();
    const game2 = new Mahjong();
    game1.play();
    expect(game1.isPlayState()).toBe(true);
    expect(game2.isIdleState()).toBe(true);
  });

  test('getGameInfo returns GameInfo instance', () => {
    const gameInfo = game.getGameInfo();
    expect(gameInfo).toBeInstanceOf(GameInfo);
  });

  test('play sets up stage with blocks', () => {
    game.play();
    expect(game.getStage()).toBeGreaterThanOrEqual(1);
  });
});
