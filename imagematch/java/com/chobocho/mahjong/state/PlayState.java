package com.chobocho.mahjong.state;

import com.chobocho.mahjong.BoardGame;
import com.chobocho.mahjong.GameInfo;
import com.chobocho.mahjong.board.Board;
import com.chobocho.mahjong.board.BoardImpl;
import com.chobocho.util.CLog;


public class PlayState extends MajhongGameState {
    final static String TAG = "PlayState";

    Board board;
    int boardWidth = 8;
    int boardHeigth = 12;
    int blockKind = 35;
    BoardGame game;
    GameInfo gameInfo;

    public PlayState(BoardGame game, GameInfo gameInfo, int width, int height, int blockKind) {
        this.boardWidth = width;
        this.boardHeigth = height;
        this.blockKind = blockKind;
        this.game = game;
        this.gameInfo = gameInfo;

        initVars();
        initGame();
    }

    public void setBoard(Board board) {
        this.board = board;
    }

    private void initVars() {
        board = new BoardImpl (boardWidth, boardHeigth, blockKind);
        board.setPlayState(this);
    }


    public void initGame() {
        initBoard();
    }

    private void initBoard() {
        board.setStage(gameInfo.getStage());
    }

    public int getState() {
        return BoardGame.PLAY_STATE;
    }

    @Override
    public boolean isPlayState() {
        return true;
    }

    @Override
    public boolean isFinishGame() {
        return board.isClear();
    }

    public String toString() {
        StringBuffer result = new StringBuffer();
        return result.toString();
    }

    @Override
    public void addTick(int tick) {
        game.addTick(tick);
    }

    @Override
    public boolean removeBlock(int x, int y) {
        CLog.i(TAG, "removeBlock");

        int result = board.removeBlock(x, y);

        if (board.needShuffle()) {
            board.shuffle();
        }

        if (result > 0) {
            game.addTick(result);
            int updateScore = gameInfo.calculatorScore(result, game.getTime());
            gameInfo.addScore(updateScore);
            return true;
        } else {
            game.tick();
        }
        return false;
    }

    @Override
    public Board getBoard() {
        return board;
    }

    @Override
    public boolean updateHint() {
        if (board.needShuffle()) {
            board.shuffle();
        }

        if (gameInfo.getHint() < 1) {
            return false;
        }

        boolean result = board.updateHint();
        if (result) {
            gameInfo.addHint(-1);
        }
        return result;
    }

    @Override
    public void addHint(int hint) {
        gameInfo.addHint(hint);
    }
}
