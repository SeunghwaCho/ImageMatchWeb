package com.chobocho.mahjong.command;

import com.chobocho.mahjong.BoardGame;
import com.chobocho.mahjong.GameObserver;
import com.chobocho.util.CLog;

public abstract class CommandFactory implements GameObserver {
    final static String TAG = "CommandFactory";

    final public static int KEYPRESS_EVENT = 1;
    final public static int MOUSE_CLICK_EVENT = 0;

    protected CommandFactoryState state;
    protected CommandFactoryState noneState;
    protected CommandFactoryState idleState;
    protected CommandFactoryState playState;
    protected CommandFactoryState pauseState;
    protected CommandFactoryState endState;
    protected CommandFactoryState gameoverState;
    @Override
    public void updateState(int nextState) {
        CLog.i(TAG, "updateState: " + nextState);
        switch (nextState) {
            case BoardGame.NONE_STATE:
                state=noneState;
                break;
            case BoardGame.IDLE_STATE:
                state=idleState;
                break;
            case BoardGame.PLAY_STATE:
                state=playState;
                break;
            case BoardGame.PAUSE_STATE:
                state=pauseState;
                break;
            case BoardGame.END_STATE:
                state=endState;
                break;
            case BoardGame.GAMEOVER_STATE:
                state=gameoverState;
                break;
            default:
                break;
        }
    }

    public PlayCommand CreateCommand(int event, int posX, int posY) {
        return state.createCommand(event, posX, posY);
    }

    public PlayCommand CreateCommand(int fromDeck, int fromPos, int toDeck, int toPos) {
        return state.createCommand(fromDeck, fromPos, toDeck, toPos);
    }
}
