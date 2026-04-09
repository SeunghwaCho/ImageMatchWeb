package com.chobocho.imagematch;

import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.Message;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;

import com.chobocho.imagematch.cmd.CommandFactoryManager;
import com.chobocho.imagematch.ui.DrawModeManager;
import com.chobocho.mahjong.BoardGame;
import com.chobocho.mahjong.Mahjong;
import com.chobocho.mahjong.GameInfo;
import com.chobocho.mahjong.command.CommandEngine;
import com.chobocho.mahjong.command.CommandFactory;
import com.chobocho.mahjong.command.PlayCommand;

public class MahjongGameView extends View {
    private String TAG = this.getClass().getName();
    private Context mContext;

    BoardProfile boardProfile;

    BoardGame game;
    CommandEngine cmdEngine;
    DrawModeManager drawEngine;
    CommandFactoryManager commandFactory;
    GameInfo gameInfo;

    Bitmap[] blockImages;
    Bitmap[] buttonImages;

    private HandlerThread gameHandlerThread;
    private Handler gameHandler;
    private static final int EMPTY_MESSAGE = 0;
    final int UPDATE_SCREEN = 1001;

    public MahjongGameView(Context context, BoardGame game, GameInfo gameInfo, BoardProfile boardProfile, CommandEngine cmdEngine) {
        super(context);
        this.mContext = context;
        this.gameInfo = gameInfo;
        this.boardProfile = boardProfile;

        loadScore();
        loadImage();

        this.game = game;
        this.cmdEngine = cmdEngine;

        drawEngine = new DrawModeManagerImpl(game, boardProfile, cmdEngine, this);
        commandFactory = new CommandFactoryManagerImpl(game, boardProfile, cmdEngine);
        createGameThread();
    }


    private void createGameThread() {
        Log.d(TAG,"createPlayerThread");
        gameHandlerThread = new HandlerThread("Game Processing Thread");
        gameHandlerThread.start();
        gameHandler = new Handler(gameHandlerThread.getLooper()){
            @Override
            public void handleMessage(Message msg){
                if (game != null && game.isPlayState()) {
                    int gameSpeed = 1000;
                    if (game.getStage() < 100) {
                        gameSpeed -= game.getStage() * 5;
                    } else {
                        gameSpeed -= game.getStage();
                    }
                    if (gameSpeed < 500) {
                        gameSpeed = 500;
                    }

                    Log.i(TAG, "GameSpeed: " + gameSpeed);
                    if (gameHandler.hasMessages(EMPTY_MESSAGE)) {
                        gameHandler.removeMessages(EMPTY_MESSAGE);
                    }
                    if (!game.tick()) {
                        ((Mahjong)game).gameoverState();
                        saveScore();
                    } else {
                        gameHandler.sendEmptyMessageDelayed(EMPTY_MESSAGE, gameSpeed);
                    }
                    update();
                }
            }
        };
    }


    public void startGame() {
        Log.d(TAG, "startGame");
        gameHandler.sendEmptyMessage(EMPTY_MESSAGE);
    }

    public void pauseGame() {
        Log.d(TAG, "pauseGame");
        if (gameHandler.hasMessages(EMPTY_MESSAGE)) {
            gameHandler.removeMessages(EMPTY_MESSAGE);
            gameHandler = null;
            Log.d(TAG, "Removed event");
        }
        if (game != null && game.isPlayState()) {
            game.pause();
        }

        if (gameHandlerThread != null) {
            gameHandlerThread.quit();
        }

        saveScore();
    }

    public void resumeGame() {
        Log.d(TAG, "resumeGame");
        loadScore();
        createGameThread();
    }


    public void update() {
        Log.d(TAG, "View.update()");
        Message message= new Message();
        message.what = UPDATE_SCREEN;
        mHandler.sendMessage(message);
    }


    public void onDraw(Canvas canvas) {
        if (game == null) {
            return;
        }
        drawEngine.onDraw(canvas, blockImages, buttonImages);
    }

    private void loadImage() {
        blockImages = new Bitmap[boardProfile.imageName.length+1];
        for (int i = 0; i < boardProfile.imageName.length; i++) {
            blockImages[i] = BitmapFactory.decodeResource(mContext.getResources(), boardProfile.imageName[i]);
        }

        buttonImages = new Bitmap[boardProfile.ButtonImageName.length+1];
        for (int i = 0; i < boardProfile.ButtonImageName.length; i++) {
            buttonImages[i] = BitmapFactory.decodeResource(mContext.getResources(), boardProfile.ButtonImageName[i]);
        }
    }

    public boolean onTouchEvent(MotionEvent event) {
        if (game == null) {
            return false;
        }

        int x = (int) (event.getX());
        int y = (int) (event.getY());

        if (MotionEvent.ACTION_UP == event.getAction()) {
            onTouchReleased(x, y);
        }

        if (MotionEvent.ACTION_DOWN == event.getAction()) {
            onTouchPressed(x, y);
        }
        return true;
    }

    private void onTouchPressed(int mouseX, int mouseY) {
        Log.i(TAG, "Mouse Pressed " + mouseX + ":" + mouseY);
    }

    public void onTouchReleased(int mouseX, int mouseY) {
        Log.i(TAG, "Mouse released " + mouseX + ":" + mouseY);

        PlayCommand cmd = commandFactory.createCommand(CommandFactory.MOUSE_CLICK_EVENT, mouseX, mouseY);
        if (cmdEngine.runCommand(cmd)) {
            update();
        }
        update();
    }

    private void saveScore() {
        SharedPreferences pref = mContext.getSharedPreferences("ImageMatch", 0);
        SharedPreferences.Editor edit = pref.edit();
        edit.putInt("highscore", gameInfo.getHighScore());
        edit.putInt("highstage", gameInfo.getHighStage());

        if (game.isPlayState()) {
            game.pause();
        }

        edit.putInt("gameState", game.getState());
        if (game.isIdleState() || game.isPauseState() || game.isEndState()) {
            edit.putInt("score", gameInfo.getScore());

            int addState = game.isEndState() ? 1 : 0;
            edit.putInt("stage", gameInfo.getStage() + addState);

            edit.putInt("hint", gameInfo.getHint());
        }

        edit.commit();
        Log.i(TAG, "saveScore " + gameInfo.getHighScore());
    }

    public void loadScore() {
        SharedPreferences pref = mContext.getSharedPreferences("ImageMatch", 0);
        int highscore = pref.getInt("highscore", 0);
        gameInfo.setHighScore(highscore);
        Log.i(TAG, "High Score " + highscore);
        int highstage = pref.getInt("highstage", 1);
        gameInfo.setHighStage(highstage);
        Log.i(TAG, "High Stage " + highstage);

        int gameState = pref.getInt("gameState", 0);
        if (gameState == BoardGame.IDLE_STATE || gameState == BoardGame.PAUSE_STATE || gameState == BoardGame.END_STATE) {
            int gameScore = pref.getInt("score", 0);
            int stage = pref.getInt("stage", 0);
            int hint = pref.getInt("hint", 0);
            gameInfo.setScore(gameScore);
            gameInfo.setStage(stage);
            gameInfo.setHint(hint);
            Log.i(TAG, "load score");
        }

    }

    Handler mHandler = new Handler() {
        public void handleMessage(Message msg) {
            Log.d("Hexa", "There is event : " + msg.what);
            if (msg.what == UPDATE_SCREEN) {
                invalidate();
            }
        }
    };

}
