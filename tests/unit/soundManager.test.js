const { SoundManager } = require('../../www/js/audio/soundManager');

describe('SoundManager', () => {
  let originalAudioContext;
  let mockAudioContext;
  let mockOscillator;
  let mockGain;

  beforeEach(() => {
    mockOscillator = {
      type: 'sine',
      frequency: {
        setValueAtTime: jest.fn(),
        exponentialRampToValueAtTime: jest.fn()
      },
      connect: jest.fn(),
      start: jest.fn(),
      stop: jest.fn()
    };

    mockGain = {
      gain: {
        setValueAtTime: jest.fn(),
        linearRampToValueAtTime: jest.fn()
      },
      connect: jest.fn()
    };

    mockAudioContext = {
      currentTime: 0,
      state: 'running',
      destination: {},
      createOscillator: jest.fn(() => mockOscillator),
      createGain: jest.fn(() => mockGain),
      resume: jest.fn().mockResolvedValue()
    };

    originalAudioContext = window.AudioContext;
    window.AudioContext = jest.fn(() => mockAudioContext);
    localStorage.clear();
  });

  afterEach(() => {
    window.AudioContext = originalAudioContext;
  });

  test('inicializa com mudo desativado por padrão', () => {
    const sm = new SoundManager();
    expect(sm.isMuted).toBe(false);
  });

  test('toggleMute altera o estado de mudo e persiste no localStorage', () => {
    const sm = new SoundManager();
    expect(sm.toggleMute()).toBe(true);
    expect(sm.isMuted).toBe(true);
    expect(localStorage.getItem('math2048_sound_muted')).toBe('true');

    expect(sm.toggleMute()).toBe(false);
    expect(sm.isMuted).toBe(false);
    expect(localStorage.getItem('math2048_sound_muted')).toBe('false');
  });

  test('toca som de movimento (playMove) quando não mutado', () => {
    const sm = new SoundManager();
    sm.playMove();

    expect(mockAudioContext.createOscillator).toHaveBeenCalled();
    expect(mockAudioContext.createGain).toHaveBeenCalled();
    expect(mockOscillator.start).toHaveBeenCalled();
    expect(mockOscillator.stop).toHaveBeenCalled();
  });

  test('toca som de fusão (playMerge) com dois estágios de frequência', () => {
    const sm = new SoundManager();
    sm.playMerge();

    expect(mockAudioContext.createOscillator).toHaveBeenCalled();
    expect(mockOscillator.frequency.setValueAtTime).toHaveBeenCalledTimes(2);
    expect(mockOscillator.start).toHaveBeenCalled();
  });

  test('toca alerta de desafio (playChallenge)', () => {
    const sm = new SoundManager();
    sm.playChallenge();

    expect(mockAudioContext.createOscillator).toHaveBeenCalled();
    expect(mockOscillator.frequency.setValueAtTime).toHaveBeenCalledTimes(3);
    expect(mockOscillator.start).toHaveBeenCalled();
  });

  test('toca fanfarra de vitória (playWin)', () => {
    const sm = new SoundManager();
    sm.playWin();

    // 4 notas na fanfarra
    expect(mockAudioContext.createOscillator).toHaveBeenCalledTimes(4);
    expect(mockOscillator.start).toHaveBeenCalledTimes(4);
  });

  test('toca som de Game Over (playGameOver)', () => {
    const sm = new SoundManager();
    sm.playGameOver();

    expect(mockAudioContext.createOscillator).toHaveBeenCalled();
    expect(mockOscillator.frequency.exponentialRampToValueAtTime).toHaveBeenCalled();
    expect(mockOscillator.start).toHaveBeenCalled();
  });

  test('não toca nenhum som quando mutado', () => {
    const sm = new SoundManager();
    sm.setMuted(true);

    sm.playMove();
    sm.playMerge();
    sm.playChallenge();
    sm.playWin();
    sm.playGameOver();

    expect(mockAudioContext.createOscillator).not.toHaveBeenCalled();
  });

  test('fallback gracioso quando Web Audio API não está disponível', () => {
    window.AudioContext = undefined;
    window.webkitAudioContext = undefined;

    const sm = new SoundManager();
    expect(() => {
      sm.playMove();
      sm.playMerge();
      sm.playChallenge();
      sm.playWin();
      sm.playGameOver();
    }).not.toThrow();
  });
});
