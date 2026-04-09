package com.chobocho.mahjong.board;

public class Block {
    public int type;
    public int x;
    public int y;
    public int far;

    public Block () {
        this.init();
    }

    public Block (Block b) {
        this.x = b.x;
        this.y = b.y;
        this.type = b.type;
        this.far = b.far;
    }

    public Block (int x, int y) {
        this.x = x;
        this.y = y;
    }

    public void init()
    {
        type = 0;
        x = 0;
        y = 0;
        far = 0;
    }
    public void set(int type, int x, int y) {
        this.type = type;
        this.x = x;
        this.y = y;
    }

    public void set(int type, int x, int y, int far) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.far = far;
    }
    public void set(Block b) {
        this.type = b.type;
        this.x = b.x;
        this.y = b.y;
        this.far = b.far;
    }
}
