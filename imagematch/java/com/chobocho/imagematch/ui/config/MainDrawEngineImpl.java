package com.chobocho.imagematch.ui.config;

import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;

import com.chobocho.imagematch.BoardProfile;
import com.chobocho.imagematch.ui.DrawEngine;
import com.chobocho.imagematch.ui.DrawEngineImpl;
import com.chobocho.mahjong.BoardGame;
import com.chobocho.mahjong.board.Board;

public class MainDrawEngineImpl extends DrawEngineImpl implements DrawEngine {
    Paint paint = new Paint();

    @Override
    public void onDraw(Canvas g, BoardGame game, BoardProfile boardProfile, Bitmap[] blockImages, Bitmap[] buttonImages) {
        onDrawCommon(g, boardProfile, blockImages, buttonImages);
    }

    private void onDrawCommon(Canvas g, BoardProfile boardProfile, Bitmap[] blockImages, Bitmap[] buttonImages) {
        int screenW = boardProfile.screenW;
        int screenH = boardProfile.screenH;

        int startX = boardProfile.buttonX;
        int startY = boardProfile.buttonY;

        int buttonGap = boardProfile.blockSize*2;

        drawImage(g, buttonImages[BoardProfile.CHALLENGE_BUTTON], startX, startY, boardProfile.buttonW, boardProfile.buttonH, paint);
        drawImage(g, buttonImages[BoardProfile.NEW_GAME_BUTTON], startX, startY + buttonGap, boardProfile.buttonW, boardProfile.buttonH, paint);
        drawImage(g, buttonImages[BoardProfile.RESUME_BUTTON], startX, startY + buttonGap*2, boardProfile.buttonW, boardProfile.buttonH, paint);
        //drawImage(g, buttonImages[BoardProfile.RANKING_BUTTON], startX, startY + buttonGap*2, boardProfile.buttonW, boardProfile.buttonH, paint);
        //drawImage(g, buttonImages[BoardProfile.ABOUT_BUTTON], startX, startY + buttonGap*3, boardProfile.buttonW, boardProfile.buttonH, paint);
        //drawImage(g, buttonImages[BoardProfile.QUIT_BUTTON], startX, startY + buttonGap*4, boardProfile.buttonW, boardProfile.buttonH, paint);
    }
}
