package com.chobocho.imagematch;

import com.chobocho.imagematch.cmd.CommandFactoryManager;
import com.chobocho.imagematch.cmd.ConfigCommandFactory;
import com.chobocho.imagematch.cmd.GameCommandFactory;
import com.chobocho.mahjong.BoardGame;
import com.chobocho.mahjong.command.CmdEngineObserver;
import com.chobocho.mahjong.command.CommandEngine;
import com.chobocho.mahjong.command.CommandFactory;
import com.chobocho.mahjong.command.PlayCommand;

class CommandFactoryManagerImpl implements CommandFactoryManager, CmdEngineObserver {
    CommandFactory gameCommandFactory;
    CommandFactory configCommandFactory;
    CommandFactory cmdFactory;
    BoardProfile boardProfile;

    public CommandFactoryManagerImpl(BoardGame game, BoardProfile boardProfile, CommandEngine cmdEngine) {
        this.boardProfile = boardProfile;
        gameCommandFactory = new GameCommandFactory(game, boardProfile);
        configCommandFactory = new ConfigCommandFactory(boardProfile);
        cmdFactory = configCommandFactory;
        cmdEngine.register(this);
    }

    @Override
    public PlayCommand createCommand(int event, int x, int y) {
        return cmdFactory.CreateCommand(event, x, y);
    }

    @Override
    public void updateMode(int mode) {
        switch (mode) {
            case CommandEngine.GAME_MODE:
                cmdFactory = gameCommandFactory;
                break;
            case CommandEngine.CONFIG_MODE:
                cmdFactory = configCommandFactory;
                break;
        }
    }
}
