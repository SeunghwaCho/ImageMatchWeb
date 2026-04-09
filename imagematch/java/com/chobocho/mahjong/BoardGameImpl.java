package com.chobocho.mahjong;

import com.chobocho.mahjong.board.Board;
import com.chobocho.mahjong.state.*;

import java.util.ArrayList;

abstract public class BoardGameImpl implements BoardGame {
    protected GameState state;
    protected NoneState noneState;
    protected IdleState idleState;
    protected PlayState playState;
    protected PauseState pauseState;
    protected EndState endState;
    protected GameoverState gameoverState;
    protected ArrayList<GameObserver> observers = new ArrayList<>();
    protected GameInfo gameInfo;

    abstract public boolean idle();
    abstract public boolean newGame();

    abstract public boolean play();

    abstract public boolean pause();

    abstract public boolean winState();

    abstract public boolean tryAgain();

    abstract public boolean challengeNextStage();

    abstract public boolean isIdleState();
    abstract public boolean isPlayState();
    abstract public boolean isPauseState();
    abstract public boolean isEndState();

    abstract public boolean isFinishGame();

    abstract public Board getBoard();

    @Override
    public int getState() {
        return state.getState();
    }

    public void register(GameObserver observer) {
        this.observers.add(observer);
        observer.updateState(state.getState());
    }

    protected void notifyToOberver() {
        for (GameObserver observer: observers) {
            observer.updateState(state.getState());
        }
    }

    abstract public boolean resumeGame();

    @Override
    public boolean tick() {
        return gameInfo.tick();
    }

    @Override
    public boolean addTick(int t) {
        return gameInfo.addTick(t);
    }

    @Override
    public int getTime() {
        return gameInfo.getTime();
    }

    abstract public int getStage();

    @Override
    public int getGameInfo() {
        return gameInfo.getScore();
    }

    @Override
    public int getHighScore() {
        return gameInfo.getHighScore();
    }

    @Override
    public boolean updateHint() { return state.updateHint(); }

    @Override
    public int getHint() {
        return gameInfo.getHint();
    }
}

