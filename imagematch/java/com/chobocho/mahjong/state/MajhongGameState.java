package com.chobocho.mahjong.state;

public class MajhongGameState extends GameState {
    public boolean removeBlock(int x, int y) {
        return false;
    }
    public boolean tick() { return true; }
    public void addTick(int tick) { };
    public boolean updateHint() { return false; }
    public void addHint(int hint) { }
}
