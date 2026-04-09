package com.chobocho.imagematch.ui;

import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;

import com.chobocho.imagematch.BoardProfile;
import com.chobocho.imagematch.ui.DrawEngine;
import com.chobocho.imagematch.ui.DrawEngineImpl;
import com.chobocho.mahjong.BoardGame;


public class CommonDrawEngineImpl extends DrawEngineImpl implements DrawEngine {
    Paint paint = new Paint();

    @Override
    public void onDraw(Canvas g, BoardGame game, BoardProfile boardProfile, Bitmap[] blockImages, Bitmap[] buttonImages) {
        onDrawCommon(g, boardProfile, blockImages, buttonImages);
    }

    private void onDrawCommon(Canvas g, BoardProfile boardProfile, Bitmap[] blockImages, Bitmap[] buttonImages) {
        int screenW = g.getWidth();
        int screenH = g.getHeight();

        paint.setColor(Color.rgb(0, 0, 0));
        g.drawRect(0, 0, g.getWidth(), g.getHeight(), paint);

        int startX = boardProfile.startX;
        int startY = boardProfile.startY;

        int h = boardProfile.boardHeight;
        int w = boardProfile.boardWidth;
        int imgSize = boardProfile.blockSize;

        for (int i = 0; i < h; i++) {
            for (int j = 0; j < w; j++) {
                drawImage(g, blockImages[0], startX + j * imgSize, startY + i * imgSize, imgSize, imgSize, paint);
            }
        }
    }
}
