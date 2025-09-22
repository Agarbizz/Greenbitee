// Calorie & Nutrition Calculator (no HTML/CSS file edits)
// - Injects calculator fields (age, gender, height, weight, activity)
// - Computes BMR, TDEE, and macronutrients (50/20/30)
// - Displays animated counters and simple inline progress bars
(function () {
  const onReady = (fn) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  };

  const ACTIVITY_LEVELS = [
    { label: 'Sedentary — Little or no exercise', value: 'sedentary', factor: 1.2 },
    { label: 'Lightly active — Light exercise 1–3 days/week', value: 'light', factor: 1.375 },
    { label: 'Moderately active — Exercise 3–5 days/week', value: 'moderate', factor: 1.55 },
    { label: 'Very active — Hard exercise 6–7 days/week', value: 'very', factor: 1.725 },
    { label: 'Super active — Very hard exercise/physical job', value: 'super', factor: 1.9 },
  ];

  const fmt = (n, decimals = 0) => {
    return Number(n).toLocaleString(undefined, { maximumFractionDigits: decimals, minimumFractionDigits: decimals });
  };

  const animateNumber = (el, from, to, durationMs = 800, decimals = 0) => {
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / durationMs);
      const val = from + (to - from) * t;
      el.textContent = fmt(val, decimals);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const build = () => {
    const section = document.querySelector('.calculator');
    const form = document.querySelector('.calculator form');
    const results = document.querySelector('.calculator .results');
    if (!section || !form || !results) return;

    // Replace the form content with required fields (DOM-only, no HTML file change)
    form.innerHTML = '';

    const mkLabel = (forId, text) => {
      const lbl = document.createElement('label');
      lbl.setAttribute('for', forId);
      lbl.textContent = text;
      return lbl;
    };
    const mkInput = (id, type, placeholder, attrs = {}) => {
      const inp = document.createElement('input');
      inp.id = id; inp.type = type; inp.placeholder = placeholder;
      Object.assign(inp, attrs);
      return inp;
    };
    const mkSelect = (id, options) => {
      const sel = document.createElement('select');
      sel.id = id;
      options.forEach(({ value, label }) => {
        const opt = document.createElement('option');
        opt.value = value; opt.textContent = label;
        sel.appendChild(opt);
      });
      return sel;
    };

    // Age
    form.appendChild(mkLabel('age', 'Age (years)'));
    form.appendChild(mkInput('age', 'number', 'e.g. 25', { required: true, min: 0 }));

    // Gender
    form.appendChild(mkLabel('gender', 'Gender'));
    const gender = mkSelect('gender', [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' }
    ]);
    form.appendChild(gender);

    // Height
    form.appendChild(mkLabel('height', 'Height (cm)'));
    form.appendChild(mkInput('height', 'number', 'e.g. 175', { required: true, min: 0 }));

    // Weight
    form.appendChild(mkLabel('weight', 'Weight (kg)'));
    form.appendChild(mkInput('weight', 'number', 'e.g. 70', { required: true, min: 0 }));

    // Activity
    form.appendChild(mkLabel('activity', 'Activity Level'));
    const act = mkSelect('activity', ACTIVITY_LEVELS.map(({ value, label }) => ({ value, label })));
    form.appendChild(act);

    // Submit button
    const btn = document.createElement('button');
    btn.type = 'submit';
    btn.textContent = 'Calculate';
    form.appendChild(btn);

    // Prepare results area
    results.innerHTML = '';

    const cards = document.createElement('div');
    cards.style.display = 'grid';
    cards.style.gridTemplateColumns = 'repeat(auto-fit, minmax(220px, 1fr))';
    cards.style.gap = '16px';

    const mkCard = (title) => {
      const c = document.createElement('div');
      c.style.border = '1px solid #eee';
      c.style.borderRadius = '12px';
      c.style.padding = '16px';
      c.style.background = '#fff';
      const h = document.createElement('h3'); h.textContent = title; h.style.marginTop = '0';
      const val = document.createElement('div'); val.style.fontSize = '24px'; val.style.fontWeight = '700';
      c.appendChild(h); c.appendChild(val);
      return { card: c, valueEl: val };
    };

    const bmrC = mkCard('BMR (kcal/day)');
    const tdeeC = mkCard('TDEE (kcal/day)');
    cards.appendChild(bmrC.card);
    cards.appendChild(tdeeC.card);

    // Macro container
    const macrosBox = document.createElement('div');
    macrosBox.style.marginTop = '12px';
    macrosBox.style.border = '1px solid #eee';
    macrosBox.style.borderRadius = '12px';
    macrosBox.style.padding = '16px';
    const macrosTitle = document.createElement('h3'); macrosTitle.textContent = 'Macronutrient Breakdown'; macrosTitle.style.marginTop = '0';

    // Progress bar (percentage-based)
    const barTrack = document.createElement('div');
    barTrack.style.height = '12px';
    barTrack.style.borderRadius = '999px';
    barTrack.style.background = '#f1f1f1';
    barTrack.style.overflow = 'hidden';
    barTrack.style.display = 'flex';

    const seg = (color, widthPct) => {
      const d = document.createElement('div');
      d.style.background = color;
      d.style.width = widthPct + '%';
      d.style.transition = 'width 600ms ease';
      return d;
    };

    const carbsSeg = seg('#66bb6a', 0);
    const proteinSeg = seg('#42a5f5', 0);
    const fatsSeg = seg('#ffa726', 0);
    barTrack.appendChild(carbsSeg);
    barTrack.appendChild(proteinSeg);
    barTrack.appendChild(fatsSeg);

    const macroList = document.createElement('ul');
    macroList.style.marginTop = '12px';

    macrosBox.appendChild(macrosTitle);
    macrosBox.appendChild(barTrack);
    macrosBox.appendChild(macroList);

    results.appendChild(cards);
    results.appendChild(macrosBox);

    // Calculation helpers
    const calcBMR = ({ gender, weight, height, age }) => {
      // Mifflin-St Jeor
      if (gender === 'male') {
        return 10 * weight + 6.25 * height - 5 * age + 5;
      } else {
        return 10 * weight + 6.25 * height - 5 * age - 161;
      }
    };

    const getFactor = (value) => ACTIVITY_LEVELS.find((a) => a.value === value)?.factor || 1.2;

    const handleSubmit = (e) => {
      e.preventDefault();
      const age = Number(document.getElementById('age').value);
      const genderVal = document.getElementById('gender').value;
      const height = Number(document.getElementById('height').value);
      const weight = Number(document.getElementById('weight').value);
      const activityVal = document.getElementById('activity').value;

      // Basic validation with friendly messages
      const toast = (msg) => (window.GB && GB.showToast) ? GB.showToast(msg) : alert(msg);
      if (!age || !genderVal || !height || !weight) {
        toast('Please fill in all fields.');
        return;
      }
      if (age < 10 || age > 120) { toast('Age must be between 10 and 120.'); return; }
      if (height < 50 || height > 250) { toast('Height must be between 50 and 250 cm.'); return; }
      if (weight < 20 || weight > 300) { toast('Weight must be between 20 and 300 kg.'); return; }

      const bmr = calcBMR({ gender: genderVal, weight, height, age });
      const tdee = bmr * getFactor(activityVal);

      const carbsKcal = tdee * 0.5;
      const proteinKcal = tdee * 0.2;
      const fatsKcal = tdee * 0.3;

      const carbsG = carbsKcal / 4;
      const proteinG = proteinKcal / 4;
      const fatsG = fatsKcal / 9;

      // Animate numbers
      animateNumber(bmrC.valueEl, 0, bmr, 800, 0);
      animateNumber(tdeeC.valueEl, 0, tdee, 800, 0);

      // Update progress segments (50/20/30)
      setTimeout(() => {
        carbsSeg.style.width = '50%';
        proteinSeg.style.width = '20%';
        fatsSeg.style.width = '30%';
      }, 50);

      macroList.innerHTML = '';
      const addMacro = (name, grams, color) => {
        const li = document.createElement('li');
        li.textContent = `${name}: ${fmt(grams, 0)} g`;
        li.style.listStyle = 'disc inside';
        li.style.color = color;
        macroList.appendChild(li);
      };
      addMacro('Carbs (50%)', carbsG, '#66bb6a');
      addMacro('Protein (20%)', proteinG, '#42a5f5');
      addMacro('Fat (30%)', fatsG, '#ffa726');

      // Persist last inputs for convenience
      const last = { age, gender: genderVal, height, weight, activity: activityVal };
      try { localStorage.setItem('gb_calc_last', JSON.stringify(last)); } catch (_) {}

      toast('Results updated');
    };

    form.addEventListener('submit', handleSubmit);

    // Load last inputs if available
    try {
      const saved = JSON.parse(localStorage.getItem('gb_calc_last') || 'null');
      if (saved) {
        document.getElementById('age').value = saved.age ?? '';
        document.getElementById('gender').value = saved.gender ?? 'male';
        document.getElementById('height').value = saved.height ?? '';
        document.getElementById('weight').value = saved.weight ?? '';
        document.getElementById('activity').value = saved.activity ?? 'sedentary';
      }
    } catch (_) {}
  };

  onReady(build);
})();
