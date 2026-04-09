package com.chobocho.mahjong.command;

import com.chobocho.mahjong.BoardGame;
import com.chobocho.mahjong.Mahjong;

public class RemoveFunction implements ComandFunction {
    @Override
    public boolean run(BoardGame game, int x1, int y1, int x2, int y2) {
        return ((Mahjong)game).removeBlock(x1, y1);
    }
}
