package com.chobocho.mahjong.board;

import com.chobocho.imagematch.BoardProfile;
import com.chobocho.mahjong.state.PlayState;
import com.chobocho.util.CLog;

import java.util.LinkedList;
import java.util.List;

public class BoardImpl implements Board {
    final static String TAG = "BoardImpl";
    final static int SMALL_TIMER = BoardProfile.SMALL_TIMER;
    final static int BIG_TIMER = BoardProfile.BIG_TIMER;
    final static int HINT = BoardProfile.HINT;
    final static int HINT_TILE = BoardProfile.HINT_TILE;
    final static int NANHEE = BoardProfile.NANHEE;
    final static int MASTER_CHO = BoardProfile.MASTER_CHO;
    protected int width;
    protected int height;
    protected int[][] board;
    protected InitBoardMethod initMethod;
    protected int blockCount = 0;
    PlayState state;
    List<Block> hintBlocks;
    protected int []imageList = new int[BoardProfile.imageName.length+1];

    int blockKind = BoardProfile.blockKind;
    int EMPTY = 0;

    public BoardImpl(int w, int h, int blockKind) {
        width = w;
        height = h;
        this.blockKind = blockKind;
        this.initMethod = new InitBoardMethodImpl();
        initVars();
        initBoard();
    }

    public BoardImpl(int w, int h, int blockKind, InitBoardMethod initMethod) {
        width = w;
        height = h;
        this.blockKind = blockKind;
        this.initMethod = initMethod;
        initVars();
        initBoard();
    }

    public void setPlayState(PlayState state) {
        this.state = state;
    }

    public void SetInitMethod(InitBoardMethod initMethod) {
        this.initMethod = initMethod;
    }

    private void initVars() {
        board = new int[height + 1][width + 1];
        hintBlocks = new LinkedList<>();
        shuffleImageList();
    }

    private void shuffleImageList() {
        for (int i = 0; i < BoardProfile.imageName.length; i++) {
            imageList[i] = i;
        }

        for (int i = 1; i <= this.blockKind; i++) {
            int next = (int) (Math.random() * this.blockKind) + 1;

            if (i == next || next > this.blockKind) {
                continue;
            }

            int tmp = imageList[i];
            imageList[i] = imageList[next];
            imageList[next] = tmp;
        }
    }

    private void initBoard() {
        CLog.i(TAG, "W:" + width + " ,H:" + height);
        blockCount = initMethod.init(board, width, height);
    }

    public void setStage(int stage) {
        CLog.i(TAG, "Set Stage " + Integer.toString(stage));

        initBoard();
        hintBlocks.clear();

        int blockStart = 1;
        int blockTypeRange = (int) (Math.random() * 15) + 8 + stage;

        if (blockTypeRange > blockKind) {
            blockTypeRange = blockKind;
        }

        int loopCount = 1000;

        int maxBlockCount = (int) (width * height * 0.35);
        stage = stage <= maxBlockCount ? stage : maxBlockCount;

        while (stage > 0 && loopCount > 0) {
            if (insertBlock(blockStart, blockTypeRange)) {
                stage--;
                blockCount += 2;
            }
            loopCount--;
        }
    }

    // When there is only fair block exist
    public void setNanheeStage() {
        CLog.i(TAG, "setNanheeStage!");

        int currentCount = blockCount;

        initBoard();
        hintBlocks.clear();

        if (insertBlock(NANHEE)) {
            blockCount += 2;
        }

        int blockStart = 1;
        int blockTypeRange = blockKind;

        int loopCount = 100;

        while (blockCount < currentCount && --loopCount > 0) {
            if (insertBlock(blockStart, blockTypeRange)) {
                blockCount += 2;
            }
        }
    }

    private boolean insertBlock(int blockStart, int blockTypeRange) {
        CLog.i(TAG, "insertBlock from " + blockStart + ", to " + blockTypeRange);

        int blockType = ((int) (Math.random() * blockKind) % blockTypeRange + blockStart) % blockKind;

        if (blockType == EMPTY) {
            blockType = EMPTY + 1;
        }

        return insertBlock(blockType);
    }

    private boolean insertBlock(int blockType) {
        CLog.i(TAG, "insertBlock " + blockType);
        int MAX_LOOPCOUNT = 100;

        int one_x = 0;
        int one_y = 0;
        int two_x = 0;
        int two_y = 0;

        int loopCount = 0;

        while (loopCount < MAX_LOOPCOUNT) {
            do {
                one_x = (int) (Math.random() * (width - 3));
                one_y = (int) (Math.random() * (height - 3));
            } while (board[one_y][one_x] != EMPTY);

            do {
                two_x = (int) (Math.random() * (width - one_x)) + one_x;
                two_y = (int) (Math.random() * (height - one_y)) + one_y;
            } while (board[two_y][two_x] != EMPTY);

            CLog.i(TAG, "W:" + one_x + " ,H:" + one_y);
            CLog.i(TAG, "W:" + two_x + " ,H:" + two_y);

            if (!isClosedBlock(one_x, one_y, two_x, two_y)) {
                break;
            }

            loopCount++;
        }

        if (loopCount >= MAX_LOOPCOUNT) {
            CLog.i(TAG, "insertBlock error: MAX COUNT LOOP");
            return false;
        }

        CLog.i(TAG, "insertBlock " + imageList[blockType] + ", " + blockType);

        board[one_y][one_x] = imageList[blockType];
        board[two_y][two_x] = imageList[blockType];

        return true;
    }

    private boolean isClosedBlock(int one_x, int one_y, int two_x, int two_y) {
        return ((two_x - one_x == 1) && (two_y == one_y)) ||
                ((one_x - two_x == 1) && (two_y == one_y)) ||
                ((two_x == one_x) && (two_y - one_y == 1)) ||
                ((two_x == one_x) && (one_y - two_y == 1)) ||
                ((two_x == one_x) && (two_y == one_y));
    }

    public int[][] getBoard() {
        return board;
    }

    public int removeBlock(int x, int y) {
        CLog.i(TAG, "removeBlock " + x + ", " + y);

        LinkedList<Block> removeBlocks = getRemovableBlocks(x, y);
        int count = 0;

        if (removeBlocks.size() > 0) {
            CLog.i(TAG, "removeBlock BlockCount " + blockCount);
            blockCount -= removeBlocks.size();
            for (Block block : removeBlocks) {
                if (state != null) {
                    processItem(block);
                }
                board[block.y][block.x] = EMPTY;

                if (!hintBlocks.isEmpty()) {
                    for (int i = 0; i < hintBlocks.size(); i++) {
                        if (block.x == hintBlocks.get(i).x && block.y == hintBlocks.get(i).y) {
                            hintBlocks.clear();
                            CLog.i(TAG, "It is hint block");
                        }
                    }
                }
            }
            CLog.i(TAG, "removeBlock BlockCount " + blockCount);
            CLog.i(TAG, "removeBlock count " + removeBlocks.size());
            count += removeBlocks.size();
            removeBlocks.clear();

            if (!hintBlocks.isEmpty()) {
                Block hint = hintBlocks.get(0);
                if (hint.x == x && hint.y == y) {
                    hintBlocks.clear();
                }
            }
        }
        return count;
    }

    private void processItem(Block block) {
        if (block.type == SMALL_TIMER) {
            state.addTick(15);
            CLog.i(TAG, "[removeBlock] addTick 15");
        } else if (block.type == BIG_TIMER) {
            CLog.i(TAG, "[removeBlock] addTick 30");
            state.addTick(30);
        } else if (block.type == HINT_TILE) {
            state.addHint(1);
            CLog.i(TAG, "[removeBlock] add Hint 1");
        } else if (block.type == MASTER_CHO) {
            state.addHint(1);
            state.addTick(42);
            CLog.i(TAG, "[removeBlock] MASTER_CHO");
        }
    }

    public boolean isClear() {
        return blockCount == 0;
    }

    @Override
    public Block getHint() {
        if (hintBlocks.isEmpty()) {
            return null;
        }
        return hintBlocks.get(0);
    }

    public boolean updateHint() {
        CLog.i(TAG, "updateHint()");

        boolean alreayHasHint = !hintBlocks.isEmpty();
        if (alreayHasHint) {
            return false;
        }

        for (int i = 0; i < height; i++) {
            for (int j = 0; j < width; j++) {
                LinkedList<Block> blocks = getRemovableBlocks(j, i);
                if (blocks.size() > 0) {
                    for (Block block : blocks) {
                        hintBlocks.add(new Block(block));
                    }
                    hintBlocks.add(0, new Block(j, i));
                    CLog.i(TAG, "X: " + j + " , y: " + i);

                    return true;
                }
            }
        }
        return false;
    }

    public boolean needShuffle() {
        return !isClear() && !isRemovable();
    }

    public boolean shuffle() {
        CLog.i(TAG, "shuffle()");
        int currentCount = blockCount;
        int maxCount = 100;

        if (currentCount <= 10) {
            setNanheeStage();
            return true;
        }

        while (!isRemovable() && (maxCount > 0)) {
            setStage(currentCount / 2);
            if (currentCount > 10) {
                addTimeIcon();
            }
            maxCount--;
        }

        if (maxCount <= 0) {
            CLog.i(TAG, "rearrange() maxCount over!");
            return false;
        }

        return true;
    }

    private void addTimeIcon() {
        if (insertBlock(SMALL_TIMER)) {
            blockCount += 2;
        }
    }

    public boolean isRemovable() {
        CLog.i(TAG, "isRemovable()");
        for (int i = 0; i < height; i++) {
            for (int j = 0; j < width; j++) {
                LinkedList<Block> blocks = getRemovableBlocks(j, i);
                if (blocks.size() > 0) {
                    return true;
                }
            }
        }
        return false;
    }

    private LinkedList<Block> getRemovableBlocks(int x, int y) {
        // CLog.i(TAG, "isRemovable " + x + ", " + y);
        LinkedList<Block> removableBlocks = new LinkedList<>();

        if (x < 0 || x >= width || y < 0 || y >= height) {
            return removableBlocks;
        }

        if (board[y][x] != EMPTY) {
            return removableBlocks;
        }

        int i = 0;
        int j = 0;

        int far = 0;

        Block north = new Block();
        Block west = new Block();
        Block south = new Block();
        Block east = new Block();

        for (i = x, far = 0; i < width; i++, far++) {
            if (board[y][i] != EMPTY) {
                east.set(board[y][i], i, y, far);
                CLog.i(TAG, "Find!! E");
                break;
            }
        }

        for (i = x, far = 0; i >= 0; i--, far++) {
            if (board[y][i] != EMPTY) {
                west.set(board[y][i], i, y, far);
                CLog.i(TAG, "Find!! W");
                break;
            }
        }

        for (j = y, far = 0; j >= 0; j--, far++) {
            if (board[j][x] != EMPTY) {
                north.set(board[j][x], x, j, far);
                break;
            }
        }

        for (j = y, far = 0; j < height; j++, far++) {
            if (board[j][x] != EMPTY) {
                south.set(board[j][x], x, j, far);
                break;
            }
        }

        if (north.type != EMPTY) {
            if (north.type == east.type) {
                removableBlocks.add(north);
                removableBlocks.add(east);
                east.type = EMPTY;
            } else if (north.type == south.type) {
                removableBlocks.add(north);
                removableBlocks.add(south);
                south.type = EMPTY;
            } else if (north.type == west.type) {
                removableBlocks.add(north);
                removableBlocks.add(west);
                west.type = EMPTY;
            }
        }

        if (east.type != EMPTY) {
            if (east.type == south.type) {
                removableBlocks.add(east);
                removableBlocks.add(south);
                south.type = EMPTY;
            } else if (east.type == west.type) {
                removableBlocks.add(east);
                removableBlocks.add(west);
                west.type = EMPTY;
            }
        }

        if (south.type != EMPTY) {
            if (south.type == west.type) {
                removableBlocks.add(south);
                removableBlocks.add(west);
                west.type = EMPTY;
            }
        }

        return removableBlocks;
    }
}
