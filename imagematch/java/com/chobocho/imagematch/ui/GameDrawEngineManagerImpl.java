package com.chobocho.imagematch.ui;

import android.graphics.Bitmap;
import android.graphics.Canvas;

import com.chobocho.imagematch.AndroidLog;
import com.chobocho.imagematch.BoardProfile;
import com.chobocho.imagematch.MahjongGameView;
import com.chobocho.imagematch.ui.game.EndDrawEngineImpl;
import com.chobocho.imagematch.ui.game.GameoverDrawEngineImpl;
import com.chobocho.imagematch.ui.game.IdleDrawEngineImpl;
import com.chobocho.imagematch.ui.game.NoneDrawEngineImpl;
import com.chobocho.imagematch.ui.game.PauseDrawEngineImpl;
import com.chobocho.imagematch.ui.game.PlayDrawEngineImpl;
import com.chobocho.mahjong.BoardGame;
import com.chobocho.mahjong.GameObserver;

public class GameDrawEngineManagerImpl implements DrawEngineManager, GameObserver {
    final String TAG = this.getClass().getSimpleName();
    BoardGame game;
    BoardProfile boardProfile;
    MahjongGameView parent;

    private DrawEngine drawEngine;
    private DrawEngine commonDrawEngine;
    private DrawEngine[] boardDrawEngines;
    public GameDrawEngineManagerImpl(BoardGame game, BoardProfile boardProfile, MahjongGameView parent) {
        this.game = game;
        this.boardProfile = boardProfile;
        this.parent = parent;

        this.commonDrawEngine = new CommonDrawEngineImpl();
        boardDrawEngines = new DrawEngine[BoardGame.GAMEOVER_STATE + 1];
        boardDrawEngines[BoardGame.NONE_STATE] = new NoneDrawEngineImpl();
        boardDrawEngines[BoardGame.IDLE_STATE] = new IdleDrawEngineImpl();
        boardDrawEngines[BoardGame.PLAY_STATE] = new PlayDrawEngineImpl(this.boardProfile);
        boardDrawEngines[BoardGame.PAUSE_STATE] = new PauseDrawEngineImpl();
        boardDrawEngines[BoardGame.END_STATE] = new EndDrawEngineImpl();
        boardDrawEngines[BoardGame.GAMEOVER_STATE] = new GameoverDrawEngineImpl();

        drawEngine = boardDrawEngines[BoardGame.NONE_STATE];

        game.register(this);
    }

    public void updateState(int state) {
        AndroidLog.i(TAG, "STATE: " + state);
        switch (state) {
            case BoardGame.NONE_STATE:
                drawEngine = boardDrawEngines[BoardGame.NONE_STATE];
                break;
            case BoardGame.IDLE_STATE:
                drawEngine = boardDrawEngines[BoardGame.IDLE_STATE];
                break;
            case BoardGame.PLAY_STATE:
                drawEngine = boardDrawEngines[BoardGame.PLAY_STATE];
                parent.startGame();
                break;
            case BoardGame.PAUSE_STATE:
                drawEngine = boardDrawEngines[BoardGame.PAUSE_STATE];
                break;
            case BoardGame.END_STATE:
                drawEngine = boardDrawEngines[BoardGame.END_STATE];
                break;
            case BoardGame.GAMEOVER_STATE:
                drawEngine = boardDrawEngines[BoardGame.GAMEOVER_STATE];
                break;
            default:
                break;
        }
        this.parent.update();
    }
    @Override
    public void onDraw(Canvas g, Bitmap[] blockImages, Bitmap[] buttonImages) {
        commonDrawEngine.onDraw(g, game, boardProfile, blockImages, buttonImages);
        drawEngine.onDraw(g, game, boardProfile, blockImages, buttonImages);
    }

}
