package com.chobocho.imagematch.cmd.game;

import com.chobocho.imagematch.AndroidLog;
import com.chobocho.imagematch.BoardProfile;
import com.chobocho.mahjong.command.*;

public class WinPauseCommandFactoryStateImpl extends PauseCommandFactoryStateImpl implements CommandFactoryState {
    final static String TAG = "WinPauseCommandFactoryStateImpl";
    BoardProfile boardProfile;

    public WinPauseCommandFactoryStateImpl(BoardProfile boardProfile) {
        this.boardProfile = boardProfile;
    }

    @Override
    public PlayCommand createCommand(int event, int x, int y) {
        AndroidLog.i(TAG, "Event:" + Integer.toString(event));
        if (event == CommandFactory.KEYPRESS_EVENT) {
            switch(x) {
                case 82: // R
                case 83: // S
                    return new PlayCommand(PlayCommand.PLAY, 0, 0, 0, 0);
            }
        }
        else if (event == CommandFactory.MOUSE_CLICK_EVENT) {
            for (ButtonPosition btn: buttons) {
                if (btn.isInRange(x, y)) {
                    return new PlayCommand(btn.id, 0, 0, 0, 0);
                }
            }
        }
        return null;
    }

    @Override
    public PlayCommand createCommand(int fromDeck, int fromPos, int toDeck, int toPos) {
        AndroidLog.i(TAG, "PauseState");
        return null;
    }

    @Override
    public void addButtons() {
        AndroidLog.i(TAG, "addButtons");
        int screenW = boardProfile.screenW;
        int screenH = boardProfile.screenH;

        int startX = boardProfile.buttonX;
        int startY = boardProfile.buttonY;

        int buttonGap = boardProfile.blockSize * 2;

        buttons.push(new ButtonPosition(PlayCommand.PLAY, startX, startY, startX + boardProfile.buttonW,startY + boardProfile.buttonH));
        buttons.push(new ButtonPosition(PlayCommand.IDLE, startX, startY+buttonGap*2, startX + boardProfile.buttonW,startY + boardProfile.buttonH+buttonGap*2));
        AndroidLog.i(TAG,buttons.toString());
    }
}
