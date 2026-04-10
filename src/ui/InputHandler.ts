import { BoardProfile } from '../game/BoardProfile';

export type GameCommand =
  | { type: 'REMOVE'; x: number; y: number }
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'NEW_GAME' }
  | { type: 'TRY_AGAIN' }
  | { type: 'HINT' }
  | { type: 'CHALLENGE' }
  | { type: 'WIN_CONTINUE' }
  | { type: 'RESUME_SAVED' }
  | { type: 'MUTE_TOGGLE' }
  | { type: 'NONE' };

export class InputHandler {
  private canvas: HTMLCanvasElement;
  private commandCallback: (cmd: GameCommand) => void;
  private currentState: number = 0;
  private blocked: boolean = false;

  constructor(canvas: HTMLCanvasElement, callback: (cmd: GameCommand) => void) {
    this.canvas = canvas;
    this.commandCallback = callback;
    this.setupListeners();
  }

  setCurrentState(state: number): void {
    this.currentState = state;
  }

  setBlocked(blocked: boolean): void {
    this.blocked = blocked;
  }

  private setupListeners(): void {
    // Prevent double-tap zoom and scrolling
    this.canvas.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
    this.canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

    this.canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      if (e.changedTouches.length > 0) {
        const touch = e.changedTouches[0];
        const rect = this.canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        this.handleClick(x, y);
      }
    }, { passive: false });

    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.handleClick(x, y);
    });
  }

  private handleClick(x: number, y: number): void {
    if (this.blocked) return;
    switch (this.currentState) {
      case 1: // IDLE
        this.handleIdleClick(x, y);
        break;
      case 2: // PLAY
        this.handlePlayClick(x, y);
        break;
      case 3: // PAUSE
        this.handlePauseClick(x, y);
        break;
      case 4: // END
        this.handleEndClick(x, y);
        break;
      case 5: // GAMEOVER
        this.handleGameoverClick(x, y);
        break;
      default: // MENU
        this.handleMenuClick(x, y);
        break;
    }
  }

  private handlePlayClick(x: number, y: number): void {
    const bs = BoardProfile.blockSize;
    const { startX, startY, endX, endY } = BoardProfile;

    // Check board area
    if (x >= startX && x < endX && y >= startY && y < endY) {
      const bx = Math.floor((x - startX) / bs);
      const by = Math.floor((y - startY) / bs);
      if (bx >= 0 && bx < BoardProfile.boardWidth && by >= 0 && by < BoardProfile.boardHeight) {
        this.commandCallback({ type: 'REMOVE', x: bx, y: by });
        return;
      }
    }

    // Check pause button (bottom right)
    const infoY = endY + Math.floor(bs * 0.2);
    if (x >= endX - bs && x <= endX && y >= infoY && y <= infoY + bs) {
      this.commandCallback({ type: 'PAUSE' });
      return;
    }

    // Check hint button (left of pause)
    const hintX = endX - bs * 3;
    if (x >= hintX && x <= hintX + bs && y >= infoY && y <= infoY + bs) {
      this.commandCallback({ type: 'HINT' });
      return;
    }

    // Check mute button (left of hint)
    const muteX = endX - bs * 5;
    const muteSize = bs * 0.7;
    const muteY = infoY + (bs - muteSize) / 2;
    if (x >= muteX && x <= muteX + muteSize && y >= muteY && y <= muteY + muteSize) {
      this.commandCallback({ type: 'MUTE_TOGGLE' });
      return;
    }
  }

  private handleIdleClick(x: number, y: number): void {
    const bs = BoardProfile.blockSize;
    const { buttonX, buttonY, buttonW, buttonH } = BoardProfile;

    // Start button
    if (this.isInRect(x, y, buttonX, buttonY + bs * 2, buttonW, buttonH)) {
      this.commandCallback({ type: 'PLAY' });
    }
  }

  private handlePauseClick(x: number, y: number): void {
    const bs = BoardProfile.blockSize;
    const { buttonX, buttonY, buttonW, buttonH } = BoardProfile;

    // Resume
    if (this.isInRect(x, y, buttonX, buttonY + bs, buttonW, buttonH)) {
      this.commandCallback({ type: 'RESUME' });
      return;
    }

    // New Game
    if (this.isInRect(x, y, buttonX, buttonY + bs * 4, buttonW, buttonH)) {
      this.commandCallback({ type: 'NEW_GAME' });
    }
  }

  private handleEndClick(x: number, y: number): void {
    const bs = BoardProfile.blockSize;
    const { buttonX, buttonY, buttonW, buttonH } = BoardProfile;

    // Continue (win button or whole screen)
    if (this.isInRect(x, y, buttonX, buttonY + bs * 5, buttonW, buttonH)) {
      this.commandCallback({ type: 'WIN_CONTINUE' });
      return;
    }
    // Click anywhere to continue
    this.commandCallback({ type: 'WIN_CONTINUE' });
  }

  private handleGameoverClick(x: number, y: number): void {
    const bs = BoardProfile.blockSize;
    const { buttonX, buttonY, buttonW, buttonH } = BoardProfile;

    // Try Again
    if (this.isInRect(x, y, buttonX, buttonY + bs * 4, buttonW, buttonH)) {
      this.commandCallback({ type: 'TRY_AGAIN' });
      return;
    }

    // New Game
    if (this.isInRect(x, y, buttonX, buttonY + bs * 6, buttonW, buttonH)) {
      this.commandCallback({ type: 'NEW_GAME' });
    }
  }

  private handleMenuClick(x: number, y: number): void {
    const bs = BoardProfile.blockSize;
    const { buttonX, buttonY, buttonW, buttonH } = BoardProfile;

    // Challenge
    if (this.isInRect(x, y, buttonX, buttonY + bs, buttonW, buttonH)) {
      this.commandCallback({ type: 'CHALLENGE' });
      return;
    }

    // New Game
    if (this.isInRect(x, y, buttonX, buttonY + bs * 4, buttonW, buttonH)) {
      this.commandCallback({ type: 'NEW_GAME' });
      return;
    }

    // Resume saved
    if (this.isInRect(x, y, buttonX, buttonY + bs * 7, buttonW, buttonH)) {
      this.commandCallback({ type: 'RESUME_SAVED' });
    }
  }

  private isInRect(px: number, py: number, rx: number, ry: number, rw: number, rh: number): boolean {
    return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
  }
}
