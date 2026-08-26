import type { ReactNode } from "react";
import { Reveal } from "./Reveal";
import styles from "./SectionHeading.module.css";

interface SectionHeadingProps {
  /** Two-digit ordinal, e.g. "01". */
  index: string;
  label: string;
  title: ReactNode;
  description?: ReactNode;
  centered?: boolean;
}

export function SectionHeading({
  index,
  label,
  title,
  description,
  centered = false,
}: SectionHeadingProps) {
  return (
    <Reveal className={`${styles.head} ${centered ? styles.centered : ""}`}>
      <div className={styles.eyebrow}>
        <span className={styles.index}>{index}</span>
        <span className={styles.label}>{label}</span>
        <span className={styles.rule} aria-hidden="true" />
      </div>
      <h2 className={styles.title}>{title}</h2>
      {description && <p className={styles.description}>{description}</p>}
    </Reveal>
  );
}
