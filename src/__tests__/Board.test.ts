import { Board } from '../game/Board';
import { Block } from '../game/Block';

describe('Board', () => {
  let board: Board;

  beforeEach(() => {
    board = new Board(8, 12, 65);
  });

  test('initial board is empty', () => {
    expect(board.getBlockCount()).toBe(0);
    expect(board.isClear()).toBe(true);
  });

  test('board dimensions', () => {
    expect(board.getWidth()).toBe(8);
    expect(board.getHeight()).toBe(12);
  });

  test('setStage places blocks', () => {
    board.setStage(5);
    expect(board.getBlockCount()).toBeGreaterThan(0);
    expect(board.isClear()).toBe(false);
  });

  test('setStage blocks are in pairs (even count)', () => {
    board.setStage(10);
    expect(board.getBlockCount() % 2).toBe(0);
  });

  test('board has blocks after setStage', () => {
    board.setStage(5);
    expect(board.getBlockCount()).toBeGreaterThan(0);
  });

  test('removeBlock on empty board returns 0', () => {
    const result = board.removeBlock(0, 0);
    expect(result).toBe(0);
  });

  test('removeBlock out of bounds returns 0', () => {
    expect(board.removeBlock(-1, 0)).toBe(0);
    expect(board.removeBlock(0, -1)).toBe(0);
    expect(board.removeBlock(8, 0)).toBe(0);
    expect(board.removeBlock(0, 12)).toBe(0);
  });

  test('removeBlock on non-empty cell returns 0', () => {
    board.setStage(5);
    const grid = board.getBoard();
    // Find a non-empty cell
    for (let y = 0; y < 12; y++) {
      for (let x = 0; x < 8; x++) {
        if (grid[y][x] !== 0) {
          expect(board.removeBlock(x, y)).toBe(0);
          return;
        }
      }
    }
  });

  test('matching algorithm finds pairs in horizontal direction', () => {
    // Manually set up a board with known matching pair
    const grid = board.getBoard();
    // Place matching cards: type 5 at (0,0) and (2,0) with empty (1,0) between
    grid[0][0] = 5;
    grid[0][2] = 5;
    (board as any).blockCount = 2;

    // Click the empty cell between them
    const removable = board.getRemovableBlocks(1, 0);
    expect(removable.length).toBe(2);
    expect(removable[0].type).toBe(5);
    expect(removable[1].type).toBe(5);
  });

  test('matching works vertically', () => {
    const grid = board.getBoard();
    grid[0][3] = 10;
    grid[2][3] = 10;
    (board as any).blockCount = 2;

    const removable = board.getRemovableBlocks(3, 1);
    expect(removable.length).toBe(2);
  });

  test('matching works across N and E directions', () => {
    const grid = board.getBoard();
    // North at (3,0), East at (5,2)
    grid[0][3] = 15;
    grid[2][5] = 15;
    (board as any).blockCount = 2;

    // Click (3,2) - north sees (3,0)=15, east sees (5,2)=15 -> match
    const removable = board.getRemovableBlocks(3, 2);
    expect(removable.length).toBe(2);
  });

  test('no match when types differ', () => {
    const grid = board.getBoard();
    grid[0][0] = 5;
    grid[0][2] = 7; // Different type
    (board as any).blockCount = 2;

    const removable = board.getRemovableBlocks(1, 0);
    expect(removable.length).toBe(0);
  });

  test('removeBlock decrements blockCount', () => {
    const grid = board.getBoard();
    grid[0][0] = 5;
    grid[0][2] = 5;
    (board as any).blockCount = 2;

    const removed = board.removeBlock(1, 0);
    expect(removed).toBe(2);
    expect(board.getBlockCount()).toBe(0);
    expect(board.isClear()).toBe(true);
  });

  test('needShuffle when no moves available', () => {
    const grid = board.getBoard();
    // Place two blocks with no empty cell between them (adjacent)
    grid[0][0] = 5;
    grid[0][1] = 5;
    (board as any).blockCount = 2;

    // No empty cell can see both - need shuffle
    expect(board.needShuffle()).toBe(true);
  });

  test('isClear true when all blocks removed', () => {
    expect(board.isClear()).toBe(true);
    board.setStage(1);
    expect(board.isClear()).toBe(false);
  });

  test('updateHint finds removable pair', () => {
    const grid = board.getBoard();
    grid[0][0] = 5;
    grid[0][2] = 5;
    (board as any).blockCount = 2;

    const result = board.updateHint();
    expect(result).toBe(true);
    expect(board.getHint()).not.toBeNull();
  });

  test('updateHint returns false when hint already active', () => {
    const grid = board.getBoard();
    grid[0][0] = 5;
    grid[0][2] = 5;
    (board as any).blockCount = 2;

    board.updateHint();
    expect(board.updateHint()).toBe(false);
  });

  test('serialization round-trip', () => {
    board.setStage(5);
    const json = board.toJSON();
    const board2 = new Board(8, 12, 65);
    board2.fromJSON(json);
    expect(board2.getBlockCount()).toBe(board.getBlockCount());
    expect(board2.getBoard()[0]).toEqual(board.getBoard()[0]);
  });

  test('shuffle preserves block count', () => {
    board.setStage(5);
    const countBefore = board.getBlockCount();
    board.shuffle();
    expect(board.getBlockCount()).toBe(countBefore);
  });

  test('different stages produce different block counts', () => {
    const board1 = new Board(8, 12, 65);
    board1.setStage(1);
    const count1 = board1.getBlockCount();

    const board2 = new Board(8, 12, 65);
    board2.setStage(20);
    const count2 = board2.getBlockCount();

    // Higher stages should generally have more blocks
    expect(count2).toBeGreaterThanOrEqual(count1);
  });
});
