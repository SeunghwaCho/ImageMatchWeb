package com.chobocho.imagematch.ui;

import android.graphics.Bitmap;
import android.graphics.Canvas;

import com.chobocho.imagematch.AndroidLog;
import com.chobocho.imagematch.BoardProfile;
import com.chobocho.imagematch.MahjongGameView;
import com.chobocho.imagematch.ui.CommonDrawEngineImpl;
import com.chobocho.imagematch.ui.DrawEngine;
import com.chobocho.imagematch.ui.DrawEngineManager;
import com.chobocho.imagematch.ui.config.MainDrawEngineImpl;
import com.chobocho.mahjong.BoardGame;
import com.chobocho.mahjong.GameObserver;

public class ConfigDrawEngineManagerImpl implements DrawEngineManager, GameObserver {
    final String TAG = this.getClass().getSimpleName();
    BoardGame game;
    BoardProfile boardProfile;
    MahjongGameView parent;

    private DrawEngine drawEngine;
    private DrawEngine commonDrawEngine;
    private DrawEngine mainDrawEnigne;

    public ConfigDrawEngineManagerImpl(BoardProfile boardProfile, MahjongGameView parent) {
        this.game = game;
        this.boardProfile = boardProfile;
        this.parent = parent;

        this.commonDrawEngine = new CommonDrawEngineImpl();
        this.mainDrawEnigne = new MainDrawEngineImpl();
        drawEngine = mainDrawEnigne;
    }

    public void updateState(int state) {
        AndroidLog.i(TAG, "STATE: " + state);
        this.parent.update();
    }
    @Override
    public void onDraw(Canvas g, Bitmap[] blockImages, Bitmap[] buttonImages) {
        commonDrawEngine.onDraw(g, game, boardProfile, blockImages, buttonImages);
        drawEngine.onDraw(g, game, boardProfile, blockImages, buttonImages);
    }

}
