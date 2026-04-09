package com.chobocho.imagematch.ui;

import android.graphics.Bitmap;
import android.graphics.Canvas;

import com.chobocho.imagematch.BoardProfile;
import com.chobocho.mahjong.BoardGame;

public interface DrawEngine {
    public void onDraw(Canvas g, BoardGame game, BoardProfile boardProfile, Bitmap[] blockImages, Bitmap[] buttonImages);
}
