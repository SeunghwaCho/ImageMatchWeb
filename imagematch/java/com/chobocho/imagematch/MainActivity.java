package com.chobocho.imagematch;

import android.graphics.Insets;
import android.graphics.Rect;
import android.view.*;
import androidx.appcompat.app.AppCompatActivity;

import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.graphics.Point;
import android.os.Bundle;
import android.util.Log;

import com.chobocho.mahjong.BoardGame;
import com.chobocho.mahjong.MahjongImpl;
import com.chobocho.mahjong.GameInfo;
import com.chobocho.mahjong.command.CommandEngine;

public class MainActivity extends AppCompatActivity {
    final String TAG = "MainActivity";
    BoardProfile boardProfile;
    GameInfo gameInfo;
    BoardGame majhong;
    CommandEngine cmdEngine;
    MahjongGameView gameView;
    String versionName;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        versionName = getVersionName();
        getWindow().setDecorFitsSystemWindows(false);
        init();
        setContentView(gameView);
        // DecorView가 attach된 후에 실행하도록 post() 사용
        getWindow().getDecorView().post(new Runnable() {
            @Override
            public void run() {
                WindowInsetsController insetsController = getWindow().getInsetsController();
                if (insetsController != null) {
                    insetsController.hide(WindowInsets.Type.statusBars() | WindowInsets.Type.navigationBars());
                    insetsController.setSystemBarsBehavior(
                            WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
                    );
                }
            }
        });
    }

    protected void init() {
        int safeWidth;
        int safeHeight;

        WindowManager windowManager = getWindowManager();
        WindowMetrics windowMetrics = windowManager.getCurrentWindowMetrics();
        Rect bounds = windowMetrics.getBounds();
        WindowInsets insets = windowMetrics.getWindowInsets();
        Insets systemInsets = insets.getInsetsIgnoringVisibility(
                WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout()
        );
        safeWidth = bounds.width() - systemInsets.left - systemInsets.right;
        safeHeight = bounds.height() - systemInsets.top - systemInsets.bottom;
        boardProfile = new BoardProfile(versionName, safeWidth, safeHeight);
        boardProfile.setScreenSize(safeWidth, safeHeight);
        gameInfo = new MajhongGameInfo(this);
        gameInfo.setMaxTime(BoardGame.MAX_TIME);
        majhong = new MahjongImpl(new AndroidLog(), gameInfo, boardProfile.boardWidth, boardProfile.boardHeight, boardProfile.blockKind);
        cmdEngine = new CommandEngine(majhong);
        gameView = new MahjongGameView(this, majhong, gameInfo, boardProfile, cmdEngine);
    }

    private String getVersionName() {
        try {
            PackageInfo pkgInfo = getPackageManager().getPackageInfo(getPackageName(), 0);
            String version = pkgInfo.versionName;
            Log.i(TAG, "Version Name: " + version);
            return version;
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
            Log.i(TAG, e.toString());
        }
        return "";
    }

    @Override
    public void onPause() {
        super.onPause();
        if (gameView != null) {
            gameView.pauseGame();
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        if (gameView != null) {
            gameView.resumeGame();
        }
    }
}
