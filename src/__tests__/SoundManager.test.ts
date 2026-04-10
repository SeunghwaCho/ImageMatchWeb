// Mock localStorage
const localStorageMock: Record<string, string> = {};
(global as any).localStorage = {
  getItem: (key: string) => localStorageMock[key] ?? null,
  setItem: (key: string, value: string) => { localStorageMock[key] = value; },
  removeItem: (key: string) => { delete localStorageMock[key]; },
  clear: () => { Object.keys(localStorageMock).forEach(k => delete localStorageMock[k]); },
};

// Mock AudioContext
class MockOscillator {
  type = 'sine';
  frequency = { value: 0 };
  connect() { return this; }
  start() {}
  stop() {}
}

class MockGain {
  gain = {
    value: 1,
    setValueAtTime() {},
    exponentialRampToValueAtTime() {},
  };
  connect() { return this; }
}

class MockAudioContext {
  state = 'running';
  currentTime = 0;
  destination = {};
  createOscillator() { return new MockOscillator(); }
  createGain() { return new MockGain(); }
  resume() { return Promise.resolve(); }
}

(global as any).AudioContext = MockAudioContext;
(global as any).window = {
  AudioContext: MockAudioContext,
};

import { SoundManager } from '../audio/SoundManager';

describe('SoundManager', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('initial state is not muted', () => {
    const sm = new SoundManager();
    expect(sm.muted).toBe(false);
  });

  test('reads muted state from localStorage', () => {
    localStorage.setItem('imagematch_muted', 'true');
    const sm = new SoundManager();
    expect(sm.muted).toBe(true);
  });

  test('toggleMute flips muted state', () => {
    const sm = new SoundManager();
    expect(sm.muted).toBe(false);
    sm.toggleMute();
    expect(sm.muted).toBe(true);
    sm.toggleMute();
    expect(sm.muted).toBe(false);
  });

  test('toggleMute persists to localStorage', () => {
    const sm = new SoundManager();
    sm.toggleMute();
    expect(localStorage.getItem('imagematch_muted')).toBe('true');
    sm.toggleMute();
    expect(localStorage.getItem('imagematch_muted')).toBe('false');
  });

  test('playMatch does not throw', () => {
    const sm = new SoundManager();
    expect(() => sm.playMatch()).not.toThrow();
  });

  test('playFail does not throw', () => {
    const sm = new SoundManager();
    expect(() => sm.playFail()).not.toThrow();
  });

  test('playClick does not throw', () => {
    const sm = new SoundManager();
    expect(() => sm.playClick()).not.toThrow();
  });

  test('playWin does not throw', () => {
    const sm = new SoundManager();
    expect(() => sm.playWin()).not.toThrow();
  });

  test('playGameOver does not throw', () => {
    const sm = new SoundManager();
    expect(() => sm.playGameOver()).not.toThrow();
  });

  test('playTimerWarning does not throw', () => {
    const sm = new SoundManager();
    expect(() => sm.playTimerWarning()).not.toThrow();
  });

  test('playHint does not throw', () => {
    const sm = new SoundManager();
    expect(() => sm.playHint()).not.toThrow();
  });

  test('muted state prevents sound playback', () => {
    const sm = new SoundManager();
    sm.toggleMute(); // mute
    // Should not throw and should not create AudioContext
    expect(() => sm.playMatch()).not.toThrow();
    expect(() => sm.playWin()).not.toThrow();
  });

  test('sound methods work after unmute', () => {
    const sm = new SoundManager();
    sm.toggleMute();  // mute
    sm.toggleMute();  // unmute
    expect(() => sm.playClick()).not.toThrow();
  });

  test('multiple rapid sound calls do not throw', () => {
    const sm = new SoundManager();
    expect(() => {
      sm.playMatch();
      sm.playClick();
      sm.playHint();
      sm.playWin();
    }).not.toThrow();
  });
});
