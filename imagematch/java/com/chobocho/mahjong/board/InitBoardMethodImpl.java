package com.chobocho.mahjong.board;

import com.chobocho.util.CLog;

public class InitBoardMethodImpl implements InitBoardMethod {
    final public static String TAG = "InitBoardMethodImpl";

    @Override
    public int init(int[][] board, int width, int height) {
        CLog.i(TAG, "W:" + width + " ,H:" + height);

        for (int i = 0; i < height; i++) {
            for (int j = 0; j < width; j++) {
                board[i][j] = 0;
            }
        }
        return 0;
    }
}
