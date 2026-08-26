import { capabilities, toolkit } from "../data/site";
import { Marquee } from "./ui/Marquee";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";
import styles from "./Expertise.module.css";

export function Expertise() {
  return (
    <section id="expertise" className={`section ${styles.section}`}>
      <div className="shell">
        <SectionHeading
          index="02"
          label="Expertise"
          title={
            <>
              What I actually <em>work in</em>.
            </>
          }
          description="Three overlapping areas rather than a list of logos — the orchestration layer around language models, the models themselves, and the Python engineering that carries both into something usable."
        />

        <div className={styles.grid}>
          {capabilities.map((capability, index) => (
            <Reveal key={capability.id} className={styles.card} delay={index * 0.1} y={22}>
              <div className={styles.cardHead}>
                <span className={styles.num}>0{index + 1}</span>
                <h3 className={styles.title}>{capability.title}</h3>
              </div>
              <p className={styles.summary}>{capability.summary}</p>
              <ul className={styles.items}>
                {capability.items.map((item) => (
                  <li key={item} className={styles.item}>
                    <span className={styles.tick} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>

      <Reveal className={styles.marqueeWrap} y={16}>
        <span className={styles.marqueeLabel}>Daily toolkit</span>
        <Marquee items={toolkit} />
      </Reveal>
    </section>
  );
}
