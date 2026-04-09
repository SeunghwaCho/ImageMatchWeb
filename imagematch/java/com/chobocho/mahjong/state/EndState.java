package com.chobocho.mahjong.state;

import com.chobocho.mahjong.BoardGame;

public class EndState extends MajhongGameState {

    public EndState() {

    }

    @Override
    public boolean isEndState() {
        return true;
    }

    public int getState() { return BoardGame.END_STATE; }

}