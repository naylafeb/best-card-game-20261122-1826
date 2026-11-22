// Cinder Court's sounds: a tiny WebAudio synth, no audio files. Every cue is a
// short oscillator phrase; silence when the browser has no audio yet.
let context = null;

function audio() {
  if (context === null) {
    try {
      const Ctor = window.AudioContext ?? window.webkitAudioContext;
      context = Ctor ? new Ctor() : null;
    } catch {
      context = null;
    }
  }
  if (context && context.state === 'suspended') context.resume().catch(() => {});
  return context;
}

function tone(freq, at, length, type, gain) {
  const ctx = audio();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  amp.gain.setValueAtTime(0.0001, ctx.currentTime + at);
  amp.gain.exponentialRampToValueAtTime(gain, ctx.currentTime + at + 0.02);
  amp.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + at + length);
  osc.connect(amp);
  amp.connect(ctx.destination);
  osc.start(ctx.currentTime + at);
  osc.stop(ctx.currentTime + at + length + 0.05);
}

/** Unlock audio on the first user gesture; screenshots never need it. */
export function unlockSound() {
  audio();
}

export function soundPlayCard() {
  tone(660, 0, 0.12, 'triangle', 0.12);
  tone(880, 0.06, 0.14, 'triangle', 0.1);
}

export function soundAttack() {
  tone(180, 0, 0.16, 'sawtooth', 0.1);
  tone(120, 0.05, 0.18, 'sawtooth', 0.08);
}

export function soundDamage() {
  tone(220, 0, 0.2, 'square', 0.06);
}

export function soundWin() {
  [523, 659, 784, 1047].forEach((freq, index) => tone(freq, index * 0.12, 0.3, 'triangle', 0.12));
}

export function soundLoss() {
  [392, 330, 262, 196].forEach((freq, index) => tone(freq, index * 0.14, 0.32, 'triangle', 0.1));
}
