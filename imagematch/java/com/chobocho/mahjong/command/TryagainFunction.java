package com.chobocho.mahjong.command;

import com.chobocho.mahjong.BoardGame;

class TryagainFunction implements ComandFunction {
    @Override
    public boolean run(BoardGame game, int x1, int y1, int x2, int y2) {
        return game.tryAgain();
    }
}
