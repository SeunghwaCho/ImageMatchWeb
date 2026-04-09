package com.chobocho.mahjong.state;

import com.chobocho.mahjong.BoardGame;

public class PauseState extends MajhongGameState {
    public PauseState() { }

    @Override
    public boolean isPauseState() {
        return true;
    }

    public int getState() { return BoardGame.PAUSE_STATE; }
}