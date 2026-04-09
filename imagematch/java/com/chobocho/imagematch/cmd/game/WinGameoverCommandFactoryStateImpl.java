package com.chobocho.imagematch.cmd.game;

import com.chobocho.imagematch.AndroidLog;
import com.chobocho.imagematch.BoardProfile;
import com.chobocho.mahjong.command.*;


public class WinGameoverCommandFactoryStateImpl extends GameoverCommandFactoryStateImpl implements CommandFactoryState {
    final static String TAG = "WinEndCommandFactoryStateImpl";
    BoardProfile boardProfile;

    public WinGameoverCommandFactoryStateImpl(BoardProfile boardProfile) {
        this.boardProfile = boardProfile;
    }

    @Override
    public PlayCommand createCommand(int event, int x, int y) {
        AndroidLog.i(TAG, "Event:" + Integer.toString(event));
        if (event == CommandFactory.KEYPRESS_EVENT) {
            switch (x) {
                case 79: // O
                case 83: // S
                    return new PlayCommand(PlayCommand.PLAY, 0, 0, 0, 0);
            }
        } else if (event == CommandFactory.MOUSE_CLICK_EVENT) {
            for (ButtonPosition btn : buttons) {
                if (btn.isInRange(x, y)) {
                    return new PlayCommand(btn.id, 0, 0, 0, 0);
                }
            }
        }
        return null;
    }

    @Override
    public PlayCommand createCommand(int fromDeck, int fromPos, int toDeck, int toPos) {
        AndroidLog.i(TAG, "GameEndState");
        return null;
    }

    @Override
    public void addButtons() {
        AndroidLog.i(TAG, "addButtons");
        int screenW = BoardProfile.screenW;
        int buttonW = BoardProfile.buttonW;
        int buttonH = BoardProfile.buttonH;
        int buttonY = BoardProfile.buttonY;
        int startX = (screenW-buttonW)/2;
        int startY = buttonY;

        buttons.push(new ButtonPosition(PlayCommand.IDLE, startX, startY, startX+buttonW,startY+buttonH));
        int buttonGap = boardProfile.blockSize*2;
        buttons.push(new ButtonPosition(PlayCommand.TRYAGAIN, startX, startY+buttonGap, startX+buttonW, startY+buttonH+buttonGap*2));
        buttons.push(new ButtonPosition(PlayCommand.IDLE, startX, startY+buttonGap*3, startX+buttonW, startY+buttonH+buttonGap*4));
        AndroidLog.i(TAG,buttons.toString());
    }
}