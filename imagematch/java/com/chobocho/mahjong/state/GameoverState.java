package com.chobocho.mahjong.state;

import com.chobocho.mahjong.BoardGame;

public class GameoverState extends MajhongGameState {

    public GameoverState() {

    }

    public int getState() { return BoardGame.GAMEOVER_STATE; }

}