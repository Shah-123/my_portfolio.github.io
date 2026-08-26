import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { codeFileName, codeSnippet, profile, socials, stats } from "../data/site";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { ButtonLink } from "./ui/Button";
import { Reveal } from "./ui/Reveal";
import styles from "./Hero.module.css";

const KIND_CLASS: Record<string, string> = {
  kw: styles.kw,
  str: styles.str,
  fn: styles.fn,
  cls: styles.cls,
  comment: styles.comment,
  op: styles.op,
};

function CodePanel() {
  const reduced = useReducedMotion();

  return (
    <div className={styles.code}>
      <div className={styles.codeBar}>
        <span className={styles.codeDots} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className={styles.codeName}>{codeFileName}</span>
      </div>
      <pre className={styles.codeBody} aria-label="Excerpt from a LangGraph multi-agent pipeline">
        <code>
          {codeSnippet.map((tokens, lineIndex) => (
            <motion.span
              key={lineIndex}
              className={styles.codeLine}
              initial={reduced ? false : { opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + lineIndex * 0.055, duration: 0.34, ease: "easeOut" }}
            >
              {tokens.map((token, i) => (
                <span key={i} className={token.kind ? KIND_CLASS[token.kind] : undefined}>
                  {token.text}
                </span>
              ))}
              {lineIndex === codeSnippet.length - 1 && (
                <span className={styles.caret} aria-hidden="true" />
              )}
            </motion.span>
          ))}
        </code>
      </pre>
    </div>
  );
}

export function Hero() {
  const reduced = useReducedMotion();

  const lineVariants = {
    hidden: { y: "108%" },
    show: (i: number) => ({
      y: "0%",
      transition: { delay: 0.08 + i * 0.09, duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
    }),
  };

  const headlineLines = [...profile.headline, profile.headlineAccent];

  return (
    <section className={styles.hero} id="top">
      <span className={styles.aura} aria-hidden="true" />
      <span className={styles.rules} aria-hidden="true" />

      <div className={`shell ${styles.grid}`}>
        <div>
          <motion.span
            className={styles.status}
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className={styles.statusDot} aria-hidden="true" />
            {profile.availability}
          </motion.span>

          <h1 className={styles.headline}>
            {headlineLines.map((line, i) => (
              <span key={line}>
                <motion.span
                  style={{ display: "block" }}
                  custom={i}
                  variants={lineVariants}
                  initial={reduced ? false : "hidden"}
                  animate="show"
                  className={i === headlineLines.length - 1 ? styles.accentLine : undefined}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <Reveal delay={0.42} y={14}>
            <p className={styles.role}>{profile.role}</p>
            <p className={styles.intro}>{profile.intro}</p>

            <div className={styles.ctas}>
              <ButtonLink
                href="#work"
                variant="primary"
                icon={<ArrowDown size={15} strokeWidth={1.9} />}
                iconDirection="down"
              >
                View selected work
              </ButtonLink>
              <ButtonLink
                href={profile.resume}
                variant="secondary"
                icon={<ArrowUpRight size={15} strokeWidth={1.9} />}
                download
              >
                Download résumé
              </ButtonLink>
            </div>

            <div className={styles.socials}>
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className={styles.socialLink}
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  <img src={social.icon} alt="" aria-hidden="true" />
                  {social.label}
                </a>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal className={styles.aside} delay={0.3} y={28}>
          <div className={styles.portraitFrame}>
            <div className={styles.portraitInner}>
              <img
                className={styles.portrait}
                src={profile.portrait}
                alt={`Portrait of ${profile.name}`}
                width={640}
                height={544}
              />
            </div>
            <div className={styles.portraitMeta}>
              <span>{profile.name}</span>
              <span>{profile.location}</span>
            </div>
          </div>

          <CodePanel />
        </Reveal>
      </div>

      <div className={`shell ${styles.stats}`}>
        {stats.map((stat, i) => (
          <Reveal key={stat.label} className={styles.stat} delay={i * 0.07} y={16}>
            <span className={styles.statValue}>{stat.value}</span>
            <span className={styles.statLabel}>{stat.label}</span>
            <span className={styles.statDetail}>{stat.detail}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
