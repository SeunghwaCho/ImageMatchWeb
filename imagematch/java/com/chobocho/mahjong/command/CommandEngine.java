package com.chobocho.mahjong.command;

import com.chobocho.mahjong.BoardGame;
import com.chobocho.util.CLog;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class CommandEngine {
    final static String TAG = "CommandEngine";
    final public static int GAME_MODE = 1;
    final public static int CONFIG_MODE = 2;

    BoardGame game;
    HashMap<String, ComandFunction> functionMap;
    List<CmdEngineObserver> observers;
    boolean isRunning;

    public CommandEngine(BoardGame game) {
        isRunning = false;
        this.game = game;
        this.functionMap = new HashMap<String, ComandFunction>();
        this.observers = new ArrayList<>();
        initFunction();
    }

    private void initFunction() {
        functionMap.put(PlayCommand.PLAY, new PlayFunction());
        functionMap.put(PlayCommand.PAUSE, new PauseFunction());
        functionMap.put(PlayCommand.IDLE, new IdleFunction());
        functionMap.put(PlayCommand.WIN, new WinFunction());
        functionMap.put(PlayCommand.REMOVE, new RemoveFunction());
        functionMap.put(PlayCommand.TRYAGAIN, new TryagainFunction());
        functionMap.put(PlayCommand.RESUME_GAME, new ResumeGameFunction());
        functionMap.put(PlayCommand.NEW_GAME, new NewGameFunction());
        functionMap.put(PlayCommand.HINT, new HintFunction());
        functionMap.put(PlayCommand.CHALLENGE, new ChallengeFunction());
    }

    public boolean runCommand(PlayCommand command) {
        if (command == null) {
            CLog.i(TAG, "Command is null");
            return false;
        }
        if (isRunning) {
            CLog.i(TAG, "Previous command is not finished");
            return false;
        }

        CLog.i(TAG, command.toString());

        if (needToUpdateState(command)) {
            notify(GAME_MODE);
        }

        isRunning = true;
        boolean result = functionMap.get(command.command).run(this.game, command.x1, command.y1, command.x2, command.y2);
        if (game.isFinishGame()) {
            isRunning = false;
            return functionMap.get(PlayCommand.WIN).run(this.game, command.x1, command.y1, command.x2, command.y2);
        }
        isRunning = false;
        return result;
    }

    boolean needToUpdateState(PlayCommand command) {
        return command.command.equals(PlayCommand.NEW_GAME) ||
                command.command.equals(PlayCommand.RESUME_GAME) ||
                command.command.equals(PlayCommand.CHALLENGE);
    }

    public void register(CmdEngineObserver observer) {
        CLog.i(TAG, "Registered!");
        observers.add(observer);
    }

    public void notify(int state) {
        for (int i = 0; i < observers.size(); i++) {
            observers.get(i).updateMode(state);
        }
    }
}
