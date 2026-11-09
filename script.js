/* ==========================================================================
   SHAHKAR AHMAD — Portfolio v7
   Theme, menu, command palette, case studies, project filters, contact form.
   No framework, no dependencies; every animated path respects reduced motion.
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
};

(function () {
  "use strict";

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reduced = motionQuery.matches;

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

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
    if (meta) meta.setAttribute("content", theme === "dark" ? "#121110" : "#f6f3ee");
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

  /* ── ACTIVE NAV LINK ───────────────────────────────────── */
  function initActiveNav() {
    const links = $$(".nav-link");
    // The hero (#top) has no nav link, so reaching it clears the highlight.
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

  /* ── COMMAND PALETTE ───────────────────────────────────── */
  function initPalette() {
    const overlay = $("#palette");
    const input = $("#paletteInput");
    const list = $("#paletteResults");
    const openBtn = $("#paletteOpen");
    if (!overlay || !input || !list) return;

    const COMMANDS = [
      { group: "Sections", icon: "→", label: "Selected work", hint: "Section", go: "#work" },
      { group: "Sections", icon: "→", label: "About", hint: "Section", go: "#about" },
      { group: "Sections", icon: "→", label: "Expertise", hint: "Section", go: "#expertise" },
      { group: "Sections", icon: "→", label: "Experience and education", hint: "Section", go: "#experience" },
      { group: "Sections", icon: "→", label: "Awards and certificates", hint: "Section", go: "#recognition" },
      { group: "Sections", icon: "→", label: "Contact", hint: "Section", go: "#contact" },

      { group: "Projects", icon: "◆", label: "MootCourtSimulator — argue a case against AI agents", hint: "2026", go: "#project-mootcourt", open: true },
      { group: "Projects", icon: "◆", label: "Text-to-SQL with GRPO — execution-verified RL", hint: "2026", go: "#project-text2sql", open: true },
      { group: "Projects", icon: "◆", label: "AI Content Factory — 10-agent pipeline (FYP)", hint: "2025–26", go: "#project-content-factory", open: true },
      { group: "Projects", icon: "◆", label: "Live Agent Hub — AI personas", hint: "2025", go: "#project-live-agent-hub", open: true },
      { group: "Projects", icon: "◆", label: "ChessMastermind — engine from scratch", hint: "2025", go: "#project-chess", open: true },
      { group: "Projects", icon: "◆", label: "YouTube Video Summariser", hint: "2024", go: "#project-yt", open: true },

      { group: "Recognition", icon: "★", label: "Honorable Mention — Top 5 of 35, GIK Institute", hint: "2026", go: "#recognition" },
      { group: "Recognition", icon: "✓", label: "Advanced AI Bootcamp — Grade B+", hint: "2026", go: "#recognition" },
      { group: "Recognition", icon: "⚑", label: "Qwenathon 2026 — participant, team Xtreme Coders", hint: "Hackathon", go: "#recognition" },

      { group: "Expertise", icon: "#", label: "LangGraph & LangChain", hint: "Skill", go: "#expertise" },
      { group: "Expertise", icon: "#", label: "Multi-agent workflows", hint: "Skill", go: "#expertise" },
      { group: "Expertise", icon: "#", label: "LLM fine-tuning — LoRA, QLoRA, GRPO", hint: "Skill", go: "#expertise" },
      { group: "Expertise", icon: "#", label: "Hugging Face PEFT & TRL", hint: "Skill", go: "#expertise" },
      { group: "Expertise", icon: "#", label: "Hybrid RAG & retrieval", hint: "Skill", go: "#expertise" },
      { group: "Expertise", icon: "#", label: "Model Context Protocol", hint: "Skill", go: "#expertise" },
      { group: "Expertise", icon: "#", label: "Python & TypeScript", hint: "Skill", go: "#expertise" },
      { group: "Expertise", icon: "#", label: "FastAPI & Express.js", hint: "Skill", go: "#expertise" },
      { group: "Expertise", icon: "#", label: "PostgreSQL & Drizzle", hint: "Skill", go: "#expertise" },
      { group: "Expertise", icon: "#", label: "React & Tailwind", hint: "Skill", go: "#expertise" },

      { group: "Links", icon: "↗", label: "GitHub — Shah-123", hint: "External", url: "https://github.com/Shah-123" },
      { group: "Links", icon: "↗", label: "LinkedIn — Shahkar Ahmad", hint: "External", url: "https://www.linkedin.com/in/shahkar-ahmad-730b41279/" },
      { group: "Links", icon: "↓", label: "Download CV (PDF)", hint: "PDF", url: "./assets/Shahkar%20Ahmad%20Shah.pdf" },
      { group: "Links", icon: "@", label: "Email shahkarahmad342@gmail.com", hint: "Email", url: "mailto:" + CONFIG.email },

      { group: "Actions", icon: "◐", label: "Toggle colour theme", hint: "Action", fn: () => $("#themeToggle")?.click() },
      { group: "Actions", icon: "↑", label: "Back to top", hint: "Action", fn: () => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }) },
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
        li.textContent = "No matches. Try 'rag', 'grpo' or 'github'.";
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
          h.textContent = currentGroup;
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

  /* ── CONTACT FORM ──────────────────────────────────────── */
  function initForm() {
    const form = $("#contactForm");
    if (!form) return;

    const status = $("#formStatus");
    const submit = $("#cfSubmit");
    const label = $(".btn-label", submit);

    const fields = [
      { input: $("#cf-name"), err: $("#err-name"), test: (v) => v.trim().length >= 2, msg: "Enter at least 2 characters." },
      { input: $("#cf-email"), err: $("#err-email"), test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()), msg: "Enter a valid email address." },
      { input: $("#cf-message"), err: $("#err-message"), test: (v) => v.trim().length >= 12, msg: "Tell me a little more (12 characters or more)." },
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
        status.textContent = "Fix the highlighted fields and try again.";
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
        status.textContent = "The form isn't connected yet, so your mail app is opening instead.";
        window.location.href = `mailto:${CONFIG.email}?subject=${subject}&body=${body}`;
        return;
      }

      submit.disabled = true;
      if (label) label.textContent = "Sending…";
      status.className = "form-status";
      status.textContent = "Sending your message…";

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
          status.textContent = "Message sent. I'll reply within a day.";
          if (label) label.textContent = "Sent";
          window.setTimeout(() => {
            if (label) label.textContent = "Send message";
          }, 3200);
        } else {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.error || `Request failed (${res.status})`);
        }
      } catch (err) {
        status.className = "form-status is-err";
        status.textContent = `${err.message}. Email me directly instead.`;
        if (label) label.textContent = "Send message";
      } finally {
        submit.disabled = false;
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
    initActiveNav();
    initCases();
    initLogRows();
    initFilters();
    initPalette();
    initForm();
    initYear();
  }

  // Keep up if the user flips the OS motion setting mid-session.
  const onMotionChange = () => {
    reduced = motionQuery.matches;
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
