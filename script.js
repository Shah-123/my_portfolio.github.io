/* Toggle hamburger menu */
function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

/* ── SCROLL REVEAL ANIMATION ── */
function initScrollReveal() {
  const reveals = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Stagger the animations slightly
          setTimeout(() => {
            entry.target.classList.add("visible");
          }, index * 80);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -60px 0px",
    }
  );

  reveals.forEach((el) => observer.observe(el));
}

/* ── SKILL BAR ANIMATION ── */
function initSkillBars() {
  const bars = document.querySelectorAll(".skill-bar");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const width = bar.getAttribute("data-width");
          setTimeout(() => {
            bar.style.width = width + "%";
          }, 300);
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
  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 100) {
      header.style.boxShadow = "0 4px 30px rgba(0,0,0,0.4)";
    } else {
      header.style.boxShadow = "none";
    }

    lastScroll = currentScroll;
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
            link.style.color = "";
            if (link.getAttribute("href") === `#${id}`) {
              link.style.color = "var(--text-primary)";
            }
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
  
  el.innerHTML = '<span class="type-line1"></span><span class="type-line2"></span><span class="type-cursor">|</span>';
  
  const line1 = el.querySelector('.type-line1');
  const line2 = el.querySelector('.type-line2');
  const cursor = el.querySelector('.type-cursor');
  
  let i = 0;
  let j = 0;
  
  cursor.classList.add('blink');
  
  function typeWriter() {
    cursor.classList.remove('blink');
    if (i < text1.length) {
      line1.innerHTML += text1.charAt(i);
      i++;
      setTimeout(typeWriter, 100);
    } else if (i === text1.length && j === 0) {
      line1.insertAdjacentHTML('afterend', '<br />');
      j++; 
      setTimeout(typeWriter, 300); 
    } else if (j <= text2.length) {
      line2.innerHTML += text2.charAt(j-1);
      j++;
      setTimeout(typeWriter, 100);
    } else {
      cursor.classList.add('blink');
    }
  }
  
  setTimeout(typeWriter, 800);
}

/* ── CUSTOM CURSOR ── */
function initCustomCursor() {
  const dot = document.getElementById("cursor-dot");
  const trail = document.getElementById("cursor-trail");
  if (!dot || !trail) return;

  let mouseX = 0, mouseY = 0;
  let dotX = 0, dotY = 0;
  let trailX = 0, trailY = 0;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    dotX += (mouseX - dotX) * 0.5;
    dotY += (mouseY - dotY) * 0.5;
    
    trailX += (mouseX - trailX) * 0.15;
    trailY += (mouseY - trailY) * 0.15;

    dot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
    trail.style.transform = `translate(${trailX}px, ${trailY}px) translate(-50%, -50%)`;

    requestAnimationFrame(animate);
  }

  animate();

  const interactives = document.querySelectorAll("a, button, .social-btn, .project-card, .skill-category");
  interactives.forEach(el => {
    el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover-active"));
    el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover-active"));
  });
}

/* ── CANVAS BACKGROUND ── */
function initCanvasBackground() {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width, height;
  let particles = [];
  let mouse = { x: null, y: null };

  function resize() {
    const profile = document.getElementById("profile");
    width = profile.offsetWidth;
    height = profile.offsetHeight;
    canvas.width = width;
    canvas.height = height;
    initParticles();
  }

  window.addEventListener("resize", resize);
  
  const profile = document.getElementById("profile");
  profile.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  
  profile.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      
      if (this.x > width || this.x < 0) this.vx *= -1;
      if (this.y > height || this.y < 0) this.vy *= -1;
    }
    draw() {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      ctx.fillStyle = isDark ? "rgba(99, 102, 241, 0.4)" : "rgba(99, 102, 241, 0.2)";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    const numParticles = window.innerWidth < 768 ? 40 : 80;
    for (let i = 0; i < numParticles; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    let maxDistance = window.innerWidth < 768 ? 80 : 120;
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < maxDistance) {
          let opacity = 1 - (distance / maxDistance);
          ctx.strokeStyle = isDark ? `rgba(99, 102, 241, ${opacity * 0.2})` : `rgba(79, 70, 229, ${opacity * 0.15})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
      
      if (mouse.x && mouse.y) {
        let dx = particles[i].x - mouse.x;
        let dy = particles[i].y - mouse.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 150) {
           let opacity = 1 - (distance / 150);
           ctx.strokeStyle = isDark ? `rgba(99, 102, 241, ${opacity * 0.4})` : `rgba(79, 70, 229, ${opacity * 0.3})`;
           ctx.lineWidth = 1;
           ctx.beginPath();
           ctx.moveTo(particles[i].x, particles[i].y);
           ctx.lineTo(mouse.x, mouse.y);
           ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    connectParticles();
    requestAnimationFrame(animate);
  }

  // Force first resize to happen after fonts/images load
  setTimeout(() => {
    resize();
    animate();
  }, 100);
}

/* ── THEME TOGGLE ── */
function initThemeToggle() {
  const toggleBtns = document.querySelectorAll(".theme-btn");
  const html = document.documentElement;
  
  // Check local storage or system preference
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    html.setAttribute("data-theme", savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    html.setAttribute("data-theme", "dark");
  }

  toggleBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const currentTheme = html.getAttribute("data-theme") || "light";
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      html.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
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
  initCanvasBackground();
});
