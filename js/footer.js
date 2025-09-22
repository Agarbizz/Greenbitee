// Footer newsletter subscription handler for all pages
// - Finds any footer .newsletter form and stores submitted emails in localStorage
// - No HTML/CSS changes required
(function () {
  const onReady = (fn) => (window.GB && GB.onReady ? GB.onReady(fn) : (document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn, { once: true }) : fn()));

  const isValidEmail = (val) => {
    // Basic email pattern, HTML5 validation also applies
    return /.+@.+\..+/.test(val);
  };

  onReady(() => {
    // Attach to all footer newsletter forms
    const forms = document.querySelectorAll('footer .newsletter form');
    if (!forms.length) return;

    forms.forEach((form) => {
      // Guard against double-binding
      if (form.dataset.gbNewsletterBound === '1') return;
      form.dataset.gbNewsletterBound = '1';

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = form.querySelector('input[type="email"]');
        const value = (emailInput?.value || '').trim();

        if (!value || !isValidEmail(value)) {
          if (window.GB && GB.showToast) GB.showToast('Please enter a valid email.'); else alert('Please enter a valid email.');
          emailInput?.focus();
          return;
        }

        const key = 'gb_newsletter_emails';
        const current = window.GB && GB.loadList ? GB.loadList(key) : (JSON.parse(localStorage.getItem(key) || '[]'));
        if (!current.includes(value)) {
          current.push(value);
          if (window.GB && GB.saveList) GB.saveList(key, current); else localStorage.setItem(key, JSON.stringify(current));
        }
        if (window.GB && GB.showToast) GB.showToast(`🎉 Subscribed: ${value}`); else alert(`🎉 Thank you for subscribing, ${value}!`);
        form.reset();
      });
    });
  });
})();
