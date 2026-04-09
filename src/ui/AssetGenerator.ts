export class AssetGenerator {
  private blockImages: HTMLCanvasElement[] = [];
  private buttonImages: Map<string, HTMLCanvasElement> = new Map();
  private blockSize: number;

  // Color palette for block types (65 unique colors + special)
  private static readonly COLORS: string[] = [
    '#333333', // 0: empty/background
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F0B27A', '#82E0AA', '#F1948A', '#85929E', '#D7BDE2',
    '#A3E4D7', '#F9E79F', '#FADBD8', '#D5F5E3', '#EBDEF0',
    '#D4E6F1', '#FCF3CF', '#D5D8DC', '#ABEBC6', '#F5B7B1',
    '#AED6F1', '#A9DFBF', '#F5CBA7', '#D2B4DE', '#A2D9CE',
    '#FAD7A0', '#A9CCE3', '#D7DBDD', '#F9E79F', '#ABEBC6',
    '#F5B7B1', '#AED6F1', '#A9DFBF', '#F5CBA7', '#D2B4DE',
    '#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6',
    '#1ABC9C', '#E67E22', '#2980B9', '#27AE60', '#8E44AD',
    '#D35400', '#C0392B', '#16A085', '#2C3E50', '#7D3C98',
    '#1A5276', '#D4AC0D', '#CA6F1E', '#117A65', '#6C3483',
    '#1B4F72', '#7E5109', '#784212', '#0E6655', '#4A235A',
    '#154360', // 65
  ];

  // Symbols for card types
  private static readonly SYMBOLS: string[] = [
    '', '\u2660', '\u2665', '\u2666', '\u2663', '\u2605', '\u25CF', '\u25B2', '\u25A0', '\u25C6',
    '\u266A', '\u266B', '\u2600', '\u2601', '\u2602', '\u26A1', '\u2764', '\u273F', '\u2618', '\u2726',
    '\u25CE', '\u2295', '\u2297', '\u25B3', '\u25BD', '\u25C7', '\u25A1', '\u25CB', '\u2606', '\u2664',
    '\u2661', '\u2662', '\u2667', '\u2680', '\u2681', '\u2682', '\u2683', '\u2684', '\u2685', '\u2720',
    '\u2721', '\u2722', '\u2723', '\u2724', '\u2725', '\u2B1F', '\u2B21', '\u2B22', '\u2BC3', '\u2BC2',
    '\u25C8', '\u25C9', '\u25CA', '\u2B23', '\u2B20', '\u2B24', '\u25B6', '\u25C0', '\u25BC', '\u25B2',
    '\u2B25', '\u2B26', '\u2B27', '\u2B28', '\u2B29', '\u2B2A',
  ];

  constructor(blockSize: number) {
    this.blockSize = blockSize;
    this.generateBlockImages();
    this.generateButtonImages();
  }

  updateSize(blockSize: number): void {
    this.blockSize = blockSize;
    this.generateBlockImages();
    this.generateButtonImages();
  }

  private generateBlockImages(): void {
    this.blockImages = [];
    const bs = this.blockSize;

    for (let i = 0; i <= 67; i++) {
      const canvas = document.createElement('canvas');
      canvas.width = bs;
      canvas.height = bs;
      const ctx = canvas.getContext('2d')!;

      if (i === 0) {
        // Empty cell - dark background
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, bs, bs);
        ctx.strokeStyle = '#16213e';
        ctx.lineWidth = 1;
        ctx.strokeRect(0, 0, bs, bs);
      } else if (i === 66) {
        // Hint overlay
        ctx.fillStyle = 'rgba(255, 255, 0, 0.4)';
        ctx.fillRect(0, 0, bs, bs);
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.strokeRect(2, 2, bs - 4, bs - 4);
      } else if (i === 67) {
        // NANHEE special
        ctx.fillStyle = '#FF69B4';
        ctx.fillRect(2, 2, bs - 4, bs - 4);
        ctx.strokeStyle = '#FF1493';
        ctx.lineWidth = 2;
        ctx.strokeRect(2, 2, bs - 4, bs - 4);
        ctx.fillStyle = '#FFF';
        ctx.font = `bold ${Math.floor(bs * 0.5)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('\u2661', bs / 2, bs / 2);
      } else {
        // Regular block
        const colorIdx = i < AssetGenerator.COLORS.length ? i : (i % (AssetGenerator.COLORS.length - 1)) + 1;
        const color = AssetGenerator.COLORS[colorIdx];

        // Card background with gradient
        const gradient = ctx.createLinearGradient(0, 0, bs, bs);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, this.darkenColor(color, 30));
        ctx.fillStyle = gradient;

        // Rounded rect
        const r = Math.floor(bs * 0.1);
        ctx.beginPath();
        ctx.moveTo(r + 2, 2);
        ctx.lineTo(bs - r - 2, 2);
        ctx.quadraticCurveTo(bs - 2, 2, bs - 2, r + 2);
        ctx.lineTo(bs - 2, bs - r - 2);
        ctx.quadraticCurveTo(bs - 2, bs - 2, bs - r - 2, bs - 2);
        ctx.lineTo(r + 2, bs - 2);
        ctx.quadraticCurveTo(2, bs - 2, 2, bs - r - 2);
        ctx.lineTo(2, r + 2);
        ctx.quadraticCurveTo(2, 2, r + 2, 2);
        ctx.closePath();
        ctx.fill();

        // Border
        ctx.strokeStyle = this.darkenColor(color, 50);
        ctx.lineWidth = 2;
        ctx.stroke();

        // Symbol
        const symbolIdx = i < AssetGenerator.SYMBOLS.length ? i : (i % (AssetGenerator.SYMBOLS.length - 1)) + 1;
        const symbol = AssetGenerator.SYMBOLS[symbolIdx];
        if (symbol) {
          ctx.fillStyle = '#FFFFFF';
          ctx.font = `bold ${Math.floor(bs * 0.45)}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(symbol, bs / 2, bs / 2);
        }

        // Number in corner
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.font = `${Math.floor(bs * 0.18)}px sans-serif`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(String(i), 6, 4);
      }

      this.blockImages.push(canvas);
    }
  }

  private generateButtonImages(): void {
    this.buttonImages.clear();
    const bs = this.blockSize;

    const buttons: [string, string, string][] = [
      ['newgame', 'NEW GAME', '#E74C3C'],
      ['start', 'START', '#2ECC71'],
      ['pause', '\u23F8', '#F39C12'],
      ['resume', 'RESUME', '#3498DB'],
      ['win', 'YOU WIN! \u25B6', '#FFD700'],
      ['gameover', 'GAME OVER', '#C0392B'],
      ['tryagain', 'TRY AGAIN', '#E67E22'],
      ['hint', 'HINT', '#9B59B6'],
      ['challenge', 'CHALLENGE', '#8E44AD'],
      ['highscore', 'HIGH:', '#2C3E50'],
    ];

    for (const [name, text, color] of buttons) {
      const w = name === 'pause' || name === 'hint' ? bs : bs * 4;
      const h = name === 'pause' || name === 'hint' ? bs : Math.floor(bs * 1.5);

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;

      // Button background
      const gradient = ctx.createLinearGradient(0, 0, 0, h);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, this.darkenColor(color, 30));
      ctx.fillStyle = gradient;

      const r = Math.min(10, Math.floor(bs * 0.08));
      ctx.beginPath();
      ctx.moveTo(r, 0);
      ctx.lineTo(w - r, 0);
      ctx.quadraticCurveTo(w, 0, w, r);
      ctx.lineTo(w, h - r);
      ctx.quadraticCurveTo(w, h, w - r, h);
      ctx.lineTo(r, h);
      ctx.quadraticCurveTo(0, h, 0, h - r);
      ctx.lineTo(0, r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.closePath();
      ctx.fill();

      // Border
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text
      ctx.fillStyle = '#FFFFFF';
      const fontSize = name === 'pause' || name === 'hint'
        ? Math.floor(bs * 0.5)
        : Math.floor(h * 0.4);
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, w / 2, h / 2);

      this.buttonImages.set(name, canvas);
    }

    // Timer bar
    const timerCanvas = document.createElement('canvas');
    timerCanvas.width = bs * 8;
    timerCanvas.height = bs - 10;
    const timerCtx = timerCanvas.getContext('2d')!;
    const timerGradient = timerCtx.createLinearGradient(0, 0, bs * 8, 0);
    timerGradient.addColorStop(0, '#2ECC71');
    timerGradient.addColorStop(0.5, '#F1C40F');
    timerGradient.addColorStop(1, '#E74C3C');
    timerCtx.fillStyle = timerGradient;
    timerCtx.fillRect(0, 0, bs * 8, bs - 10);
    this.buttonImages.set('timerbar', timerCanvas);
  }

  getBlockImage(index: number): HTMLCanvasElement {
    if (index < 0 || index >= this.blockImages.length) return this.blockImages[0];
    return this.blockImages[index];
  }

  getButtonImage(name: string): HTMLCanvasElement | undefined {
    return this.buttonImages.get(name);
  }

  private darkenColor(hex: string, amount: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.max(0, (num >> 16) - amount);
    const g = Math.max(0, ((num >> 8) & 0x00FF) - amount);
    const b = Math.max(0, (num & 0x0000FF) - amount);
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
  }

  getBlockSize(): number {
    return this.blockSize;
  }
}
