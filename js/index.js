// Home page JS: Hero auto-rotating slogans (no HTML/CSS changes required)
// Safely initializes after DOM is ready and only runs if the target element exists.

(function () {
  const onReady = (fn) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  };

  onReady(() => {
    // Candidate target: existing hero slogan container
    const target = document.querySelector(".hero .slogan") || document.querySelector(".slogan");
    if (target) {

    // Slogans to rotate through
    const slogans = [
      "Eat green, live clean 🌱",
      "Your health is your wealth 💎",
      "Small steps, big health gains 🚶",
      "Fuel your body, feed your soul 🥦",
      "Healthy habits, happy life 😊",
      "Nourish to flourish 🌼",
      "Move daily, feel amazing ✨",
    ];

    // Config
    const intervalMs = 3500; // rotation interval
    const fadeMs = 300; // fade-out/in duration

    // Prepare inline transition without touching CSS file
    target.style.transition = `opacity ${fadeMs}ms ease`;

    let idx = 0;
    let timer = null;
    let paused = false;

    const show = (text) => {
      target.textContent = text;
    };

    const step = () => {
      if (paused) return; // do nothing while paused
      // Fade out -> swap -> fade in
      target.style.opacity = "0";
      window.setTimeout(() => {
        show(slogans[idx]);
        idx = (idx + 1) % slogans.length;
        target.style.opacity = "1";
      }, fadeMs);
    };

    // Start with immediate content update and visible fade
    target.style.opacity = "1";
    show(slogans[idx]);
    idx = (idx + 1) % slogans.length;

    const start = () => {
      if (timer) return;
      timer = window.setInterval(step, intervalMs);
    };

    const stop = () => {
      if (!timer) return;
      window.clearInterval(timer);
      timer = null;
    };

    // Pause on hover for better UX
    target.addEventListener("mouseenter", () => {
      paused = true;
    });
    target.addEventListener("mouseleave", () => {
      paused = false;
    });

    // Save resources when tab is hidden
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    });

    // Kick off rotation
    start();
    }

    // Featured Section: Daily Health Tip (date-based, deterministic)
    const tipElement = document.querySelector("#health-tip p");
    if (tipElement) {
      const healthTips = [
        "Drink at least 8 glasses of water today 💧",
        "Take a 10-minute walk after meals 🚶",
        "Swap sugary drinks for fresh fruit juice 🍊",
        "Stretch for 5 minutes in the morning 🧘",
        "Add one extra veggie to your meal 🥗",
        "Limit screen time before bed 🌙",
        "Practice deep breathing for 2 minutes 🌬️",
        "Aim for 7–9 hours of sleep tonight 😴",
        "Choose whole grains over refined carbs 🌾",
        "Take the stairs when you can 🪜",
        "Include a lean protein with meals 🍗",
        "Stand up and move every hour ⏱️",
        "Add healthy fats like nuts or avocado 🥑",
        "Do a quick posture check—sit tall 🧍",
        "Plan your meals to avoid snacking 📝",
      ];

      // Build a simple yyyymmdd number for deterministic indexing per calendar day
      const now = new Date();
      const yyyymmdd = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
      const tipIndex = yyyymmdd % healthTips.length;
      tipElement.textContent = healthTips[tipIndex];
    }
  });
})();
