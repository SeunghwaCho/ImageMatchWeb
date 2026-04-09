package com.chobocho.imagematch.cmd;

import com.chobocho.mahjong.command.PlayCommand;

public interface CommandFactoryManager {
    public PlayCommand createCommand(int event, int x, int y);
}
