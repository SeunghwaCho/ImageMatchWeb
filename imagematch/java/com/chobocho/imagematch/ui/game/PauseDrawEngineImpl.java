package com.chobocho.imagematch.ui.game;

import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;

import com.chobocho.imagematch.BoardProfile;
import com.chobocho.imagematch.ui.DrawEngine;
import com.chobocho.imagematch.ui.DrawEngineImpl;
import com.chobocho.mahjong.BoardGame;


public class PauseDrawEngineImpl extends DrawEngineImpl implements DrawEngine {
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

        drawImage(g, buttonImages[BoardProfile.RESUME_BUTTON], startX, startY, boardProfile.buttonW, boardProfile.buttonH, paint);
        drawImage(g, buttonImages[BoardProfile.NEW_GAME_BUTTON], startX, startY+buttonGap*2, boardProfile.buttonW, boardProfile.buttonH, paint);

        paint.setTextSize(30);
        paint.setColor(Color.CYAN);
        int fontGap = boardProfile.blockSize / 2;
        g.drawText(boardProfile.versionName, boardProfile.endX - fontGap*4, boardProfile.endY + fontGap, paint);
    }
}
