import { Block } from './Block';
import { BoardProfile } from './BoardProfile';

export interface IBoard {
  getBoard(): number[][];
  removeBlock(x: number, y: number): number;
  isClear(): boolean;
  getHint(): Block | null;
  updateHint(): boolean;
  needShuffle(): boolean;
  shuffle(): boolean;
  isRemovable(): boolean;
  setStage(stage: number): void;
  getBlockCount(): number;
  getWidth(): number;
  getHeight(): number;
}

export interface PlayStateCallback {
  addTick(tick: number): void;
  addHint(hint: number): void;
}

export class Board implements IBoard {
  private width: number;
  private height: number;
  private board: number[][];
  private blockCount: number = 0;
  private state: PlayStateCallback | null = null;
  private hintBlocks: Block[] = [];
  private imageList: number[];
  private blockKind: number;
  private readonly EMPTY = 0;

  constructor(w: number, h: number, blockKind: number) {
    this.width = w;
    this.height = h;
    this.blockKind = blockKind;
    this.board = [];
    this.imageList = [];
    this.initVars();
    this.initBoard();
  }

  setPlayState(state: PlayStateCallback): void {
    this.state = state;
  }

  private initVars(): void {
    this.board = Array.from({ length: this.height + 1 }, () =>
      new Array(this.width + 1).fill(0)
    );
    this.hintBlocks = [];
    this.shuffleImageList();
  }

  private shuffleImageList(): void {
    const totalImages = BoardProfile.blockKind + 3; // block0..blockKind + hint + block99
    this.imageList = Array.from({ length: totalImages }, (_, i) => i);

    for (let i = 1; i <= this.blockKind; i++) {
      const next = Math.floor(Math.random() * this.blockKind) + 1;
      if (i === next || next > this.blockKind) continue;
      const tmp = this.imageList[i];
      this.imageList[i] = this.imageList[next];
      this.imageList[next] = tmp;
    }
  }

  private initBoard(): void {
    for (let i = 0; i <= this.height; i++) {
      for (let j = 0; j <= this.width; j++) {
        this.board[i][j] = 0;
      }
    }
    this.blockCount = 0;
  }

  setStage(stage: number): void {
    this.initBoard();
    this.hintBlocks = [];

    const blockStart = 1;
    let blockTypeRange = Math.floor(Math.random() * 15) + 8 + stage;
    if (blockTypeRange > this.blockKind) blockTypeRange = this.blockKind;

    let loopCount = 1000;
    const maxBlockCount = Math.floor(this.width * this.height * 0.35);
    stage = stage <= maxBlockCount ? stage : maxBlockCount;

    while (stage > 0 && loopCount > 0) {
      if (this.insertBlockRange(blockStart, blockTypeRange)) {
        stage--;
        this.blockCount += 2;
      }
      loopCount--;
    }
  }

  private setNanheeStage(): void {
    const currentCount = this.blockCount;
    this.initBoard();
    this.hintBlocks = [];

    if (this.insertBlockType(BoardProfile.NANHEE)) {
      this.blockCount += 2;
    }

    const blockStart = 1;
    const blockTypeRange = this.blockKind;
    let loopCount = 100;

    while (this.blockCount < currentCount && --loopCount > 0) {
      if (this.insertBlockRange(blockStart, blockTypeRange)) {
        this.blockCount += 2;
      }
    }
  }

  private insertBlockRange(blockStart: number, blockTypeRange: number): boolean {
    let blockType = (Math.floor(Math.random() * this.blockKind) % blockTypeRange + blockStart) % this.blockKind;
    if (blockType === this.EMPTY) blockType = this.EMPTY + 1;
    return this.insertBlockType(blockType);
  }

  private insertBlockType(blockType: number): boolean {
    const MAX_LOOPCOUNT = 100;
    let oneX = 0, oneY = 0, twoX = 0, twoY = 0;
    let loopCount = 0;

    while (loopCount < MAX_LOOPCOUNT) {
      do {
        oneX = Math.floor(Math.random() * (this.width - 3));
        oneY = Math.floor(Math.random() * (this.height - 3));
      } while (this.board[oneY][oneX] !== this.EMPTY);

      do {
        twoX = Math.floor(Math.random() * (this.width - oneX)) + oneX;
        twoY = Math.floor(Math.random() * (this.height - oneY)) + oneY;
      } while (this.board[twoY][twoX] !== this.EMPTY);

      if (!this.isClosedBlock(oneX, oneY, twoX, twoY)) break;
      loopCount++;
    }

    if (loopCount >= MAX_LOOPCOUNT) return false;

    const imageIndex = blockType < this.imageList.length ? this.imageList[blockType] : blockType;
    this.board[oneY][oneX] = imageIndex;
    this.board[twoY][twoX] = imageIndex;
    return true;
  }

  private isClosedBlock(oneX: number, oneY: number, twoX: number, twoY: number): boolean {
    return ((twoX - oneX === 1) && (twoY === oneY)) ||
           ((oneX - twoX === 1) && (twoY === oneY)) ||
           ((twoX === oneX) && (twoY - oneY === 1)) ||
           ((twoX === oneX) && (oneY - twoY === 1)) ||
           ((twoX === oneX) && (twoY === oneY));
  }

  getBoard(): number[][] { return this.board; }
  getBlockCount(): number { return this.blockCount; }
  getWidth(): number { return this.width; }
  getHeight(): number { return this.height; }

  removeBlock(x: number, y: number): number {
    const removeBlocks = this.getRemovableBlocks(x, y);
    let count = 0;

    if (removeBlocks.length > 0) {
      this.blockCount -= removeBlocks.length;
      for (const block of removeBlocks) {
        if (this.state) this.processItem(block);
        this.board[block.y][block.x] = this.EMPTY;

        if (this.hintBlocks.length > 0) {
          for (let i = 0; i < this.hintBlocks.length; i++) {
            if (block.x === this.hintBlocks[i].x && block.y === this.hintBlocks[i].y) {
              this.hintBlocks = [];
              break;
            }
          }
        }
      }
      count += removeBlocks.length;

      if (this.hintBlocks.length > 0) {
        const hint = this.hintBlocks[0];
        if (hint.x === x && hint.y === y) {
          this.hintBlocks = [];
        }
      }
    }
    return count;
  }

  private processItem(block: Block): void {
    if (!this.state) return;
    if (block.type === BoardProfile.SMALL_TIMER) {
      this.state.addTick(15);
    } else if (block.type === BoardProfile.BIG_TIMER) {
      this.state.addTick(30);
    } else if (block.type === BoardProfile.HINT_TILE) {
      this.state.addHint(1);
    } else if (block.type === BoardProfile.MASTER_CHO) {
      this.state.addHint(1);
      this.state.addTick(42);
    }
  }

  isClear(): boolean { return this.blockCount === 0; }

  getHint(): Block | null {
    if (this.hintBlocks.length === 0) return null;
    return this.hintBlocks[0];
  }

  getHintBlocks(): Block[] { return this.hintBlocks; }

  updateHint(): boolean {
    if (this.hintBlocks.length > 0) return false;

    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        const blocks = this.getRemovableBlocks(j, i);
        if (blocks.length > 0) {
          this.hintBlocks = [];
          for (const block of blocks) {
            this.hintBlocks.push(block.clone());
          }
          this.hintBlocks.unshift(new Block(j, i));
          return true;
        }
      }
    }
    return false;
  }

  needShuffle(): boolean {
    return !this.isClear() && !this.isRemovable();
  }

  shuffle(): boolean {
    const currentCount = this.blockCount;
    let maxCount = 100;

    if (currentCount <= 10) {
      this.setNanheeStage();
      return true;
    }

    while (!this.isRemovable() && maxCount > 0) {
      this.setStage(Math.floor(currentCount / 2));
      if (currentCount > 10) this.addTimeIcon();
      maxCount--;
    }

    return maxCount > 0;
  }

  private addTimeIcon(): void {
    if (this.insertBlockType(BoardProfile.SMALL_TIMER)) {
      this.blockCount += 2;
    }
  }

  isRemovable(): boolean {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        const blocks = this.getRemovableBlocks(j, i);
        if (blocks.length > 0) return true;
      }
    }
    return false;
  }

  getRemovableBlocks(x: number, y: number): Block[] {
    const removableBlocks: Block[] = [];

    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return removableBlocks;
    if (this.board[y][x] !== this.EMPTY) return removableBlocks;

    const north = new Block();
    const west = new Block();
    const south = new Block();
    const east = new Block();

    // Search East
    for (let i = x, far = 0; i < this.width; i++, far++) {
      if (this.board[y][i] !== this.EMPTY) {
        east.set(this.board[y][i], i, y, far);
        break;
      }
    }

    // Search West
    for (let i = x, far = 0; i >= 0; i--, far++) {
      if (this.board[y][i] !== this.EMPTY) {
        west.set(this.board[y][i], i, y, far);
        break;
      }
    }

    // Search North
    for (let j = y, far = 0; j >= 0; j--, far++) {
      if (this.board[j][x] !== this.EMPTY) {
        north.set(this.board[j][x], x, j, far);
        break;
      }
    }

    // Search South
    for (let j = y, far = 0; j < this.height; j++, far++) {
      if (this.board[j][x] !== this.EMPTY) {
        south.set(this.board[j][x], x, j, far);
        break;
      }
    }

    // Match pairs
    if (north.type !== this.EMPTY) {
      if (north.type === east.type) {
        removableBlocks.push(north.clone(), east.clone());
        east.type = this.EMPTY;
      } else if (north.type === south.type) {
        removableBlocks.push(north.clone(), south.clone());
        south.type = this.EMPTY;
      } else if (north.type === west.type) {
        removableBlocks.push(north.clone(), west.clone());
        west.type = this.EMPTY;
      }
    }

    if (east.type !== this.EMPTY) {
      if (east.type === south.type) {
        removableBlocks.push(east.clone(), south.clone());
        south.type = this.EMPTY;
      } else if (east.type === west.type) {
        removableBlocks.push(east.clone(), west.clone());
        west.type = this.EMPTY;
      }
    }

    if (south.type !== this.EMPTY) {
      if (south.type === west.type) {
        removableBlocks.push(south.clone(), west.clone());
        west.type = this.EMPTY;
      }
    }

    return removableBlocks;
  }

  // Serialization for save/load
  toJSON(): Record<string, unknown> {
    return {
      width: this.width,
      height: this.height,
      board: this.board.map(row => [...row]),
      blockCount: this.blockCount,
      blockKind: this.blockKind,
    };
  }

  fromJSON(data: Record<string, unknown>): void {
    this.width = data.width as number;
    this.height = data.height as number;
    this.blockCount = data.blockCount as number;
    this.blockKind = data.blockKind as number;
    this.board = (data.board as number[][]).map((row: number[]) => [...row]);
    this.hintBlocks = [];
  }
}
