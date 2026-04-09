package com.chobocho.mahjong.button;

public class ImageButtonImpl implements ImageButton {
    int mId;
    int x1;
    int y1;
    int x2;
    int y2;
    int mResourceId;
    boolean mIsEnabled;
    boolean mIsShown;

    public ImageButtonImpl() {
        mId = 0;
        x1 = 0;
        y1 = 0;
        x2 = 0;
        y2 = 0;
        mIsEnabled = true;
        mIsShown = true;
        mResourceId = 0;
    }

    public ImageButtonImpl(int id, int resource, int x1, int y1, int x2, int y2) {
        mId = id;
        mIsEnabled = true;
        mIsShown = true;
        mResourceId = resource;
        setPosition(x1, y1, x2, y2);
    }

    @Override
    public void setId(int id) {
        mId = id;
    }

    @Override
    public int getId() {
        return mId;
    }

    @Override
    public int getResourceId() {
        return mResourceId;
    }

    @Override
    public void setResourceId(int id) {
        mResourceId = id;
    }

    @Override
    public void setPosition(int x1, int y1, int x2, int y2) {
        if (x1 < x2) {
            this.x1 = x1;
            this.x2 = x2;
        } else {
            this.x1 = x2;
            this.x2 = x1;
        }

        if (y1 < y2) {
            this.y1 = y1;
            this.y2 = y2;
        } else {
            this.y1 = y2;
            this.y2 = y1;
        }
    }

    @Override
    public boolean isInRange(int x, int y) {
        return (x > x1) && (x < x2) && (y > y1) && (y < y2);
    }

    @Override
    public void enable(boolean enable) {
        mIsEnabled = enable;
    }

    @Override
    public boolean isEnabled() {
        return mIsEnabled;
    }

    @Override
    public void show() {
        mIsShown = true;
    }

    @Override
    public void hide() {
        mIsShown = false;
    }

    @Override
    public boolean isShown() {
        return mIsShown;
    }
}
