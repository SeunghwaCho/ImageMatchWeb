package com.chobocho.mahjong.command;

public class PlayCommand {
    public static final String UNKNOWN = "unknown";
    public static final String PLAY = "play";
    public static final String PAUSE = "pause";
    public static final String IDLE = "idle";
    public static final String WIN = "win";
    public static final String REMOVE = "remove";
    public static final String NEW_GAME = "new_game";
    public static final String RESUME_GAME = "resume_game";
    public static final String TRYAGAIN = "tryagain";
    public static final String HINT = "hint";
    public static final String CHALLENGE = "challenge";

    public String command;
    public int x1;
    public int y1;
    public int x2;
    public int y2;

    public PlayCommand(String cmd, int x1, int y1, int x2, int y2) {
        this.command = cmd;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    public String toString() {
        return command + ": (" + x1 + "," + y1 + ") -> (" + x2 + "," + y2 + ")";
    }
}
