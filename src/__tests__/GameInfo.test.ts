import { GameInfo } from '../game/GameInfo';

describe('GameInfo', () => {
  let info: GameInfo;

  beforeEach(() => {
    info = new GameInfo();
  });

  test('initial state', () => {
    expect(info.getScore()).toBe(0);
    expect(info.getHighScore()).toBe(0);
    expect(info.getStage()).toBe(0);
    expect(info.getHighStage()).toBe(1);
    expect(info.getHint()).toBe(3); // DEFAULT_HINT
    expect(info.getTime()).toBe(60); // MAX_TIME
  });

  test('score management', () => {
    info.addScore(100);
    expect(info.getScore()).toBe(100);
    expect(info.getHighScore()).toBe(100);
    info.addScore(50);
    expect(info.getScore()).toBe(150);
  });

  test('high score tracks maximum', () => {
    info.addScore(200);
    expect(info.getHighScore()).toBe(200);
    info.setScore(0);
    info.addScore(50);
    expect(info.getHighScore()).toBe(200);
  });

  test('score capped at MAX_SCORE', () => {
    info.addScore(99999999);
    info.addScore(1);
    expect(info.getScore()).toBe(99999999);
  });

  test('hint management', () => {
    expect(info.getHint()).toBe(3);
    info.addHint(2);
    expect(info.getHint()).toBe(5);
    info.addHint(-1);
    expect(info.getHint()).toBe(4);
  });

  test('hint capped at MAX_HINT', () => {
    info.addHint(20);
    expect(info.getHint()).toBe(9); // MAX_HINT
  });

  test('hint minimum is 0', () => {
    info.addHint(-100);
    expect(info.getHint()).toBe(0);
  });

  test('setHint clamps values', () => {
    info.setHint(15);
    expect(info.getHint()).toBe(9); // MAX_HINT
    info.setHint(-5);
    expect(info.getHint()).toBe(9); // setHint with negative returns 0 but doesn't change hint
  });

  test('time tick decrements', () => {
    info.initTime();
    const initialTime = info.getTime();
    info.tick();
    expect(info.getTime()).toBe(initialTime - 1);
  });

  test('time does not go below 0', () => {
    info.initTime();
    for (let i = 0; i < 100; i++) info.tick();
    expect(info.getTime()).toBe(0);
  });

  test('tick returns true while time > 0', () => {
    info.initTime();
    expect(info.tick()).toBe(true); // time = 59
  });

  test('tick returns false when time reaches 0', () => {
    info.initTime();
    for (let i = 0; i < 59; i++) info.tick();
    expect(info.getTime()).toBe(1);
    expect(info.tick()).toBe(false); // time = 0
  });

  test('addTick adds time normally when time >= 20', () => {
    info.initTime();
    // Tick down to 30
    for (let i = 0; i < 30; i++) info.tick();
    expect(info.getTime()).toBe(30);
    info.addTick(5);
    expect(info.getTime()).toBe(35);
  });

  test('addTick capped at MAX_TIME', () => {
    info.initTime();
    info.addTick(100);
    expect(info.getTime()).toBe(60);
  });

  test('addTick adds 20 when time < 20', () => {
    info.initTime();
    for (let i = 0; i < 50; i++) info.tick();
    expect(info.getTime()).toBe(10);
    info.addTick(2);
    expect(info.getTime()).toBe(30); // 10 + 20
  });

  test('addTick returns false for negative values', () => {
    expect(info.addTick(-5)).toBe(false);
  });

  test('stage management', () => {
    info.setStage(5);
    expect(info.getStage()).toBe(5);
  });

  test('setStage clamps minimum to 1', () => {
    info.setStage(0);
    expect(info.getStage()).toBe(1);
  });

  test('setStage(1) calls init', () => {
    info.addScore(500);
    info.setStage(1);
    expect(info.getScore()).toBe(0); // init resets score
  });

  test('stageUp increments stage', () => {
    info.setStage(1);
    info.stageUp();
    expect(info.getStage()).toBe(2);
  });

  test('stageUp gives hint when stage % 3 === 2', () => {
    info.setStage(1);
    info.stageUp(); // stage = 2, 2 % 3 === 2 -> addHint(1)
    expect(info.getHint()).toBe(4); // 3 default + 1
  });

  test('stageUp gives extra hints for high stages', () => {
    info.setStage(16);
    // stage=16, stageUp -> stage=17
    // 17 % 3 === 2 -> addHint(1)
    // 17 > 15 -> addHint(floor(17/10)) = addHint(1)
    info.stageUp();
    expect(info.getHint()).toBeGreaterThanOrEqual(4);
  });

  test('high stage tracking', () => {
    info.setStage(5);
    info.updateHighStage();
    expect(info.getHighStage()).toBe(6);
  });

  test('high stage does not decrease', () => {
    info.setHighStage(10);
    info.setStage(3);
    info.updateHighStage();
    expect(info.getHighStage()).toBe(10); // 3+1=4 < 10, no update
  });

  test('calculatorScore returns actual score', () => {
    const score = info.calculatorScore(2, 50);
    expect(score).toBe(2 * 10 + 50 * 5); // 270
    expect(score).toBeGreaterThan(0);
  });

  test('calculatorScore with zero inputs', () => {
    expect(info.calculatorScore(0, 0)).toBe(0);
  });

  test('backup and revert', () => {
    info.addScore(500);
    info.addHint(2);
    info.backup();
    info.addScore(300);
    info.addHint(-3);
    info.revert();
    expect(info.getScore()).toBe(500);
    expect(info.getHint()).toBe(5);
  });

  test('initTime sets to MAX_TIME', () => {
    info.initTime();
    expect(info.getTime()).toBe(60);
  });

  test('setMaxTime changes the max', () => {
    info.setMaxTime(120);
    info.initTime();
    expect(info.getTime()).toBe(120);
  });

  test('init resets score, hint, and time', () => {
    info.addScore(1000);
    info.addHint(5);
    for (let i = 0; i < 30; i++) info.tick();
    info.init();
    expect(info.getScore()).toBe(0);
    expect(info.getHint()).toBe(3);
    expect(info.getTime()).toBe(60);
  });

  test('serialization round-trip', () => {
    info.addScore(1000);
    info.setStage(5);
    info.addHint(2);
    const json = info.toJSON();
    const info2 = new GameInfo();
    info2.fromJSON(json as Record<string, unknown>);
    expect(info2.getScore()).toBe(1000);
    expect(info2.getStage()).toBe(5);
    expect(info2.getHint()).toBe(5);
  });

  test('serialization preserves high score and high stage', () => {
    info.addScore(5000);
    info.setHighStage(10);
    const json = info.toJSON();
    const info2 = new GameInfo();
    info2.fromJSON(json as Record<string, unknown>);
    expect(info2.getHighScore()).toBe(5000);
    expect(info2.getHighStage()).toBe(10);
  });

  test('serialization preserves time', () => {
    info.initTime();
    for (let i = 0; i < 25; i++) info.tick();
    const json = info.toJSON();
    const info2 = new GameInfo();
    info2.fromJSON(json as Record<string, unknown>);
    expect(info2.getTime()).toBe(35);
  });

  test('serialization preserves stage at high values', () => {
    info.setStage(15);
    const json = info.toJSON();
    const info2 = new GameInfo();
    info2.fromJSON(json as Record<string, unknown>);
    expect(info2.getStage()).toBe(15);
  });

  test('fromJSON with missing fields uses defaults', () => {
    const info2 = new GameInfo();
    info2.fromJSON({} as Record<string, unknown>);
    expect(info2.getScore()).toBe(0);
    expect(info2.getStage()).toBe(0);
    expect(info2.getHighStage()).toBe(1);
  });
});
