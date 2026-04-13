/* ============================================================
   SHAHKAR AHMAD — Portfolio script.js v2.0 "Nova"
   ============================================================ */

/* ── Utility: check if user prefers reduced motion ── */
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ── Toggle hamburger menu ── */
function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

/* ── SCROLL REVEAL ── */
function initScrollReveal() {
  if (prefersReducedMotion) {
    document.querySelectorAll(".reveal").forEach(el => el.classList.add("visible"));
    return;
  }

  const reveals = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("visible");
          }, index * 70);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -50px 0px" }
  );

  reveals.forEach((el) => observer.observe(el));
}

/* ── SKILL BAR ANIMATION ── */
function initSkillBars() {
  const bars = document.querySelectorAll(".skill-bar");

  if (prefersReducedMotion) {
    bars.forEach((bar) => {
      const width = bar.getAttribute("data-width");
      bar.style.width = width + "%";
      bar.style.transition = "none";
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const width = bar.getAttribute("data-width");
          setTimeout(() => {
            bar.style.width = width + "%";
          }, 250);
          observer.unobserve(bar);
        }
      });
    },
    { threshold: 0.3 }
  );

  bars.forEach((bar) => observer.observe(bar));
}

/* ── NAVBAR SCROLL EFFECT ── */
function initNavScroll() {
  const header = document.querySelector("header");

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        if (scrollY > 80) {
          header.style.boxShadow = "0 4px 32px rgba(0,0,0,0.3)";
        } else {
          header.style.boxShadow = "none";
        }
        ticking = false;
      });
      ticking = true;
    }
  });
}

/* ── ACTIVE NAV LINK ── */
function initActiveNav() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            const isActive = link.getAttribute("href") === `#${id}`;
            link.style.color = isActive ? "var(--accent-primary)" : "";
            link.style.background = isActive ? "rgba(99,102,241,0.1)" : "";
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ── TYPING EFFECT ── */
function initTypingEffect() {
  const el = document.querySelector(".hero-name");
  if (!el) return;

  const text1 = "Shahkar";
  const text2 = "Ahmad";

  el.innerHTML =
    '<span class="type-line1"></span><span class="type-line2"></span><span class="type-cursor">|</span>';

  const line1 = el.querySelector(".type-line1");
  const line2 = el.querySelector(".type-line2");
  const cursor = el.querySelector(".type-cursor");

  if (prefersReducedMotion) {
    line1.textContent = text1;
    line1.insertAdjacentHTML("afterend", "<br />");
    line2.textContent = text2;
    cursor.style.display = "none";
    return;
  }

  let i = 0;
  let j = 0;
  cursor.classList.add("blink");

  function typeWriter() {
    cursor.classList.remove("blink");
    if (i < text1.length) {
      line1.innerHTML += text1.charAt(i);
      i++;
      setTimeout(typeWriter, 95);
    } else if (i === text1.length && j === 0) {
      line1.insertAdjacentHTML("afterend", "<br />");
      j++;
      setTimeout(typeWriter, 280);
    } else if (j <= text2.length) {
      line2.innerHTML += text2.charAt(j - 1);
      j++;
      setTimeout(typeWriter, 95);
    } else {
      cursor.classList.add("blink");
    }
  }

  setTimeout(typeWriter, 700);
}

/* ── CUSTOM CURSOR ── */
function initCustomCursor() {
  const dot = document.getElementById("cursor-dot");
  const trail = document.getElementById("cursor-trail");
  if (!dot || !trail || prefersReducedMotion) return;

  let mouseX = 0, mouseY = 0;
  let dotX = 0, dotY = 0;
  let trailX = 0, trailY = 0;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    dotX += (mouseX - dotX) * 0.55;
    dotY += (mouseY - dotY) * 0.55;
    trailX += (mouseX - trailX) * 0.12;
    trailY += (mouseY - trailY) * 0.12;

    dot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
    trail.style.transform = `translate(${trailX}px, ${trailY}px) translate(-50%, -50%)`;

    requestAnimationFrame(animate);
  }

  animate();

  const interactives = document.querySelectorAll(
    "a, button, .social-btn, .project-card, .skill-category, .contact-card"
  );
  interactives.forEach((el) => {
    el.addEventListener("mouseenter", () =>
      document.body.classList.add("cursor-hover-active")
    );
    el.addEventListener("mouseleave", () =>
      document.body.classList.remove("cursor-hover-active")
    );
  });
}

/* ── HERO IMAGE TILT EFFECT ── */
function initHeroTilt() {
  const wrapper = document.querySelector(".hero-image-wrapper");
  if (!wrapper || prefersReducedMotion) return;

  const profile = document.getElementById("profile");
  if (!profile) return;

  profile.addEventListener("mousemove", (e) => {
    const rect = profile.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);

    const tiltX = dy * 8;
    const tiltY = -dx * 8;

    wrapper.style.transform = `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.04, 1.04, 1.04)`;
    wrapper.style.transition = "transform 0.15s ease";
  });

  profile.addEventListener("mouseleave", () => {
    wrapper.style.transform = "perspective(600px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    wrapper.style.transition = "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
  });
}

/* ── NEURAL NETWORK CANVAS BACKGROUND ── */
function initCanvasBackground() {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;

  if (prefersReducedMotion) {
    canvas.style.display = "none";
    return;
  }

  const ctx = canvas.getContext("2d");
  let width, height, particles = [], pulses = [];
  let mouse = { x: null, y: null };
  let animId = null;

  function resize() {
    const profile = document.getElementById("profile");
    if (!profile) return;
    width = profile.offsetWidth;
    height = profile.offsetHeight;
    canvas.width = width;
    canvas.height = height;
    initParticles();
  }

  // Debounce resize
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });

  const profile = document.getElementById("profile");
  if (profile) {
    profile.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    profile.addEventListener("mouseleave", () => {
      mouse.x = null;
      mouse.y = null;
    });
  }

  class Particle {
    constructor() { this.reset(); }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1; // Slightly larger for glow
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.baseAlpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x > width || this.x < 0) this.vx *= -1;
      if (this.y > height || this.y < 0) this.vy *= -1;
    }

    draw() {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      const r = isDark ? 129 : 99;
      const g = isDark ? 140 : 102;
      const b = isDark ? 248 : 241;
      
      ctx.shadowBlur = 10;
      ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.8)`;
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.baseAlpha})`;
      
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0; // reset for lines
    }
  }

  class Pulse {
    constructor(startX, startY, targetX, targetY, color) {
      this.x = startX;
      this.y = startY;
      this.targetX = targetX;
      this.targetY = targetY;
      this.color = color;
      this.progress = 0;
      this.speed = 0.01 + Math.random() * 0.02; // Speed of the data pulse
      this.active = true;
    }

    update() {
      this.progress += this.speed;
      if (this.progress >= 1) {
        this.active = false;
      }
    }

    draw() {
      if (!this.active) return;
      const currentX = this.x + (this.targetX - this.x) * this.progress;
      const currentY = this.y + (this.targetY - this.y) * this.progress;
      
      ctx.shadowBlur = 15;
      ctx.shadowColor = this.color;
      ctx.fillStyle = this.color;
      
      ctx.beginPath();
      ctx.arc(currentX, currentY, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function initParticles() {
    const count = window.innerWidth < 768 ? 40 : 80;
    particles = Array.from({ length: count }, () => new Particle());
    pulses = []; // Reset pulses on resize
  }

  function connectParticles() {
    const maxDist = window.innerWidth < 768 ? 90 : 130;
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const baseColor = isDark ? "129, 140, 248" : "99, 102, 241";
    // Aurora accent colors for data pulses
    const pulseColor = isDark ? "rgba(168, 85, 247, 0.9)" : "rgba(8, 145, 178, 0.9)"; 

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const opacity = (1 - dist / maxDist) * (isDark ? 0.3 : 0.2);
          ctx.strokeStyle = `rgba(${baseColor}, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();

          // Randomly spawn pulses on connected lines (simulate neural data firing)
          // Adjust 0.001 probability for more or fewer pulses
          if (Math.random() < 0.001) {
            pulses.push(new Pulse(particles[i].x, particles[i].y, particles[j].x, particles[j].y, pulseColor));
          }
        }
      }

      if (mouse.x !== null && mouse.y !== null) {
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 160) {
          const opacity = (1 - dist / 160) * (isDark ? 0.6 : 0.4);
          ctx.strokeStyle = `rgba(${baseColor}, ${opacity})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
          
          // Draw a soft glowing energy ring around the mouse connection radius
          ctx.shadowBlur = 20;
          ctx.shadowColor = `rgba(${baseColor}, 0.5)`;
          ctx.beginPath();
          ctx.arc(mouse.x, mouse.y, dist, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${baseColor}, ${opacity * 0.05})`;
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    // Connections update first so particles and pulses sit on top
    connectParticles();
    
    particles.forEach(p => { p.update(); p.draw(); });
    
    // Draw data pulses
    for (let i = pulses.length - 1; i >= 0; i--) {
      pulses[i].update();
      pulses[i].draw();
      if (!pulses[i].active) {
        pulses.splice(i, 1);
      }
    }
    
    animId = requestAnimationFrame(animate);
  }

  setTimeout(() => {
    resize();
    animate();
  }, 100);
}

/* ── THEME TOGGLE ── */
function initThemeToggle() {
  const toggleBtns = document.querySelectorAll(".theme-btn");
  const html = document.documentElement;

  // Apply saved or system preference
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    html.setAttribute("data-theme", savedTheme);
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    html.setAttribute("data-theme", "dark");
  }

  toggleBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const current = html.getAttribute("data-theme") || "light";
      const next = current === "dark" ? "light" : "dark";
      html.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    });
  });
}

/* ── SMOOTH CLOSE MENU ON LINK CLICK ── */
function initMenuClose() {
  const navLinks = document.querySelectorAll(".menu-links a");
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      const menu = document.querySelector(".menu-links");
      const icon = document.querySelector(".hamburger-icon");
      if (menu.classList.contains("open")) {
        menu.classList.remove("open");
        icon.classList.remove("open");
      }
    });
  });
}

/* ── INIT ALL ── */
document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initScrollReveal();
  initSkillBars();
  initNavScroll();
  initActiveNav();
  initTypingEffect();
  initCustomCursor();
  initHeroTilt();
  initCanvasBackground();
  initMenuClose();
});