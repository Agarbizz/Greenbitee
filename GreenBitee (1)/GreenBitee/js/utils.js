// Global reusable helpers available as window.GB
(function () {
  const GB = (window.GB = window.GB || {});

  GB.onReady = (fn) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  };

  GB.debounce = (fn, ms = 200) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), ms);
    };
  };

  GB.loadList = (key) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch (_) {
      return [];
    }
  };

  GB.saveList = (key, list) => {
    try {
      localStorage.setItem(key, JSON.stringify(list));
    } catch (_) {}
  };

  // Lightweight toast message (no CSS file edits)
  GB.showToast = (message, opts = {}) => {
    const { timeout = 1800 } = opts;
    let host = document.getElementById('gb-toast-host');
    if (!host) {
      host = document.createElement('div');
      host.id = 'gb-toast-host';
      host.style.position = 'fixed';
      host.style.right = '16px';
      host.style.bottom = '16px';
      host.style.zIndex = '10000';
      host.style.display = 'flex';
      host.style.flexDirection = 'column';
      host.style.gap = '8px';
      document.body.appendChild(host);
    }
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.background = '#323232';
    toast.style.color = '#fff';
    toast.style.padding = '10px 14px';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 6px 18px rgba(0,0,0,0.25)';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    toast.style.transition = 'opacity 200ms ease, transform 200ms ease';
    host.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      setTimeout(() => toast.remove(), 220);
    }, timeout);
  };

  // Initialize mobile navigation (hamburger toggle)
  GB.initMobileNav = () => {
    const header = document.querySelector('header');
    if (!header) return;
    const burger = header.querySelector('.hamburger');
    const navLinks = header.querySelector('.nav-links');
    if (!burger || !navLinks) return;

    // Toggle menu on click
    burger.addEventListener('click', () => {
      header.classList.toggle('open');
    });

    // Close menu when resizing back to desktop
    const handleResize = GB.debounce(() => {
      if (window.innerWidth > 800) {
        header.classList.remove('open');
      }
    }, 150);
    window.addEventListener('resize', handleResize);

    // Optional: close menu when clicking a link (mobile UX)
    navLinks.addEventListener('click', (e) => {
      const target = e.target;
      if (target && target.tagName === 'A') {
        header.classList.remove('open');
      }
    });
  };

  // Auto-init on ready
  GB.onReady(() => {
    GB.initMobileNav();
  });
})();
