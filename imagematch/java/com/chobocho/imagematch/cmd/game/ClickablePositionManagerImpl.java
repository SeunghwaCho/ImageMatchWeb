package com.chobocho.imagematch.cmd.game;

import com.chobocho.mahjong.BoardGame;
import com.chobocho.mahjong.command.CardPosition;
import com.chobocho.mahjong.command.ClickablePositoinManager;

public class ClickablePositionManagerImpl extends ClickablePositoinManager {
    final public static String TAG = "ClickablePositionManagerImpl";
    int width = 100;
    int height = 150;

    public ClickablePositionManagerImpl() {
        super();
        init();
    }

    private void init() {
        //CardPosition deck = new CardPosition(Freecell.RESULT_DECK_1 + i, 0, 10 + (width + 10) * i, 10, (width + 10) * (i + 1), 10 + height);
        //addDeckPosition(deck);
    }

    @Override
    public void initCardPosition(BoardGame game) {

    }
}
