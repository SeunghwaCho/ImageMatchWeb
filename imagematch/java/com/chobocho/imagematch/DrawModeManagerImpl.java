package com.chobocho.imagematch;

import android.graphics.Bitmap;
import android.graphics.Canvas;

import com.chobocho.imagematch.ui.ConfigDrawEngineManagerImpl;
import com.chobocho.imagematch.ui.DrawEngineManager;
import com.chobocho.imagematch.ui.DrawModeManager;
import com.chobocho.imagematch.ui.GameDrawEngineManagerImpl;
import com.chobocho.mahjong.BoardGame;
import com.chobocho.mahjong.command.CmdEngineObserver;
import com.chobocho.mahjong.command.CommandEngine;

class DrawModeManagerImpl implements DrawModeManager, CmdEngineObserver {
    DrawEngineManager drawEngine;
    DrawEngineManager gameDrawEngine;
    DrawEngineManager configDrawEngine;

    public DrawModeManagerImpl(BoardGame game, BoardProfile boardProfile, CommandEngine cmdEngine, MahjongGameView parents) {
        gameDrawEngine = new GameDrawEngineManagerImpl(game, boardProfile, parents);
        configDrawEngine = new ConfigDrawEngineManagerImpl(boardProfile, parents);
        drawEngine = configDrawEngine;
        cmdEngine.register(this);
    }

    @Override
    public void onDraw(Canvas g, Bitmap[] blockImages, Bitmap[] buttonImages) {
        drawEngine.onDraw(g, blockImages, buttonImages);
    }

    @Override
    public void updateMode(int mode) {
        switch (mode) {
            case CommandEngine.GAME_MODE:
                drawEngine = gameDrawEngine;
                break;
            case CommandEngine.CONFIG_MODE:
                drawEngine = configDrawEngine;
                break;
        }
    }
}
