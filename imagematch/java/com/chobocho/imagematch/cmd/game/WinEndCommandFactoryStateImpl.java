package com.chobocho.imagematch.cmd.game;

import com.chobocho.imagematch.AndroidLog;
import com.chobocho.imagematch.BoardProfile;
import com.chobocho.mahjong.command.*;


public class WinEndCommandFactoryStateImpl extends EndCommandFactoryStateImpl implements CommandFactoryState {
    final static String TAG = "WinEndCommandFactoryStateImpl";
    BoardProfile boardProfile;

    public WinEndCommandFactoryStateImpl(BoardProfile boardProfile) {
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
        int x1 = BoardProfile.startX;
        int y1 = BoardProfile.startY;
        int x2 = BoardProfile.endX;
        int y2 = BoardProfile.endY;
        buttons.push(new ButtonPosition(PlayCommand.IDLE, x1, y1, x2, y2));
        AndroidLog.i(TAG,buttons.toString());
    }
}