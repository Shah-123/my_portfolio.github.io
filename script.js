/* ==========================================================================
   SHAHKAR AHMAD — Portfolio v5 "Agentic OS"
   Terminal chrome, command palette, 3D agent graph, case studies, form.
   Every animated path checks prefers-reduced-motion first.
   Three.js is dynamically imported — a CDN or WebGL failure degrades to SVG.
   ========================================================================== */

/* ─────────────────────────────────────────────────────────────
   CONFIG — the only two places you should need to edit
   ───────────────────────────────────────────────────────────── */
const CONFIG = {
  // INPUT A — the MootCourtSimulator repository (repo name: CourtSimulator).
  // The link is wired immediately, but the card keeps its `private` badge until
  // mootcourtPublic is flipped to true: the repo is not in the public repo list
  // yet, so the URL 404s for anonymous visitors.
  mootcourtRepo: "https://github.com/Shah-123/CourtSimulator",
  mootcourtPublic: false,

  // INPUT C — your Formspree endpoint. Must also match the <form action> in
  // index.html. While it still contains YOUR_FORM_ID the form falls back to
  // opening the visitor's mail client, so it is never silently broken.
  formspreeId: "YOUR_FORM_ID",

  email: "shahkarahmad342@gmail.com",
  threeVersion: "0.169.0",
};

(function () {
  "use strict";

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(pointer: fine)");
  const smallScreen = window.matchMedia("(max-width: 720px)");
  let reduced = motionQuery.matches;

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

  /* ── PENDING LINKS (CONFIG-driven) ───────────────────────── */
  function initPendingLinks() {
    if (!CONFIG.mootcourtRepo) return;

    $$("[data-pending-link='mootcourtRepo']").forEach((a) => {
      a.href = CONFIG.mootcourtRepo;
      a.removeAttribute("aria-disabled");
      a.target = "_blank";
      a.rel = "noopener";

      // Keep the `private` badge while the repo is unpublished — a 404 that
      // explains itself beats a link that merely looks broken.
      if (CONFIG.mootcourtPublic) {
        const badge = $(".badge-private", a);
        if (badge) badge.remove();
      }

      if (!$("svg", a)) {
        a.insertAdjacentHTML(
          "beforeend",
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>'
        );
      }
    });
  }

  /* ── THEME ─────────────────────────────────────────────── */
  function applyThemeMeta(theme) {
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#06070a" : "#f2f4f6");
  }

  function initTheme() {
    const root = document.documentElement;
    const toggle = $("#themeToggle");
    applyThemeMeta(root.getAttribute("data-theme") || "dark");
    if (!toggle) return;

    toggle.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      applyThemeMeta(next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {
        /* private mode — theme just won't persist */
      }
      // Let the agent graph re-read the palette.
      document.dispatchEvent(new CustomEvent("themechange", { detail: { theme: next } }));
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

    burger.addEventListener("click", () => setOpen(!menu.classList.contains("is-open")));
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
    const bar = $("#progress i");
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      if (header) header.classList.toggle("is-stuck", y > 24);
      if (bar) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = `scaleX(${max > 0 ? clamp(y / max, 0, 1) : 0})`;
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
    window.addEventListener("resize", update, { passive: true });
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
          const href = "#" + entry.target.id;
          links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === href));
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    sections.forEach((s) => observer.observe(s));
  }

  /* ── BOOT SEQUENCE ─────────────────────────────────────── */
  const BOOT_LINES = [
    { text: "> shahkar@ai:~$ init --profile=agentic", cls: "" },
    { text: "  ok   runtime        vanilla-js", cls: "ok" },
    { text: "  ok   renderer       webgl / three.js", cls: "ok" },
    { text: "  ok   agent graph    10 nodes online", cls: "ok" },
    { text: "  ok   retrieval      hybrid · mrr 1.00", cls: "ok" },
    { text: "> ready", cls: "dim" },
  ];

  function initBoot(done) {
    const boot = $("#boot");
    const log = $("#bootLog");
    const bar = $("#bootBar");

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      document.body.classList.add("boot-done");
      window.setTimeout(() => {
        document.body.classList.remove("booting", "boot-done");
        if (boot) boot.setAttribute("aria-hidden", "true");
      }, 560);
      done();
    };

    // Never run twice in a session, and never run without motion.
    let seen = false;
    try {
      seen = sessionStorage.getItem("booted") === "1";
      sessionStorage.setItem("booted", "1");
    } catch (e) {
      seen = true; // storage blocked — assume shown, don't trap the reader
    }

    if (!boot || !log || reduced || seen) {
      finish();
      return;
    }

    document.body.classList.add("booting");
    boot.setAttribute("aria-hidden", "false");

    // Hard failsafe: whatever happens, the overlay is gone in 2.5s.
    const failsafe = window.setTimeout(finish, 2500);
    ["keydown", "pointerdown", "wheel", "touchstart"].forEach((evt) =>
      window.addEventListener(evt, finish, { once: true, passive: true })
    );

    const total = BOOT_LINES.length;
    BOOT_LINES.forEach((line, i) => {
      window.setTimeout(() => {
        const span = document.createElement("span");
        if (line.cls) span.className = line.cls;
        span.textContent = line.text;
        log.appendChild(span);
        log.appendChild(document.createTextNode("\n"));
        if (bar) bar.style.width = ((i + 1) / total) * 100 + "%";
        if (i === total - 1) {
          window.clearTimeout(failsafe);
          window.setTimeout(finish, 260);
        }
      }, 130 + i * 150);
    });
  }

  /* ── TYPING + REVEALS ──────────────────────────────────── */
  function splitChars(el) {
    const text = el.textContent;
    el.textContent = "";
    el.setAttribute("aria-label", text);

    const chars = [];
    [...text].forEach((ch) => {
      const s = document.createElement("span");
      s.className = "char";
      s.setAttribute("aria-hidden", "true");
      s.textContent = ch === " " ? "\u00A0" : ch;
      el.appendChild(s);
      chars.push(s);
    });
    return chars;
  }

  function runTyping() {
    const termText = $(".term-text");
    const words = $$(".hero-name .word");
    const lede = $(".hero-lede");

    if (reduced) {
      if (lede) lede.classList.add("mask-reveal", "is-in");
      return;
    }

    let cursor = 0;

    if (termText) {
      const chars = splitChars(termText);
      chars.forEach((c, i) => {
        window.setTimeout(() => c.classList.add("is-shown"), 60 + i * 26);
      });
      cursor = 60 + chars.length * 26;
    }

    words.forEach((word) => {
      const chars = splitChars(word);
      chars.forEach((c) => {
        cursor += 34;
        const at = cursor;
        window.setTimeout(() => c.classList.add("is-shown"), at);
      });
      cursor += 90;
    });

    if (lede) {
      lede.classList.add("mask-reveal");
      window.setTimeout(() => lede.classList.add("is-in"), cursor + 60);
    }
  }

  /* ── SCROLL REVEAL ─────────────────────────────────────── */
  function initReveal() {
    const items = $$(".reveal");

    if (reduced) {
      items.forEach((el) => el.classList.add("is-in"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries
          .filter((e) => e.isIntersecting)
          .forEach((entry, i) => {
            entry.target.style.transitionDelay = Math.min(i * 70, 420) + "ms";
            entry.target.classList.add("is-in");
            obs.unobserve(entry.target);
          });
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
    );

    items.forEach((el) => observer.observe(el));
  }

  /* ── SKILL BARS ────────────────────────────────────────── */
  function initBars() {
    const bars = $$(".bar");
    if (!bars.length) return;

    bars.forEach((b) => b.style.setProperty("--lvl", b.dataset.level || "3"));

    if (reduced) {
      bars.forEach((b) => b.classList.add("is-lit"));
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
      { threshold: 0.4 }
    );

    bars.forEach((b) => observer.observe(b));
  }

  /* ── STAT COUNTERS ─────────────────────────────────────── */
  function initCounters() {
    const stats = $$("[data-count]");
    if (!stats.length) return;

    const render = (el, value) => {
      const decimals = Number(el.dataset.decimals || 0);
      el.textContent = decimals ? value.toFixed(decimals) : String(Math.round(value));
      if (el.dataset.suffix) el.textContent += el.dataset.suffix;
    };

    // Values like a year read better placed than counted up to.
    stats.forEach((el) => {
      if (el.dataset.plain === "true") render(el, Number(el.dataset.count) || 0);
    });

    const animated = stats.filter((el) => el.dataset.plain !== "true");
    if (reduced) {
      animated.forEach((el) => render(el, Number(el.dataset.count) || 0));
      return;
    }

    const run = (el) => {
      const target = Number(el.dataset.count) || 0;
      const decimals = Number(el.dataset.decimals || 0);
      const duration = decimals ? 1400 : 1100;
      const start = performance.now();

      const step = (now) => {
        const p = clamp((now - start) / duration, 0, 1);
        const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p); // easeOutExpo
        render(el, target * eased);
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
      { threshold: 0.5 }
    );

    animated.forEach((el) => observer.observe(el));
  }

  /* ── CASE STUDY EXPANDERS ──────────────────────────────── */
  function initCases() {
    $$(".case-toggle").forEach((btn) => {
      const label = $(".case-toggle-label", btn);
      if (label) label.dataset.closed = label.textContent.trim();

      btn.addEventListener("click", () => {
        const card = btn.closest(".case");
        if (!card) return;
        const open = card.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", String(open));
        if (!label) return;
        const closed = label.dataset.closed || "Read details";
        label.textContent = open
          ? label.dataset.open || closed.replace(/^Read\b/i, "Hide")
          : closed;
      });
    });
  }

  /* ── MORE-WORK ROW EXPANDERS ───────────────────────────── */
  function initLogRows() {
    $$(".log-item").forEach((item) => {
      const row = $(".log-row", item);
      const btn = $(".log-toggle", item);
      if (!row || !btn) return;

      // The row itself toggles; the repo link inside it still navigates.
      row.addEventListener("click", (e) => {
        if (e.target.closest("a")) return;
        const open = item.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", String(open));
      });
    });
  }

  /* ── MORE-WORK FILTER ──────────────────────────────────── */
  function initFilters() {
    const buttons = $$(".filter");
    const rows = $$(".log-item");
    const empty = $("#logEmpty");
    if (!buttons.length || !rows.length) return;

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.dataset.filter;

        buttons.forEach((b) => {
          const on = b === btn;
          b.classList.toggle("is-active", on);
          b.setAttribute("aria-pressed", String(on));
        });

        let visible = 0;
        rows.forEach((row) => {
          const cats = (row.dataset.cat || "").split(/\s+/);
          const show = key === "all" || cats.includes(key);
          row.classList.toggle("is-hidden", !show);
          if (show) visible++;
        });

        if (empty) empty.hidden = visible !== 0;
      });
    });
  }

  /* ── TIMELINE SPINE ────────────────────────────────────── */
  function initTimeline() {
    const tl = $("#timeline");
    const fill = $("#timelineFill");
    if (!tl || !fill) return;

    if (reduced) {
      fill.style.setProperty("--fill", "1");
      return;
    }

    let ticking = false;

    const update = () => {
      const r = tl.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.82;
      const span = r.height * 0.88;
      fill.style.setProperty("--fill", clamp((start - r.top) / span, 0, 1).toFixed(4));
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
    window.addEventListener("resize", update, { passive: true });
    update();
  }

  /* ── COMMAND PALETTE ───────────────────────────────────── */
  function initPalette() {
    const overlay = $("#palette");
    const input = $("#paletteInput");
    const list = $("#paletteResults");
    const openBtn = $("#paletteOpen");
    if (!overlay || !input || !list) return;

    const COMMANDS = [
      { group: "navigate", icon: "01", label: "About", hint: "#about", go: "#about" },
      { group: "navigate", icon: "02", label: "Stack", hint: "#stack", go: "#stack" },
      { group: "navigate", icon: "03", label: "Selected work", hint: "#work", go: "#work" },
      { group: "navigate", icon: "04", label: "Journey", hint: "#journey", go: "#journey" },
      { group: "navigate", icon: "05", label: "Credentials", hint: "#credentials", go: "#credentials" },
      { group: "navigate", icon: "06", label: "Contact", hint: "#contact", go: "#contact" },

      { group: "projects", icon: "›", label: "MootCourtSimulator — argue a case against AI agents", hint: "2026", go: "#project-mootcourt", open: true },
      { group: "projects", icon: "›", label: "AI Content Factory — 10-agent pipeline", hint: "2025–26", go: "#project-content-factory", open: true },
      { group: "projects", icon: "›", label: "Live Agent Hub — AI personas", hint: "2025", go: "#project-live-agent-hub", open: true },
      { group: "projects", icon: "›", label: "ChessMastermind — engine from scratch", hint: "2025", go: "#project-chess", open: true },
      { group: "projects", icon: "›", label: "YouTube Video Summariser", hint: "2024", go: "#project-yt", open: true },

      { group: "credentials", icon: "★", label: "Honorable Mention — Top 5 of 35, GIK Institute", hint: "2026", go: "#credentials" },
      { group: "credentials", icon: "✓", label: "Advanced AI Bootcamp — Grade B+", hint: "2026", go: "#credentials" },
      { group: "credentials", icon: "⚑", label: "Qwenathon 2026 — participant, team Xtreme Coders", hint: "hackathon", go: "#credentials" },

      { group: "skills", icon: "#", label: "LangGraph & LangChain", hint: "stack", go: "#stack" },
      { group: "skills", icon: "#", label: "Multi-agent workflows", hint: "stack", go: "#stack" },
      { group: "skills", icon: "#", label: "Hybrid RAG & retrieval", hint: "stack", go: "#stack" },
      { group: "skills", icon: "#", label: "Model Context Protocol", hint: "stack", go: "#stack" },
      { group: "skills", icon: "#", label: "Python & TypeScript", hint: "stack", go: "#stack" },
      { group: "skills", icon: "#", label: "FastAPI & Express.js", hint: "stack", go: "#stack" },
      { group: "skills", icon: "#", label: "PostgreSQL & Drizzle", hint: "stack", go: "#stack" },
      { group: "skills", icon: "#", label: "React & Tailwind", hint: "stack", go: "#stack" },

      { group: "links", icon: "↗", label: "GitHub — Shah-123", hint: "external", url: "https://github.com/Shah-123" },
      { group: "links", icon: "↗", label: "LinkedIn — Shahkar Ahmad", hint: "external", url: "https://www.linkedin.com/in/shahkar-ahmad-730b41279/" },
      { group: "links", icon: "↓", label: "Download CV (PDF)", hint: "file", url: "./assets/Shahkar%20Ahmad%20Shah.pdf" },
      { group: "links", icon: "@", label: "Email shahkarahmad342@gmail.com", hint: "mailto", url: "mailto:" + CONFIG.email },

      { group: "actions", icon: "◐", label: "Toggle colour theme", hint: "action", fn: () => $("#themeToggle")?.click() },
      { group: "actions", icon: "↑", label: "Back to top", hint: "action", fn: () => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }) },
    ];

    let results = [];
    let cursorIdx = 0;
    let lastFocused = null;

    function score(query, text) {
      const q = query.toLowerCase().trim();
      if (!q) return 1;
      const t = text.toLowerCase();

      const direct = t.indexOf(q);
      if (direct === 0) return 1000;
      if (direct > 0) return 600 - direct;

      // Subsequence match, rewarding consecutive hits.
      let ti = 0;
      let total = 0;
      let streak = 0;
      for (const ch of q) {
        const at = t.indexOf(ch, ti);
        if (at < 0) return 0;
        streak = at === ti ? streak + 1 : 0;
        total += 10 + streak * 6 - Math.min(at - ti, 12);
        ti = at + 1;
      }
      return total;
    }

    function render(query) {
      const q = (query || "").trim();
      results = COMMANDS.map((c) => ({ cmd: c, s: score(q, c.label + " " + (c.hint || "") + " " + c.group) }))
        .filter((r) => r.s > 0)
        .sort((a, b) => b.s - a.s)
        .slice(0, 24);

      cursorIdx = 0;
      list.textContent = "";

      if (!results.length) {
        const li = document.createElement("li");
        li.className = "p-empty";
        li.textContent = "// no matches — try 'rag', 'adalat', 'github'";
        list.appendChild(li);
        input.setAttribute("aria-expanded", "false");
        return;
      }

      let currentGroup = null;
      results.forEach((r, i) => {
        if (r.cmd.group !== currentGroup) {
          currentGroup = r.cmd.group;
          const h = document.createElement("li");
          h.className = "p-group";
          h.textContent = "// " + currentGroup;
          h.setAttribute("role", "presentation");
          list.appendChild(h);
        }

        const li = document.createElement("li");
        li.setAttribute("role", "option");
        li.id = "p-opt-" + i;
        li.setAttribute("aria-selected", i === 0 ? "true" : "false");

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "p-item" + (i === 0 ? " is-cursor" : "");
        btn.innerHTML =
          '<span class="p-icon" aria-hidden="true"></span>' +
          '<span class="p-label"></span>' +
          '<span class="p-hint" aria-hidden="true"></span>';
        $(".p-icon", btn).textContent = r.cmd.icon || "›";
        $(".p-label", btn).textContent = r.cmd.label;
        $(".p-hint", btn).textContent = r.cmd.hint || "";

        btn.addEventListener("click", () => activate(i));
        btn.addEventListener("mousemove", () => setCursor(i));
        li.appendChild(btn);
        list.appendChild(li);
      });

      input.setAttribute("aria-expanded", "true");
      input.setAttribute("aria-activedescendant", "p-opt-0");
    }

    function setCursor(i) {
      if (i < 0 || i >= results.length) return;
      cursorIdx = i;
      $$(".p-item", list).forEach((el, idx) => {
        el.classList.toggle("is-cursor", idx === i);
        el.setAttribute("aria-selected", String(idx === i));
      });
      const active = $$(".p-item", list)[i];
      if (active) active.scrollIntoView({ block: "nearest" });
      const li = active && active.closest("li");
      if (li) input.setAttribute("aria-activedescendant", li.id);
    }

    function activate(i) {
      const r = results[i];
      if (!r) return;
      const cmd = r.cmd;
      close();

      if (cmd.url) {
        if (cmd.url.startsWith("mailto:")) window.location.href = cmd.url;
        else window.open(cmd.url, "_blank", "noopener");
        return;
      }
      if (cmd.fn) {
        cmd.fn();
        return;
      }
      if (cmd.go) {
        const target = $(cmd.go);
        if (target) {
          if (cmd.open) {
            const card = target.closest(".case") || target;
            if (!card.classList.contains("is-open")) $(".case-toggle", card)?.click();
          }
          target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
        }
      }
    }

    function open() {
      lastFocused = document.activeElement;
      overlay.classList.add("is-open");
      overlay.setAttribute("aria-hidden", "false");
      document.body.classList.add("palette-open");
      input.value = "";
      render("");
      window.setTimeout(() => input.focus(), 40);
    }

    function close() {
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
      document.body.classList.remove("palette-open");
      input.setAttribute("aria-expanded", "false");
      if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
    }

    const isOpen = () => overlay.classList.contains("is-open");

    if (openBtn) openBtn.addEventListener("click", open);
    overlay.addEventListener("mousedown", (e) => {
      if (e.target === overlay) close();
    });
    input.addEventListener("input", () => render(input.value));

    document.addEventListener("keydown", (e) => {
      const combo = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k";

      if (combo) {
        e.preventDefault();
        isOpen() ? close() : open();
        return;
      }

      if (!isOpen()) {
        // "/" is a familiar shortcut, but never hijack a form field.
        if (e.key === "/" && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || "")) {
          e.preventDefault();
          open();
        }
        return;
      }

      switch (e.key) {
        case "Escape":
          e.preventDefault();
          close();
          break;
        case "ArrowDown":
          e.preventDefault();
          setCursor(Math.min(cursorIdx + 1, results.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setCursor(Math.max(cursorIdx - 1, 0));
          break;
        case "Home":
          e.preventDefault();
          setCursor(0);
          break;
        case "End":
          e.preventDefault();
          setCursor(results.length - 1);
          break;
        case "Enter":
          e.preventDefault();
          activate(cursorIdx);
          break;
        case "Tab": {
          // Keep focus inside the dialog.
          const focusables = $$('button, input, [href], [tabindex]:not([tabindex="-1"])', overlay).filter(
            (el) => el.offsetParent !== null
          );
          if (!focusables.length) break;
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
          break;
        }
      }
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

    document.addEventListener("mouseleave", () => document.body.classList.remove("cursor-ready"));

    const loop = () => {
      rx += (mx - rx) * 0.17;
      ry += (my - ry) * 0.17;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      requestAnimationFrame(loop);
    };
    loop();

    const hot = "a, button, input, textarea, .case, .skill, .spec-row, .log-row, .board-cell, .cred";
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
        const x = (e.clientX - r.left - r.width / 2) * 0.2;
        const y = (e.clientY - r.top - r.height / 2) * 0.3;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
      });
    });
  }

  /* ── CONTACT FORM ──────────────────────────────────────── */
  function initForm() {
    const form = $("#contactForm");
    if (!form) return;

    const status = $("#formStatus");
    const submit = $("#cfSubmit");
    const label = $(".btn-label", submit);

    const fields = [
      { input: $("#cf-name"), err: $("#err-name"), test: (v) => v.trim().length >= 2, msg: "enter at least 2 characters" },
      { input: $("#cf-email"), err: $("#err-email"), test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()), msg: "enter a valid email address" },
      { input: $("#cf-message"), err: $("#err-message"), test: (v) => v.trim().length >= 12, msg: "tell me a little more (12+ characters)" },
    ].filter((f) => f.input);

    const setFieldError = (f, msg) => {
      const wrap = f.input.closest(".field");
      if (wrap) wrap.classList.toggle("has-error", Boolean(msg));
      if (f.err) {
        f.err.textContent = msg || "";
        f.err.hidden = !msg;
      }
      f.input.setAttribute("aria-invalid", msg ? "true" : "false");
      if (msg && f.err) f.input.setAttribute("aria-describedby", f.err.id);
    };

    fields.forEach((f) => {
      f.input.addEventListener("blur", () => {
        if (f.input.value) setFieldError(f, f.test(f.input.value) ? "" : f.msg);
      });
      f.input.addEventListener("input", () => {
        if (f.input.closest(".field")?.classList.contains("has-error") && f.test(f.input.value)) {
          setFieldError(f, "");
        }
      });
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Honeypot: bots fill it, people never see it.
      const hp = $("#cf-company");
      if (hp && hp.value) return;

      let ok = true;
      fields.forEach((f) => {
        const valid = f.test(f.input.value);
        setFieldError(f, valid ? "" : f.msg);
        if (!valid && ok) {
          f.input.focus();
          ok = false;
        }
      });

      if (!ok) {
        status.className = "form-status is-err";
        status.textContent = "// fix the highlighted fields and retry";
        return;
      }

      const name = $("#cf-name").value.trim();
      const email = $("#cf-email").value.trim();
      const message = $("#cf-message").value.trim();

      // Not wired to Formspree yet — fall back to the visitor's mail client
      // rather than pretending the message was sent.
      if (form.action.includes("YOUR_FORM_ID") || CONFIG.formspreeId === "YOUR_FORM_ID") {
        const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
        const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
        status.className = "form-status is-ok";
        status.textContent = "// formspree not configured — opening your mail client instead";
        window.location.href = `mailto:${CONFIG.email}?subject=${subject}&body=${body}`;
        return;
      }

      submit.disabled = true;
      if (label) label.textContent = "Sending…";
      status.className = "form-status";
      status.textContent = "// transmitting…";

      try {
        const res = await fetch(form.action, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
        });

        if (res.ok) {
          form.reset();
          fields.forEach((f) => setFieldError(f, ""));
          status.className = "form-status is-ok";
          status.textContent = "// message sent — I'll reply within a day";
          if (label) label.textContent = "Sent ✓";
          window.setTimeout(() => {
            if (label) label.textContent = "Send message";
          }, 3200);
        } else {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.error || `request failed (${res.status})`);
        }
      } catch (err) {
        status.className = "form-status is-err";
        status.textContent = `// ${err.message} — email me directly instead`;
        if (label) label.textContent = "Send message";
      } finally {
        submit.disabled = false;
      }
    });
  }

  /* ── 3D AGENT GRAPH ────────────────────────────────────── */
  function hasWebGL() {
    try {
      const c = document.createElement("canvas");
      return Boolean(
        window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl"))
      );
    } catch (e) {
      return false;
    }
  }

  function cssColor(varName, fallback) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    return v || fallback;
  }

  async function initAgentGraph() {
    const panel = $("#graphPanel");
    const canvas = $("#agentGraph");
    if (!panel || !canvas) return;

    const degrade = () => panel.classList.add("no-webgl");

    if (!hasWebGL() || smallScreen.matches) {
      degrade();
      return;
    }

    let THREE;
    try {
      THREE = await import(
        `https://cdn.jsdelivr.net/npm/three@${CONFIG.threeVersion}/build/three.module.js`
      );
    } catch (e) {
      degrade(); // CDN blocked or offline — the SVG topology takes over
      return;
    }

    const stage = canvas.parentElement;
    let width = stage.clientWidth || 600;
    let height = stage.clientHeight || 450;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch (e) {
      degrade();
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 9.4);

    const world = new THREE.Group();
    scene.add(world);

    /* Topology: one supervisor, ten workers on a Fibonacci sphere. */
    const WORKERS = 10;
    const RADIUS = 3.15;
    const golden = Math.PI * (3 - Math.sqrt(5));
    const workerPos = [];

    for (let i = 0; i < WORKERS; i++) {
      const y = 1 - (i / (WORKERS - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * i;
      workerPos.push(
        new THREE.Vector3(Math.cos(theta) * r * RADIUS, y * RADIUS * 0.72, Math.sin(theta) * r * RADIUS)
      );
    }

    const supervisorPos = new THREE.Vector3(0, 0, 0);

    /* Materials — recoloured on theme change. */
    const supMat = new THREE.MeshBasicMaterial({ color: cssColor("--signal", "#2ee6a8") });
    const haloMat = new THREE.MeshBasicMaterial({
      color: cssColor("--signal", "#2ee6a8"),
      transparent: true,
      opacity: 0.13,
    });
    const workerMat = new THREE.MeshBasicMaterial({ color: cssColor("--plasma", "#8b5cf6") });
    const edgeMat = new THREE.LineBasicMaterial({
      color: cssColor("--signal", "#2ee6a8"),
      transparent: true,
      opacity: 0.24,
    });
    const meshEdgeMat = new THREE.LineBasicMaterial({
      color: cssColor("--plasma", "#8b5cf6"),
      transparent: true,
      opacity: 0.14,
    });
    const packetMat = new THREE.MeshBasicMaterial({ color: cssColor("--signal-hi", "#74f7cb") });

    const sphere = new THREE.SphereGeometry(1, 22, 22);

    const supervisor = new THREE.Mesh(sphere, supMat);
    supervisor.scale.setScalar(0.3);
    world.add(supervisor);

    const halo = new THREE.Mesh(sphere, haloMat);
    halo.scale.setScalar(0.56);
    world.add(halo);

    workerPos.forEach((p) => {
      const m = new THREE.Mesh(sphere, workerMat);
      m.position.copy(p);
      m.scale.setScalar(0.115);
      world.add(m);
    });

    /* Edges: supervisor → every worker, plus nearest-neighbour links. */
    const edges = [];
    const hubPts = [];
    workerPos.forEach((p) => {
      hubPts.push(supervisorPos.x, supervisorPos.y, supervisorPos.z, p.x, p.y, p.z);
      edges.push([supervisorPos.clone(), p.clone()]);
    });

    const hubGeo = new THREE.BufferGeometry();
    hubGeo.setAttribute("position", new THREE.Float32BufferAttribute(hubPts, 3));
    world.add(new THREE.LineSegments(hubGeo, edgeMat));

    const meshPts = [];
    workerPos.forEach((p, i) => {
      const distances = workerPos
        .map((q, j) => ({ j, d: p.distanceTo(q) }))
        .filter((o) => o.j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 2);

      distances.forEach(({ j }) => {
        if (j < i) return; // emit each pair once
        const q = workerPos[j];
        meshPts.push(p.x, p.y, p.z, q.x, q.y, q.z);
        edges.push([p.clone(), q.clone()]);
      });
    });

    const meshGeo = new THREE.BufferGeometry();
    meshGeo.setAttribute("position", new THREE.Float32BufferAttribute(meshPts, 3));
    world.add(new THREE.LineSegments(meshGeo, meshEdgeMat));

    /* Packets travelling the graph. */
    const packetGeo = new THREE.SphereGeometry(0.055, 8, 8);
    const packets = Array.from({ length: 16 }, () => {
      const mesh = new THREE.Mesh(packetGeo, packetMat);
      world.add(mesh);
      return {
        mesh,
        edge: Math.floor(Math.random() * edges.length),
        t: Math.random(),
        speed: 0.0035 + Math.random() * 0.0075,
        dir: Math.random() < 0.5 ? 1 : -1,
      };
    });

    /* Depth: a faint starfield behind the topology. */
    const starPts = [];
    for (let i = 0; i < 260; i++) {
      starPts.push(
        (Math.random() - 0.5) * 26,
        (Math.random() - 0.5) * 18,
        -3 - Math.random() * 16
      );
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.Float32BufferAttribute(starPts, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x7f8b9c,
      size: 0.035,
      transparent: true,
      opacity: 0.45,
      sizeAttenuation: true,
    });
    scene.add(new THREE.Points(starGeo, starMat));

    /* Pointer parallax */
    let targetX = 0;
    let targetY = 0;
    let pointerX = 0;
    let pointerY = 0;

    if (!reduced) {
      window.addEventListener(
        "pointermove",
        (e) => {
          targetX = (e.clientX / window.innerWidth - 0.5) * 0.5;
          targetY = (e.clientY / window.innerHeight - 0.5) * 0.34;
        },
        { passive: true }
      );
    }

    /* Resize */
    const resize = () => {
      width = stage.clientWidth || width;
      height = stage.clientHeight || height;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    if (typeof ResizeObserver === "function") {
      new ResizeObserver(resize).observe(stage);
    } else {
      window.addEventListener("resize", resize, { passive: true });
    }
    resize();

    /* Theme sync */
    const recolor = () => {
      supMat.color.set(cssColor("--signal", "#2ee6a8"));
      haloMat.color.set(cssColor("--signal", "#2ee6a8"));
      workerMat.color.set(cssColor("--plasma", "#8b5cf6"));
      edgeMat.color.set(cssColor("--signal", "#2ee6a8"));
      meshEdgeMat.color.set(cssColor("--plasma", "#8b5cf6"));
      packetMat.color.set(cssColor("--signal-hi", "#74f7cb"));
      if (reduced) renderer.render(scene, camera);
    };
    document.addEventListener("themechange", recolor);

    /* Reduced motion: one composed frame, no loop, no rAF cost. */
    if (reduced) {
      world.rotation.set(-0.18, 0.6, 0);
      packets.forEach((p) => {
        const [a, b] = edges[p.edge];
        p.mesh.position.lerpVectors(a, b, p.t);
      });
      renderer.render(scene, camera);
      return;
    }

    /* Only animate while the hero is actually on screen. */
    let visible = true;
    if (typeof IntersectionObserver === "function") {
      new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            visible = en.isIntersecting;
          });
        },
        { threshold: 0 }
      ).observe(panel);
    }

    let raf = 0;
    const clock = new THREE.Clock();
    const tmp = new THREE.Vector3();

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden) return;

      const dt = Math.min(clock.getDelta(), 0.05);
      const step = dt * 60; // normalise to ~60fps regardless of refresh rate

      world.rotation.y += 0.0022 * step;

      pointerX += (targetX - pointerX) * 0.045 * step;
      pointerY += (targetY - pointerY) * 0.045 * step;
      world.rotation.x = pointerY;
      world.rotation.z = pointerX * 0.12;

      const pulse = 1 + Math.sin(clock.elapsedTime * 1.6) * 0.06;
      supervisor.scale.setScalar(0.3 * pulse);
      halo.scale.setScalar(0.56 + Math.sin(clock.elapsedTime * 1.1) * 0.05);

      packets.forEach((p) => {
        p.t += p.speed * p.dir * step;
        if (p.t > 1 || p.t < 0) {
          p.edge = Math.floor(Math.random() * edges.length);
          p.dir = Math.random() < 0.5 ? 1 : -1;
          p.t = p.dir === 1 ? 0 : 1;
        }
        const [a, b] = edges[p.edge];
        p.mesh.position.copy(tmp.lerpVectors(a, b, p.t));
        // Arc slightly outward so packets read as traffic, not a straight line.
        p.mesh.position.multiplyScalar(1 + Math.sin(p.t * Math.PI) * 0.06);
      });

      renderer.render(scene, camera);
    };

    frame();

    /* Free the GPU when the tab goes away. */
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf && !reduced) {
        clock.getDelta();
        frame();
      }
    });
  }

  /* ── FOOTER YEAR ───────────────────────────────────────── */
  function initYear() {
    const el = $("#year");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /* ── BOOT ──────────────────────────────────────────────── */
  function boot() {
    initPendingLinks();
    initTheme();
    initMenu();
    initScrollChrome();
    initActiveNav();
    initReveal();
    initBars();
    initCounters();
    initCases();
    initLogRows();
    initFilters();
    initTimeline();
    initPalette();
    initCursor();
    initMagnetic();
    initForm();
    initYear();

    // 3D is independent — never let it block the page.
    initAgentGraph().catch(() => {
      const panel = $("#graphPanel");
      if (panel) panel.classList.add("no-webgl");
    });

    // Hero typing waits for the boot overlay so they don't fight.
    initBoot(runTyping);
  }

  // Keep up if the user flips the OS motion setting mid-session.
  const onMotionChange = () => {
    reduced = motionQuery.matches;
    if (reduced) {
      $$(".reveal").forEach((el) => el.classList.add("is-in"));
      $$(".bar").forEach((b) => b.classList.add("is-lit"));
      $$(".char").forEach((c) => c.classList.add("is-shown"));
      $$(".mask-reveal").forEach((m) => m.classList.add("is-in"));
      const fill = $("#timelineFill");
      if (fill) fill.style.setProperty("--fill", "1");
      document.body.classList.remove("cursor-ready", "cursor-hot", "booting", "boot-done");
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
