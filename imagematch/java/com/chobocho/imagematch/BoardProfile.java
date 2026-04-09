package com.chobocho.imagematch;

public class BoardProfile {
    final static public String TAG = "BoardProfile";
    final static public int NEW_GAME_BUTTON = 0;
    final static public int ABOUT_BUTTON = 1;
    final static public int RANKING_BUTTON = 2;
    final static public int QUIT_BUTTON = 3;
    final static public int START_BUTTON = 4;
    final static public int PAUSE_BUTTON = 5;
    final static public int RESUME_BUTTON = 6;
    final static public int WIN_BUTTON = 7;
    final static public int TIMER_BAR = 8;
    final static public int GAME_OVER = 9;
    final static public int NUMBER_1 = 10;
    final static public int NUMBER_2 = 11;
    final static public int NUMBER_3 = 12;
    final static public int NUMBER_4 = 13;
    final static public int NUMBER_5 = 14;
    final static public int SMALL_NUMBER_0 = 15;
    final static public int SMALL_NUMBER_1 = 16;
    final static public int SMALL_NUMBER_2 = 17;
    final static public int SMALL_NUMBER_3 = 18;
    final static public int SMALL_NUMBER_4 = 19;
    final static public int SMALL_NUMBER_5 = 20;
    final static public int SMALL_NUMBER_6 = 21;
    final static public int SMALL_NUMBER_7 = 22;
    final static public int SMALL_NUMBER_8 = 23;
    final static public int SMALL_NUMBER_9 = 24;
    final static public int HIGH_SCORE_BUTTON = 25;
    final static public int TRY_AGAIN_BUTTON = 26;
    final static public int HINT_BUTTON = 27;
    final static public int CHALLENGE_BUTTON = 28;

    public static String versionName = "0.1105";
    public static int screenW = 1080;
    public static int screenH = 1820;

    public static int blockSize = 130;

    public static int startX = 0;
    public static int startY = blockSize;
    public static int endX = 1080;
    public static int endY = 1820;

    static public int buttonW = 400;
    static public int buttonH = 130;
    static public int buttonX =  (screenW - buttonW)/2;
    static public int buttonY =  50;

    final static public int boardWidth = 8;
    final static public int boardHeight = 12;
    public final static int blockKind = 65;

    public final static int MASTER_CHO = 2;
    public final static int HINT = blockKind+1;
    public final static int HINT_TILE = 7;
    public final static int SMALL_TIMER = 24;
    public final static int BIG_TIMER = 43;

    public final static int NANHEE = HINT+1;

    public BoardProfile(String versionName, int w, int h) {
        this.versionName = versionName;
        setScreenSize(w, h);
    }

    public void setScreenSize(int w, int h) {
        this.screenW = w;
        this.screenH = h;

        int widthBlockSize = (int) (h / (boardHeight+5));
        blockSize = (int) (w / boardWidth);
        AndroidLog.i(TAG, "W: " + blockSize + ", H: " + widthBlockSize);
        blockSize = blockSize <= widthBlockSize ? blockSize : widthBlockSize;
        startX = (int)((w - (blockSize * boardWidth))/2);
        startY = blockSize;
        endX = startX + blockSize * boardWidth;
        endY = startY + blockSize * boardHeight;
        buttonW = blockSize * 4;
        buttonH = ((int)(blockSize * 1.5));

        buttonX =  (screenW - buttonW)/2;
        buttonY =  blockSize*2;
    }

    public final static int[] imageName = {
            R.drawable.block0,
            R.drawable.block1,
            R.drawable.block2,
            R.drawable.block3,
            R.drawable.block4,
            R.drawable.block5,
            R.drawable.block6,
            R.drawable.block7,
            R.drawable.block8,
            R.drawable.block9,
            R.drawable.block10,
            R.drawable.block11,
            R.drawable.block12,
            R.drawable.block13,
            R.drawable.block14,
            R.drawable.block15,
            R.drawable.block16,
            R.drawable.block17,
            R.drawable.block18,
            R.drawable.block19,
            R.drawable.block20,
            R.drawable.block21,
            R.drawable.block22,
            R.drawable.block23,
            R.drawable.block24,
            R.drawable.block25,
            R.drawable.block26,
            R.drawable.block27,
            R.drawable.block28,
            R.drawable.block29,
            R.drawable.block30,
            R.drawable.block31,
            R.drawable.block32,
            R.drawable.block33,
            R.drawable.block34,
            R.drawable.block35,
            R.drawable.block36,
            R.drawable.block37,
            R.drawable.block38,
            R.drawable.block39,
            R.drawable.block40,
            R.drawable.block41,
            R.drawable.block42,
            R.drawable.block43,
            R.drawable.block44,
            R.drawable.block45,
            R.drawable.block46,
            R.drawable.block47,
            R.drawable.block48,
            R.drawable.block49,
            R.drawable.block50,
            R.drawable.block51,
            R.drawable.block52,
            R.drawable.block53,
            R.drawable.block54,
            R.drawable.block55,
            R.drawable.block56,
            R.drawable.block57,
            R.drawable.block58,
            R.drawable.block59,
            R.drawable.block60,
            R.drawable.block61,
            R.drawable.block62,
            R.drawable.block63,
            R.drawable.block64,
            R.drawable.block65,
            R.drawable.hint,
            R.drawable.block99
    };

    final static public int[] ButtonImageName = {
            R.drawable.newgame,
            R.drawable.about,
            R.drawable.ranking,
            R.drawable.quit,
            R.drawable.start,
            R.drawable.pause,
            R.drawable.resume,
            R.drawable.win,
            R.drawable.time,
            R.drawable.gameover,
            R.drawable.n01,
            R.drawable.n02,
            R.drawable.n03,
            R.drawable.n04,
            R.drawable.n05,
            R.drawable.sn00,
            R.drawable.sn01,
            R.drawable.sn02,
            R.drawable.sn03,
            R.drawable.sn04,
            R.drawable.sn05,
            R.drawable.sn06,
            R.drawable.sn07,
            R.drawable.sn08,
            R.drawable.sn09,
            R.drawable.highscore,
            R.drawable.tryagain,
            R.drawable.hint_button,
            R.drawable.challenge
    };

}
