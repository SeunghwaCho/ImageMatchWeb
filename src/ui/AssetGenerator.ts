export class AssetGenerator {
  private blockImages: CanvasImageSource[] = [];
  private buttonImages: Map<string, CanvasImageSource> = new Map();
  private blockSize: number;

  // Raw loaded PNG images (originals, not resized)
  private rawBlockImages: (HTMLImageElement | null)[] = [];
  private rawButtonImages: Map<string, HTMLImageElement> = new Map();
  private imagesLoaded = false;

  // Color palette for block types (65 unique colors + special) — used as fallback
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

  // Symbols for card types — used as fallback
  private static readonly SYMBOLS: string[] = [
    '', '\u2660', '\u2665', '\u2666', '\u2663', '\u2605', '\u25CF', '\u25B2', '\u25A0', '\u25C6',
    '\u266A', '\u266B', '\u2600', '\u2601', '\u2602', '\u26A1', '\u2764', '\u273F', '\u2618', '\u2726',
    '\u25CE', '\u2295', '\u2297', '\u25B3', '\u25BD', '\u25C7', '\u25A1', '\u25CB', '\u2606', '\u2664',
    '\u2661', '\u2662', '\u2667', '\u2680', '\u2681', '\u2682', '\u2683', '\u2684', '\u2685', '\u2720',
    '\u2721', '\u2722', '\u2723', '\u2724', '\u2725', '\u2B1F', '\u2B21', '\u2B22', '\u2BC3', '\u2BC2',
    '\u25C8', '\u25C9', '\u25CA', '\u2B23', '\u2B20', '\u2B24', '\u25B6', '\u25C0', '\u25BC', '\u25B2',
    '\u2B25', '\u2B26', '\u2B27', '\u2B28', '\u2B29', '\u2B2A',
  ];

  // Button name -> PNG filename mapping
  private static readonly BUTTON_FILE_MAP: Record<string, string> = {
    'newgame': 'newgame.png',
    'start': 'start.png',
    'pause': 'pause.png',
    'resume': 'resume.png',
    'win': 'win.png',
    'gameover': 'gameover.png',
    'tryagain': 'tryagain.png',
    'hint': 'hint_button.png',
    'challenge': 'challenge.png',
    'highscore': 'highscore.png',
    'timerbar': 'time.png',
  };

  constructor(blockSize: number) {
    this.blockSize = blockSize;
    this.generateBlockImages();
    this.generateButtonImages();
  }

  /**
   * Load all PNG images from the assets/ directory.
   * After loading, call updateSize() to redraw at the correct size.
   */
  async loadImages(): Promise<void> {
    const blockPromises: Promise<HTMLImageElement | null>[] = [];

    // Load block images: block0..block65, hint (66), block99 (67/NANHEE)
    for (let i = 0; i <= 65; i++) {
      blockPromises.push(this.loadImage(`assets/blocks/block${i}.png`));
    }
    blockPromises.push(this.loadImage('assets/blocks/hint.png'));       // index 66
    blockPromises.push(this.loadImage('assets/blocks/block99.png'));    // index 67 (NANHEE)

    // Load button images
    const buttonEntries = Object.entries(AssetGenerator.BUTTON_FILE_MAP);
    const buttonPromises = buttonEntries.map(([, filename]) =>
      this.loadImage(`assets/buttons/${filename}`)
    );

    const [blockResults, buttonResults] = await Promise.all([
      Promise.all(blockPromises),
      Promise.all(buttonPromises),
    ]);

    this.rawBlockImages = blockResults;

    this.rawButtonImages.clear();
    buttonEntries.forEach(([name], idx) => {
      const img = buttonResults[idx];
      if (img) {
        this.rawButtonImages.set(name, img);
      }
    });

    this.imagesLoaded = true;

    // Redraw at current block size using loaded images
    this.rebuildFromLoaded();
  }

  updateSize(blockSize: number): void {
    this.blockSize = blockSize;
    if (this.imagesLoaded) {
      this.rebuildFromLoaded();
    } else {
      this.generateBlockImages();
      this.generateButtonImages();
    }
  }

  getBlockImage(index: number): CanvasImageSource {
    if (index < 0 || index >= this.blockImages.length) return this.blockImages[0];
    return this.blockImages[index];
  }

  getButtonImage(name: string): CanvasImageSource | undefined {
    return this.buttonImages.get(name);
  }

  getBlockSize(): number {
    return this.blockSize;
  }

  // ------- Private helpers -------

  /**
   * Rebuild all block and button canvases from loaded raw images.
   */
  private rebuildFromLoaded(): void {
    this.blockImages = [];
    const bs = this.blockSize;

    for (let i = 0; i <= 67; i++) {
      const raw = i < this.rawBlockImages.length ? this.rawBlockImages[i] : null;
      if (raw) {
        this.blockImages.push(this.drawImageToCanvas(raw, bs, bs));
      } else {
        this.blockImages.push(this.createFallbackBlock(i, bs));
      }
    }

    this.buttonImages.clear();
    for (const [name] of Object.entries(AssetGenerator.BUTTON_FILE_MAP)) {
      const raw = this.rawButtonImages.get(name);
      if (raw) {
        // Determine target dimensions based on the raw image aspect ratio
        const aspect = raw.naturalWidth / raw.naturalHeight;
        let w: number;
        let h: number;
        if (name === 'timerbar') {
          w = bs * 8;
          h = bs - 10;
        } else if (name === 'pause' || name === 'hint') {
          w = bs;
          h = bs;
        } else {
          // Preserve aspect ratio with height = bs * 1.5
          h = Math.floor(bs * 1.5);
          w = Math.floor(h * aspect);
        }
        this.buttonImages.set(name, this.drawImageToCanvas(raw, w, h));
      } else {
        this.buttonImages.set(name, this.createFallbackButton(name, bs));
      }
    }
  }

  /**
   * Load a single image, returning null on failure.
   */
  private loadImage(src: string): Promise<HTMLImageElement | null> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => {
        console.warn(`AssetGenerator: failed to load ${src}, will use fallback`);
        resolve(null);
      };
      img.src = src;
    });
  }

  /**
   * Draw an HTMLImageElement onto an offscreen canvas at the given dimensions.
   */
  private drawImageToCanvas(img: HTMLImageElement, w: number, h: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0, w, h);
    return canvas;
  }

  /**
   * Create a colored fallback block canvas (procedural) for missing images.
   */
  private createFallbackBlock(i: number, bs: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = bs;
    canvas.height = bs;
    const ctx = canvas.getContext('2d')!;

    if (i === 0) {
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, bs, bs);
      ctx.strokeStyle = '#16213e';
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, bs, bs);
    } else if (i === 66) {
      ctx.fillStyle = 'rgba(255, 255, 0, 0.4)';
      ctx.fillRect(0, 0, bs, bs);
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 3;
      ctx.strokeRect(2, 2, bs - 4, bs - 4);
    } else if (i === 67) {
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
      const colorIdx = i < AssetGenerator.COLORS.length ? i : (i % (AssetGenerator.COLORS.length - 1)) + 1;
      const color = AssetGenerator.COLORS[colorIdx];

      const gradient = ctx.createLinearGradient(0, 0, bs, bs);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, this.darkenColor(color, 30));
      ctx.fillStyle = gradient;

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

      ctx.strokeStyle = this.darkenColor(color, 50);
      ctx.lineWidth = 2;
      ctx.stroke();

      const symbolIdx = i < AssetGenerator.SYMBOLS.length ? i : (i % (AssetGenerator.SYMBOLS.length - 1)) + 1;
      const symbol = AssetGenerator.SYMBOLS[symbolIdx];
      if (symbol) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `bold ${Math.floor(bs * 0.45)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(symbol, bs / 2, bs / 2);
      }

      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = `${Math.floor(bs * 0.18)}px sans-serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(String(i), 6, 4);
    }

    return canvas;
  }

  /**
   * Create a colored fallback button canvas (procedural) for missing images.
   */
  private createFallbackButton(name: string, bs: number): HTMLCanvasElement {
    const buttonDefs: Record<string, [string, string]> = {
      'newgame': ['NEW GAME', '#E74C3C'],
      'start': ['START', '#2ECC71'],
      'pause': ['\u23F8', '#F39C12'],
      'resume': ['RESUME', '#3498DB'],
      'win': ['YOU WIN! \u25B6', '#FFD700'],
      'gameover': ['GAME OVER', '#C0392B'],
      'tryagain': ['TRY AGAIN', '#E67E22'],
      'hint': ['HINT', '#9B59B6'],
      'challenge': ['CHALLENGE', '#8E44AD'],
      'highscore': ['HIGH:', '#2C3E50'],
    };

    if (name === 'timerbar') {
      const canvas = document.createElement('canvas');
      canvas.width = bs * 8;
      canvas.height = bs - 10;
      const ctx = canvas.getContext('2d')!;
      const g = ctx.createLinearGradient(0, 0, bs * 8, 0);
      g.addColorStop(0, '#2ECC71');
      g.addColorStop(0.5, '#F1C40F');
      g.addColorStop(1, '#E74C3C');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, bs * 8, bs - 10);
      return canvas;
    }

    const [text, color] = buttonDefs[name] ?? [name.toUpperCase(), '#555555'];
    const isSmall = name === 'pause' || name === 'hint';
    const w = isSmall ? bs : bs * 4;
    const h = isSmall ? bs : Math.floor(bs * 1.5);

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

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

    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    const fontSize = isSmall ? Math.floor(bs * 0.5) : Math.floor(h * 0.4);
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, w / 2, h / 2);

    return canvas;
  }

  // ---- Initial procedural generation (before images load) ----

  private generateBlockImages(): void {
    this.blockImages = [];
    const bs = this.blockSize;
    for (let i = 0; i <= 67; i++) {
      this.blockImages.push(this.createFallbackBlock(i, bs));
    }
  }

  private generateButtonImages(): void {
    this.buttonImages.clear();
    const bs = this.blockSize;
    for (const name of Object.keys(AssetGenerator.BUTTON_FILE_MAP)) {
      this.buttonImages.set(name, this.createFallbackButton(name, bs));
    }
  }

  private darkenColor(hex: string, amount: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.max(0, (num >> 16) - amount);
    const g = Math.max(0, ((num >> 8) & 0x00FF) - amount);
    const b = Math.max(0, (num & 0x0000FF) - amount);
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
  }
}
