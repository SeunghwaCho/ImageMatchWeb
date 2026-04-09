import { Block } from './Block';
import { Board, PlayStateCallback } from './Board';
import { GameInfo } from './GameInfo';
import { GameStateType, GameStateValue } from './GameState';
import { BoardProfile } from './BoardProfile';

export type GameObserver = (state: GameStateValue) => void;

export class Mahjong implements PlayStateCallback {
  private gameInfo: GameInfo;
  private board: Board;
  private currentState: GameStateValue = GameStateType.NONE;
  private previousState: GameStateValue = GameStateType.NONE;
  private tryAgainFlag: boolean = false;
  private observers: GameObserver[] = [];
  private boardWidth: number;
  private boardHeight: number;
  private blockKind: number;

  constructor(
    gameInfo?: GameInfo,
    width: number = BoardProfile.boardWidth,
    height: number = BoardProfile.boardHeight,
    blockKind: number = BoardProfile.blockKind
  ) {
    this.gameInfo = gameInfo ?? new GameInfo();
    this.boardWidth = width;
    this.boardHeight = height;
    this.blockKind = blockKind;
    this.board = new Board(width, height, blockKind);
    this.board.setPlayState(this);
    this.setState(GameStateType.IDLE);
  }

  addObserver(observer: GameObserver): void {
    this.observers.push(observer);
  }

  removeObserver(observer: GameObserver): void {
    this.observers = this.observers.filter(o => o !== observer);
  }

  private notifyObservers(): void {
    for (const observer of this.observers) {
      observer(this.currentState);
    }
  }

  // PlayStateCallback implementation
  addTick(tick: number): void {
    this.gameInfo.addTick(tick);
  }

  addHint(hint: number): void {
    this.gameInfo.addHint(hint);
  }

  // State transitions
  play(): boolean { return this.setState(GameStateType.PLAY); }
  pause(): boolean { return this.setState(GameStateType.PAUSE); }
  winState(): boolean { return this.setState(GameStateType.END); }
  gameoverState(): boolean { return this.setState(GameStateType.GAMEOVER); }
  idle(): boolean { return this.setState(GameStateType.IDLE); }

  newGame(): boolean {
    this.tryAgainFlag = false;
    this.idle();
    this.gameInfo.setStage(1);
    this.initGame();
    return true;
  }

  challengeNextStage(): boolean {
    this.tryAgainFlag = false;
    this.idle();
    this.gameInfo.setStage(this.gameInfo.getHighStage());
    this.initGame();
    return true;
  }

  resumeGame(): boolean {
    this.tryAgainFlag = true;
    return this.idle();
  }

  tryAgain(): boolean {
    this.tryAgainFlag = true;
    return this.setState(GameStateType.IDLE);
  }

  private setState(newState: GameStateValue): boolean {
    switch (newState) {
      case GameStateType.NONE:
        this.previousState = this.currentState;
        this.currentState = GameStateType.NONE;
        break;

      case GameStateType.IDLE:
        if (this.tryAgainFlag) {
          this.gameInfo.revert();
          this.initGame();
        } else if (this.currentState === GameStateType.PAUSE || this.currentState === GameStateType.GAMEOVER) {
          this.gameInfo.setStage(1);
          this.initGame();
        } else {
          this.gameInfo.stageUp();
          this.initGame();
        }
        this.tryAgainFlag = false;
        this.gameInfo.initTime();
        this.previousState = this.currentState;
        this.currentState = GameStateType.IDLE;
        break;

      case GameStateType.PLAY:
        this.previousState = this.currentState;
        this.currentState = GameStateType.PLAY;
        break;

      case GameStateType.PAUSE:
        this.previousState = this.currentState;
        this.currentState = GameStateType.PAUSE;
        break;

      case GameStateType.END:
        this.gameInfo.updateHighStage();
        this.previousState = this.currentState;
        this.currentState = GameStateType.END;
        break;

      case GameStateType.GAMEOVER:
        this.previousState = this.currentState;
        this.currentState = GameStateType.GAMEOVER;
        break;
    }

    this.notifyObservers();
    return true;
  }

  private initGame(): void {
    this.board.setStage(this.gameInfo.getStage());
  }

  // Preview which blocks would be removed (for animation), without modifying state
  previewRemovableBlocks(x: number, y: number): Block[] {
    return this.board.getRemovableBlocks(x, y);
  }

  // Game actions
  removeBlock(x: number, y: number): boolean {
    if (this.currentState !== GameStateType.PLAY) return false;

    const result = this.board.removeBlock(x, y);

    if (this.board.needShuffle()) {
      this.board.shuffle();
    }

    if (result > 0) {
      this.gameInfo.addTick(result);
      const updateScore = this.gameInfo.calculatorScore(result, this.gameInfo.getTime());
      this.gameInfo.addScore(updateScore);
      return true;
    } else {
      this.gameInfo.tick();
    }
    return false;
  }

  updateHint(): boolean {
    if (this.currentState !== GameStateType.PLAY) return false;

    if (this.board.needShuffle()) {
      this.board.shuffle();
    }

    if (this.gameInfo.getHint() < 1) return false;

    const result = this.board.updateHint();
    if (result) {
      this.gameInfo.addHint(-1);
    }
    return result;
  }

  // Tick - called by timer
  tick(): boolean {
    return this.gameInfo.tick();
  }

  // Getters
  getState(): GameStateValue { return this.currentState; }
  getBoard(): Board { return this.board; }
  getGameInfo(): GameInfo { return this.gameInfo; }
  getStage(): number { return this.gameInfo.getStage(); }
  getTime(): number { return this.gameInfo.getTime(); }
  getScore(): number { return this.gameInfo.getScore(); }
  getHighScore(): number { return this.gameInfo.getHighScore(); }
  getHintCount(): number { return this.gameInfo.getHint(); }
  isFinishGame(): boolean { return this.board.isClear(); }

  isIdleState(): boolean { return this.currentState === GameStateType.IDLE; }
  isPlayState(): boolean { return this.currentState === GameStateType.PLAY; }
  isPauseState(): boolean { return this.currentState === GameStateType.PAUSE; }
  isEndState(): boolean { return this.currentState === GameStateType.END; }
  isGameoverState(): boolean { return this.currentState === GameStateType.GAMEOVER; }

  // Serialization
  toJSON(): object {
    return {
      gameInfo: this.gameInfo.toJSON(),
      board: this.board.toJSON(),
      state: this.currentState,
      previousState: this.previousState,
    };
  }

  fromJSON(data: Record<string, unknown>): void {
    this.gameInfo.fromJSON(data.gameInfo as Record<string, unknown>);
    this.board.fromJSON(data.board as Record<string, unknown>);
    this.board.setPlayState(this);
    this.currentState = data.state as GameStateValue;
    this.previousState = data.previousState as GameStateValue;
    this.notifyObservers();
  }
}
