package com.chobocho.imagematch.ui.game;

import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;

import com.chobocho.imagematch.BoardProfile;
import com.chobocho.imagematch.ui.DrawEngine;
import com.chobocho.imagematch.ui.DrawEngineImpl;
import com.chobocho.mahjong.BoardGame;
import com.chobocho.mahjong.board.Block;


public class PlayDrawEngineImpl extends DrawEngineImpl implements DrawEngine {
    String TAG = getClass().getSimpleName();

    Paint paint;
    Paint mPaint4BigNumber;
    BoardProfile boardProfile;

    public PlayDrawEngineImpl(BoardProfile boardProfile) {
        this.boardProfile = boardProfile;

        paint = new Paint();

        mPaint4BigNumber = new Paint();
        mPaint4BigNumber.setColor(Color.WHITE);
        mPaint4BigNumber.setStrokeWidth(3);
        mPaint4BigNumber.setAntiAlias(true);
        mPaint4BigNumber.setAlpha(50);
    }


    @Override
    public void onDraw(Canvas g, BoardGame game, BoardProfile boardProfile, Bitmap[] blockImages, Bitmap[] buttonImages) {
        onDrawCommon(g, game, boardProfile, blockImages, buttonImages);
        onDrawInfo(g, game, boardProfile, blockImages, buttonImages);
        onDrawScore(g, game, boardProfile, blockImages, buttonImages);
        onDrawHighScore(g, game, boardProfile, blockImages, buttonImages);
    }

    private void onDrawCommon(Canvas g, BoardGame game, BoardProfile boardProfile, Bitmap[] blockImages, Bitmap[] buttonImages) {
        int startX = boardProfile.startX;
        int startY = boardProfile.startY;
        int h = boardProfile.boardHeight;
        int w = boardProfile.boardWidth;
        int imgSize = boardProfile.blockSize;
        int leftTime = game.getTime();

        drawImage(g, buttonImages[boardProfile.TIMER_BAR], startX, startY-imgSize, w*imgSize, imgSize-10, paint);
        paint.setColor(Color.BLACK);
        int blackWidth = (boardProfile.endX - startX-20) * leftTime / game.MAX_TIME;
        g.drawRect(startX+10+blackWidth, startY-imgSize+10, boardProfile.endX-10,startY-20, paint);

        int[][] board = game.getBoard().getBoard();

         for (int i = 0; i < h; i++) {
             for (int j = 0; j < w; j++) {
                 drawImage(g, blockImages[board[i][j]], startX + j * imgSize, startY + i * imgSize, imgSize, imgSize, paint);
             }
         }

         Block hint = game.getBoard().getHint();
         if (hint != null) {
             drawImage(g, blockImages[BoardProfile.HINT], startX + hint.x * imgSize, startY + hint.y * imgSize, imgSize, imgSize, paint);
         }

         if (leftTime > 0 && leftTime <= 5) {
             int x = boardProfile.startX + imgSize;
             int y = boardProfile.startY + imgSize * 2;
             int numberWidth = (boardProfile.boardWidth - 2) * imgSize;
             drawImage(g, buttonImages[boardProfile.NUMBER_1 + leftTime - 1], x, y,  numberWidth, numberWidth, mPaint4BigNumber);
         }
    }

    private void onDrawInfo(Canvas g, BoardGame game, BoardProfile boardProfile, Bitmap[] blockImages, Bitmap[] buttonImages) {
        int screenW = g.getWidth();
        int screenH = g.getHeight();
        int imgSize = boardProfile.blockSize;

        int stageX = boardProfile.startX;
        //int stageY = screenH-imgSize*2-20;
        int stageY = boardProfile.startY + boardProfile.boardHeight * imgSize + imgSize + (imgSize/2);
        int stageNumSize = boardProfile.blockSize-20;

        int stage = game.getStage();
        drawImage(g, buttonImages[stage / 1000 + BoardProfile.SMALL_NUMBER_0], stageX, stageY, stageNumSize, stageNumSize, paint);
        stage %= 1000;
        drawImage(g, buttonImages[stage / 100 + BoardProfile.SMALL_NUMBER_0], stageX+stageNumSize, stageY, stageNumSize, stageNumSize, paint);
        stage %= 100;
        drawImage(g, buttonImages[stage/ 10 + BoardProfile.SMALL_NUMBER_0], stageX+stageNumSize*2, stageY, stageNumSize, stageNumSize, paint);
        drawImage(g, buttonImages[stage % 10 + BoardProfile.SMALL_NUMBER_0], stageX + stageNumSize*3, stageY, stageNumSize, stageNumSize, paint);

        int pauseStartX = boardProfile.endX - imgSize-20;
        drawImage(g, buttonImages[boardProfile.PAUSE_BUTTON], pauseStartX, stageY, imgSize, imgSize, paint);

        int hintStartX = pauseStartX - imgSize * 2;
        drawImage(g, buttonImages[boardProfile.HINT_BUTTON], hintStartX, stageY, imgSize, imgSize, paint);
        drawImage(g, buttonImages[game.getHint() % 10 + BoardProfile.SMALL_NUMBER_0], hintStartX+imgSize, stageY, imgSize, imgSize, paint);
    }

    private void onDrawScore(Canvas g, BoardGame game, BoardProfile boardProfile, Bitmap[] blockImages, Bitmap[] buttonImages) {
        int imgSize = boardProfile.blockSize;
        int stageNumSize = boardProfile.blockSize / 2;
        int startY = boardProfile.startY-imgSize + (imgSize - stageNumSize)/2;
        int startX = boardProfile.startX + boardProfile.boardWidth * imgSize - 8 * stageNumSize;

        int gameScore = game.getGameInfo();
        for (int i = 7; i >= 0; --i) {
            drawImage(g, buttonImages[ gameScore % 10 + BoardProfile.SMALL_NUMBER_0],
                    startX + stageNumSize*i, startY, stageNumSize, stageNumSize, paint);
            gameScore /= 10;
        }
    }

    private void onDrawHighScore(Canvas g, BoardGame game, BoardProfile boardProfile,
                                 Bitmap[] blockImages, Bitmap[] buttonImages) {
        int imgSize = boardProfile.blockSize;
        int stageNumSize = boardProfile.blockSize / 2;
        int startY = boardProfile.startY + boardProfile.boardHeight * imgSize + (imgSize - stageNumSize)/2;
        int startX = boardProfile.startX;

        drawImage(g, buttonImages[boardProfile.HIGH_SCORE_BUTTON], startX, startY, imgSize*2, stageNumSize, paint);

        int gameScore = game.getHighScore();
        for (int i = 7; i >= 0; --i) {
            drawImage(g, buttonImages[ gameScore % 10 + BoardProfile.SMALL_NUMBER_0],
                    imgSize*2 + startX + stageNumSize*i, startY, stageNumSize, stageNumSize, paint);
            gameScore /= 10;
        }
    }
}
