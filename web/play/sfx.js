/* ============================================================
   冷案印痕 · 音效引擎
   Web Audio 程序化实时合成（无需任何音频文件）
   - startup()  启动界面电影级音效：低频积蓄 → 上升扫频 → 冲击 → 星尘尾音
   - hover()    按钮悬停轻响
   - click()    按钮点击科技感音
   - back()/select()  返回 / 下拉切换
   - 菜单氛围底噪（ambient）
   ============================================================ */
const SFX = {
  ctx: null, master: null, comp: null,
  enabled: true, ready: false,
  ambNodes: null, ambGain: null,

  /* 初始化（需在用户手势后调用才能发声） */
  ensure() {
    if (this.ctx) { if (this.ctx.state === "suspended") this.ctx.resume(); return true; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    try {
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.enabled ? 0.9 : 0.0001;
      this.comp = this.ctx.createDynamicsCompressor();
      this.comp.threshold.value = -14; this.comp.knee.value = 24;
      this.comp.ratio.value = 8; this.comp.attack.value = 0.003; this.comp.release.value = 0.25;
      this.master.connect(this.comp);
      this.comp.connect(this.ctx.destination);
      this.ready = true;
    } catch (e) { return false; }
    return true;
  },

  setEnabled(on) {
    this.enabled = on;
    try { localStorage.setItem("illusion_sfx", on ? "1" : "0"); } catch (e) {}
    if (this.ctx && this.master) {
      this.master.gain.setTargetAtTime(on ? 0.9 : 0.0001, this.ctx.currentTime, 0.02);
    }
    if (!on) this.stopAmbient();
  },

  /* 振荡音：f0→f1 频率滑动 + 可选滤波器滑动 + 包络 */
  tone(o) {
    if (!this.ctx || !this.enabled) return;
    const t0 = this.ctx.currentTime + (o.delay || 0);
    const dur = o.dur || 0.2;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = o.type || "sine";
    osc.frequency.setValueAtTime(Math.max(1, o.f0), t0);
    if (o.f1) osc.frequency.exponentialRampToValueAtTime(Math.max(1, o.f1), t0 + dur);
    const peak = o.gain == null ? 0.22 : o.gain;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + (o.attack || 0.012));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    let node = osc;
    if (o.filter) {
      const f = this.ctx.createBiquadFilter();
      f.type = o.filter;
      f.Q.value = o.q || 1;
      f.frequency.setValueAtTime(Math.max(20, o.fF0 || 1200), t0);
      if (o.fF1) f.frequency.exponentialRampToValueAtTime(Math.max(20, o.fF1), t0 + dur);
      node.connect(f); node = f;
    }
    node.connect(g); g.connect(this.master);
    osc.start(t0); osc.stop(t0 + dur + 0.06);
  },

  /* 噪声层：打击感 / 气流质感 */
  noise(o) {
    if (!this.ctx || !this.enabled) return;
    const t0 = this.ctx.currentTime + (o.delay || 0);
    const dur = o.dur || 0.3;
    const len = Math.max(1, Math.ceil(this.ctx.sampleRate * dur));
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = this.ctx.createBufferSource(); src.buffer = buf;
    const f = this.ctx.createBiquadFilter();
    f.type = o.filter || "lowpass";
    f.frequency.setValueAtTime(Math.max(20, o.f0 || 900), t0);
    if (o.f1) f.frequency.exponentialRampToValueAtTime(Math.max(20, o.f1), t0 + dur);
    const g = this.ctx.createGain();
    const peak = o.gain == null ? 0.25 : o.gain;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(f); f.connect(g); g.connect(this.master);
    src.start(t0); src.stop(t0 + dur + 0.03);
  },

  /* ---- 交互音效 ---- */
  hover() {
    if (!this.ensure()) return;
    this.tone({ f0: 920, f1: 1380, type: "sine", dur: 0.08, gain: 0.05, filter: "bandpass", fF0: 1400, fF1: 2800, q: 2 });
  },
  click() {
    if (!this.ensure()) return;
    this.tone({ f0: 540, f1: 170, type: "triangle", dur: 0.16, gain: 0.15 });
    this.noise({ dur: 0.12, gain: 0.10, f0: 3200, f1: 500 });
    this.tone({ f0: 1240, f1: 1860, type: "sine", dur: 0.07, gain: 0.045, delay: 0.012 });
  },
  back() {
    if (!this.ensure()) return;
    this.tone({ f0: 440, f1: 210, type: "sine", dur: 0.18, gain: 0.11 });
  },
  select() {
    if (!this.ensure()) return;
    this.tone({ f0: 680, type: "sine", dur: 0.05, gain: 0.07 });
    this.tone({ f0: 1020, type: "sine", dur: 0.06, gain: 0.05, delay: 0.05 });
  },

  /* ---- 启动界面：电影级音效（约 2.5s） ---- */
  startup() {
    if (!this.ensure()) return;
    // 1) 低频能量积蓄
    this.tone({ f0: 52, f1: 88, type: "sine", dur: 1.15, gain: 0.5, attack: 0.06 });
    this.tone({ f0: 104, f1: 44, type: "sawtooth", dur: 1.25, gain: 0.07, filter: "lowpass", fF0: 320, fF1: 120 });
    // 2) 上升扫频（科技感）
    this.tone({ f0: 120, f1: 2300, type: "sawtooth", dur: 1.0, gain: 0.10, filter: "lowpass", fF0: 520, fF1: 7200, attack: 0.32 });
    this.tone({ f0: 240, f1: 4600, type: "square", dur: 0.9, gain: 0.028, filter: "bandpass", fF0: 900, fF1: 6200, q: 3, attack: 0.34 });
    // 3) 冲击点
    this.noise({ delay: 1.0, dur: 0.5, gain: 0.26, f0: 1400, f1: 120 });
    this.tone({ delay: 1.0, f0: 170, f1: 42, type: "sine", dur: 0.62, gain: 0.48 });
    // 4) 星尘尾音
    [1244, 1661, 2217, 3329].forEach((f, i) => {
      this.tone({ delay: 1.06 + i * 0.07, f0: f, f1: f * 1.012, type: "triangle", dur: 1.4, gain: 0.06, attack: 0.02 });
    });
    this.tone({ delay: 1.1, f0: 3000, f1: 520, type: "sine", dur: 0.5, gain: 0.045 });
  },

  /* ---- 菜单氛围底噪 ---- */
  startAmbient() {
    if (!this.ensure() || !this.enabled || this.ambNodes) return;
    const ctx = this.ctx;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.16, ctx.currentTime + 2.5);
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass"; lp.frequency.value = 620;
    g.connect(this.master);
    const nodes = [];
    // 双层低频嗡鸣（缓慢失谐）
    [[55, 0], [82.5, 0.35]].forEach(([f, det]) => {
      const o = ctx.createOscillator(); o.type = "sine"; o.frequency.value = f;
      const og = ctx.createGain(); og.gain.value = 0.5;
      o.connect(og); og.connect(lp); o.start(); nodes.push(o);
    });
    // 缓慢 LFO 让底噪呼吸
    const lfo = ctx.createOscillator(); lfo.type = "sine"; lfo.frequency.value = 0.12;
    const lfoG = ctx.createGain(); lfoG.gain.value = 0.35;
    lfo.connect(lfoG); lfoG.connect(g.gain); lfo.start(); nodes.push(lfo);
    // 极轻的气流噪声
    const len = Math.ceil(ctx.sampleRate * 2);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * 0.5;
    const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
    const nf = ctx.createBiquadFilter(); nf.type = "bandpass"; nf.frequency.value = 420; nf.Q.value = 0.6;
    const ng = ctx.createGain(); ng.gain.value = 0.05;
    src.connect(nf); nf.connect(ng); ng.connect(lp); src.start(); nodes.push(src);
    lp.connect(g);
    this.ambNodes = nodes; this.ambGain = g;
  },
  stopAmbient() {
    if (!this.ambNodes || !this.ctx) return;
    const t = this.ctx.currentTime;
    try { this.ambGain.gain.setTargetAtTime(0.0001, t, 0.25); } catch (e) {}
    const nodes = this.ambNodes;
    setTimeout(() => nodes.forEach(n => { try { n.stop(); } catch (e) {} }), 1400);
    this.ambNodes = null; this.ambGain = null;
  },
};
