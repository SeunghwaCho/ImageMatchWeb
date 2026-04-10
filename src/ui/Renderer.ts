import { AssetGenerator } from './AssetGenerator';
import { BoardProfile } from '../game/BoardProfile';

export interface MatchAnimationData {
  clickX: number;
  clickY: number;
  matchedBlocks: { x: number; y: number; type: number }[];
  progress: number;
}

export interface RenderState {
  board: number[][];
  boardWidth: number;
  boardHeight: number;
  state: number; // GameStateValue
  score: number;
  highScore: number;
  stage: number;
  time: number;
  maxTime: number;
  hintCount: number;
  hintBlock: { x: number; y: number } | null;
  hintBlocks: { x: number; y: number; type: number }[];
  lastRemovedBlocks: { x: number; y: number }[];
  animationProgress: number;
  matchAnimation: MatchAnimationData | null;
}

export class Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private assets: AssetGenerator;
  private width: number = 0;
  private height: number = 0;

  constructor(canvas: HTMLCanvasElement, assets?: AssetGenerator) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.assets = assets ?? new AssetGenerator(50);
    this.resize();
  }

  setAssets(assets: AssetGenerator): void {
    this.assets = assets;
    this.assets.updateSize(BoardProfile.blockSize);
  }

  resize(): void {
    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;

    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';
    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;
    this.ctx.scale(dpr, dpr);

    this.width = w;
    this.height = h;

    BoardProfile.setScreenSize(w, h);
    this.assets.updateSize(BoardProfile.blockSize);
  }

  render(renderState: RenderState): void {
    const ctx = this.ctx;

    // Clear
    ctx.fillStyle = '#0f0f23';
    ctx.fillRect(0, 0, this.width, this.height);

    switch (renderState.state) {
      case 1: // IDLE
        this.drawIdleScreen(renderState);
        break;
      case 2: // PLAY
        this.drawPlayScreen(renderState);
        break;
      case 3: // PAUSE
        this.drawPauseScreen(renderState);
        break;
      case 4: // END
        this.drawEndScreen(renderState);
        break;
      case 5: // GAMEOVER
        this.drawGameoverScreen(renderState);
        break;
      default: // NONE or CONFIG
        this.drawMenuScreen(renderState);
        break;
    }
  }

  private drawBoard(renderState: RenderState): void {
    const ctx = this.ctx;
    const bs = BoardProfile.blockSize;
    const { startX, startY } = BoardProfile;
    const { board, boardWidth, boardHeight } = renderState;

    // Draw empty grid background
    for (let i = 0; i < boardHeight; i++) {
      for (let j = 0; j < boardWidth; j++) {
        const x = startX + j * bs;
        const y = startY + i * bs;
        ctx.drawImage(this.assets.getBlockImage(0), x, y, bs, bs);
      }
    }

    // Draw blocks
    for (let i = 0; i < boardHeight; i++) {
      for (let j = 0; j < boardWidth; j++) {
        if (board[i] && board[i][j] !== 0) {
          const x = startX + j * bs;
          const y = startY + i * bs;
          ctx.drawImage(this.assets.getBlockImage(board[i][j]), x, y, bs, bs);
        }
      }
    }

    // Draw hint overlay with path
    if (renderState.hintBlocks && renderState.hintBlocks.length > 0) {
      // hintBlocks[0] = click position, hintBlocks[1..] = matched blocks
      const clickHint = renderState.hintBlocks[0];
      const matchedHints = renderState.hintBlocks.slice(1);

      // Draw hint highlight on matched blocks
      for (const hint of matchedHints) {
        const x = startX + hint.x * bs;
        const y = startY + hint.y * bs;
        ctx.drawImage(this.assets.getBlockImage(66), x, y, bs, bs);
      }

      // Draw hint path lines from click position to each matched block
      if (clickHint && matchedHints.length > 0) {
        const cx = startX + clickHint.x * bs + bs / 2;
        const cy = startY + clickHint.y * bs + bs / 2;

        // Highlight click cell
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 0, 0.7)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(startX + clickHint.x * bs + 2, startY + clickHint.y * bs + 2, bs - 4, bs - 4);
        ctx.setLineDash([]);
        ctx.restore();

        for (const hint of matchedHints) {
          const hx = startX + hint.x * bs + bs / 2;
          const hy = startY + hint.y * bs + bs / 2;

          // Path line
          ctx.save();
          ctx.strokeStyle = 'rgba(255, 255, 0, 0.6)';
          ctx.lineWidth = 3;
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#FFD700';
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(hx, hy);
          ctx.stroke();

          // Endpoint circles
          ctx.fillStyle = '#FFD700';
          ctx.beginPath();
          ctx.arc(cx, cy, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(hx, hy, 5, 0, Math.PI * 2);
          ctx.fill();

          ctx.shadowBlur = 0;
          ctx.shadowColor = 'transparent';
          ctx.restore();
        }
      }
    }
  }

  private drawTimerBar(renderState: RenderState): void {
    const ctx = this.ctx;
    const bs = BoardProfile.blockSize;
    const { startX, startY, endX } = BoardProfile;
    const barY = startY - bs;
    const barW = endX - startX;
    const barH = bs - 10;

    // Background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(startX, barY, barW, barH);

    // Timer fill
    const ratio = Math.max(0, renderState.time / renderState.maxTime);
    const fillW = barW * ratio;

    // Rainbow gradient across the filled portion
    if (fillW > 0) {
      const gradient = ctx.createLinearGradient(startX, barY, startX + fillW, barY);
      gradient.addColorStop(0.0, '#FF0000');   // red
      gradient.addColorStop(0.14, '#FF8C00');  // orange
      gradient.addColorStop(0.28, '#FFD700');  // yellow
      gradient.addColorStop(0.42, '#2ECC71');  // green
      gradient.addColorStop(0.57, '#00CED1');  // cyan
      gradient.addColorStop(0.71, '#1E90FF');  // blue
      gradient.addColorStop(0.85, '#9B59B6');  // violet
      gradient.addColorStop(1.0, '#FF0000');   // red
      ctx.fillStyle = gradient;
      ctx.fillRect(startX, barY, fillW, barH);
    }

    // Border
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.strokeRect(startX, barY, barW, barH);

    // Time text
    ctx.fillStyle = '#FFF';
    ctx.font = `bold ${Math.floor(barH * 0.6)}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${renderState.time}`, startX + barW / 2, barY + barH / 2);

    // Countdown warning
    if (renderState.time > 0 && renderState.time <= 5) {
      ctx.fillStyle = 'rgba(231, 76, 60, 0.3)';
      ctx.fillRect(startX, startY, bs * 8, bs * 12);

      ctx.fillStyle = '#E74C3C';
      ctx.font = `bold ${bs * 3}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        String(renderState.time),
        startX + bs * 4,
        startY + bs * 5
      );
    }
  }

  private drawScore(renderState: RenderState): void {
    const ctx = this.ctx;
    const bs = BoardProfile.blockSize;
    const { endX } = BoardProfile;
    const numH = Math.floor(bs * 0.4);

    // Score at top right (above timer bar)
    ctx.fillStyle = '#AAA';
    ctx.font = `${numH}px monospace`;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillText(
      `SCORE: ${String(renderState.score).padStart(8, '0')}`,
      endX,
      2
    );
  }

  private drawStageAndButtons(renderState: RenderState): void {
    const ctx = this.ctx;
    const bs = BoardProfile.blockSize;
    const { startX, endX, endY } = BoardProfile;
    const infoY = endY + Math.floor(bs * 0.2);
    const numH = Math.floor(bs * 0.5);

    // Stage number
    ctx.fillStyle = '#FFF';
    ctx.font = `bold ${numH}px monospace`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(
      `STAGE ${String(renderState.stage).padStart(4, '0')}`,
      startX,
      infoY
    );

    // Pause button
    const pauseBtn = this.assets.getButtonImage('pause');
    if (pauseBtn) {
      ctx.drawImage(pauseBtn, endX - bs, infoY, bs, bs);
    }

    // Hint button + count
    const hintBtn = this.assets.getButtonImage('hint');
    if (hintBtn) {
      const hintX = endX - bs * 3;
      ctx.drawImage(hintBtn, hintX, infoY, bs, bs);
      ctx.fillStyle = '#FFF';
      ctx.font = `bold ${Math.floor(bs * 0.4)}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        String(renderState.hintCount),
        hintX + bs + bs * 0.4,
        infoY + bs / 2
      );
    }

    // High score at bottom
    ctx.fillStyle = '#888';
    ctx.font = `${Math.floor(bs * 0.35)}px monospace`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(
      `HIGH: ${String(renderState.highScore).padStart(8, '0')}`,
      startX,
      infoY + bs + 5
    );
  }

  private drawMatchAnimation(rs: RenderState): void {
    const anim = rs.matchAnimation;
    if (!anim) return;

    const ctx = this.ctx;
    const bs = BoardProfile.blockSize;
    const { startX, startY } = BoardProfile;
    const { clickX, clickY, matchedBlocks, progress } = anim;

    const cx = startX + clickX * bs + bs / 2;
    const cy = startY + clickY * bs + bs / 2;

    // Phase 1 (0.0 - 0.4): Path appears
    if (progress <= 0.4) {
      const phase1 = progress / 0.4; // 0 to 1

      // Pulsing circle at click position
      ctx.save();
      const pulseRadius = bs * 0.3 + Math.sin(phase1 * Math.PI * 4) * bs * 0.1;
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#00FFFF';
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, pulseRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';
      ctx.restore();

      // Animated lines from click to each matched block
      for (const block of matchedBlocks) {
        const bx = startX + block.x * bs + bs / 2;
        const by = startY + block.y * bs + bs / 2;

        const dx = bx - cx;
        const dy = by - cy;
        const endLineX = cx + dx * phase1;
        const endLineY = cy + dy * phase1;

        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00FFFF';
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(endLineX, endLineY);
        ctx.stroke();

        // Endpoint circles at connection points
        ctx.fillStyle = '#00FFFF';
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(endLineX, endLineY, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
        ctx.restore();
      }
    }

    // Phase 2 (0.4 - 0.7): Blocks highlight
    if (progress > 0.4 && progress <= 0.7) {
      const phase2 = (progress - 0.4) / 0.3; // 0 to 1

      // Fully drawn lines
      for (const block of matchedBlocks) {
        const bx = startX + block.x * bs + bs / 2;
        const by = startY + block.y * bs + bs / 2;

        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00FFFF';
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(bx, by);
        ctx.stroke();

        // Endpoint circles
        ctx.fillStyle = '#00FFFF';
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(bx, by, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
        ctx.restore();
      }

      // Pulsing highlight on matched blocks
      const pulseAlpha = 0.4 + Math.sin(phase2 * Math.PI * 3) * 0.3;
      for (const block of matchedBlocks) {
        const bx = startX + block.x * bs;
        const by = startY + block.y * bs;

        ctx.save();
        ctx.strokeStyle = `rgba(255, 255, 255, ${pulseAlpha})`;
        ctx.lineWidth = 3;
        ctx.strokeRect(bx + 2, by + 2, bs - 4, bs - 4);

        // Flash effect
        ctx.fillStyle = `rgba(255, 255, 255, ${pulseAlpha * 0.3})`;
        ctx.fillRect(bx, by, bs, bs);
        ctx.restore();
      }

      // Click circle still visible
      ctx.save();
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#00FFFF';
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, bs * 0.3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';
      ctx.restore();
    }

    // Phase 3 (0.7 - 1.0): Blocks fade and shrink
    if (progress > 0.7) {
      const phase3 = (progress - 0.7) / 0.3; // 0 to 1

      // Fading lines
      const lineAlpha = 1.0 - phase3;
      for (const block of matchedBlocks) {
        const bx = startX + block.x * bs + bs / 2;
        const by = startY + block.y * bs + bs / 2;

        ctx.save();
        ctx.globalAlpha = lineAlpha;
        ctx.shadowBlur = 10 * lineAlpha;
        ctx.shadowColor = '#00FFFF';
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(bx, by);
        ctx.stroke();

        // Fading endpoint circles
        ctx.fillStyle = '#00FFFF';
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(bx, by, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
        ctx.restore();
      }

      // Shrinking and fading blocks
      const scale = 1.0 - phase3;
      const alpha = 1.0 - phase3;
      for (const block of matchedBlocks) {
        const bx = startX + block.x * bs;
        const by = startY + block.y * bs;
        const centerX = bx + bs / 2;
        const centerY = by + bs / 2;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(centerX, centerY);
        ctx.scale(scale, scale);
        ctx.translate(-centerX, -centerY);
        ctx.drawImage(this.assets.getBlockImage(block.type), bx, by, bs, bs);
        ctx.restore();
      }
    }
  }

  private drawPlayScreen(rs: RenderState): void {
    this.drawBoard(rs);
    this.drawTimerBar(rs);
    this.drawScore(rs);
    this.drawStageAndButtons(rs);

    // Match animation overlay
    if (rs.matchAnimation) {
      this.drawMatchAnimation(rs);
    }
  }

  private drawIdleScreen(rs: RenderState): void {
    this.drawBoard(rs);
    this.drawOverlay();

    const ctx = this.ctx;
    const bs = BoardProfile.blockSize;
    const { buttonX, buttonY, buttonW, buttonH } = BoardProfile;

    // Stage display
    ctx.fillStyle = '#FFD700';
    ctx.font = `bold ${bs}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      `STAGE ${rs.stage}`,
      this.width / 2,
      buttonY + bs
    );

    // Start button
    const startBtn = this.assets.getButtonImage('start');
    if (startBtn) {
      ctx.drawImage(startBtn, buttonX, buttonY + bs * 2, buttonW, buttonH);
    }
  }

  private drawPauseScreen(rs: RenderState): void {
    this.drawOverlay();

    const ctx = this.ctx;
    const bs = BoardProfile.blockSize;
    const { buttonX, buttonY, buttonW, buttonH } = BoardProfile;

    // Title
    ctx.fillStyle = '#FFF';
    ctx.font = `bold ${bs}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('PAUSED', this.width / 2, buttonY);

    // Resume button
    const resumeBtn = this.assets.getButtonImage('resume');
    if (resumeBtn) {
      ctx.drawImage(resumeBtn, buttonX, buttonY + bs, buttonW, buttonH);
    }

    // New Game button
    const newGameBtn = this.assets.getButtonImage('newgame');
    if (newGameBtn) {
      ctx.drawImage(newGameBtn, buttonX, buttonY + bs * 4, buttonW, buttonH);
    }

    // Version
    ctx.fillStyle = '#666';
    ctx.font = `${Math.floor(bs * 0.3)}px monospace`;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText(`v${BoardProfile.versionName}`, BoardProfile.endX, BoardProfile.endY + bs);
  }

  private drawEndScreen(rs: RenderState): void {
    this.drawBoard(rs);
    this.drawOverlay();

    const ctx = this.ctx;
    const bs = BoardProfile.blockSize;
    const { buttonX, buttonY, buttonW, buttonH } = BoardProfile;

    // Win text
    ctx.fillStyle = '#FFD700';
    ctx.font = `bold ${bs * 1.5}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('YOU WIN!', this.width / 2, buttonY + bs * 2);

    // Score
    ctx.fillStyle = '#FFF';
    ctx.font = `bold ${bs * 0.6}px sans-serif`;
    ctx.fillText(
      `Score: ${rs.score}`,
      this.width / 2,
      buttonY + bs * 4
    );

    // Continue button (click anywhere)
    const winBtn = this.assets.getButtonImage('win');
    if (winBtn) {
      ctx.drawImage(winBtn, buttonX, buttonY + bs * 5, buttonW, buttonH);
    }
  }

  private drawGameoverScreen(rs: RenderState): void {
    this.drawOverlay();

    const ctx = this.ctx;
    const bs = BoardProfile.blockSize;
    const { buttonX, buttonY, buttonW, buttonH } = BoardProfile;

    // Game Over
    const goBtn = this.assets.getButtonImage('gameover');
    if (goBtn) {
      ctx.drawImage(goBtn, buttonX, buttonY, buttonW, buttonH);
    }

    // Score display
    ctx.fillStyle = '#FFF';
    ctx.font = `bold ${Math.floor(bs * 0.6)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      `Score: ${rs.score}`,
      this.width / 2,
      buttonY + bs * 2.5
    );

    // Try Again button
    const tryBtn = this.assets.getButtonImage('tryagain');
    if (tryBtn) {
      ctx.drawImage(tryBtn, buttonX, buttonY + bs * 4, buttonW, buttonH);
    }

    // New Game button
    const newBtn = this.assets.getButtonImage('newgame');
    if (newBtn) {
      ctx.drawImage(newBtn, buttonX, buttonY + bs * 6, buttonW, buttonH);
    }
  }

  private drawMenuScreen(rs: RenderState): void {
    const ctx = this.ctx;
    const bs = BoardProfile.blockSize;
    const { buttonX, buttonY, buttonW, buttonH } = BoardProfile;

    // Title
    ctx.fillStyle = '#FFD700';
    ctx.font = `bold ${bs * 1.2}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Image Match', this.width / 2, bs * 2);

    // Challenge button
    const challengeBtn = this.assets.getButtonImage('challenge');
    if (challengeBtn) {
      ctx.drawImage(challengeBtn, buttonX, buttonY + bs, buttonW, buttonH);
    }

    // New Game button
    const newBtn = this.assets.getButtonImage('newgame');
    if (newBtn) {
      ctx.drawImage(newBtn, buttonX, buttonY + bs * 4, buttonW, buttonH);
    }

    // Resume button
    const resumeBtn = this.assets.getButtonImage('resume');
    if (resumeBtn) {
      ctx.drawImage(resumeBtn, buttonX, buttonY + bs * 7, buttonW, buttonH);
    }
  }

  private drawOverlay(): void {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  private adjustBrightness(hex: string, amount: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
  }

  getWidth(): number { return this.width; }
  getHeight(): number { return this.height; }
}
