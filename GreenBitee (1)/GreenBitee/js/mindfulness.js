// Mindfulness page interactions: breathing animation, session timer, ambient sounds, and session tracking
(function(){
  const onReady = (fn) => (window.GB && GB.onReady) ? GB.onReady(fn) : (document.readyState==='loading' ? document.addEventListener('DOMContentLoaded', fn, {once:true}) : fn());

  const storageKey = 'gb_mind_sessions';
  const loadCount = () => { try { return Number(localStorage.getItem(storageKey) || '0'); } catch(_) { return 0; } };
  const saveCount = (n) => { try { localStorage.setItem(storageKey, String(n)); } catch(_) {} };

  // ---------- Breathing Animation ----------
  function setupBreathing() {
    const circle = document.querySelector('.breathing-circle');
    const label = document.getElementById('breathing-text');
    if (!circle || !label) return;

    const phaseMs = 4000; // 4s inhale, 4s hold, 4s exhale (12s cycle)
    circle.style.transition = 'transform 4s ease-in-out, box-shadow 800ms ease';
    circle.style.width = circle.style.width || '160px';
    circle.style.height = circle.style.height || '160px';
    circle.style.borderRadius = '50%';

    let phase = 0; // 0: inhale, 1: hold, 2: exhale
    const setPhase = () => {
      if (phase === 0) { // inhale
        label.textContent = 'Inhale…';
        circle.style.transform = 'scale(1.2)';
        circle.style.boxShadow = '0 0 30px rgba(22,163,74,0.4)';
      } else if (phase === 1) { // hold
        label.textContent = 'Hold…';
        // keep current scale
      } else { // exhale
        label.textContent = 'Exhale…';
        circle.style.transform = 'scale(1.0)';
        circle.style.boxShadow = '0 0 10px rgba(22,163,74,0.2)';
      }
    };
    setPhase();

    setInterval(() => {
      phase = (phase + 1) % 3;
      setPhase();
    }, phaseMs);
  }

  // ---------- Session Timer (Pomodoro/Meditation) ----------
  function setupTimer() {
    const tool = document.querySelector('.timer-tool');
    const display = tool?.querySelector('.timer-display');
    const buttons = tool?.querySelectorAll('button');
    if (!tool || !display || !buttons || buttons.length < 3) return;

    const [startBtn, pauseBtn, resetBtn] = buttons; // assuming order Start, Pause, Reset

    let total = 25 * 60; // 25:00 default
    let remaining = total;
    let running = false;
    let last = 0;
    let rafId = null;

    const fmt = (s) => {
      const m = Math.floor(s / 60).toString().padStart(2, '0');
      const sec = Math.floor(s % 60).toString().padStart(2, '0');
      return `${m}:${sec}`;
    };

    const render = () => { display.textContent = fmt(remaining); };
    render();

    const tick = (ts) => {
      if (!running) return;
      if (!last) last = ts;
      const dt = (ts - last) / 1000;
      if (dt >= 1) {
        remaining = Math.max(0, remaining - Math.floor(dt));
        last = ts;
        render();
        if (remaining <= 0) {
          running = false;
          rafId = null;
          // Increment completed sessions
          const newCount = loadCount() + 1;
          saveCount(newCount);
          const counter = document.getElementById('session-count');
          if (counter) counter.textContent = `You have completed ${newCount} sessions`;
          // Soft chime
          try {
            const ctx = new (window.AudioContext||window.webkitAudioContext)();
            const o = ctx.createOscillator(); const g = ctx.createGain();
            o.type = 'sine'; o.frequency.value = 660; o.connect(g); g.connect(ctx.destination);
            o.start(); g.gain.setValueAtTime(0.0001, ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.01);
            g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
            o.stop(ctx.currentTime + 0.42);
          } catch(_) {}
          if (window.GB && GB.showToast) GB.showToast('Session complete');
          return;
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    const start = () => { if (running) return; running = true; last = 0; rafId = requestAnimationFrame(tick); };
    const pause = () => { running = false; if (rafId) cancelAnimationFrame(rafId); rafId = null; };
    const reset = () => { pause(); remaining = total; render(); };

    startBtn.addEventListener('click', start);
    pauseBtn.addEventListener('click', pause);
    resetBtn.addEventListener('click', reset);

    // Load existing count
    const counter = document.getElementById('session-count');
    if (counter) counter.textContent = `You have completed ${loadCount()} sessions`;
  }

  // ---------- Ambient Sounds (toggle buttons) ----------
  function setupAmbient() {
    const soundsSection = document.querySelector('.sounds');
    if (!soundsSection) return;
    const btns = Array.from(soundsSection.querySelectorAll('button'));
    if (!btns.length) return;

    let ctx; let nodes = {};

    const ensureCtx = () => { ctx = ctx || new (window.AudioContext||window.webkitAudioContext)(); return ctx; };

    const stopAll = () => {
      Object.values(nodes).forEach(n => { try { n.stop?.(); n.disconnect?.(); } catch(_){} });
      nodes = {};
    };

    const toggle = (type, btn) => {
      const ac = ensureCtx();
      // Stop if already playing
      if (nodes[type]) { stopAll(); btn.setAttribute('aria-pressed', 'false'); btn.style.opacity = '1'; return; }
      stopAll(); btns.forEach(b=>{ b.setAttribute('aria-pressed','false'); b.style.opacity='1'; });
      btn.setAttribute('aria-pressed','true'); btn.style.opacity='0.8';
      if (type === 'ocean') {
        // Pink-noise like surf via filtered noise + slow LFO
        const bufferSize = 2 * ac.sampleRate;
        const noiseBuffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i=0; i<bufferSize; i++) { output[i] = (Math.random()*2-1); }
        const noise = ac.createBufferSource(); noise.buffer = noiseBuffer; noise.loop = true;
        const filt = ac.createBiquadFilter(); filt.type='lowpass'; filt.frequency.value=800;
        const gain = ac.createGain(); gain.gain.value = 0.15;
        noise.connect(filt); filt.connect(gain); gain.connect(ac.destination);
        noise.start(); nodes[type] = noise;
      } else if (type === 'rain') {
        // White noise with highpass for hiss
        const bufferSize = 2 * ac.sampleRate;
        const noiseBuffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i=0; i<bufferSize; i++) { output[i] = (Math.random()*2-1); }
        const noise = ac.createBufferSource(); noise.buffer = noiseBuffer; noise.loop = true;
        const hp = ac.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=1000;
        const gain = ac.createGain(); gain.gain.value = 0.08;
        noise.connect(hp); hp.connect(gain); gain.connect(ac.destination);
        noise.start(); nodes[type] = noise;
      } else {
        // Soft music: simple detuned triad
        const gain = ac.createGain(); gain.gain.value = 0.04; gain.connect(ac.destination);
        const mkOsc = (f) => { const o = ac.createOscillator(); o.type='sine'; o.frequency.value=f; o.connect(gain); o.start(); return o; };
        const a = mkOsc(261.63); // C4
        const b = mkOsc(329.63); // E4
        const c = mkOsc(392.00); // G4
        nodes[type] = { stop: ()=>{ [a,b,c].forEach(o=>o.stop()); gain.disconnect(); } };
      }
    };

    // Map buttons by text content
    btns.forEach((btn) => {
      const txt = btn.textContent.toLowerCase();
      if (txt.includes('ocean')) btn.addEventListener('click', ()=>toggle('ocean', btn));
      else if (txt.includes('rain')) btn.addEventListener('click', ()=>toggle('rain', btn));
      else btn.addEventListener('click', ()=>toggle('music', btn));
    });
  }

  onReady(() => {
    setupBreathing();
    setupTimer();
    setupAmbient();
  });
})();
