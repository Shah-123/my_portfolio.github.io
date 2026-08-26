import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Hairline reading indicator pinned under the nav.
 * Spring-smoothed so it glides instead of snapping on wheel scroll.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 34, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      style={{
        scaleX,
        transformOrigin: "left",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "2px",
        background: "var(--accent)",
        zIndex: "var(--z-overlay)",
      }}
    />
  );
}
