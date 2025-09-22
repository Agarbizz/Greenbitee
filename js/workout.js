// Workout page: data-driven generator with localStorage and small interactions
(function(){
  const onReady = (fn) => (window.GB && GB.onReady) ? GB.onReady(fn) : (document.readyState==='loading' ? document.addEventListener('DOMContentLoaded', fn, {once:true}) : fn());

  // Dataset of exercises by body part and equipment
  const WORKOUTS = {
    arms: {
      none: [
        { name: 'Push-ups', sets: 3, reps: '10-15' },
        { name: 'Diamond Push-ups', sets: 3, reps: '8-12' },
        { name: 'Tricep Dips (bench/chair)', sets: 3, reps: '10-12' }
      ],
      dumbbells: [
        { name: 'Bicep Curls', sets: 3, reps: '12' },
        { name: 'Tricep Kickbacks', sets: 3, reps: '12' },
        { name: 'Hammer Curls', sets: 3, reps: '12' }
      ],
      'resistance-band': [
        { name: 'Band Curls', sets: 3, reps: '15' },
        { name: 'Band Tricep Extensions', sets: 3, reps: '15' },
        { name: 'Band Rows (narrow)', sets: 3, reps: '12-15' }
      ]
    },
    legs: {
      none: [
        { name: 'Squats', sets: 3, reps: '15' },
        { name: 'Lunges', sets: 3, reps: '10/leg' },
        { name: 'Glute Bridges', sets: 3, reps: '15' }
      ],
      dumbbells: [
        { name: 'Goblet Squats', sets: 4, reps: '12' },
        { name: 'DB Romanian Deadlifts', sets: 3, reps: '12' },
        { name: 'DB Lunges', sets: 3, reps: '10/leg' }
      ],
      'resistance-band': [
        { name: 'Band Squats', sets: 4, reps: '15' },
        { name: 'Band Walks', sets: 3, reps: '12 steps' },
        { name: 'Band Hip Thrusts', sets: 3, reps: '15' }
      ]
    },
    fullbody: {
      none: [
        { name: 'Burpees', sets: 3, reps: '10' },
        { name: 'Mountain Climbers', sets: 3, reps: '30s' },
        { name: 'Plank', sets: 3, reps: '30-45s' }
      ],
      dumbbells: [
        { name: 'DB Thrusters', sets: 3, reps: '10' },
        { name: 'Renegade Rows', sets: 3, reps: '10' },
        { name: 'DB Swings', sets: 3, reps: '15' }
      ],
      'resistance-band': [
        { name: 'Band Squat to Press', sets: 3, reps: '12' },
        { name: 'Band Rows', sets: 3, reps: '15' },
        { name: 'Band Deadlifts', sets: 3, reps: '12' }
      ]
    },
    core: {
      none: [
        { name: 'Plank', sets: 3, reps: '45s' },
        { name: 'Bicycle Crunches', sets: 3, reps: '20' },
        { name: 'Leg Raises', sets: 3, reps: '12-15' }
      ],
      dumbbells: [
        { name: 'DB Russian Twists', sets: 3, reps: '20' },
        { name: 'DB Side Bends', sets: 3, reps: '15/side' },
        { name: 'DB Dead Bug', sets: 3, reps: '12' }
      ],
      'resistance-band': [
        { name: 'Band Pallof Press', sets: 3, reps: '12/side' },
        { name: 'Band Woodchoppers', sets: 3, reps: '12/side' },
        { name: 'Band Crunches', sets: 3, reps: '15' }
      ]
    }
  };

  const keySaved = 'gb_saved_workouts';

  onReady(() => {
    const form = document.getElementById('workout-generator');
    const container = document.getElementById('plan-container');
    if (!form || !container) return;

    // Hide the legacy standalone timer section without editing HTML/CSS files
    const legacyTimer = document.querySelector('.timer-section');
    if (legacyTimer) legacyTimer.style.display = 'none';

    const renderPlan = (exs) => {
      container.innerHTML = '';
      const list = document.createElement('ul');
      list.style.paddingLeft = '18px';
      exs.forEach((ex) => {
        const li = document.createElement('li');
        // Row container to hold title + timer cluster
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.alignItems = 'center';
        row.style.justifyContent = 'space-between';
        row.style.gap = '10px';

        const title = document.createElement('div');
        title.textContent = `${ex.name} — ${ex.sets} sets × ${ex.reps}`;

        // Timer cluster
        const controls = document.createElement('div');
        controls.style.display = 'flex';
        controls.style.alignItems = 'center';
        controls.style.gap = '6px';

        const timeLabel = document.createElement('span');
        timeLabel.textContent = '30s';
        // Style like the provided .timer box
        timeLabel.style.display = 'inline-block';
        timeLabel.style.minWidth = '120px';
        timeLabel.style.textAlign = 'center';
        timeLabel.style.fontVariantNumeric = 'tabular-nums';
        timeLabel.style.fontSize = '3rem';
        timeLabel.style.fontWeight = '700';
        timeLabel.style.border = '3px solid #000';
        timeLabel.style.padding = '1.5rem';
        timeLabel.style.borderRadius = '12px';
        timeLabel.style.marginBottom = '0.25rem';
        timeLabel.style.boxShadow = '6px 6px 0 #16a34a';

        const startBtn = document.createElement('button');
        startBtn.textContent = 'Start';
        // Style like #start-timer
        startBtn.style.padding = '0.8rem 1.5rem';
        startBtn.style.border = '3px solid #000';
        startBtn.style.background = '#16a34a';
        startBtn.style.color = '#fff';
        startBtn.style.fontWeight = '700';
        startBtn.style.borderRadius = '8px';
        startBtn.style.cursor = 'pointer';
        startBtn.style.transition = 'transform 0.2s ease, background 0.2s ease';
        startBtn.addEventListener('mouseenter', () => { startBtn.style.background = '#065f46'; startBtn.style.transform = 'scale(1.05)'; });
        startBtn.addEventListener('mouseleave', () => { startBtn.style.background = '#16a34a'; startBtn.style.transform = 'none'; });

        const pauseBtn = document.createElement('button');
        pauseBtn.textContent = 'Pause';
        pauseBtn.style.border = '1px solid #ddd';
        pauseBtn.style.borderRadius = '6px';
        pauseBtn.style.padding = '4px 8px';
        pauseBtn.style.cursor = 'pointer';

        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Reset';
        resetBtn.style.border = '1px solid #ddd';
        resetBtn.style.borderRadius = '6px';
        resetBtn.style.padding = '4px 8px';
        resetBtn.style.cursor = 'pointer';

        controls.appendChild(timeLabel);
        controls.appendChild(startBtn);
        controls.appendChild(pauseBtn);
        controls.appendChild(resetBtn);

        // Progress bar
        const track = document.createElement('div');
        track.style.height = '6px';
        track.style.borderRadius = '999px';
        track.style.background = '#eee';
        track.style.overflow = 'hidden';
        track.style.marginTop = '6px';
        const fill = document.createElement('div');
        fill.style.height = '100%';
        fill.style.width = '0%';
        fill.style.background = '#66bb6a';
        fill.style.transition = 'width 100ms linear';
        track.appendChild(fill);

        // hover micro-animation on the li
        li.style.transition = 'transform 120ms ease';
        li.addEventListener('mouseenter', () => li.style.transform = 'translateX(4px)');
        li.addEventListener('mouseleave', () => li.style.transform = 'none');

        // Assemble
        row.appendChild(title);
        row.appendChild(controls);
        li.appendChild(row);
        li.appendChild(track);
        list.appendChild(li);

        // Timer logic (30 seconds)
        let duration = 30;
        let remaining = duration;
        let running = false;
        let lastTick = 0;
        let rafId = null;
        const updateLabel = () => { timeLabel.textContent = `${remaining}s`; };
        const setFill = () => { fill.style.width = `${100 * (1 - remaining / duration)}%`; };

        const beep = () => {
          try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.type = 'sine';
            o.frequency.value = 880;
            o.connect(g); g.connect(ctx.destination);
            o.start();
            g.gain.setValueAtTime(0.001, ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.01);
            g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
            o.stop(ctx.currentTime + 0.16);
          } catch (_) {}
        };

        const step = (ts) => {
          if (!running) return;
          if (!lastTick) lastTick = ts;
          const dt = (ts - lastTick) / 1000;
          if (dt >= 1) {
            remaining = Math.max(0, remaining - Math.floor(dt));
            lastTick = ts;
            updateLabel();
            setFill();
            if (remaining <= 0) {
              running = false; rafId = null; beep();
              li.style.background = '#f0fff0';
              if (window.GB && GB.showToast) GB.showToast(`${ex.name} done!`);
              return;
            }
          }
          rafId = requestAnimationFrame(step);
        };

        const start = () => {
          if (running) return;
          running = true;
          lastTick = 0;
          rafId = requestAnimationFrame(step);
        };
        const pause = () => { running = false; if (rafId) cancelAnimationFrame(rafId); rafId = null; };
        const reset = () => { pause(); remaining = duration; updateLabel(); setFill(); li.style.background = ''; };
        updateLabel(); setFill();

        startBtn.addEventListener('click', start);
        pauseBtn.addEventListener('click', pause);
        resetBtn.addEventListener('click', reset);
      });
      container.appendChild(list);

      const actions = document.createElement('div');
      actions.style.marginTop = '12px';
      const saveBtn = document.createElement('button');
      saveBtn.textContent = 'Save Plan';
      saveBtn.style.border = '1px solid #ddd';
      saveBtn.style.borderRadius = '8px';
      saveBtn.style.padding = '8px 12px';
      saveBtn.style.cursor = 'pointer';
      saveBtn.addEventListener('click', () => {
        const bp = document.getElementById('body-part')?.value || 'unknown';
        const eq = document.getElementById('equipment')?.value || 'unknown';
        const entry = { when: new Date().toISOString(), bodyPart: bp, equipment: eq, items: exs };
        const current = (window.GB && GB.loadList) ? GB.loadList(keySaved) : (JSON.parse(localStorage.getItem(keySaved) || '[]'));
        current.push(entry);
        if (window.GB && GB.saveList) GB.saveList(keySaved, current); else localStorage.setItem(keySaved, JSON.stringify(current));
        if (window.GB && GB.showToast) GB.showToast('Workout plan saved'); else alert('Workout plan saved');
      });
      actions.appendChild(saveBtn);
      container.appendChild(actions);
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const body = document.getElementById('body-part')?.value || 'arms';
      const equip = document.getElementById('equipment')?.value || 'none';
      const pool = WORKOUTS[body]?.[equip] || [];
      // Randomly select up to 5 unique exercises from the pool (or all if fewer)
      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      const pickCount = Math.min(5, shuffled.length);
      const plan = shuffled.slice(0, pickCount);
      if (!plan.length) {
        container.innerHTML = '<p>No workout generated. Adjust selections.</p>';
        return;
      }
      renderPlan(plan);
      if (window.GB && GB.showToast) GB.showToast('Workout generated');
    });
  });
})();
