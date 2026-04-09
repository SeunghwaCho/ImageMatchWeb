package com.chobocho.mahjong.state;

import com.chobocho.mahjong.BoardGame;

public class NoneState extends MajhongGameState {

    public NoneState() {
    }

    public int getState() { return BoardGame.NONE_STATE; }
}