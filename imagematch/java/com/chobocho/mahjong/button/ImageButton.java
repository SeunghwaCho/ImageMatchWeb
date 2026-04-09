package com.chobocho.mahjong.button;

public interface ImageButton {
    public void setId(int id);
    public int getId();
    public int getResourceId();
    public void setResourceId(int id);
    public void setPosition(int x1, int y1, int x2, int y2);
    public boolean isInRange(int x, int y);
    public void enable(boolean enable);
    public boolean isEnabled();
    public void show();
    public void hide();
    public boolean isShown();
}
