package com.chobocho.mahjong.state;

import com.chobocho.mahjong.BoardGame;

public class IdleState extends MajhongGameState {

    public IdleState() {
    }

    @Override
    public boolean isIdleState() {
        return true;
    }

    public int getState() { return BoardGame.IDLE_STATE; }
}