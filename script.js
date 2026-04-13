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

/* ── INIT ALL ── */
document.addEventListener("DOMContentLoaded", () => {
  initScrollReveal();
  initSkillBars();
  initNavScroll();
  initActiveNav();
  initTypingEffect();
});
