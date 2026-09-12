/* ==========================================================================
   SHAHKAR AHMAD — Portfolio v4 "Atelier"
   Restrained motion: reveals, magnetics, filtering, theme.
   Every animated path checks prefers-reduced-motion first.
   ========================================================================== */

(function () {
  "use strict";

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(pointer: fine)");
  let reduced = motionQuery.matches;

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  /* ── THEME ─────────────────────────────────────────────── */
  function initTheme() {
    const root = document.documentElement;
    const toggle = $("#themeToggle");
    if (!toggle) return;

    toggle.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      const meta = $('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", next === "dark" ? "#08090b" : "#f7f5f1");
      try {
        localStorage.setItem("theme", next);
      } catch (e) {
        /* private mode — theme just won't persist */
      }
    });
  }

  /* ── MOBILE MENU ───────────────────────────────────────── */
  function initMenu() {
    const burger = $("#burger");
    const menu = $("#menu");
    if (!burger || !menu) return;

    const setOpen = (open) => {
      burger.classList.toggle("is-open", open);
      menu.classList.toggle("is-open", open);
      document.body.classList.toggle("menu-open", open);
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      menu.setAttribute("aria-hidden", String(!open));
    };

    burger.addEventListener("click", () => {
      setOpen(!menu.classList.contains("is-open"));
    });

    $$("a", menu).forEach((a) => a.addEventListener("click", () => setOpen(false)));

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menu.classList.contains("is-open")) {
        setOpen(false);
        burger.focus();
      }
    });
  }

  /* ── HEADER STATE + SCROLL PROGRESS ────────────────────── */
  function initScrollChrome() {
    const header = $("#header");
    const bar = $("#progress");
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      if (header) header.classList.toggle("is-stuck", y > 24);

      if (bar) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
      }
      ticking = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true }
    );

    update();
  }

  /* ── ACTIVE NAV LINK ───────────────────────────────────── */
  function initActiveNav() {
    const links = $$(".nav-link");
    const sections = $$("main section[id]");
    if (!links.length || !sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          links.forEach((link) =>
            link.classList.toggle("is-active", link.getAttribute("href") === "#" + id)
          );
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    sections.forEach((s) => observer.observe(s));
  }

  /* ── SCROLL REVEAL (staggered within each section) ─────── */
  function initReveal() {
    const items = $$(".reveal");

    if (reduced) {
      items.forEach((el) => el.classList.add("is-in"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        // Stagger only the items entering together in this batch.
        entries
          .filter((e) => e.isIntersecting)
          .forEach((entry, i) => {
            entry.target.style.transitionDelay = i * 80 + "ms";
            entry.target.classList.add("is-in");
            obs.unobserve(entry.target);
          });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    items.forEach((el) => observer.observe(el));
  }

  /* ── HERO WORD REVEAL ──────────────────────────────────── */
  function initHero() {
    const name = $(".hero-name");
    if (!name) return;

    if (reduced) {
      name.classList.add("is-in");
      return;
    }

    requestAnimationFrame(() => {
      setTimeout(() => name.classList.add("is-in"), 120);
    });
  }

  /* ── CAPABILITY METERS ─────────────────────────────────── */
  function initMeters() {
    const meters = $$(".meter");
    if (!meters.length) return;

    if (reduced) {
      meters.forEach((m) => m.classList.add("is-lit"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-lit");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );

    meters.forEach((m) => observer.observe(m));
  }

  /* ── STAT COUNTERS ─────────────────────────────────────── */
  function initCounters() {
    const stats = $$("[data-count]");
    if (!stats.length) return;

    const render = (el, value) => {
      el.textContent = value + (el.dataset.suffix || "");
    };

    if (reduced) {
      stats.forEach((el) => render(el, Number(el.dataset.count)));
      return;
    }

    const run = (el) => {
      const target = Number(el.dataset.count) || 0;
      const duration = 1100;
      const start = performance.now();

      const step = (now) => {
        const p = Math.min((now - start) / duration, 1);
        // easeOutExpo
        const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
        render(el, Math.round(target * eased));
        if (p < 1) requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          run(entry.target);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.6 }
    );

    stats.forEach((el) => observer.observe(el));
  }

  /* ── PROJECT FILTER ────────────────────────────────────── */
  function initFilters() {
    const buttons = $$(".filter");
    const cards = $$(".project");
    if (!buttons.length || !cards.length) return;

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.dataset.filter;

        buttons.forEach((b) => {
          const on = b === btn;
          b.classList.toggle("is-active", on);
          b.setAttribute("aria-pressed", String(on));
        });

        cards.forEach((card) => {
          const cats = (card.dataset.cat || "").split(/\s+/);
          card.classList.toggle("is-hidden", key !== "all" && !cats.includes(key));
        });
      });
    });
  }

  /* ── CUSTOM CURSOR ─────────────────────────────────────── */
  function initCursor() {
    if (reduced || !finePointer.matches) return;

    const ring = $(".cursor-ring");
    const dot = $(".cursor-dot");
    if (!ring || !dot) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;

    window.addEventListener(
      "mousemove",
      (e) => {
        mx = e.clientX;
        my = e.clientY;
        document.body.classList.add("cursor-ready");
      },
      { passive: true }
    );

    document.addEventListener("mouseleave", () =>
      document.body.classList.remove("cursor-ready")
    );

    const loop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      requestAnimationFrame(loop);
    };
    loop();

    const hot = "a, button, .project, .cap-item, .spec-row, .channel";
    document.addEventListener("mouseover", (e) => {
      if (e.target.closest(hot)) document.body.classList.add("cursor-hot");
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest(hot)) document.body.classList.remove("cursor-hot");
    });
  }

  /* ── MAGNETIC BUTTONS ──────────────────────────────────── */
  function initMagnetic() {
    if (reduced || !finePointer.matches) return;

    $$("[data-magnetic]").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.22;
        const y = (e.clientY - r.top - r.height / 2) * 0.32;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });

      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
      });
    });
  }

  /* ── FOOTER YEAR ───────────────────────────────────────── */
  function initYear() {
    const el = $("#year");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /* ── BOOT ──────────────────────────────────────────────── */
  function boot() {
    initTheme();
    initMenu();
    initScrollChrome();
    initActiveNav();
    initReveal();
    initHero();
    initMeters();
    initCounters();
    initFilters();
    initCursor();
    initMagnetic();
    initYear();
  }

  // Keep up if the user flips the OS motion setting mid-session.
  const onMotionChange = () => {
    reduced = motionQuery.matches;
    if (reduced) {
      $$(".reveal").forEach((el) => el.classList.add("is-in"));
      $$(".meter").forEach((m) => m.classList.add("is-lit"));
      document.body.classList.remove("cursor-ready", "cursor-hot");
    }
  };

  if (motionQuery.addEventListener) {
    motionQuery.addEventListener("change", onMotionChange);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
