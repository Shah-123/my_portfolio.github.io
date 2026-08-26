import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import type { Theme } from "../../hooks/useTheme";
import styles from "./ThemeToggle.module.css";

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
  className?: string;
}

export function ThemeToggle({ theme, onToggle, className = "" }: ThemeToggleProps) {
  const next = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`${styles.toggle} ${className}`}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
    >
      <span className={styles.iconWrap}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={theme}
            initial={{ opacity: 0, rotate: -70, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 70, scale: 0.6 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: "grid", placeItems: "center" }}
          >
            {theme === "dark" ? <Moon size={17} strokeWidth={1.6} /> : <Sun size={17} strokeWidth={1.6} />}
          </motion.span>
        </AnimatePresence>
      </span>
    </button>
  );
}
