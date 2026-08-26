import { Minus } from "lucide-react";
import { profile } from "../data/site";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";
import styles from "./About.module.css";

const facts = [
  { key: "Based in", value: profile.location },
  { key: "Education", value: "B.Sc. Computer Science · University of Peshawar" },
  { key: "Focus", value: "Agentic systems, retrieval architectures, applied ML" },
  { key: "Status", value: profile.availability },
];

const focus = [
  "LangGraph state machines & tool-using agents",
  "Retrieval pipelines that grade their own context",
  "Deep learning fundamentals, built from scratch",
];

export function About() {
  return (
    <section id="about" className={`section ${styles.section}`}>
      <div className={`shell ${styles.grid}`}>
        <Reveal className={styles.aside} y={20}>
          <dl className={styles.facts}>
            {facts.map((fact) => (
              <div key={fact.key} className={styles.fact}>
                <dt className={styles.factKey}>{fact.key}</dt>
                <dd className={styles.factValue}>{fact.value}</dd>
              </div>
            ))}
            <div className={styles.fact}>
              <dt className={styles.factKey}>Email</dt>
              <dd className={styles.factValue}>
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
              </dd>
            </div>
          </dl>

          <div>
            <p className={styles.focusTitle}>Currently working on</p>
            <ul className={styles.focusList}>
              {focus.map((item) => (
                <li key={item} className={styles.focusItem}>
                  <Minus size={13} strokeWidth={2} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <div>
          <SectionHeading
            index="01"
            label="About"
            title={
              <>
                From notebooks to <em>systems</em> that hold up in production.
              </>
            }
          />

          <Reveal className={styles.prose} delay={0.1} y={20}>
            {profile.about.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}

            <blockquote className={styles.quote}>
              <span className={styles.quoteMark} aria-hidden="true">
                &ldquo;
              </span>
              A model is a hypothesis. The pipeline around it is what makes it an answer.
            </blockquote>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
