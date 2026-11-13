/* ============================================================
   冷案印痕 — BGM 引擎
   Web Audio 程序化作曲：黑色侦探氛围循环
   · D 小调 92BPM，四和弦循环 Dm – Bb – F – A
   · 合成器 Pad（失谐锯齿+低通+LFO）/  sub 贝斯 / 16 分琶音
   · 鼓组（底鼓+拍手+踩镲）/ 结尾升腾 Riser
   · 合成混响（Convolver 生成 IR）+ 附点八分延迟
   无缝循环，进入/离开自动淡入淡出
   ============================================================ */
const BGM = {
  ctx: null, master: null, comp: null,
  padBus: null, pluckBus: null, drumBus: null, bassBus: null,
  delay: null, delayGain: null, revSend: null,
  playing: false, muted: false,
  timer: null, step: 0, nextTime: 0, noiseBuf: null,
  bpm: 92, baseLevel: "menu", ducked: false, muted: false,

  mtof(m) { return 440 * Math.pow(2, (m - 69) / 12); },

  /* 和弦进行：i – VI – III – V（D 小调） */
  CHORDS: [
    { bass: 38, tones: [50, 53, 57] },   // Dm
    { bass: 34, tones: [46, 50, 53] },   // Bb
    { bass: 41, tones: [53, 57, 60] },   // F
    { bass: 45, tones: [57, 61, 64] },   // A
  ],

  ensure() {
    if (this.ctx) { if (this.ctx.state === "suspended") this.ctx.resume(); return true; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    try {
      const ctx = this.ctx = new AC();

      // ---- 主输出链 ----
      this.master = ctx.createGain();
      this.master.gain.value = 0.0001;
      this.comp = ctx.createDynamicsCompressor();
      this.comp.threshold.value = -16; this.comp.knee.value = 26;
      this.comp.ratio.value = 6; this.comp.attack.value = 0.004; this.comp.release.value = 0.28;
      this.master.connect(this.comp);
      this.comp.connect(ctx.destination);

      // ---- 合成混响（噪声指数衰减 IR）----
      const conv = ctx.createConvolver();
      const rate = ctx.sampleRate, len = Math.floor(rate * 2.6);
      const ir = ctx.createBuffer(2, len, rate);
      for (let c = 0; c < 2; c++) {
        const d = ir.getChannelData(c);
        for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.4);
      }
      conv.buffer = ir;
      this.revSend = ctx.createGain(); this.revSend.gain.value = 0.5;
      this.revSend.connect(conv); conv.connect(this.master);

      // ---- 附点八分延迟（给琶音加空间）----
      const s16 = 60 / this.bpm / 4;
      this.delay = ctx.createDelay(2.0);
      this.delay.delayTime.value = s16 * 3;
      const fb = ctx.createGain(); fb.gain.value = 0.34;
      const dlp = ctx.createBiquadFilter(); dlp.type = "lowpass"; dlp.frequency.value = 2400;
      this.delay.connect(dlp); dlp.connect(fb); fb.connect(this.delay);
      this.delayGain = ctx.createGain(); this.delayGain.gain.value = 0.5;
      this.delayGain.connect(this.delay); this.delay.connect(this.master);

      // ---- 分轨总线 ----
      this.padBus = ctx.createGain(); this.padBus.gain.value = 0.9;
      this.padBus.connect(this.master); this.padBus.connect(this.revSend);
      this.pluckBus = ctx.createGain(); this.pluckBus.gain.value = 1.0;
      this.pluckBus.connect(this.master); this.pluckBus.connect(this.delayGain); this.pluckBus.connect(this.revSend);
      this.drumBus = ctx.createGain(); this.drumBus.gain.value = 0.85;
      this.drumBus.connect(this.master);
      this.bassBus = ctx.createGain(); this.bassBus.gain.value = 1.0;
      this.bassBus.connect(this.master);

      // ---- 预生成噪声缓冲（鼓组复用）----
      const nlen = Math.floor(rate * 1.0);
      const nb = ctx.createBuffer(1, nlen, rate);
      const nd = nb.getChannelData(0);
      for (let i = 0; i < nlen; i++) nd[i] = Math.random() * 2 - 1;
      this.noiseBuf = nb;
      return true;
    } catch (e) { return false; }
  },

  /* ---------------- 音色 ---------------- */
  pad(t, midis, dur) {
    const ctx = this.ctx;
    midis.forEach(m => {
      const f = this.mtof(m);
      [-7, 7].forEach(det => {
        const o = ctx.createOscillator(); o.type = "sawtooth";
        o.frequency.value = f; o.detune.value = det;
        const lp = ctx.createBiquadFilter(); lp.type = "lowpass";
        lp.frequency.setValueAtTime(500, t);
        lp.frequency.linearRampToValueAtTime(900, t + dur * 0.5);
        lp.frequency.linearRampToValueAtTime(520, t + dur);
        lp.Q.value = 0.9;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(0.05, t + dur * 0.35);
        g.gain.linearRampToValueAtTime(0.0001, t + dur);
        o.connect(lp); lp.connect(g); g.connect(this.padBus);
        o.start(t); o.stop(t + dur + 0.15);
      });
    });
  },
  bass(t, midi, dur) {
    const ctx = this.ctx, f = this.mtof(midi);
    const o = ctx.createOscillator(); o.type = "sine"; o.frequency.value = f;
    const o2 = ctx.createOscillator(); o2.type = "triangle"; o2.frequency.value = f * 2;
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 190; lp.Q.value = 1.2;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.30, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); o2.connect(g); g.connect(lp); lp.connect(this.bassBus);
    o.start(t); o.stop(t + dur + 0.05); o2.start(t); o2.stop(t + dur + 0.05);
  },
  pluck(t, midi) {
    const ctx = this.ctx;
    const o = ctx.createOscillator(); o.type = "triangle";
    o.frequency.setValueAtTime(this.mtof(midi), t);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.13, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.34);
    const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 320;
    o.connect(hp); hp.connect(g); g.connect(this.pluckBus);
    o.start(t); o.stop(t + 0.38);
  },
  noise(t, o) {
    const ctx = this.ctx;
    const src = ctx.createBufferSource(); src.buffer = this.noiseBuf;
    const f = ctx.createBiquadFilter();
    f.type = o.type || "lowpass"; f.Q.value = o.q || 1;
    f.frequency.setValueAtTime(o.f0, t);
    if (o.f1) f.frequency.exponentialRampToValueAtTime(Math.max(30, o.f1), t + o.dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(o.gain, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);
    src.connect(f); f.connect(g); g.connect(this.drumBus);
    src.start(t, Math.random() * 0.3); src.stop(t + o.dur + 0.03);
  },
  kick(t) {
    const ctx = this.ctx;
    const o = ctx.createOscillator(); o.type = "sine";
    o.frequency.setValueAtTime(150, t);
    o.frequency.exponentialRampToValueAtTime(44, t + 0.13);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.55, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
    o.connect(g); g.connect(this.drumBus);
    o.start(t); o.stop(t + 0.34);
  },
  clap(t) { this.noise(t, { dur: 0.17, gain: 0.17, type: "bandpass", f0: 1700, f1: 1100, q: 1.3 }); },
  hat(t, open) { this.noise(t, { dur: open ? 0.2 : 0.05, gain: open ? 0.1 : 0.07, type: "highpass", f0: 7600, f1: 5200 }); },
  riser(t, dur) {
    this.noise(t, { dur, gain: 0.09, type: "bandpass", f0: 500, f1: 6500, q: 2.2 });
    const ctx = this.ctx;
    const o = ctx.createOscillator(); o.type = "sawtooth";
    o.frequency.setValueAtTime(220, t);
    o.frequency.exponentialRampToValueAtTime(1760, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.05, t + dur * 0.9);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 3000;
    o.connect(lp); lp.connect(g); g.connect(this.padBus);
    o.start(t); o.stop(t + dur + 0.05);
  },

  /* ---------------- 节拍调度（前瞻调度保证时序精准） ---------------- */
  playStep(step, t) {
    const s16 = 60 / this.bpm / 4;
    const bar = Math.floor(step / 16) % 4;
    const s = step % 16;
    const ch = this.CHORDS[bar];

    // 铺底 + 贝斯（每小节头）
    if (s === 0) {
      this.pad(t, ch.tones, s16 * 15);
      this.bass(t, ch.bass, s16 * 5);
    }
    if (s === 6) this.bass(t, ch.bass, s16 * 3);
    if (s === 11 && bar % 2 === 1) this.bass(t, ch.bass + 12, s16 * 2);

    // 16 分琶音（稀疏+加花）
    const arp = [0, 2, 3, 5, 8, 10, 11, 13, 14];
    if (arp.includes(s)) {
      const idx = (Math.floor(step / 3) + bar) % 3;
      const oct = (s === 6 || s === 14) ? 12 : 0;
      this.pluck(t, ch.tones[idx] + 12 + oct);
    }
    // 鼓组
    if (s === 0 || s === 6 || s === 10) this.kick(t);
    if (s === 4 || s === 12) this.clap(t);
    if (s % 2 === 0) this.hat(t, s === 14);
    // 第三小节尾部升腾
    if (bar === 2 && s === 12) this.riser(t, s16 * 4);
  },
  scheduler() {
    const s16 = 60 / this.bpm / 4;
    while (this.nextTime < this.ctx.currentTime + 0.25) {
      this.playStep(this.step, this.nextTime);
      this.nextTime += s16;
      this.step = (this.step + 1) % 64;
    }
  },

  /* ---------------- 控制 ---------------- */
  targetVol() {
    if (!this.playing || this.muted) return 0.0001;
    if (this.ducked) return 0.07;                       // 旁白期间压低
    return this.baseLevel === "game" ? 0.19 : 0.38;     // 游戏中 / 菜单
  },
  applyVol(fade) {
    if (!this.ctx || !this.master) return;
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(Math.max(0.0001, this.master.gain.value), now);
    this.master.gain.linearRampToValueAtTime(this.targetVol(), now + (fade || 0.6));
  },
  start() {
    if (!this.ensure()) return false;
    if (this.playing) { this.applyVol(0.6); return true; }
    this.ctx.resume();
    this.playing = true;
    this.step = 0;
    this.nextTime = this.ctx.currentTime + 0.12;
    this.master.gain.cancelScheduledValues(this.ctx.currentTime);
    this.master.gain.setValueAtTime(0.0001, this.ctx.currentTime);
    this.applyVol(1.6);           // 淡入
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => this.scheduler(), 60);
    return true;
  },
  stop(fade) {
    if (!this.playing) return;
    this.playing = false;
    this.applyVol(fade == null ? 0.9 : fade);
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
  },
  setLevel(l) { this.baseLevel = l; if (this.playing) this.applyVol(0.5); },
  duck(on) { this.ducked = !!on; if (this.playing) this.applyVol(0.4); },
  setMuted(on) {
    this.muted = on;
    try { localStorage.setItem("illusion_bgm", on ? "0" : "1"); } catch (e) {}
    if (on) this.stop(0.5); else this.start();
  },
  /* 尝试自动播放（浏览器允许时直接出声） */
  autoplay() {
    if (!this.ensure()) return false;
    this.ctx.resume();
    const ok = this.start();
    setTimeout(() => {
      if (this.ctx.state !== "running" && this.playing) this.stop(0.3);
    }, 500);
    return ok && this.ctx.state === "running";
  },
};
