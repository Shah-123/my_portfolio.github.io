import type { CSSProperties } from "react";
import styles from "./Marquee.module.css";

interface MarqueeProps {
  items: readonly string[];
  /** Seconds for one full pass. Longer reads calmer. */
  duration?: number;
}

/**
 * Infinite horizontal ticker. The item list is rendered twice so the
 * translate(-50%) loop is seamless; the duplicate is hidden from
 * assistive tech and removed entirely under reduced motion.
 */
export function Marquee({ items, duration = 46 }: MarqueeProps) {
  const group = (
    <div className={styles.group}>
      {items.map((item) => (
        <span key={item} className={styles.item}>
          {item}
          <span className={styles.dot} aria-hidden="true" />
        </span>
      ))}
    </div>
  );

  return (
    <div className={styles.wrap}>
      <div className={styles.track} style={{ "--marquee-duration": `${duration}s` } as CSSProperties}>
        {group}
        <div className={styles.group} aria-hidden="true">
          {items.map((item) => (
            <span key={`dup-${item}`} className={styles.item}>
              {item}
              <span className={styles.dot} />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
