package com.chobocho.mahjong;

import com.chobocho.mahjong.board.Board;
import com.chobocho.mahjong.state.*;
import com.chobocho.util.CLog;

public class MahjongImpl extends BoardGameImpl implements Mahjong {
    private static final String TAG = "MahjongImpl";
    boolean tryAgain = false;

    CLog log;

    public MahjongImpl(CLog log, GameInfo gameInfo, int width, int height, int blockKind) {
        this.log = log;
        this.gameInfo = gameInfo;
        noneState = new NoneState();
        idleState = new IdleState();
        playState = new PlayState(this, this.gameInfo, width, height, blockKind);
        pauseState = new PauseState();
        endState = new EndState();
        gameoverState = new GameoverState();

        setState(BoardGame.IDLE_STATE);
    }

    public boolean play() {
        return setState(PLAY_STATE);
    }

    public boolean pause() {
        return setState(PAUSE_STATE);
    }

    public boolean winState() {
        return setState(END_STATE);
    }

    @Override
    public boolean gameoverState() {
        return setState(GAMEOVER_STATE);
    }

    public boolean idle() {
        return setState(IDLE_STATE);
    }

    @Override
    public boolean newGame() {
        tryAgain = false;
        idle();
        gameInfo.setStage(1);
        playState.initGame();
        return true;
    }

    @Override
    public boolean challengeNextStage() {
        tryAgain = false;
        idle();
        gameInfo.setStage(gameInfo.getHighStage());
        playState.initGame();
        return true;
    }

    @Override
    public boolean resumeGame() {
        tryAgain = true;
        return idle();
    }

    @Override
    public boolean tryAgain() {
        tryAgain = true;
        return setState(IDLE_STATE);
    }

    boolean setState(int newState) {
        log.i(TAG, "newState: " + newState);
        switch (newState) {
            case NONE_STATE:
                state = noneState;
                break;
            case IDLE_STATE:
                if (tryAgain) {
                    gameInfo.revert();
                    log.i(TAG, "IDLE_STATE try again " + gameInfo.getStage());
                    playState.initGame();
                } else if (state == pauseState || state == gameoverState) {
                    gameInfo.setStage(1);
                    log.i(TAG, "IDLE_STATE GameOver " + gameInfo.getStage());
                    playState.initGame();
                } else {
                    gameInfo.stageUp();
                    log.i(TAG, "IDLE_STATE New game " + gameInfo.getStage());
                    playState.initGame();
                }
                tryAgain = false;
                gameInfo.initTime();
                state = idleState;
                break;
            case PLAY_STATE:
                state = playState;
                break;
            case PAUSE_STATE:
                state = pauseState;
                break;
            case END_STATE:
                gameInfo.updateHighStage();
                state = endState;
                break;
            case GAMEOVER_STATE:
                state = gameoverState;
                break;
            default:
                break;
        }
        notifyToOberver();
        return true;
    }

    @Override
    public boolean isIdleState() {
        return state.isIdleState();
    }

    public boolean isPlayState() {
        return state.isPlayState();
    }

    @Override
    public boolean isPauseState() {
        return state.isPauseState();
    }

    @Override
    public boolean isEndState() {
        return state.isEndState();
    }

    public boolean isFinishGame() {
        return state.isFinishGame();
    }

    public boolean removeBlock(int x, int y) {
        log.i(TAG, "removeBlock " + x + ", " + y);
        if (state == playState) {
            return ((PlayState) state).removeBlock(x, y);
        }
        return false;
    }

    @Override
    public Board getBoard() {
        return state.getBoard();
    }

    @Override
    public int getStage() {
        return gameInfo.getStage();
    }
}
