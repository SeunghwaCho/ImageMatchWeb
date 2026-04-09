package com.chobocho.imagematch.cmd;

import com.chobocho.imagematch.AndroidLog;
import com.chobocho.imagematch.BoardProfile;
import com.chobocho.imagematch.cmd.game.WinEndCommandFactoryStateImpl;
import com.chobocho.imagematch.cmd.game.WinGameoverCommandFactoryStateImpl;
import com.chobocho.imagematch.cmd.game.WinIdleCommandFactoryStateImpl;
import com.chobocho.imagematch.cmd.game.WinNoneCommandFactoryStateImpl;
import com.chobocho.imagematch.cmd.game.WinPauseCommandFactoryStateImpl;
import com.chobocho.imagematch.cmd.game.WinPlayCommandFactoryStateImpl;
import com.chobocho.mahjong.BoardGame;
import com.chobocho.mahjong.GameObserver;
import com.chobocho.mahjong.command.CommandFactory;

public class GameCommandFactory extends CommandFactory {
    final String TAG = getClass().getSimpleName();

    public GameCommandFactory(BoardGame game, BoardProfile profile) {
        idleState = new WinIdleCommandFactoryStateImpl(profile);
        noneState = new WinNoneCommandFactoryStateImpl(profile);
        playState = new WinPlayCommandFactoryStateImpl(profile);
        pauseState = new WinPauseCommandFactoryStateImpl(profile);
        endState = new WinEndCommandFactoryStateImpl(profile);
        gameoverState = new WinGameoverCommandFactoryStateImpl(profile);
        state = idleState;

        game.register(this);
    }

}
