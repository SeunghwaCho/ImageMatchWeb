package com.chobocho.mahjong;

public class GameInfoImpl implements GameInfo {
    int score = 0;
    int highScore = 0;
    int previousScore = 0;
    int highState = 1;
    protected int stage = 0;

    final int DEFAULT_HINT = 3;
    final int MAX_HINT = 9;
    final int MAX_SCORE = 99999999;
    int previousHint = 0;
    int hint = 0;

    int MAX_TIME = 60;
    int MAX_STAGE = 1123;
    int time = 0;

    public GameInfoImpl() {
        this.score = 0;
        this.highScore = 0;
        this.previousScore = 0;
        this.stage = 0;
        this.highState = 1;
        this.previousHint = 0;
        this.hint = DEFAULT_HINT;
        this.time = MAX_TIME+1;
    }

    @Override
    public void init() {
        this.score = 0;
        this.previousScore = 0;
        this.hint = DEFAULT_HINT;
        this.time = MAX_TIME+1;
    }

    @Override
    public int getHighStage() {
        return highState;
    }

    @Override
    public boolean setHighStage(int stage) {
        if (stage > MAX_STAGE) {
            stage = MAX_STAGE;
        }
        highState = stage;
        return true;
    }

    @Override
    public void updateHighStage() {
        if ((this.stage+1) > this.highState) {
            this.highState = this.stage+1;
            if (highState > MAX_STAGE) {
                highState = MAX_STAGE;
            }
        }
    }

    @Override
    public int getStage() {
        return stage;
    }

    @Override
    public void setStage(int newStage) {
        newStage = newStage < 1 ? 1 : newStage;

        this.stage = newStage > MAX_STAGE ? MAX_STAGE : newStage;
        if (newStage == 1) {
            init();
        } else {
            backup();
        }
        this.stage = newStage;
    }

    @Override
    public void stageUp() {
        this.stage = (this.stage + 1) % (MAX_STAGE+1);

        if ((stage % 3) == 2) {
            addHint(1);
        } else if (stage > 15) {
            addHint(stage/10);
        }
        backup();
    }

    @Override
    public int addScore(int score) {
        this.score += score;
        this.score = this.score > MAX_SCORE ? MAX_SCORE : this.score;
        updateHighScore();
        return this.score;
    }

    @Override
    public boolean setScore(int score) {
        this.score = score;
        return true;
    }

    @Override
    public boolean setHighScore(int score) {
        score = score > MAX_SCORE ? MAX_SCORE : score;
        this.highScore = score;
        return true;
    }

    @Override
    public void updateHighScore() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
        }
    }

    @Override
    public int getScore() {
        return score;
    }

    @Override
    public int getHighScore() {
        return highScore;
    }

    public int calculatorScore(int removedBlockCount, int time) {
        return 0;
    }

    @Override
    public void revert() {
        score = previousScore;
        hint = previousHint;
    }

    @Override
    public void backup() {
        previousScore = score;
        previousHint = hint;
    }

    @Override
    public int getHint() {
        return hint;
    }

    @Override
    public int setHint(int hint) {
        if (hint < 0) {
            return 0;
        }
        this.hint = hint >= MAX_HINT ? MAX_HINT : hint;
        return hint;
    }

    @Override
    public int addHint(int h) {
        this.hint += h;
        this.hint = this.hint > MAX_HINT ? MAX_HINT : this.hint;
        this.hint = this.hint < 0 ? 0 : this.hint;
        return this.hint;
    }

    @Override
    public int getTime() {
        return time;
    }

    @Override
    public int setMaxTime(int newMaxTime) {
        MAX_TIME = newMaxTime;
        return MAX_TIME;
    }

    @Override
    public boolean addTick(int t) {
        if (t < 0) {
            return false;
        }

        if (time < 20) {
            time += 20;
            return true;
        }

        time += t;

        if (time > MAX_TIME) {
            time = MAX_TIME;
            return true;
        }

        return time > 0;
    }

    @Override
    public boolean tick() {
        time--;
        time = time < 0 ? 0 : time;
        return time > 0;
    }

    @Override
    public void initTime() {
        time = MAX_TIME+1;
    }
}

