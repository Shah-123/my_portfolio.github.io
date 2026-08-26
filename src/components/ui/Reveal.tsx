import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface RevealProps {
  children: ReactNode;
  /** Seconds of delay — use to stagger siblings. */
  delay?: number;
  /** Distance travelled on entry, in pixels. */
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "header";
}

/**
 * Scroll-triggered entrance. Deliberately understated: a short rise
 * and a fade, once, with no bounce — motion should be felt, not watched.
 */
export function Reveal({ children, delay = 0, y = 24, className, as = "div" }: RevealProps) {
  const reduced = useReducedMotion();
  const Component = motion[as];

  if (reduced) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Component>
  );
}
