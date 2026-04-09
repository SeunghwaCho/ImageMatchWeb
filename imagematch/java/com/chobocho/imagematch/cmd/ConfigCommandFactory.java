package com.chobocho.imagematch.cmd;

import com.chobocho.imagematch.BoardProfile;
import com.chobocho.imagematch.cmd.config.WinMainCommandFactoryStateImpl;
import com.chobocho.mahjong.command.CommandFactory;
import com.chobocho.mahjong.command.CommandFactoryState;

public class ConfigCommandFactory extends CommandFactory {
    CommandFactoryState mainCmdFactory;

    public ConfigCommandFactory(BoardProfile profile) {
        mainCmdFactory = new WinMainCommandFactoryStateImpl(profile);
        state = mainCmdFactory;
    }

}
