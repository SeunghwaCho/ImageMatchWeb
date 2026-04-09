package com.chobocho.mahjong.board;

import com.chobocho.mahjong.state.PlayState;

public interface Board {
    int[][] getBoard();
    boolean isClear();
    boolean isRemovable();
    boolean needShuffle();
    boolean shuffle();
    void setStage(int stage);
    int removeBlock(int x, int y);
    void setPlayState(PlayState state);
    boolean updateHint();
    Block getHint();
}
