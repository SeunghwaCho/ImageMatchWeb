package com.chobocho.imagematch.cmd.game;

import com.chobocho.imagematch.AndroidLog;
import com.chobocho.imagematch.BoardProfile;
import com.chobocho.mahjong.command.ButtonPosition;
import com.chobocho.mahjong.command.CommandFactory;
import com.chobocho.mahjong.command.CommandFactoryState;
import com.chobocho.mahjong.command.PlayCommand;
import com.chobocho.mahjong.command.PlayCommandFactoryStateImpl;

public class WinPlayCommandFactoryStateImpl extends PlayCommandFactoryStateImpl implements CommandFactoryState {
    final static String TAG = "WinPlayCommandFactoryStateImpl";
    BoardProfile boardProfile;

    public WinPlayCommandFactoryStateImpl(BoardProfile boardProfile) {
        this.boardProfile = boardProfile;
    }

    @Override
    public PlayCommand createCommand(int x1, int x2, int y1, int y2) {
        // return new PlayCommand(PlayCommand.MOVE, fromDeck, toDeck, count);
        return null;
    }

    @Override
    public PlayCommand createCommand(int event, int x, int y) {
        AndroidLog.i(TAG, "Event:" + Integer.toString(event));
        if (event == CommandFactory.KEYPRESS_EVENT) {
            switch(x) {
                case 27: // ESC
                case 80: // P
                    return new PlayCommand(PlayCommand.PAUSE, 0, 0, 0 , 0);
            }
        } else if (event == CommandFactory.MOUSE_CLICK_EVENT) {
            int bx = (int)((x - BoardProfile.startX)/ BoardProfile.blockSize);
            int by = (int)((y - BoardProfile.startY)/BoardProfile.blockSize);

            if (by < boardProfile.boardHeight) {
                return new PlayCommand(PlayCommand.REMOVE, bx, by, 0 , 0);
            } else {
                for (ButtonPosition btn: buttons) {
                    if (btn.isInRange(x, y)) {
                        return new PlayCommand(btn.id, 0, 0, 0, 0);
                    }
                }
            }

        } else {
            AndroidLog.i(TAG, "Unknown Event:" + Integer.toString(x) + " : " + Integer.toString(y));
        }
        return null;
    }
	
	@Override
    public void addButtons() {
        int screenW = boardProfile.screenW;
        int screenH = boardProfile.screenH;

        int imgSize = boardProfile.blockSize;
        int startX = boardProfile.endX - imgSize-20;
        //int startY = screenH-imgSize*2-20;
        int startY = boardProfile.startY + boardProfile.boardHeight * imgSize + imgSize + (imgSize/2);
        buttons.push(new ButtonPosition(PlayCommand.PAUSE, startX, startY, startX + imgSize,startY + imgSize));

        int hintStartX = startX - imgSize * 2;
        buttons.push(new ButtonPosition(PlayCommand.HINT, hintStartX, startY, hintStartX + imgSize,startY + imgSize));
        AndroidLog.i(TAG, "addButtons");
    }
}
