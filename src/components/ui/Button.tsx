import type { AnchorHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant;
  size?: "default" | "small";
  icon?: ReactNode;
  /** Vertical icon nudge on hover instead of horizontal (for downloads). */
  iconDirection?: "right" | "down";
  children: ReactNode;
}

/**
 * Every call to action on the site is a link, so this renders an anchor.
 * External hrefs get the usual rel hardening automatically.
 */
export function ButtonLink({
  variant = "primary",
  size = "default",
  icon,
  iconDirection = "right",
  children,
  className = "",
  href = "#",
  ...rest
}: ButtonLinkProps) {
  const isExternal = /^https?:/.test(href);

  return (
    <a
      href={href}
      className={[styles.btn, styles[variant], size === "small" ? styles.small : "", className]
        .filter(Boolean)
        .join(" ")}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : null)}
      {...rest}
    >
      <span>{children}</span>
      {icon && (
        <span
          className={`${styles.icon} ${iconDirection === "down" ? styles.iconDown : ""}`}
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
    </a>
  );
}
