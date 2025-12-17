/**
 * Simple Audio Synthesizer using Web Audio API
 * Generates cute UI sounds and game effects without external assets.
 */

let audioCtx: AudioContext | null = null;
let masterVolume = 0.5; // Default volume 50%

export const setMasterVolume = (vol: number) => {
  masterVolume = Math.max(0, Math.min(1, vol));
};

const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

const createOscillator = (type: OscillatorType, freq: number, duration: number, startTime: number, vol: number = 0.1) => {
  if (!audioCtx || masterVolume === 0) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);
  
  // Apply master volume
  const finalVol = vol * masterVolume;
  
  gain.gain.setValueAtTime(finalVol, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration);
};

export const playSound = {
  click: () => {
    const ctx = initAudio();
    if (!ctx) return;
    createOscillator('sine', 800, 0.1, ctx.currentTime);
  },
  
  type: () => {
    const ctx = initAudio();
    if (!ctx) return;
    createOscillator('triangle', 400, 0.05, ctx.currentTime, 0.05);
  },

  magic: () => {
    const ctx = initAudio();
    if (!ctx) return;
    const now = ctx.currentTime;
    createOscillator('sine', 440, 0.2, now);
    createOscillator('sine', 554, 0.2, now + 0.1);
    createOscillator('sine', 659, 0.2, now + 0.2);
    createOscillator('sine', 880, 0.4, now + 0.3);
  },

  score: () => {
    const ctx = initAudio();
    if (!ctx) return;
    const now = ctx.currentTime;
    createOscillator('triangle', 523.25, 0.3, now); 
    createOscillator('triangle', 659.25, 0.3, now + 0.1); 
    createOscillator('triangle', 783.99, 0.6, now + 0.2); 
  },

  goodItem: () => {
    const ctx = initAudio();
    if (!ctx) return;
    createOscillator('sine', 1000, 0.1, ctx.currentTime, 0.1);
    createOscillator('sine', 1500, 0.2, ctx.currentTime + 0.05, 0.1);
  },

  badItem: () => {
    const ctx = initAudio();
    if (!ctx) return;
    createOscillator('sawtooth', 150, 0.3, ctx.currentTime);
    createOscillator('sawtooth', 100, 0.3, ctx.currentTime + 0.1);
  },

  heartbeat: () => {
    const ctx = initAudio();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(50, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.3);
    
    gain.gain.setValueAtTime(0.6 * masterVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.3);
  },

  flip: () => {
    const ctx = initAudio();
    if (!ctx) return;
    createOscillator('square', 300, 0.05, ctx.currentTime, 0.05);
  },

  squish: () => {
    const ctx = initAudio();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);
    gain.gain.setValueAtTime(0.2 * masterVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  },

  gacha: () => {
    const ctx = initAudio();
    if (!ctx) return;
    const now = ctx.currentTime;
    [440, 554, 659, 880, 1108, 1318].forEach((freq, i) => {
      createOscillator('sine', freq, 0.1, now + (i * 0.05), 0.1);
    });
  }
};