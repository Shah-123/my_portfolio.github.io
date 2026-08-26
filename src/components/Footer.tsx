import { ArrowUp } from "lucide-react";
import { navLinks, profile, socials } from "../data/site";
import styles from "./Footer.module.css";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="shell">
        <div className={styles.top}>
          <div className={styles.brandBlock}>
            <span className={styles.wordmark}>{profile.name}</span>
            <p className={styles.tagline}>
              {profile.role} — building agentic systems, retrieval pipelines and machine learning
              models from {profile.location}.
            </p>
          </div>

          <div className={styles.columns}>
            <div>
              <p className={styles.colTitle}>Navigate</p>
              <ul className={styles.colList}>
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a className={styles.colLink} href={link.href}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className={styles.colTitle}>Elsewhere</p>
              <ul className={styles.colList}>
                {socials.map((social) => (
                  <li key={social.label}>
                    <a
                      className={styles.colLink}
                      href={social.href}
                      target={social.href.startsWith("http") ? "_blank" : undefined}
                      rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {year} {profile.name}. Designed and built from scratch.
          </p>
          <a href="#top" className={styles.toTop}>
            Back to top
            <ArrowUp size={13} strokeWidth={1.8} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
