package com.chobocho.mahjong.command;

public interface CommandFactoryState {
    public PlayCommand createCommand(int event, int x, int y);
    public PlayCommand createCommand(int x1, int y1, int x2, int y2);
}
