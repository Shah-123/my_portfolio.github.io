import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { navLinks, profile } from "../data/site";
import { useActiveSection } from "../hooks/useActiveSection";
import type { Theme } from "../hooks/useTheme";
import { ButtonLink } from "./ui/Button";
import { ThemeToggle } from "./ui/ThemeToggle";
import styles from "./Navbar.module.css";

const SECTION_IDS = navLinks.map((link) => link.href.slice(1));

interface NavbarProps {
  theme: Theme;
  onToggleTheme: () => void;
}

export function Navbar({ theme, onToggleTheme }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useActiveSection(SECTION_IDS);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock the page behind the mobile sheet, and let Escape close it.
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <>
      <header className={`${styles.header} ${scrolled || menuOpen ? styles.scrolled : ""}`}>
        <div className={`shell ${styles.inner}`}>
          <a href="#top" className={styles.brand} aria-label={`${profile.name} — home`}>
            <span className={styles.monogram} aria-hidden="true">
              {profile.initials}
            </span>
            <span className={styles.brandText}>{profile.wordmark}</span>
          </a>

          <nav className={styles.nav} aria-label="Primary">
            {navLinks.map((link) => {
              const id = link.href.slice(1);
              const isActive = active === id;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
                  aria-current={isActive ? "true" : undefined}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className={styles.pill}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {link.label}
                </a>
              );
            })}
          </nav>

          <div className={styles.actions}>
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            <ButtonLink
              href={profile.resume}
              variant="secondary"
              size="small"
              className={styles.resumeBtn}
              icon={<ArrowUpRight size={14} strokeWidth={1.8} />}
              download
            >
              Résumé
            </ButtonLink>
            <button
              type="button"
              className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ""}`}
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <span className={styles.burgerBars} aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className={styles.sheet}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav aria-label="Mobile">
              {navLinks.map((link, index) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={styles.sheetLink}
                  onClick={() => setMenuOpen(false)}
                >
                  <span className={styles.sheetIndex}>0{index + 1}</span>
                  {link.label}
                </a>
              ))}
            </nav>

            <div className={styles.sheetFooter}>
              <span className={styles.sheetMeta}>{profile.location}</span>
              <ButtonLink
                href={profile.resume}
                variant="primary"
                icon={<ArrowUpRight size={15} strokeWidth={1.8} />}
                download
              >
                Download résumé
              </ButtonLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
