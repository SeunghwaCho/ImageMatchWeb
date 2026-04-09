import { Mahjong } from './game/Mahjong';
import { GameInfo } from './game/GameInfo';
import { GameStateType } from './game/GameState';
import { BoardProfile } from './game/BoardProfile';
import { Renderer, RenderState, MatchAnimationData } from './ui/Renderer';
import { AssetGenerator } from './ui/AssetGenerator';
import { InputHandler, GameCommand } from './ui/InputHandler';
import { GameStorage } from './storage/GameStorage';

export class App {
  private game: Mahjong;
  private renderer: Renderer;
  private inputHandler: InputHandler;
  private storage: GameStorage;
  private timerInterval: number | null = null;
  private animationFrameId: number | null = null;
  private hasSaved: boolean = false;
  private animating: boolean = false;
  private matchAnimation: MatchAnimationData | null = null;
  private matchAnimRafId: number | null = null;
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.game = new Mahjong();
    this.renderer = new Renderer(canvas);
    this.storage = new GameStorage();
    this.inputHandler = new InputHandler(canvas, (cmd) => this.handleCommand(cmd));

    window.addEventListener('resize', () => {
      this.renderer.resize();
      this.render();
    });

    // Auto-save on visibility change (tab switch, app background)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.game.isPlayState()) {
        this.game.pause();
        this.saveGame();
        this.render();
      }
    });

    // Auto-save on beforeunload
    window.addEventListener('beforeunload', () => {
      if (this.game.isPlayState() || this.game.isPauseState()) {
        this.saveGame();
      }
    });

    this.init();
  }

  private async init(): Promise<void> {
    try {
      await this.storage.open();
      this.hasSaved = await this.storage.hasSavedGame();
    } catch {
      this.hasSaved = false;
    }

    // Load image assets and recreate renderer with them
    try {
      const assets = new AssetGenerator(50);
      await assets.loadImages();
      this.renderer = new Renderer(this.canvas, assets);
    } catch {
      // Keep the default renderer with fallback assets
    }

    this.render();
  }

  private handleCommand(cmd: GameCommand): void {
    switch (cmd.type) {
      case 'PLAY':
        this.game.play();
        this.startTimer();
        break;

      case 'PAUSE':
        this.game.pause();
        this.stopTimer();
        this.saveGame();
        break;

      case 'RESUME':
        this.game.play();
        this.startTimer();
        break;

      case 'REMOVE':
        if (this.game.isPlayState()) {
          const previewBlocks = this.game.previewRemovableBlocks(cmd.x, cmd.y);
          if (previewBlocks.length > 0) {
            const blocks = previewBlocks.map(b => ({ x: b.x, y: b.y, type: b.type }));
            this.game.removeBlock(cmd.x, cmd.y);
            this.startMatchAnimation(cmd.x, cmd.y, blocks);
            return; // Animation handles render and win check
          } else {
            this.game.removeBlock(cmd.x, cmd.y);
          }
        }
        break;

      case 'HINT':
        this.game.updateHint();
        break;

      case 'NEW_GAME':
        this.stopTimer();
        this.game.newGame();
        this.clearSave();
        break;

      case 'TRY_AGAIN':
        this.stopTimer();
        this.game.tryAgain();
        this.clearSave();
        break;

      case 'WIN_CONTINUE':
        this.game.idle();
        break;

      case 'CHALLENGE':
        this.stopTimer();
        this.game.challengeNextStage();
        this.clearSave();
        break;

      case 'RESUME_SAVED':
        this.loadGame();
        return;
    }

    this.inputHandler.setCurrentState(this.game.getState());
    this.render();
  }

  private startTimer(): void {
    this.stopTimer();
    this.timerInterval = window.setInterval(() => {
      if (this.animating) return;  // Skip tick during animation
      if (this.game.isPlayState()) {
        const alive = this.game.tick();
        if (!alive) {
          this.game.gameoverState();
          this.stopTimer();
          this.clearSave();
        }
        this.render();
      }
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerInterval !== null) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  private render(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.animationFrameId = requestAnimationFrame(() => {
      const board = this.game.getBoard();
      const hintBlock = board.getHint();
      const hintBlocks = board.getHintBlocks();

      const renderState: RenderState = {
        board: board.getBoard(),
        boardWidth: BoardProfile.boardWidth,
        boardHeight: BoardProfile.boardHeight,
        state: this.game.getState(),
        score: this.game.getScore(),
        highScore: this.game.getHighScore(),
        stage: this.game.getStage(),
        time: this.game.getTime(),
        maxTime: 60,
        hintCount: this.game.getHintCount(),
        hintBlock: hintBlock ? { x: hintBlock.x, y: hintBlock.y } : null,
        hintBlocks: hintBlocks.map(b => ({ x: b.x, y: b.y, type: b.type })),
        lastRemovedBlocks: [],
        animationProgress: 1,
        matchAnimation: this.matchAnimation,
      };

      this.renderer.render(renderState);
      this.animationFrameId = null;
    });
  }

  private startMatchAnimation(clickX: number, clickY: number, blocks: {x: number; y: number; type: number}[]): void {
    this.animating = true;
    this.inputHandler.setBlocked(true);
    this.matchAnimation = {
      clickX, clickY,
      matchedBlocks: blocks,
      progress: 0,
    };
    const startTime = performance.now();
    const duration = 700; // ms

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1.0, elapsed / duration);
      this.matchAnimation = { ...this.matchAnimation!, progress };
      this.render();

      if (progress < 1.0) {
        this.matchAnimRafId = requestAnimationFrame(animate);
      } else {
        this.animating = false;
        this.inputHandler.setBlocked(false);
        this.matchAnimation = null;
        this.matchAnimRafId = null;
        // Check win condition after animation
        if (this.game.isFinishGame()) {
          this.game.winState();
          this.stopTimer();
          this.clearSave();
          this.inputHandler.setCurrentState(this.game.getState());
        }
        this.render();
      }
    };
    this.matchAnimRafId = requestAnimationFrame(animate);
  }

  private async saveGame(): Promise<void> {
    try {
      const data = this.game.toJSON();
      await this.storage.save(data);
      this.hasSaved = true;
    } catch (e) {
      console.error('Failed to save game:', e);
    }
  }

  private async loadGame(): Promise<void> {
    try {
      const data = await this.storage.load();
      if (data) {
        this.game.fromJSON(data);
        this.inputHandler.setCurrentState(this.game.getState());
        if (this.game.isPlayState()) {
          this.startTimer();
        }
        this.render();
      }
    } catch (e) {
      console.error('Failed to load game:', e);
    }
  }

  private async clearSave(): Promise<void> {
    try {
      await this.storage.clear();
      this.hasSaved = false;
    } catch (e) {
      console.error('Failed to clear save:', e);
    }
  }
}
