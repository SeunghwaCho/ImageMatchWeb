export const BoardProfile = {
  // Button image indices
  NEW_GAME_BUTTON: 0,
  ABOUT_BUTTON: 1,
  RANKING_BUTTON: 2,
  QUIT_BUTTON: 3,
  START_BUTTON: 4,
  PAUSE_BUTTON: 5,
  RESUME_BUTTON: 6,
  WIN_BUTTON: 7,
  TIMER_BAR: 8,
  GAME_OVER: 9,
  NUMBER_1: 10,
  NUMBER_2: 11,
  NUMBER_3: 12,
  NUMBER_4: 13,
  NUMBER_5: 14,
  SMALL_NUMBER_0: 15,
  SMALL_NUMBER_1: 16,
  SMALL_NUMBER_2: 17,
  SMALL_NUMBER_3: 18,
  SMALL_NUMBER_4: 19,
  SMALL_NUMBER_5: 20,
  SMALL_NUMBER_6: 21,
  SMALL_NUMBER_7: 22,
  SMALL_NUMBER_8: 23,
  SMALL_NUMBER_9: 24,
  HIGH_SCORE_BUTTON: 25,
  TRY_AGAIN_BUTTON: 26,
  HINT_BUTTON: 27,
  CHALLENGE_BUTTON: 28,

  versionName: '1.0.0',
  screenW: 1080,
  screenH: 1820,
  blockSize: 130,
  startX: 0,
  startY: 130,
  endX: 1080,
  endY: 1820,
  buttonW: 400,
  buttonH: 130,
  buttonX: 340,
  buttonY: 50,

  boardWidth: 8,
  boardHeight: 12,
  blockKind: 65,

  MASTER_CHO: 2,
  HINT: 66, // blockKind + 1
  HINT_TILE: 7,
  SMALL_TIMER: 24,
  BIG_TIMER: 43,
  NANHEE: 67, // HINT + 1

  setScreenSize(w: number, h: number): void {
    this.screenW = w;
    this.screenH = h;
    const widthBlockSize = Math.floor(h / (this.boardHeight + 5));
    let bs = Math.floor(w / this.boardWidth);
    bs = bs <= widthBlockSize ? bs : widthBlockSize;
    this.blockSize = bs;
    this.startX = Math.floor((w - bs * this.boardWidth) / 2);
    this.startY = bs;
    this.endX = this.startX + bs * this.boardWidth;
    this.endY = this.startY + bs * this.boardHeight;
    this.buttonW = bs * 4;
    this.buttonH = Math.floor(bs * 1.5);
    this.buttonX = Math.floor((w - this.buttonW) / 2);
    this.buttonY = bs * 2;
  }
};
