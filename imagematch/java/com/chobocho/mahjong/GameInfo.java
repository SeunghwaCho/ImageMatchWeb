package com.chobocho.mahjong;

public interface GameInfo {
    int addScore(int score);
    void init();

    int getScore();
    boolean setScore(int score);
    boolean setHighScore(int score);
    void updateHighScore();

    int getHighStage();
    boolean setHighStage(int stage);
    void updateHighStage();

    int getHighScore();
    int calculatorScore(int removedBlockCount, int time);
    void backup();
    void revert();
    int getStage();
    void setStage(int stage);
    void stageUp();
    int getHint();
    int setHint(int hint);
    int addHint(int hint);
    void initTime();
    int getTime();
    int setMaxTime(int newMaxTime);
    boolean addTick(int t);
    boolean tick();
}
