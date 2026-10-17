/**
 * Sistema de Áudio do Math2048 (WDD Seção 9 / TDD Seção 11 / Lacuna 4.1).
 * Implementado via Web Audio API pura, sem dependências externas e com 0KB de assets
 * externos (respeitando o limite estrito de 5MB — RNF-17).
 *
 * Efeitos suportados:
 * 1. move: som suave de deslize/movimento.
 * 2. merge: som harmônico de fusão de blocos.
 * 3. challenge: alerta ao abrir o modal de desafio (Gatekeeper).
 * 4. win: fanfarra triunfante ao alcançar 2048.
 * 5. gameOver: tom grave descendente de fim de jogo.
 *
 * Fornece fallback silencioso caso o navegador ou dispositivo não suporte Web Audio
 * ou se o usuário estiver com o som desativado (Muted).
 */

const STORAGE_KEY_MUTED = 'math2048_sound_muted';

class SoundManager {
  constructor() {
    this._ctx = null;
    this._muted = this._loadMutedState();
  }

  _loadMutedState() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(STORAGE_KEY_MUTED) === 'true';
      }
    } catch (_) {
      // Ignora falhas de localStorage em ambientes restritos
    }
    return false;
  }

  _saveMutedState() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY_MUTED, String(this._muted));
      }
    } catch (_) {
      // Ignora
    }
  }

  get isMuted() {
    return this._muted;
  }

  setMuted(muted) {
    this._muted = Boolean(muted);
    this._saveMutedState();
  }

  toggleMute() {
    this.setMuted(!this._muted);
    return this._muted;
  }

  _getAudioContext() {
    if (typeof window === 'undefined') return null;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;

    if (!this._ctx) {
      try {
        this._ctx = new AudioCtx();
      } catch (_) {
        return null;
      }
    }

    if (this._ctx.state === 'suspended') {
      this._ctx.resume().catch(() => {});
    }

    return this._ctx;
  }

  /**
   * Toca som suave de deslize ao mover os blocos.
   */
  playMove() {
    if (this._muted) return;
    const ctx = this._getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch (_) {
      // Fallback silencioso
    }
  }

  /**
   * Toca som harmônico duplo ao fundir blocos.
   */
  playMerge() {
    if (this._muted) return;
    const ctx = this._getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(330, now);
      osc.frequency.setValueAtTime(523.25, now + 0.06); // C5

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch (_) {
      // Fallback silencioso
    }
  }

  /**
   * Alerta sonoro ao abrir o modal de desafio do Gatekeeper.
   */
  playChallenge() {
    if (this._muted) return;
    const ctx = this._getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now); // A4
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.setValueAtTime(880, now + 0.2); // A5

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch (_) {
      // Fallback silencioso
    }
  }

  /**
   * Fanfarra curta triunfante de vitória (bloco 2048).
   */
  playWin() {
    if (this._muted) return;
    const ctx = this._getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      const duration = 0.12;

      notes.forEach((freq, idx) => {
        const start = now + idx * duration;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.15, start);
        gain.gain.linearRampToValueAtTime(0.001, start + duration + (idx === 3 ? 0.3 : 0));

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + duration + (idx === 3 ? 0.3 : 0));
      });
    } catch (_) {
      // Fallback silencioso
    }
  }

  /**
   * Som grave descendente de Game Over.
   */
  playGameOver() {
    if (this._muted) return;
    const ctx = this._getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.45);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch (_) {
      // Fallback silencioso
    }
  }
}

// Instância singleton para uso em todo o app
const soundManager = new SoundManager();

module.exports = {
  SoundManager,
  soundManager
};
