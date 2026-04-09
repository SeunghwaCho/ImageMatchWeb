package com.chobocho.imagematch;

import android.content.Context;

import com.chobocho.mahjong.GameInfoImpl;
import com.chobocho.mahjong.GameInfo;

public class MajhongGameInfo extends GameInfoImpl implements GameInfo {
    Context mContext;

    public MajhongGameInfo(Context context) {
        mContext = context;
    }

    @Override
    public int calculatorScore(int removedBlockCount, int time) {
        int updateScore =  stage * removedBlockCount * removedBlockCount + (time * time);
        return updateScore > 100 ? updateScore / 10 : updateScore;
    }
}
