/**
 * Quiet synthesised atmosphere for the cinematic stage: a wind bed, a low drone
 * for the ingredients chapter, and a few one-shot cues. Nothing plays until the
 * visitor turns sound on (browsers need a gesture first).
 */
const WIND_BY_CHAPTER = [0.05, 0.075, 0.035, 0.018];
const DRONE_BY_CHAPTER = [0, 0, 0.018, 0.045];

type AudioWindow = Window & { webkitAudioContext?: typeof AudioContext };

export class StageAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private wind: GainNode | null = null;
  private drone: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private on = false;
  private chapter = 0;

  get enabled() {
    return this.on;
  }

  async enable() {
    if (!this.ctx) this.build();
    const ctx = this.ctx;
    if (!ctx || !this.master) return;
    await ctx.resume();
    this.on = true;
    this.master.gain.setTargetAtTime(0.8, ctx.currentTime, 0.25);
    this.setChapter(this.chapter);
  }

  disable() {
    const ctx = this.ctx;
    if (!ctx || !this.master) return;
    this.on = false;
    this.master.gain.setTargetAtTime(0, ctx.currentTime, 0.12);
    window.setTimeout(() => {
      if (!this.on) void ctx.suspend();
    }, 600);
  }

  setChapter(index: number) {
    this.chapter = index;
    const ctx = this.ctx;
    if (!this.on || !ctx || !this.wind || !this.drone) return;
    this.wind.gain.setTargetAtTime(WIND_BY_CHAPTER[index] ?? 0.03, ctx.currentTime, 0.8);
    this.drone.gain.setTargetAtTime(DRONE_BY_CHAPTER[index] ?? 0, ctx.currentTime, 0.8);
  }

  /** The feed bag landing */
  thud() {
    const ctx = this.ctx;
    if (!this.on || !ctx || !this.master) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(42, now + 0.28);
    g.gain.setValueAtTime(0.55, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.34);
    osc.connect(g).connect(this.master);
    osc.start(now);
    osc.stop(now + 0.36);
    this.burst(0.12, 900, 0.12);
  }

  /** The bag spinning to a new product */
  whoosh() {
    this.burst(0.5, 2400, 0.16, 350);
  }

  /** A small chirp for the chick */
  chirp() {
    const ctx = this.ctx;
    if (!this.on || !ctx || !this.master) return;
    const now = ctx.currentTime;
    [0, 0.11].forEach((delay, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      const from = 3100 + i * 300;
      osc.frequency.setValueAtTime(from, now + delay);
      osc.frequency.exponentialRampToValueAtTime(from + 1100, now + delay + 0.07);
      g.gain.setValueAtTime(0.0001, now + delay);
      g.gain.exponentialRampToValueAtTime(0.05, now + delay + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.09);
      osc.connect(g).connect(this.master as GainNode);
      osc.start(now + delay);
      osc.stop(now + delay + 0.1);
    });
  }

  dispose() {
    this.on = false;
    if (this.ctx) void this.ctx.close();
    this.ctx = null;
    this.master = null;
    this.wind = null;
    this.drone = null;
    this.noise = null;
  }

  /** Filtered noise burst; sweeps the band-pass from `from` Hz up to `to` Hz */
  private burst(duration: number, to: number, level: number, from = to) {
    const ctx = this.ctx;
    if (!ctx || !this.master || !this.noise) return;
    const now = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 0.9;
    filter.frequency.setValueAtTime(from, now);
    filter.frequency.exponentialRampToValueAtTime(to, now + duration);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(level, now + duration * 0.35);
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    src.connect(filter).connect(g).connect(this.master);
    src.start(now);
    src.stop(now + duration + 0.05);
  }

  private build() {
    const AC = window.AudioContext || (window as AudioWindow).webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    this.ctx = ctx;

    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    this.master = master;

    // two seconds of soft (low-passed) noise, shared by the wind and the one-shots
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < data.length; i++) {
      last = (last + 0.04 * (Math.random() * 2 - 1)) / 1.04;
      data[i] = last * 3.2;
    }
    this.noise = buffer;

    // Wind: looped noise, with a slow LFO breathing the filter
    const windSrc = ctx.createBufferSource();
    windSrc.buffer = buffer;
    windSrc.loop = true;
    const windFilter = ctx.createBiquadFilter();
    windFilter.type = 'lowpass';
    windFilter.frequency.value = 620;
    const windGain = ctx.createGain();
    windGain.gain.value = 0;
    windSrc.connect(windFilter).connect(windGain).connect(master);
    windSrc.start();
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.09;
    const lfoDepth = ctx.createGain();
    lfoDepth.gain.value = 240;
    lfo.connect(lfoDepth).connect(windFilter.frequency);
    lfo.start();
    this.wind = windGain;

    // Drone: two low, slightly detuned sines
    const droneGain = ctx.createGain();
    droneGain.gain.value = 0;
    const droneFilter = ctx.createBiquadFilter();
    droneFilter.type = 'lowpass';
    droneFilter.frequency.value = 420;
    [110, 164.8].forEach((freq, i) => {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = freq;
      o.detune.value = i ? 6 : -4;
      o.connect(droneFilter);
      o.start();
    });
    droneFilter.connect(droneGain).connect(master);
    this.drone = droneGain;
  }
}
