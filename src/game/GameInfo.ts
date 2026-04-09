export interface IGameInfo {
  getHighStage(): number;
  setHighStage(stage: number): boolean;
  updateHighStage(): void;
  getStage(): number;
  setStage(newStage: number): void;
  stageUp(): void;
  addScore(score: number): number;
  setScore(score: number): boolean;
  setHighScore(score: number): boolean;
  updateHighScore(): void;
  getScore(): number;
  getHighScore(): number;
  calculatorScore(removedBlockCount: number, time: number): number;
  revert(): void;
  backup(): void;
  getHint(): number;
  setHint(hint: number): number;
  addHint(h: number): number;
  getTime(): number;
  setMaxTime(newMaxTime: number): number;
  addTick(t: number): boolean;
  tick(): boolean;
  initTime(): void;
  init(): void;
}

export class GameInfo implements IGameInfo {
  private score: number = 0;
  private highScore: number = 0;
  private previousScore: number = 0;
  private highState: number = 1;
  private stage: number = 0;
  private readonly DEFAULT_HINT = 3;
  private readonly MAX_HINT = 9;
  private readonly MAX_SCORE = 99999999;
  private previousHint: number = 0;
  private hint: number = 0;
  private MAX_TIME = 60;
  private readonly MAX_STAGE = 1123;
  private time: number = 0;

  constructor() {
    this.score = 0;
    this.highScore = 0;
    this.previousScore = 0;
    this.stage = 0;
    this.highState = 1;
    this.previousHint = 0;
    this.hint = this.DEFAULT_HINT;
    this.time = this.MAX_TIME; // BUG FIX: was MAX_TIME+1 in Android
  }

  init(): void {
    this.score = 0;
    this.previousScore = 0;
    this.hint = this.DEFAULT_HINT;
    this.time = this.MAX_TIME; // BUG FIX: was MAX_TIME+1
  }

  getHighStage(): number { return this.highState; }

  setHighStage(stage: number): boolean {
    if (stage > this.MAX_STAGE) stage = this.MAX_STAGE;
    this.highState = stage;
    return true;
  }

  updateHighStage(): void {
    if ((this.stage + 1) > this.highState) {
      this.highState = this.stage + 1;
      if (this.highState > this.MAX_STAGE) this.highState = this.MAX_STAGE;
    }
  }

  getStage(): number { return this.stage; }

  setStage(newStage: number): void {
    newStage = newStage < 1 ? 1 : newStage;
    this.stage = newStage > this.MAX_STAGE ? this.MAX_STAGE : newStage;
    if (newStage === 1) {
      this.init();
    } else {
      this.backup();
    }
    this.stage = newStage;
  }

  stageUp(): void {
    this.stage = (this.stage + 1) % (this.MAX_STAGE + 1);
    if ((this.stage % 3) === 2) {
      this.addHint(1);
    } else if (this.stage > 15) {
      this.addHint(Math.floor(this.stage / 10));
    }
    this.backup();
  }

  addScore(score: number): number {
    this.score += score;
    this.score = this.score > this.MAX_SCORE ? this.MAX_SCORE : this.score;
    this.updateHighScore();
    return this.score;
  }

  setScore(score: number): boolean { this.score = score; return true; }

  setHighScore(score: number): boolean {
    score = score > this.MAX_SCORE ? this.MAX_SCORE : score;
    this.highScore = score;
    return true;
  }

  updateHighScore(): void {
    if (this.score > this.highScore) this.highScore = this.score;
  }

  getScore(): number { return this.score; }
  getHighScore(): number { return this.highScore; }

  // BUG FIX: Android version always returned 0. Now gives actual score.
  calculatorScore(removedBlockCount: number, time: number): number {
    return removedBlockCount * 10 + time * 5;
  }

  revert(): void {
    this.score = this.previousScore;
    this.hint = this.previousHint;
  }

  backup(): void {
    this.previousScore = this.score;
    this.previousHint = this.hint;
  }

  getHint(): number { return this.hint; }

  setHint(hint: number): number {
    if (hint < 0) return 0;
    this.hint = hint >= this.MAX_HINT ? this.MAX_HINT : hint;
    return this.hint;
  }

  addHint(h: number): number {
    this.hint += h;
    this.hint = this.hint > this.MAX_HINT ? this.MAX_HINT : this.hint;
    this.hint = this.hint < 0 ? 0 : this.hint;
    return this.hint;
  }

  getTime(): number { return this.time; }

  setMaxTime(newMaxTime: number): number {
    this.MAX_TIME = newMaxTime;
    return this.MAX_TIME;
  }

  addTick(t: number): boolean {
    if (t < 0) return false;
    if (this.time < 20) {
      this.time += 20;
      return true;
    }
    this.time += t;
    if (this.time > this.MAX_TIME) {
      this.time = this.MAX_TIME;
      return true;
    }
    return this.time > 0;
  }

  tick(): boolean {
    this.time--;
    this.time = this.time < 0 ? 0 : this.time;
    return this.time > 0;
  }

  initTime(): void {
    this.time = this.MAX_TIME; // BUG FIX: was MAX_TIME+1
  }

  // For serialization (save/load)
  toJSON(): object {
    return {
      score: this.score,
      highScore: this.highScore,
      previousScore: this.previousScore,
      highState: this.highState,
      stage: this.stage,
      previousHint: this.previousHint,
      hint: this.hint,
      time: this.time,
    };
  }

  fromJSON(data: Record<string, unknown>): void {
    this.score = (data.score as number) ?? 0;
    this.highScore = (data.highScore as number) ?? 0;
    this.previousScore = (data.previousScore as number) ?? 0;
    this.highState = (data.highState as number) ?? 1;
    this.stage = (data.stage as number) ?? 0;
    this.previousHint = (data.previousHint as number) ?? 0;
    this.hint = (data.hint as number) ?? this.DEFAULT_HINT;
    this.time = (data.time as number) ?? this.MAX_TIME;
  }
}
