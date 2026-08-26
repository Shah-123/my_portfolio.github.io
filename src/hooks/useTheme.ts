import { useCallback, useEffect, useState } from "react";

export type Theme = "dark" | "light";

const STORAGE_KEY = "sa-theme";

function readInitialTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  // index.html has already resolved and applied the theme before paint.
  const applied = document.documentElement.getAttribute("data-theme");
  return applied === "light" ? "light" : "dark";
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* storage can be unavailable in private mode — the theme still applies */
    }
  }, [theme]);

  // Follow the OS only while the visitor has not made an explicit choice.
  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    if (stored) return;

    const query = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = (event: MediaQueryListEvent) => setTheme(event.matches ? "light" : "dark");
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  return { theme, toggleTheme } as const;
}
