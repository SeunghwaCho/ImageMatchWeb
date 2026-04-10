(function() {
"use strict";

const __modules = {};
const __exports = {};

function __require(name) {
  if (__exports[name]) return __exports[name];
  __exports[name] = {};
  __modules[name](__exports[name]);
  return __exports[name];
}

// --- game/Block.js ---
__modules['game/Block'] = function(exports) {
class Block {
    constructor(xOrBlock, y) {
        this.type = 0;
        this.x = 0;
        this.y = 0;
        this.far = 0;
        if (xOrBlock === undefined) {
            // default
        }
        else if (typeof xOrBlock === 'object') {
            this.type = xOrBlock.type;
            this.x = xOrBlock.x;
            this.y = xOrBlock.y;
            this.far = xOrBlock.far;
        }
        else {
            this.x = xOrBlock;
            this.y = y ?? 0;
        }
    }
    set(type, x, y, far) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.far = far ?? 0;
    }
    clone() {
        const b = new Block();
        b.type = this.type;
        b.x = this.x;
        b.y = this.y;
        b.far = this.far;
        return b;
    }
}
//# sourceMappingURL=Block.js.map
  try { exports.Block = Block; } catch(e) {}
};

// --- game/GameState.js ---
__modules['game/GameState'] = function(exports) {
const GameStateType = {
    NONE: 0,
    IDLE: 1,
    PLAY: 2,
    PAUSE: 3,
    END: 4,
    GAMEOVER: 5,
};
//# sourceMappingURL=GameState.js.map
  try { exports.GameStateType = GameStateType; } catch(e) {}
};

// --- game/BoardProfile.js ---
__modules['game/BoardProfile'] = function(exports) {
const BoardProfile = {
    // Button image indices
    NEW_GAME_BUTTON: 0,
    ABOUT_BUTTON: 1,
    RANKING_BUTTON: 2,
    QUIT_BUTTON: 3,
    START_BUTTON: 4,
    PAUSE_BUTTON: 5,
    RESUME_BUTTON: 6,
    WIN_BUTTON: 7,
    TIMER_BAR: 8,
    GAME_OVER: 9,
    NUMBER_1: 10,
    NUMBER_2: 11,
    NUMBER_3: 12,
    NUMBER_4: 13,
    NUMBER_5: 14,
    SMALL_NUMBER_0: 15,
    SMALL_NUMBER_1: 16,
    SMALL_NUMBER_2: 17,
    SMALL_NUMBER_3: 18,
    SMALL_NUMBER_4: 19,
    SMALL_NUMBER_5: 20,
    SMALL_NUMBER_6: 21,
    SMALL_NUMBER_7: 22,
    SMALL_NUMBER_8: 23,
    SMALL_NUMBER_9: 24,
    HIGH_SCORE_BUTTON: 25,
    TRY_AGAIN_BUTTON: 26,
    HINT_BUTTON: 27,
    CHALLENGE_BUTTON: 28,
    versionName: '1.0.0',
    screenW: 1080,
    screenH: 1820,
    blockSize: 130,
    startX: 0,
    startY: 130,
    endX: 1080,
    endY: 1820,
    buttonW: 400,
    buttonH: 130,
    buttonX: 340,
    buttonY: 50,
    boardWidth: 8,
    boardHeight: 12,
    blockKind: 65,
    MASTER_CHO: 2,
    HINT: 66, // blockKind + 1
    HINT_TILE: 7,
    SMALL_TIMER: 24,
    BIG_TIMER: 43,
    NANHEE: 67, // HINT + 1
    setScreenSize(w, h) {
        this.screenW = w;
        this.screenH = h;
        const widthBlockSize = Math.floor(h / (this.boardHeight + 5.5));
        let bs = Math.floor(w / this.boardWidth);
        bs = bs <= widthBlockSize ? bs : widthBlockSize;
        this.blockSize = bs;
        this.startX = Math.floor((w - bs * this.boardWidth) / 2);
        this.startY = Math.floor(bs * 1.5);
        this.endX = this.startX + bs * this.boardWidth;
        this.endY = this.startY + bs * this.boardHeight;
        this.buttonW = bs * 4;
        this.buttonH = Math.floor(bs * 1.5);
        this.buttonX = Math.floor((w - this.buttonW) / 2);
        this.buttonY = bs * 2;
    }
};
//# sourceMappingURL=BoardProfile.js.map
  try { exports.BoardProfile = BoardProfile; } catch(e) {}
};

// --- game/GameInfo.js ---
__modules['game/GameInfo'] = function(exports) {
class GameInfo {
    constructor() {
        this.score = 0;
        this.highScore = 0;
        this.previousScore = 0;
        this.highState = 1;
        this.stage = 0;
        this.DEFAULT_HINT = 3;
        this.MAX_HINT = 9;
        this.MAX_SCORE = 99999999;
        this.previousHint = 0;
        this.hint = 0;
        this.MAX_TIME = 60;
        this.MAX_STAGE = 1123;
        this.time = 0;
        this.score = 0;
        this.highScore = 0;
        this.previousScore = 0;
        this.stage = 0;
        this.highState = 1;
        this.previousHint = 0;
        this.hint = this.DEFAULT_HINT;
        this.time = this.MAX_TIME; // BUG FIX: was MAX_TIME+1 in Android
    }
    init() {
        this.score = 0;
        this.previousScore = 0;
        this.hint = this.DEFAULT_HINT;
        this.time = this.MAX_TIME; // BUG FIX: was MAX_TIME+1
    }
    getHighStage() { return this.highState; }
    setHighStage(stage) {
        if (stage > this.MAX_STAGE)
            stage = this.MAX_STAGE;
        this.highState = stage;
        return true;
    }
    updateHighStage() {
        if ((this.stage + 1) > this.highState) {
            this.highState = this.stage + 1;
            if (this.highState > this.MAX_STAGE)
                this.highState = this.MAX_STAGE;
        }
    }
    getStage() { return this.stage; }
    setStage(newStage) {
        newStage = newStage < 1 ? 1 : newStage;
        this.stage = newStage > this.MAX_STAGE ? this.MAX_STAGE : newStage;
        if (newStage === 1) {
            this.init();
        }
        else {
            this.backup();
        }
        this.stage = newStage;
    }
    stageUp() {
        this.stage = (this.stage + 1) % (this.MAX_STAGE + 1);
        if ((this.stage % 3) === 2) {
            this.addHint(1);
        }
        else if (this.stage > 15) {
            this.addHint(Math.floor(this.stage / 10));
        }
        this.backup();
    }
    addScore(score) {
        this.score += score;
        this.score = this.score > this.MAX_SCORE ? this.MAX_SCORE : this.score;
        this.updateHighScore();
        return this.score;
    }
    setScore(score) { this.score = score; return true; }
    setHighScore(score) {
        score = score > this.MAX_SCORE ? this.MAX_SCORE : score;
        this.highScore = score;
        return true;
    }
    updateHighScore() {
        if (this.score > this.highScore)
            this.highScore = this.score;
    }
    getScore() { return this.score; }
    getHighScore() { return this.highScore; }
    // BUG FIX: Android version always returned 0. Now gives actual score.
    calculatorScore(removedBlockCount, time) {
        return removedBlockCount * 10 + time * 5;
    }
    revert() {
        this.score = this.previousScore;
        this.hint = this.previousHint;
    }
    backup() {
        this.previousScore = this.score;
        this.previousHint = this.hint;
    }
    getHint() { return this.hint; }
    setHint(hint) {
        if (hint < 0)
            return 0;
        this.hint = hint >= this.MAX_HINT ? this.MAX_HINT : hint;
        return this.hint;
    }
    addHint(h) {
        this.hint += h;
        this.hint = this.hint > this.MAX_HINT ? this.MAX_HINT : this.hint;
        this.hint = this.hint < 0 ? 0 : this.hint;
        return this.hint;
    }
    getTime() { return this.time; }
    setMaxTime(newMaxTime) {
        this.MAX_TIME = newMaxTime;
        return this.MAX_TIME;
    }
    addTick(t) {
        if (t < 0)
            return false;
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
    tick() {
        this.time--;
        this.time = this.time < 0 ? 0 : this.time;
        return this.time > 0;
    }
    initTime() {
        this.time = this.MAX_TIME; // BUG FIX: was MAX_TIME+1
    }
    // For serialization (save/load)
    toJSON() {
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
    fromJSON(data) {
        this.score = data.score ?? 0;
        this.highScore = data.highScore ?? 0;
        this.previousScore = data.previousScore ?? 0;
        this.highState = data.highState ?? 1;
        this.stage = data.stage ?? 0;
        this.previousHint = data.previousHint ?? 0;
        this.hint = data.hint ?? this.DEFAULT_HINT;
        this.time = data.time ?? this.MAX_TIME;
    }
}
//# sourceMappingURL=GameInfo.js.map
  try { exports.GameInfo = GameInfo; } catch(e) {}
};

// --- game/Board.js ---
__modules['game/Board'] = function(exports) {
var Block = __require('game/Block').Block;
var BoardProfile = __require('game/BoardProfile').BoardProfile;
class Board {
    constructor(w, h, blockKind) {
        this.blockCount = 0;
        this.state = null;
        this.hintBlocks = [];
        this.EMPTY = 0;
        this.width = w;
        this.height = h;
        this.blockKind = blockKind;
        this.board = [];
        this.imageList = [];
        this.initVars();
        this.initBoard();
    }
    setPlayState(state) {
        this.state = state;
    }
    initVars() {
        this.board = Array.from({ length: this.height + 1 }, () => new Array(this.width + 1).fill(0));
        this.hintBlocks = [];
        this.shuffleImageList();
    }
    shuffleImageList() {
        const totalImages = BoardProfile.blockKind + 3; // block0..blockKind + hint + block99
        this.imageList = Array.from({ length: totalImages }, (_, i) => i);
        for (let i = 1; i <= this.blockKind; i++) {
            const next = Math.floor(Math.random() * this.blockKind) + 1;
            if (i === next || next > this.blockKind)
                continue;
            const tmp = this.imageList[i];
            this.imageList[i] = this.imageList[next];
            this.imageList[next] = tmp;
        }
    }
    initBoard() {
        for (let i = 0; i <= this.height; i++) {
            for (let j = 0; j <= this.width; j++) {
                this.board[i][j] = 0;
            }
        }
        this.blockCount = 0;
    }
    setStage(stage) {
        this.initBoard();
        this.hintBlocks = [];
        const blockStart = 1;
        let blockTypeRange = Math.floor(Math.random() * 15) + 8 + stage;
        if (blockTypeRange > this.blockKind)
            blockTypeRange = this.blockKind;
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
    setNanheeStage() {
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
    insertBlockRange(blockStart, blockTypeRange) {
        let blockType = (Math.floor(Math.random() * this.blockKind) % blockTypeRange + blockStart) % this.blockKind;
        if (blockType === this.EMPTY)
            blockType = this.EMPTY + 1;
        return this.insertBlockType(blockType);
    }
    insertBlockType(blockType) {
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
            if (!this.isClosedBlock(oneX, oneY, twoX, twoY))
                break;
            loopCount++;
        }
        if (loopCount >= MAX_LOOPCOUNT)
            return false;
        const imageIndex = blockType < this.imageList.length ? this.imageList[blockType] : blockType;
        this.board[oneY][oneX] = imageIndex;
        this.board[twoY][twoX] = imageIndex;
        return true;
    }
    isClosedBlock(oneX, oneY, twoX, twoY) {
        return ((twoX - oneX === 1) && (twoY === oneY)) ||
            ((oneX - twoX === 1) && (twoY === oneY)) ||
            ((twoX === oneX) && (twoY - oneY === 1)) ||
            ((twoX === oneX) && (oneY - twoY === 1)) ||
            ((twoX === oneX) && (twoY === oneY));
    }
    getBoard() { return this.board; }
    getBlockCount() { return this.blockCount; }
    getWidth() { return this.width; }
    getHeight() { return this.height; }
    removeBlock(x, y) {
        const removeBlocks = this.getRemovableBlocks(x, y);
        let count = 0;
        if (removeBlocks.length > 0) {
            this.blockCount -= removeBlocks.length;
            for (const block of removeBlocks) {
                if (this.state)
                    this.processItem(block);
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
    processItem(block) {
        if (!this.state)
            return;
        if (block.type === BoardProfile.SMALL_TIMER) {
            this.state.addTick(15);
        }
        else if (block.type === BoardProfile.BIG_TIMER) {
            this.state.addTick(30);
        }
        else if (block.type === BoardProfile.HINT_TILE) {
            this.state.addHint(1);
        }
        else if (block.type === BoardProfile.MASTER_CHO) {
            this.state.addHint(1);
            this.state.addTick(42);
        }
    }
    isClear() { return this.blockCount === 0; }
    getHint() {
        if (this.hintBlocks.length === 0)
            return null;
        return this.hintBlocks[0];
    }
    getHintBlocks() { return this.hintBlocks; }
    updateHint() {
        if (this.hintBlocks.length > 0)
            return false;
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
    needShuffle() {
        return !this.isClear() && !this.isRemovable();
    }
    shuffle() {
        const currentCount = this.blockCount;
        let maxCount = 100;
        if (currentCount <= 10) {
            this.setNanheeStage();
            return true;
        }
        while (!this.isRemovable() && maxCount > 0) {
            this.setStage(Math.floor(currentCount / 2));
            if (currentCount > 10)
                this.addTimeIcon();
            maxCount--;
        }
        return maxCount > 0;
    }
    addTimeIcon() {
        if (this.insertBlockType(BoardProfile.SMALL_TIMER)) {
            this.blockCount += 2;
        }
    }
    isRemovable() {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                const blocks = this.getRemovableBlocks(j, i);
                if (blocks.length > 0)
                    return true;
            }
        }
        return false;
    }
    getRemovableBlocks(x, y) {
        const removableBlocks = [];
        if (x < 0 || x >= this.width || y < 0 || y >= this.height)
            return removableBlocks;
        if (this.board[y][x] !== this.EMPTY)
            return removableBlocks;
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
            }
            else if (north.type === south.type) {
                removableBlocks.push(north.clone(), south.clone());
                south.type = this.EMPTY;
            }
            else if (north.type === west.type) {
                removableBlocks.push(north.clone(), west.clone());
                west.type = this.EMPTY;
            }
        }
        if (east.type !== this.EMPTY) {
            if (east.type === south.type) {
                removableBlocks.push(east.clone(), south.clone());
                south.type = this.EMPTY;
            }
            else if (east.type === west.type) {
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
    toJSON() {
        return {
            width: this.width,
            height: this.height,
            board: this.board.map(row => [...row]),
            blockCount: this.blockCount,
            blockKind: this.blockKind,
        };
    }
    fromJSON(data) {
        this.width = data.width;
        this.height = data.height;
        this.blockCount = data.blockCount;
        this.blockKind = data.blockKind;
        this.board = data.board.map((row) => [...row]);
        this.hintBlocks = [];
    }
}
//# sourceMappingURL=Board.js.map
  try { exports.Board = Board; } catch(e) {}
};

// --- game/Mahjong.js ---
__modules['game/Mahjong'] = function(exports) {
var Board = __require('game/Board').Board;
var GameInfo = __require('game/GameInfo').GameInfo;
var GameStateType = __require('game/GameState').GameStateType;
var BoardProfile = __require('game/BoardProfile').BoardProfile;
class Mahjong {
    constructor(gameInfo, width = BoardProfile.boardWidth, height = BoardProfile.boardHeight, blockKind = BoardProfile.blockKind) {
        this.currentState = GameStateType.NONE;
        this.previousState = GameStateType.NONE;
        this.tryAgainFlag = false;
        this.observers = [];
        this.gameInfo = gameInfo ?? new GameInfo();
        this.boardWidth = width;
        this.boardHeight = height;
        this.blockKind = blockKind;
        this.board = new Board(width, height, blockKind);
        this.board.setPlayState(this);
        this.setState(GameStateType.IDLE);
    }
    addObserver(observer) {
        this.observers.push(observer);
    }
    removeObserver(observer) {
        this.observers = this.observers.filter(o => o !== observer);
    }
    notifyObservers() {
        for (const observer of this.observers) {
            observer(this.currentState);
        }
    }
    // PlayStateCallback implementation
    addTick(tick) {
        this.gameInfo.addTick(tick);
    }
    addHint(hint) {
        this.gameInfo.addHint(hint);
    }
    // State transitions
    play() { return this.setState(GameStateType.PLAY); }
    pause() { return this.setState(GameStateType.PAUSE); }
    winState() { return this.setState(GameStateType.END); }
    gameoverState() { return this.setState(GameStateType.GAMEOVER); }
    idle() { return this.setState(GameStateType.IDLE); }
    newGame() {
        this.tryAgainFlag = false;
        this.idle();
        this.gameInfo.setStage(1);
        this.initGame();
        return true;
    }
    challengeNextStage() {
        this.tryAgainFlag = false;
        this.idle();
        this.gameInfo.setStage(this.gameInfo.getHighStage());
        this.initGame();
        return true;
    }
    resumeGame() {
        this.tryAgainFlag = true;
        return this.idle();
    }
    tryAgain() {
        this.tryAgainFlag = true;
        return this.setState(GameStateType.IDLE);
    }
    setState(newState) {
        switch (newState) {
            case GameStateType.NONE:
                this.previousState = this.currentState;
                this.currentState = GameStateType.NONE;
                break;
            case GameStateType.IDLE:
                if (this.tryAgainFlag) {
                    this.gameInfo.revert();
                    this.initGame();
                }
                else if (this.currentState === GameStateType.PAUSE || this.currentState === GameStateType.GAMEOVER) {
                    this.gameInfo.setStage(1);
                    this.initGame();
                }
                else {
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
    initGame() {
        this.board.setStage(this.gameInfo.getStage());
    }
    // Preview which blocks would be removed (for animation), without modifying state
    previewRemovableBlocks(x, y) {
        return this.board.getRemovableBlocks(x, y);
    }
    // Game actions
    removeBlock(x, y) {
        if (this.currentState !== GameStateType.PLAY)
            return false;
        const result = this.board.removeBlock(x, y);
        if (this.board.needShuffle()) {
            this.board.shuffle();
        }
        if (result > 0) {
            this.gameInfo.addTick(result);
            const updateScore = this.gameInfo.calculatorScore(result, this.gameInfo.getTime());
            this.gameInfo.addScore(updateScore);
            return true;
        }
        else {
            this.gameInfo.tick();
        }
        return false;
    }
    updateHint() {
        if (this.currentState !== GameStateType.PLAY)
            return false;
        if (this.board.needShuffle()) {
            this.board.shuffle();
        }
        if (this.gameInfo.getHint() < 1)
            return false;
        const result = this.board.updateHint();
        if (result) {
            this.gameInfo.addHint(-1);
        }
        return result;
    }
    // Tick - called by timer
    tick() {
        return this.gameInfo.tick();
    }
    // Getters
    getState() { return this.currentState; }
    getBoard() { return this.board; }
    getGameInfo() { return this.gameInfo; }
    getStage() { return this.gameInfo.getStage(); }
    getTime() { return this.gameInfo.getTime(); }
    getScore() { return this.gameInfo.getScore(); }
    getHighScore() { return this.gameInfo.getHighScore(); }
    getHintCount() { return this.gameInfo.getHint(); }
    isFinishGame() { return this.board.isClear(); }
    isIdleState() { return this.currentState === GameStateType.IDLE; }
    isPlayState() { return this.currentState === GameStateType.PLAY; }
    isPauseState() { return this.currentState === GameStateType.PAUSE; }
    isEndState() { return this.currentState === GameStateType.END; }
    isGameoverState() { return this.currentState === GameStateType.GAMEOVER; }
    // Serialization
    toJSON() {
        return {
            gameInfo: this.gameInfo.toJSON(),
            board: this.board.toJSON(),
            state: this.currentState,
            previousState: this.previousState,
        };
    }
    fromJSON(data) {
        this.gameInfo.fromJSON(data.gameInfo);
        this.board.fromJSON(data.board);
        this.board.setPlayState(this);
        this.currentState = data.state;
        this.previousState = data.previousState;
        this.notifyObservers();
    }
}
//# sourceMappingURL=Mahjong.js.map
  try { exports.Mahjong = Mahjong; } catch(e) {}
};

// --- game/index.js ---
__modules['game/index'] = function(exports) {
exports.Block = __require('game/Block').Block;
exports.Board = __require('game/Board').Board;
exports.BoardProfile = __require('game/BoardProfile').BoardProfile;
exports.GameInfo = __require('game/GameInfo').GameInfo;
exports.GameStateType = __require('game/GameState').GameStateType;
exports.Mahjong = __require('game/Mahjong').Mahjong;
//# sourceMappingURL=index.js.map
};

// --- storage/GameStorage.js ---
__modules['storage/GameStorage'] = function(exports) {
class GameStorage {
    constructor() {
        this.dbName = 'ImageMatchDB';
        this.storeName = 'gameState';
        this.version = 1;
        this.db = null;
    }
    async open() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName, { keyPath: 'id' });
                }
            };
            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve();
            };
            request.onerror = () => reject(request.error);
        });
    }
    async save(gameState) {
        if (!this.db)
            await this.open();
        const data = {
            id: 'current',
            gameState,
            timestamp: Date.now(),
            version: '1.0.0',
        };
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(this.storeName, 'readwrite');
            const store = tx.objectStore(this.storeName);
            const request = store.put(data);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
    async load() {
        if (!this.db)
            await this.open();
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(this.storeName, 'readonly');
            const store = tx.objectStore(this.storeName);
            const request = store.get('current');
            request.onsuccess = () => {
                const data = request.result;
                resolve(data ? data.gameState : null);
            };
            request.onerror = () => reject(request.error);
        });
    }
    async clear() {
        if (!this.db)
            await this.open();
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(this.storeName, 'readwrite');
            const store = tx.objectStore(this.storeName);
            const request = store.delete('current');
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
    async hasSavedGame() {
        const data = await this.load();
        return data !== null;
    }
}
//# sourceMappingURL=GameStorage.js.map
  try { exports.GameStorage = GameStorage; } catch(e) {}
};

// --- storage/index.js ---
__modules['storage/index'] = function(exports) {
exports.GameStorage = __require('storage/GameStorage').GameStorage;
//# sourceMappingURL=index.js.map
};

// --- ui/AssetGenerator.js ---
__modules['ui/AssetGenerator'] = function(exports) {
class AssetGenerator {
    constructor(blockSize) {
        this.blockImages = [];
        this.buttonImages = new Map();
        // Raw loaded PNG images (originals, not resized)
        this.rawBlockImages = [];
        this.rawButtonImages = new Map();
        this.imagesLoaded = false;
        this.blockSize = blockSize;
        this.generateBlockImages();
        this.generateButtonImages();
    }
    /**
     * Load all PNG images from the assets/ directory.
     * After loading, call updateSize() to redraw at the correct size.
     */
    async loadImages() {
        const blockPromises = [];
        // Load block images: block0..block65, hint (66), block99 (67/NANHEE)
        for (let i = 0; i <= 65; i++) {
            blockPromises.push(this.loadImage(`assets/blocks/block${i}.png`));
        }
        blockPromises.push(this.loadImage('assets/blocks/hint.png')); // index 66
        blockPromises.push(this.loadImage('assets/blocks/block99.png')); // index 67 (NANHEE)
        // Load button images
        const buttonEntries = Object.entries(AssetGenerator.BUTTON_FILE_MAP);
        const buttonPromises = buttonEntries.map(([, filename]) => this.loadImage(`assets/buttons/${filename}`));
        const [blockResults, buttonResults] = await Promise.all([
            Promise.all(blockPromises),
            Promise.all(buttonPromises),
        ]);
        this.rawBlockImages = blockResults;
        this.rawButtonImages.clear();
        buttonEntries.forEach(([name], idx) => {
            const img = buttonResults[idx];
            if (img) {
                this.rawButtonImages.set(name, img);
            }
        });
        this.imagesLoaded = true;
        // Redraw at current block size using loaded images
        this.rebuildFromLoaded();
    }
    updateSize(blockSize) {
        this.blockSize = blockSize;
        if (this.imagesLoaded) {
            this.rebuildFromLoaded();
        }
        else {
            this.generateBlockImages();
            this.generateButtonImages();
        }
    }
    getBlockImage(index) {
        if (index < 0 || index >= this.blockImages.length)
            return this.blockImages[0];
        return this.blockImages[index];
    }
    getButtonImage(name) {
        return this.buttonImages.get(name);
    }
    getBlockSize() {
        return this.blockSize;
    }
    // ------- Private helpers -------
    /**
     * Rebuild all block and button canvases from loaded raw images.
     */
    rebuildFromLoaded() {
        this.blockImages = [];
        const bs = this.blockSize;
        for (let i = 0; i <= 67; i++) {
            const raw = i < this.rawBlockImages.length ? this.rawBlockImages[i] : null;
            if (raw) {
                this.blockImages.push(this.drawImageToCanvas(raw, bs, bs));
            }
            else {
                this.blockImages.push(this.createFallbackBlock(i, bs));
            }
        }
        this.buttonImages.clear();
        for (const [name] of Object.entries(AssetGenerator.BUTTON_FILE_MAP)) {
            const raw = this.rawButtonImages.get(name);
            if (raw) {
                // Determine target dimensions based on the raw image aspect ratio
                const aspect = raw.naturalWidth / raw.naturalHeight;
                let w;
                let h;
                if (name === 'timerbar') {
                    w = bs * 8;
                    h = bs - 10;
                }
                else if (name === 'pause' || name === 'hint') {
                    w = bs;
                    h = bs;
                }
                else {
                    // Preserve aspect ratio with height = bs * 1.5
                    h = Math.floor(bs * 1.5);
                    w = Math.floor(h * aspect);
                }
                this.buttonImages.set(name, this.drawImageToCanvas(raw, w, h));
            }
            else {
                this.buttonImages.set(name, this.createFallbackButton(name, bs));
            }
        }
    }
    /**
     * Load a single image, returning null on failure.
     */
    loadImage(src) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => {
                console.warn(`AssetGenerator: failed to load ${src}, will use fallback`);
                resolve(null);
            };
            img.src = src;
        });
    }
    /**
     * Draw an HTMLImageElement onto an offscreen canvas at the given dimensions.
     */
    drawImageToCanvas(img, w, h) {
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        return canvas;
    }
    /**
     * Create a colored fallback block canvas (procedural) for missing images.
     */
    createFallbackBlock(i, bs) {
        const canvas = document.createElement('canvas');
        canvas.width = bs;
        canvas.height = bs;
        const ctx = canvas.getContext('2d');
        if (i === 0) {
            ctx.fillStyle = '#1a1a2e';
            ctx.fillRect(0, 0, bs, bs);
            ctx.strokeStyle = '#16213e';
            ctx.lineWidth = 1;
            ctx.strokeRect(0, 0, bs, bs);
        }
        else if (i === 66) {
            ctx.fillStyle = 'rgba(255, 255, 0, 0.4)';
            ctx.fillRect(0, 0, bs, bs);
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 3;
            ctx.strokeRect(2, 2, bs - 4, bs - 4);
        }
        else if (i === 67) {
            ctx.fillStyle = '#FF69B4';
            ctx.fillRect(2, 2, bs - 4, bs - 4);
            ctx.strokeStyle = '#FF1493';
            ctx.lineWidth = 2;
            ctx.strokeRect(2, 2, bs - 4, bs - 4);
            ctx.fillStyle = '#FFF';
            ctx.font = `bold ${Math.floor(bs * 0.5)}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('\u2661', bs / 2, bs / 2);
        }
        else {
            const colorIdx = i < AssetGenerator.COLORS.length ? i : (i % (AssetGenerator.COLORS.length - 1)) + 1;
            const color = AssetGenerator.COLORS[colorIdx];
            const gradient = ctx.createLinearGradient(0, 0, bs, bs);
            gradient.addColorStop(0, color);
            gradient.addColorStop(1, this.darkenColor(color, 30));
            ctx.fillStyle = gradient;
            const r = Math.floor(bs * 0.1);
            ctx.beginPath();
            ctx.moveTo(r + 2, 2);
            ctx.lineTo(bs - r - 2, 2);
            ctx.quadraticCurveTo(bs - 2, 2, bs - 2, r + 2);
            ctx.lineTo(bs - 2, bs - r - 2);
            ctx.quadraticCurveTo(bs - 2, bs - 2, bs - r - 2, bs - 2);
            ctx.lineTo(r + 2, bs - 2);
            ctx.quadraticCurveTo(2, bs - 2, 2, bs - r - 2);
            ctx.lineTo(2, r + 2);
            ctx.quadraticCurveTo(2, 2, r + 2, 2);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = this.darkenColor(color, 50);
            ctx.lineWidth = 2;
            ctx.stroke();
            const symbolIdx = i < AssetGenerator.SYMBOLS.length ? i : (i % (AssetGenerator.SYMBOLS.length - 1)) + 1;
            const symbol = AssetGenerator.SYMBOLS[symbolIdx];
            if (symbol) {
                ctx.fillStyle = '#FFFFFF';
                ctx.font = `bold ${Math.floor(bs * 0.45)}px sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(symbol, bs / 2, bs / 2);
            }
            ctx.fillStyle = 'rgba(255,255,255,0.7)';
            ctx.font = `${Math.floor(bs * 0.18)}px sans-serif`;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.fillText(String(i), 6, 4);
        }
        return canvas;
    }
    /**
     * Create a colored fallback button canvas (procedural) for missing images.
     */
    createFallbackButton(name, bs) {
        const buttonDefs = {
            'newgame': ['NEW GAME', '#E74C3C'],
            'start': ['START', '#2ECC71'],
            'pause': ['\u23F8', '#F39C12'],
            'resume': ['RESUME', '#3498DB'],
            'win': ['YOU WIN! \u25B6', '#FFD700'],
            'gameover': ['GAME OVER', '#C0392B'],
            'tryagain': ['TRY AGAIN', '#E67E22'],
            'hint': ['HINT', '#9B59B6'],
            'challenge': ['CHALLENGE', '#8E44AD'],
            'highscore': ['HIGH:', '#2C3E50'],
        };
        if (name === 'timerbar') {
            const canvas = document.createElement('canvas');
            canvas.width = bs * 8;
            canvas.height = bs - 10;
            const ctx = canvas.getContext('2d');
            const g = ctx.createLinearGradient(0, 0, bs * 8, 0);
            g.addColorStop(0, '#2ECC71');
            g.addColorStop(0.5, '#F1C40F');
            g.addColorStop(1, '#E74C3C');
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, bs * 8, bs - 10);
            return canvas;
        }
        const [text, color] = buttonDefs[name] ?? [name.toUpperCase(), '#555555'];
        const isSmall = name === 'pause' || name === 'hint';
        const w = isSmall ? bs : bs * 4;
        const h = isSmall ? bs : Math.floor(bs * 1.5);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, h);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, this.darkenColor(color, 30));
        ctx.fillStyle = gradient;
        const r = Math.min(10, Math.floor(bs * 0.08));
        ctx.beginPath();
        ctx.moveTo(r, 0);
        ctx.lineTo(w - r, 0);
        ctx.quadraticCurveTo(w, 0, w, r);
        ctx.lineTo(w, h - r);
        ctx.quadraticCurveTo(w, h, w - r, h);
        ctx.lineTo(r, h);
        ctx.quadraticCurveTo(0, h, 0, h - r);
        ctx.lineTo(0, r);
        ctx.quadraticCurveTo(0, 0, r, 0);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#FFFFFF';
        const fontSize = isSmall ? Math.floor(bs * 0.5) : Math.floor(h * 0.4);
        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, w / 2, h / 2);
        return canvas;
    }
    // ---- Initial procedural generation (before images load) ----
    generateBlockImages() {
        this.blockImages = [];
        const bs = this.blockSize;
        for (let i = 0; i <= 67; i++) {
            this.blockImages.push(this.createFallbackBlock(i, bs));
        }
    }
    generateButtonImages() {
        this.buttonImages.clear();
        const bs = this.blockSize;
        for (const name of Object.keys(AssetGenerator.BUTTON_FILE_MAP)) {
            this.buttonImages.set(name, this.createFallbackButton(name, bs));
        }
    }
    darkenColor(hex, amount) {
        const num = parseInt(hex.replace('#', ''), 16);
        const r = Math.max(0, (num >> 16) - amount);
        const g = Math.max(0, ((num >> 8) & 0x00FF) - amount);
        const b = Math.max(0, (num & 0x0000FF) - amount);
        return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
    }
}
// Color palette for block types (65 unique colors + special) — used as fallback
AssetGenerator.COLORS = [
    '#333333', // 0: empty/background
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F0B27A', '#82E0AA', '#F1948A', '#85929E', '#D7BDE2',
    '#A3E4D7', '#F9E79F', '#FADBD8', '#D5F5E3', '#EBDEF0',
    '#D4E6F1', '#FCF3CF', '#D5D8DC', '#ABEBC6', '#F5B7B1',
    '#AED6F1', '#A9DFBF', '#F5CBA7', '#D2B4DE', '#A2D9CE',
    '#FAD7A0', '#A9CCE3', '#D7DBDD', '#F9E79F', '#ABEBC6',
    '#F5B7B1', '#AED6F1', '#A9DFBF', '#F5CBA7', '#D2B4DE',
    '#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6',
    '#1ABC9C', '#E67E22', '#2980B9', '#27AE60', '#8E44AD',
    '#D35400', '#C0392B', '#16A085', '#2C3E50', '#7D3C98',
    '#1A5276', '#D4AC0D', '#CA6F1E', '#117A65', '#6C3483',
    '#1B4F72', '#7E5109', '#784212', '#0E6655', '#4A235A',
    '#154360', // 65
];
// Symbols for card types — used as fallback
AssetGenerator.SYMBOLS = [
    '', '\u2660', '\u2665', '\u2666', '\u2663', '\u2605', '\u25CF', '\u25B2', '\u25A0', '\u25C6',
    '\u266A', '\u266B', '\u2600', '\u2601', '\u2602', '\u26A1', '\u2764', '\u273F', '\u2618', '\u2726',
    '\u25CE', '\u2295', '\u2297', '\u25B3', '\u25BD', '\u25C7', '\u25A1', '\u25CB', '\u2606', '\u2664',
    '\u2661', '\u2662', '\u2667', '\u2680', '\u2681', '\u2682', '\u2683', '\u2684', '\u2685', '\u2720',
    '\u2721', '\u2722', '\u2723', '\u2724', '\u2725', '\u2B1F', '\u2B21', '\u2B22', '\u2BC3', '\u2BC2',
    '\u25C8', '\u25C9', '\u25CA', '\u2B23', '\u2B20', '\u2B24', '\u25B6', '\u25C0', '\u25BC', '\u25B2',
    '\u2B25', '\u2B26', '\u2B27', '\u2B28', '\u2B29', '\u2B2A',
];
// Button name -> PNG filename mapping
AssetGenerator.BUTTON_FILE_MAP = {
    'newgame': 'newgame.png',
    'start': 'start.png',
    'pause': 'pause.png',
    'resume': 'resume.png',
    'win': 'win.png',
    'gameover': 'gameover.png',
    'tryagain': 'tryagain.png',
    'hint': 'hint_button.png',
    'challenge': 'challenge.png',
    'highscore': 'highscore.png',
    'timerbar': 'time.png',
};
//# sourceMappingURL=AssetGenerator.js.map
  try { exports.AssetGenerator = AssetGenerator; } catch(e) {}
};

// --- ui/Renderer.js ---
__modules['ui/Renderer'] = function(exports) {
var AssetGenerator = __require('ui/AssetGenerator').AssetGenerator;
var BoardProfile = __require('game/BoardProfile').BoardProfile;
class Renderer {
    constructor(canvas, assets) {
        this.width = 0;
        this.height = 0;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.assets = assets ?? new AssetGenerator(50);
        this.resize();
    }
    setAssets(assets) {
        this.assets = assets;
        this.assets.updateSize(BoardProfile.blockSize);
    }
    resize() {
        const dpr = window.devicePixelRatio || 1;
        const w = window.innerWidth;
        const h = window.innerHeight;
        this.canvas.style.width = w + 'px';
        this.canvas.style.height = h + 'px';
        this.canvas.width = w * dpr;
        this.canvas.height = h * dpr;
        this.ctx.scale(dpr, dpr);
        this.width = w;
        this.height = h;
        BoardProfile.setScreenSize(w, h);
        this.assets.updateSize(BoardProfile.blockSize);
    }
    render(renderState) {
        const ctx = this.ctx;
        // Clear
        ctx.fillStyle = '#0f0f23';
        ctx.fillRect(0, 0, this.width, this.height);
        switch (renderState.state) {
            case 1: // IDLE
                this.drawIdleScreen(renderState);
                break;
            case 2: // PLAY
                this.drawPlayScreen(renderState);
                break;
            case 3: // PAUSE
                this.drawPauseScreen(renderState);
                break;
            case 4: // END
                this.drawEndScreen(renderState);
                break;
            case 5: // GAMEOVER
                this.drawGameoverScreen(renderState);
                break;
            default: // NONE or CONFIG
                this.drawMenuScreen(renderState);
                break;
        }
    }
    drawBoard(renderState) {
        const ctx = this.ctx;
        const bs = BoardProfile.blockSize;
        const { startX, startY } = BoardProfile;
        const { board, boardWidth, boardHeight } = renderState;
        // Draw empty grid background
        for (let i = 0; i < boardHeight; i++) {
            for (let j = 0; j < boardWidth; j++) {
                const x = startX + j * bs;
                const y = startY + i * bs;
                ctx.drawImage(this.assets.getBlockImage(0), x, y, bs, bs);
            }
        }
        // Draw blocks
        for (let i = 0; i < boardHeight; i++) {
            for (let j = 0; j < boardWidth; j++) {
                if (board[i] && board[i][j] !== 0) {
                    const x = startX + j * bs;
                    const y = startY + i * bs;
                    ctx.drawImage(this.assets.getBlockImage(board[i][j]), x, y, bs, bs);
                }
            }
        }
        // Draw hint overlay
        if (renderState.hintBlocks && renderState.hintBlocks.length > 0) {
            for (const hint of renderState.hintBlocks) {
                const x = startX + hint.x * bs;
                const y = startY + hint.y * bs;
                ctx.drawImage(this.assets.getBlockImage(66), x, y, bs, bs);
            }
        }
    }
    drawTimerBar(renderState) {
        const ctx = this.ctx;
        const bs = BoardProfile.blockSize;
        const { startX, startY, endX } = BoardProfile;
        const barY = startY - bs;
        const barW = endX - startX;
        const barH = bs - 10;
        // Background
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(startX, barY, barW, barH);
        // Timer fill
        const ratio = Math.max(0, renderState.time / renderState.maxTime);
        const fillW = barW * ratio;
        // Rainbow gradient across the filled portion
        if (fillW > 0) {
            const gradient = ctx.createLinearGradient(startX, barY, startX + fillW, barY);
            gradient.addColorStop(0.0, '#FF0000'); // red
            gradient.addColorStop(0.14, '#FF8C00'); // orange
            gradient.addColorStop(0.28, '#FFD700'); // yellow
            gradient.addColorStop(0.42, '#2ECC71'); // green
            gradient.addColorStop(0.57, '#00CED1'); // cyan
            gradient.addColorStop(0.71, '#1E90FF'); // blue
            gradient.addColorStop(0.85, '#9B59B6'); // violet
            gradient.addColorStop(1.0, '#FF0000'); // red
            ctx.fillStyle = gradient;
            ctx.fillRect(startX, barY, fillW, barH);
        }
        // Border
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.strokeRect(startX, barY, barW, barH);
        // Time text
        ctx.fillStyle = '#FFF';
        ctx.font = `bold ${Math.floor(barH * 0.6)}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${renderState.time}`, startX + barW / 2, barY + barH / 2);
        // Countdown warning
        if (renderState.time > 0 && renderState.time <= 5) {
            ctx.fillStyle = 'rgba(231, 76, 60, 0.3)';
            ctx.fillRect(startX, startY, bs * 8, bs * 12);
            ctx.fillStyle = '#E74C3C';
            ctx.font = `bold ${bs * 3}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(String(renderState.time), startX + bs * 4, startY + bs * 5);
        }
    }
    drawScore(renderState) {
        const ctx = this.ctx;
        const bs = BoardProfile.blockSize;
        const { endX } = BoardProfile;
        const numH = Math.floor(bs * 0.4);
        // Score at top right (above timer bar)
        ctx.fillStyle = '#AAA';
        ctx.font = `${numH}px monospace`;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'top';
        ctx.fillText(`SCORE: ${String(renderState.score).padStart(8, '0')}`, endX, 2);
    }
    drawStageAndButtons(renderState) {
        const ctx = this.ctx;
        const bs = BoardProfile.blockSize;
        const { startX, endX, endY } = BoardProfile;
        const infoY = endY + Math.floor(bs * 0.2);
        const numH = Math.floor(bs * 0.5);
        // Stage number
        ctx.fillStyle = '#FFF';
        ctx.font = `bold ${numH}px monospace`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(`STAGE ${String(renderState.stage).padStart(4, '0')}`, startX, infoY);
        // Pause button
        const pauseBtn = this.assets.getButtonImage('pause');
        if (pauseBtn) {
            ctx.drawImage(pauseBtn, endX - bs, infoY, bs, bs);
        }
        // Hint button + count
        const hintBtn = this.assets.getButtonImage('hint');
        if (hintBtn) {
            const hintX = endX - bs * 3;
            ctx.drawImage(hintBtn, hintX, infoY, bs, bs);
            ctx.fillStyle = '#FFF';
            ctx.font = `bold ${Math.floor(bs * 0.4)}px monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(String(renderState.hintCount), hintX + bs + bs * 0.4, infoY + bs / 2);
        }
        // High score at bottom
        ctx.fillStyle = '#888';
        ctx.font = `${Math.floor(bs * 0.35)}px monospace`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(`HIGH: ${String(renderState.highScore).padStart(8, '0')}`, startX, infoY + bs + 5);
    }
    drawMatchAnimation(rs) {
        const anim = rs.matchAnimation;
        if (!anim)
            return;
        const ctx = this.ctx;
        const bs = BoardProfile.blockSize;
        const { startX, startY } = BoardProfile;
        const { clickX, clickY, matchedBlocks, progress } = anim;
        const cx = startX + clickX * bs + bs / 2;
        const cy = startY + clickY * bs + bs / 2;
        // Phase 1 (0.0 - 0.4): Path appears
        if (progress <= 0.4) {
            const phase1 = progress / 0.4; // 0 to 1
            // Pulsing circle at click position
            ctx.save();
            const pulseRadius = bs * 0.3 + Math.sin(phase1 * Math.PI * 4) * bs * 0.1;
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#00FFFF';
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(cx, cy, pulseRadius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.shadowBlur = 0;
            ctx.shadowColor = 'transparent';
            ctx.restore();
            // Animated lines from click to each matched block
            for (const block of matchedBlocks) {
                const bx = startX + block.x * bs + bs / 2;
                const by = startY + block.y * bs + bs / 2;
                const dx = bx - cx;
                const dy = by - cy;
                const endLineX = cx + dx * phase1;
                const endLineY = cy + dy * phase1;
                ctx.save();
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#00FFFF';
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(endLineX, endLineY);
                ctx.stroke();
                ctx.shadowBlur = 0;
                ctx.shadowColor = 'transparent';
                ctx.restore();
            }
        }
        // Phase 2 (0.4 - 0.7): Blocks highlight
        if (progress > 0.4 && progress <= 0.7) {
            const phase2 = (progress - 0.4) / 0.3; // 0 to 1
            // Fully drawn lines
            for (const block of matchedBlocks) {
                const bx = startX + block.x * bs + bs / 2;
                const by = startY + block.y * bs + bs / 2;
                ctx.save();
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#00FFFF';
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(bx, by);
                ctx.stroke();
                ctx.shadowBlur = 0;
                ctx.shadowColor = 'transparent';
                ctx.restore();
            }
            // Pulsing highlight on matched blocks
            const pulseAlpha = 0.4 + Math.sin(phase2 * Math.PI * 3) * 0.3;
            for (const block of matchedBlocks) {
                const bx = startX + block.x * bs;
                const by = startY + block.y * bs;
                ctx.save();
                ctx.strokeStyle = `rgba(255, 255, 255, ${pulseAlpha})`;
                ctx.lineWidth = 3;
                ctx.strokeRect(bx + 2, by + 2, bs - 4, bs - 4);
                // Flash effect
                ctx.fillStyle = `rgba(255, 255, 255, ${pulseAlpha * 0.3})`;
                ctx.fillRect(bx, by, bs, bs);
                ctx.restore();
            }
            // Click circle still visible
            ctx.save();
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#00FFFF';
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(cx, cy, bs * 0.3, 0, Math.PI * 2);
            ctx.stroke();
            ctx.shadowBlur = 0;
            ctx.shadowColor = 'transparent';
            ctx.restore();
        }
        // Phase 3 (0.7 - 1.0): Blocks fade and shrink
        if (progress > 0.7) {
            const phase3 = (progress - 0.7) / 0.3; // 0 to 1
            // Fading lines
            const lineAlpha = 1.0 - phase3;
            for (const block of matchedBlocks) {
                const bx = startX + block.x * bs + bs / 2;
                const by = startY + block.y * bs + bs / 2;
                ctx.save();
                ctx.globalAlpha = lineAlpha;
                ctx.shadowBlur = 10 * lineAlpha;
                ctx.shadowColor = '#00FFFF';
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(bx, by);
                ctx.stroke();
                ctx.shadowBlur = 0;
                ctx.shadowColor = 'transparent';
                ctx.restore();
            }
            // Shrinking and fading blocks
            const scale = 1.0 - phase3;
            const alpha = 1.0 - phase3;
            for (const block of matchedBlocks) {
                const bx = startX + block.x * bs;
                const by = startY + block.y * bs;
                const centerX = bx + bs / 2;
                const centerY = by + bs / 2;
                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.translate(centerX, centerY);
                ctx.scale(scale, scale);
                ctx.translate(-centerX, -centerY);
                ctx.drawImage(this.assets.getBlockImage(block.type), bx, by, bs, bs);
                ctx.restore();
            }
        }
    }
    drawPlayScreen(rs) {
        this.drawBoard(rs);
        this.drawTimerBar(rs);
        this.drawScore(rs);
        this.drawStageAndButtons(rs);
        // Match animation overlay
        if (rs.matchAnimation) {
            this.drawMatchAnimation(rs);
        }
    }
    drawIdleScreen(rs) {
        this.drawBoard(rs);
        this.drawOverlay();
        const ctx = this.ctx;
        const bs = BoardProfile.blockSize;
        const { buttonX, buttonY, buttonW, buttonH } = BoardProfile;
        // Stage display
        ctx.fillStyle = '#FFD700';
        ctx.font = `bold ${bs}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`STAGE ${rs.stage}`, this.width / 2, buttonY + bs);
        // Start button
        const startBtn = this.assets.getButtonImage('start');
        if (startBtn) {
            ctx.drawImage(startBtn, buttonX, buttonY + bs * 2, buttonW, buttonH);
        }
    }
    drawPauseScreen(rs) {
        this.drawOverlay();
        const ctx = this.ctx;
        const bs = BoardProfile.blockSize;
        const { buttonX, buttonY, buttonW, buttonH } = BoardProfile;
        // Title
        ctx.fillStyle = '#FFF';
        ctx.font = `bold ${bs}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('PAUSED', this.width / 2, buttonY);
        // Resume button
        const resumeBtn = this.assets.getButtonImage('resume');
        if (resumeBtn) {
            ctx.drawImage(resumeBtn, buttonX, buttonY + bs, buttonW, buttonH);
        }
        // New Game button
        const newGameBtn = this.assets.getButtonImage('newgame');
        if (newGameBtn) {
            ctx.drawImage(newGameBtn, buttonX, buttonY + bs * 4, buttonW, buttonH);
        }
        // Version
        ctx.fillStyle = '#666';
        ctx.font = `${Math.floor(bs * 0.3)}px monospace`;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        ctx.fillText(`v${BoardProfile.versionName}`, BoardProfile.endX, BoardProfile.endY + bs);
    }
    drawEndScreen(rs) {
        this.drawBoard(rs);
        this.drawOverlay();
        const ctx = this.ctx;
        const bs = BoardProfile.blockSize;
        const { buttonX, buttonY, buttonW, buttonH } = BoardProfile;
        // Win text
        ctx.fillStyle = '#FFD700';
        ctx.font = `bold ${bs * 1.5}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('YOU WIN!', this.width / 2, buttonY + bs * 2);
        // Score
        ctx.fillStyle = '#FFF';
        ctx.font = `bold ${bs * 0.6}px sans-serif`;
        ctx.fillText(`Score: ${rs.score}`, this.width / 2, buttonY + bs * 4);
        // Continue button (click anywhere)
        const winBtn = this.assets.getButtonImage('win');
        if (winBtn) {
            ctx.drawImage(winBtn, buttonX, buttonY + bs * 5, buttonW, buttonH);
        }
    }
    drawGameoverScreen(rs) {
        this.drawOverlay();
        const ctx = this.ctx;
        const bs = BoardProfile.blockSize;
        const { buttonX, buttonY, buttonW, buttonH } = BoardProfile;
        // Game Over
        const goBtn = this.assets.getButtonImage('gameover');
        if (goBtn) {
            ctx.drawImage(goBtn, buttonX, buttonY, buttonW, buttonH);
        }
        // Score display
        ctx.fillStyle = '#FFF';
        ctx.font = `bold ${Math.floor(bs * 0.6)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`Score: ${rs.score}`, this.width / 2, buttonY + bs * 2.5);
        // Try Again button
        const tryBtn = this.assets.getButtonImage('tryagain');
        if (tryBtn) {
            ctx.drawImage(tryBtn, buttonX, buttonY + bs * 4, buttonW, buttonH);
        }
        // New Game button
        const newBtn = this.assets.getButtonImage('newgame');
        if (newBtn) {
            ctx.drawImage(newBtn, buttonX, buttonY + bs * 6, buttonW, buttonH);
        }
    }
    drawMenuScreen(rs) {
        const ctx = this.ctx;
        const bs = BoardProfile.blockSize;
        const { buttonX, buttonY, buttonW, buttonH } = BoardProfile;
        // Title
        ctx.fillStyle = '#FFD700';
        ctx.font = `bold ${bs * 1.2}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Image Match', this.width / 2, bs * 2);
        // Challenge button
        const challengeBtn = this.assets.getButtonImage('challenge');
        if (challengeBtn) {
            ctx.drawImage(challengeBtn, buttonX, buttonY + bs, buttonW, buttonH);
        }
        // New Game button
        const newBtn = this.assets.getButtonImage('newgame');
        if (newBtn) {
            ctx.drawImage(newBtn, buttonX, buttonY + bs * 4, buttonW, buttonH);
        }
        // Resume button
        const resumeBtn = this.assets.getButtonImage('resume');
        if (resumeBtn) {
            ctx.drawImage(resumeBtn, buttonX, buttonY + bs * 7, buttonW, buttonH);
        }
    }
    drawOverlay() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
    adjustBrightness(hex, amount) {
        const num = parseInt(hex.replace('#', ''), 16);
        const r = Math.min(255, Math.max(0, (num >> 16) + amount));
        const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
        const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
        return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
    }
    getWidth() { return this.width; }
    getHeight() { return this.height; }
}
//# sourceMappingURL=Renderer.js.map
  try { exports.Renderer = Renderer; } catch(e) {}
};

// --- ui/InputHandler.js ---
__modules['ui/InputHandler'] = function(exports) {
var BoardProfile = __require('game/BoardProfile').BoardProfile;
class InputHandler {
    constructor(canvas, callback) {
        this.currentState = 0;
        this.blocked = false;
        this.canvas = canvas;
        this.commandCallback = callback;
        this.setupListeners();
    }
    setCurrentState(state) {
        this.currentState = state;
    }
    setBlocked(blocked) {
        this.blocked = blocked;
    }
    setupListeners() {
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
    handleClick(x, y) {
        if (this.blocked)
            return;
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
    handlePlayClick(x, y) {
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
    }
    handleIdleClick(x, y) {
        const bs = BoardProfile.blockSize;
        const { buttonX, buttonY, buttonW, buttonH } = BoardProfile;
        // Start button
        if (this.isInRect(x, y, buttonX, buttonY + bs * 2, buttonW, buttonH)) {
            this.commandCallback({ type: 'PLAY' });
        }
    }
    handlePauseClick(x, y) {
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
    handleEndClick(x, y) {
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
    handleGameoverClick(x, y) {
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
    handleMenuClick(x, y) {
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
    isInRect(px, py, rx, ry, rw, rh) {
        return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
    }
}
//# sourceMappingURL=InputHandler.js.map
  try { exports.InputHandler = InputHandler; } catch(e) {}
};

// --- ui/index.js ---
__modules['ui/index'] = function(exports) {
exports.Renderer = __require('ui/Renderer').Renderer;
exports.InputHandler = __require('ui/InputHandler').InputHandler;
exports.AssetGenerator = __require('ui/AssetGenerator').AssetGenerator;
//# sourceMappingURL=index.js.map
};

// --- App.js ---
__modules['App'] = function(exports) {
var Mahjong = __require('game/Mahjong').Mahjong;
var BoardProfile = __require('game/BoardProfile').BoardProfile;
var Renderer = __require('ui/Renderer').Renderer;
var AssetGenerator = __require('ui/AssetGenerator').AssetGenerator;
var InputHandler = __require('ui/InputHandler').InputHandler;
var GameStorage = __require('storage/GameStorage').GameStorage;
class App {
    constructor(canvas) {
        this.timerInterval = null;
        this.animationFrameId = null;
        this.hasSaved = false;
        this.animating = false;
        this.matchAnimation = null;
        this.matchAnimRafId = null;
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
    async init() {
        try {
            await this.storage.open();
            this.hasSaved = await this.storage.hasSavedGame();
        }
        catch {
            this.hasSaved = false;
        }
        // Load image assets and recreate renderer with them
        try {
            const assets = new AssetGenerator(50);
            await assets.loadImages();
            this.renderer = new Renderer(this.canvas, assets);
        }
        catch {
            // Keep the default renderer with fallback assets
        }
        this.render();
    }
    handleCommand(cmd) {
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
                    }
                    else {
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
    startTimer() {
        this.stopTimer();
        this.timerInterval = window.setInterval(() => {
            if (this.animating)
                return; // Skip tick during animation
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
    stopTimer() {
        if (this.timerInterval !== null) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
    render() {
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
        }
        this.animationFrameId = requestAnimationFrame(() => {
            const board = this.game.getBoard();
            const hintBlock = board.getHint();
            const hintBlocks = board.getHintBlocks();
            const renderState = {
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
    startMatchAnimation(clickX, clickY, blocks) {
        this.animating = true;
        this.inputHandler.setBlocked(true);
        this.matchAnimation = {
            clickX, clickY,
            matchedBlocks: blocks,
            progress: 0,
        };
        const startTime = performance.now();
        const duration = 450; // ms
        const animate = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(1.0, elapsed / duration);
            this.matchAnimation = { ...this.matchAnimation, progress };
            this.render();
            if (progress < 1.0) {
                this.matchAnimRafId = requestAnimationFrame(animate);
            }
            else {
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
    async saveGame() {
        try {
            const data = this.game.toJSON();
            await this.storage.save(data);
            this.hasSaved = true;
        }
        catch (e) {
            console.error('Failed to save game:', e);
        }
    }
    async loadGame() {
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
        }
        catch (e) {
            console.error('Failed to load game:', e);
        }
    }
    async clearSave() {
        try {
            await this.storage.clear();
            this.hasSaved = false;
        }
        catch (e) {
            console.error('Failed to clear save:', e);
        }
    }
}
//# sourceMappingURL=App.js.map
  try { exports.App = App; } catch(e) {}
};

// --- main.js ---
__modules['main'] = function(exports) {
var App = __require('App').App;
window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }
    new App(canvas);
});
//# sourceMappingURL=main.js.map
};

__require('main');
})();
