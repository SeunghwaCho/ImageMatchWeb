package com.chobocho.mahjong.state;

import com.chobocho.mahjong.BoardGame;
import com.chobocho.mahjong.board.Board;

abstract public class GameState {
    public boolean isIdleState() {
        return false;
    }

    public boolean isPlayState() {
        return false;
    }

    public boolean isPauseState() {
        return false;
    }

    public boolean isEndState() {
        return false;
    }
    public int getState() {
        return BoardGame.NONE_STATE;
    }

    public boolean isFinishGame() {
        return false;
    }

    public Board getBoard() {
        return null;
    }
    abstract public boolean updateHint();
    abstract public void addHint(int hint);
}