// Contact & Feedback Page behaviors: validation, confirmation, localStorage, FAQ accordion
(function(){
  const onReady = (fn) => (window.GB && GB.onReady) ? GB.onReady(fn) : (document.readyState==='loading' ? document.addEventListener('DOMContentLoaded', fn, {once:true}) : fn());

  const toast = (msg) => (window.GB && GB.showToast) ? GB.showToast(msg) : alert(msg);
  const saveList = (key, list) => (window.GB && GB.saveList) ? GB.saveList(key, list) : localStorage.setItem(key, JSON.stringify(list));
  const loadList = (key) => (window.GB && GB.loadList) ? GB.loadList(key) : JSON.parse(localStorage.getItem(key) || '[]');

  function setupForm(){
    const form = document.getElementById('feedback-form');
    if (!form) return;

    const nameEl = document.getElementById('name');
    const emailEl = document.getElementById('email');
    const msgEl = document.getElementById('message');
    const confirmEl = document.getElementById('confirmation');

    const emailValid = (val) => /.+@.+\..+/.test(val);

    const mark = (el, ok) => {
      el.style.outline = ok ? '2px solid #16a34a' : '2px solid #ef4444';
      setTimeout(() => { el.style.outline = ''; }, 1500);
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (nameEl?.value || '').trim();
      const email = (emailEl?.value || '').trim();
      const message = (msgEl?.value || '').trim();

      if (!name || name.length < 2) { mark(nameEl, false); toast('Please enter your name (at least 2 characters).'); return; }
      if (!email || !emailValid(email)) { mark(emailEl, false); toast('Please enter a valid email.'); return; }
      if (!message || message.length < 10) { mark(msgEl, false); toast('Message should be at least 10 characters.'); return; }

      mark(nameEl, true); mark(emailEl, true); mark(msgEl, true);

      // Save feedback to localStorage
      const key = 'gb_feedbacks';
      const list = loadList(key);
      list.push({ when: new Date().toISOString(), name, email, message });
      saveList(key, list);

      // Show confirmation without relying on CSS class
      if (confirmEl) {
        confirmEl.textContent = '✅ Thank you! Your feedback has been submitted.';
        confirmEl.style.display = 'block';
        confirmEl.style.marginTop = '8px';
      }
      toast('Feedback submitted. Thank you!');
      form.reset();
    });
  }

  function setupFAQ(){
    const section = document.querySelector('.faq');
    if (!section) return;
    const items = Array.from(section.querySelectorAll('.faq-item'));
    items.forEach((item) => {
      const btn = item.querySelector('.faq-question');
      const ans = item.querySelector('.faq-answer');
      if (!btn || !ans) return;
      // Initialize collapsed
      ans.style.display = 'none';
      btn.setAttribute('aria-expanded', 'false');

      btn.addEventListener('click', () => {
        const open = ans.style.display === 'block';
        // close all others for accordion behavior
        items.forEach((it) => {
          const a = it.querySelector('.faq-answer');
          const b = it.querySelector('.faq-question');
          if (a && b) { a.style.display = 'none'; b.setAttribute('aria-expanded','false'); }
        });
        if (!open) { ans.style.display = 'block'; btn.setAttribute('aria-expanded','true'); }
      });
    });
  }

  function setupFeedbackPanel(){
    // Floating toggle button
    let toggle = document.getElementById('gb-feedback-toggle');
    if (!toggle) {
      toggle = document.createElement('button');
      toggle.id = 'gb-feedback-toggle';
      toggle.textContent = 'Feedbacks';
      toggle.style.position = 'fixed';
      toggle.style.right = '16px';
      toggle.style.bottom = '80px';
      toggle.style.zIndex = '10010';
      toggle.style.padding = '10px 14px';
      toggle.style.border = '2px solid #000';
      toggle.style.background = '#16a34a';
      toggle.style.color = '#fff';
      toggle.style.fontWeight = '700';
      toggle.style.borderRadius = '10px';
      toggle.style.cursor = 'pointer';
      toggle.style.boxShadow = '4px 4px 0 #065f46';
      document.body.appendChild(toggle);
    }

    // Side panel host
    let panel = document.getElementById('gb-feedback-panel');
    if (!panel) {
      panel = document.createElement('aside');
      panel.id = 'gb-feedback-panel';
      panel.style.position = 'fixed';
      panel.style.top = '0';
      panel.style.right = '0';
      panel.style.height = '100vh';
      panel.style.width = '360px';
      panel.style.maxWidth = '90vw';
      panel.style.transform = 'translateX(100%)';
      panel.style.transition = 'transform 240ms ease';
      panel.style.background = '#fff';
      panel.style.borderLeft = '3px solid #000';
      panel.style.boxShadow = '-8px 0 24px rgba(0,0,0,0.15)';
      panel.style.zIndex = '10009';

      const header = document.createElement('div');
      header.style.display = 'flex';
      header.style.alignItems = 'center';
      header.style.justifyContent = 'space-between';
      header.style.padding = '12px 14px';
      header.style.borderBottom = '1px solid #eee';

      const title = document.createElement('h3');
      title.textContent = 'Saved Feedbacks';
      title.style.margin = '0';

      const actions = document.createElement('div');

      const clearBtn = document.createElement('button');
      clearBtn.textContent = 'Clear All';
      clearBtn.style.border = '1px solid #ddd';
      clearBtn.style.borderRadius = '8px';
      clearBtn.style.padding = '6px 10px';
      clearBtn.style.cursor = 'pointer';

      const closeBtn = document.createElement('button');
      closeBtn.textContent = '×';
      closeBtn.style.fontSize = '22px';
      closeBtn.style.background = 'transparent';
      closeBtn.style.border = 'none';
      closeBtn.style.cursor = 'pointer';
      closeBtn.style.marginLeft = '8px';

      actions.appendChild(clearBtn);
      actions.appendChild(closeBtn);

      header.appendChild(title);
      header.appendChild(actions);

      const listWrap = document.createElement('div');
      listWrap.id = 'gb-feedback-list';
      listWrap.style.padding = '10px 14px';
      listWrap.style.overflow = 'auto';
      listWrap.style.height = 'calc(100% - 56px)';

      panel.appendChild(header);
      panel.appendChild(listWrap);
      document.body.appendChild(panel);

      const open = () => { panel.style.transform = 'translateX(0)'; };
      const close = () => { panel.style.transform = 'translateX(100%)'; };
      toggle.addEventListener('click', () => {
        if (panel.style.transform === 'translateX(0px)' || panel.style.transform === 'translateX(0)') close();
        else {
          render();
          open();
        }
      });
      closeBtn.addEventListener('click', close);
      clearBtn.addEventListener('click', () => {
        const key = 'gb_feedbacks';
        const list = loadList(key);
        if (!list.length) { toast('No feedbacks to clear'); return; }
        saveList(key, []);
        render();
        toast('All feedbacks cleared');
      });

      function render(){
        const key = 'gb_feedbacks';
        const list = loadList(key);
        const host = listWrap;
        host.innerHTML = '';
        if (!list.length) {
          const p = document.createElement('p');
          p.textContent = 'No feedbacks yet.';
          host.appendChild(p);
          return;
        }
        list.slice().reverse().forEach((fb) => {
          const card = document.createElement('div');
          card.style.border = '1px solid #eee';
          card.style.borderRadius = '10px';
          card.style.padding = '10px';
          card.style.marginBottom = '10px';
          const when = new Date(fb.when || Date.now());
          const h = document.createElement('div');
          h.style.display = 'flex';
          h.style.justifyContent = 'space-between';
          h.style.gap = '8px';
          const name = document.createElement('strong');
          name.textContent = fb.name || 'Anonymous';
          const time = document.createElement('small');
          time.textContent = when.toLocaleString();
          const email = document.createElement('div');
          email.textContent = fb.email || '';
          email.style.color = '#555';
          email.style.fontSize = '12px';
          const msg = document.createElement('p');
          msg.textContent = fb.message || '';
          msg.style.margin = '8px 0 0 0';
          h.appendChild(name);
          h.appendChild(time);
          card.appendChild(h);
          card.appendChild(email);
          card.appendChild(msg);
          host.appendChild(card);
        });
      }
    }
  }

  onReady(() => { setupForm(); setupFAQ(); setupFeedbackPanel(); });
})();
