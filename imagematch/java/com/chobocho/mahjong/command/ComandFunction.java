package com.chobocho.mahjong.command;

import com.chobocho.mahjong.BoardGame;
import com.chobocho.mahjong.board.Board;

public interface ComandFunction {
    public boolean run(BoardGame game, int x1, int y1, int x2, int y2);
}
