export class SoundManager {
  private ctx: AudioContext | null = null;
  private _muted: boolean = false;

  constructor() {
    const saved = localStorage.getItem('imagematch_muted');
    if (saved === 'true') this._muted = true;
  }

  get muted(): boolean {
    return this._muted;
  }

  toggleMute(): void {
    this._muted = !this._muted;
    localStorage.setItem('imagematch_muted', String(this._muted));
  }

  private getCtx(): AudioContext | null {
    if (this._muted) return null;
    if (!this.ctx) {
      try {
        this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch {
        return null;
      }
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  private playTone(freq: number, duration: number, type: OscillatorType = 'sine',
                   volume: number = 0.15, delay: number = 0): void {
    const ctx = this.getCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, ctx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + duration);
  }

  /** Two ascending tones - match found */
  playMatch(): void {
    this.playTone(523, 0.12, 'sine', 0.15, 0);
    this.playTone(659, 0.15, 'sine', 0.15, 0.08);
  }

  /** Short low bump - no match / invalid click */
  playFail(): void {
    this.playTone(180, 0.15, 'triangle', 0.12);
  }

  /** Quick click sound */
  playClick(): void {
    this.playTone(800, 0.04, 'sine', 0.08);
  }

  /** Ascending arpeggio - stage clear */
  playWin(): void {
    this.playTone(523, 0.15, 'sine', 0.15, 0);
    this.playTone(659, 0.15, 'sine', 0.15, 0.12);
    this.playTone(784, 0.15, 'sine', 0.15, 0.24);
    this.playTone(1047, 0.3, 'sine', 0.18, 0.36);
  }

  /** Descending tones - game over */
  playGameOver(): void {
    this.playTone(440, 0.25, 'sine', 0.12, 0);
    this.playTone(370, 0.25, 'sine', 0.12, 0.2);
    this.playTone(330, 0.25, 'sine', 0.12, 0.4);
    this.playTone(262, 0.5, 'triangle', 0.1, 0.6);
  }

  /** Short urgent beep - timer warning */
  playTimerWarning(): void {
    this.playTone(880, 0.08, 'square', 0.06);
  }

  /** Sparkle shimmer - hint used */
  playHint(): void {
    this.playTone(1200, 0.08, 'sine', 0.08, 0);
    this.playTone(1600, 0.08, 'sine', 0.06, 0.06);
    this.playTone(2000, 0.1, 'sine', 0.04, 0.12);
  }
}
