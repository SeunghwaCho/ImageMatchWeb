package com.chobocho.imagematch.cmd.game;

import com.chobocho.imagematch.AndroidLog;
import com.chobocho.imagematch.BoardProfile;
import com.chobocho.mahjong.command.*;


public class WinNoneCommandFactoryStateImpl extends NoneCommandFactoryStateImpl implements CommandFactoryState {
    final static String TAG = "WinNoneCommandFactoryStateImpl";
    private BoardProfile profile;

    public WinNoneCommandFactoryStateImpl(BoardProfile profile) {
        this.profile = profile;
    }

    @Override
    public PlayCommand createCommand(int x1, int y1, int x2, int y2) {
        //return new PlayCommand(PlayCommand.MOVE, fromDeck, toDeck, count);
        return null;
    }

    @Override
    public PlayCommand createCommand(int event, int x, int y) {
        AndroidLog.i(TAG, "Event:" + Integer.toString(event));
        if (event == CommandFactory.KEYPRESS_EVENT) {
            switch(x) {
                case 27: // ESC
                case 83: // S
                    return new PlayCommand(PlayCommand.IDLE, 0, 0, 0, 0);
            }
        } else if (event == CommandFactory.MOUSE_CLICK_EVENT) {
            for (ButtonPosition btn: buttons) {
                if (btn.isInRange(x, y)) {
                    return new PlayCommand(btn.id, 0, 0, 0, 0);
                }
            }
        } else {
            AndroidLog.i(TAG, "Unknown Event:" + Integer.toString(x) + " : " + Integer.toString(y));
        }
        return null;
    }
	
	@Override
    public void addButtons() {
        int screenW = BoardProfile.screenW;
        int buttonW = BoardProfile.buttonW;
        int buttonH = BoardProfile.buttonH;
        int buttonY = BoardProfile.buttonY;
        buttons.push(new ButtonPosition(PlayCommand.IDLE, (screenW-buttonW)/2, buttonY, (screenW-buttonW)/2+buttonW,buttonY+buttonH));
        AndroidLog.i(TAG, "addButtons");
    }
}
