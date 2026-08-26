import { ArrowUpRight } from "lucide-react";
import { profile, socials } from "../data/site";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";
import styles from "./Contact.module.css";

export function Contact() {
  return (
    <section id="contact" className={`section ${styles.section}`}>
      <span className={styles.aura} aria-hidden="true" />

      <div className={`shell ${styles.inner}`}>
        <SectionHeading
          index="04"
          label="Contact"
          centered
          title={
            <>
              Let&rsquo;s build something <em>intelligent</em>.
            </>
          }
          description="Open to internships, research collaborations, and conversations about agents, retrieval or anything adjacent. I reply to everything."
        />

        <Reveal y={16}>
          <a className={styles.mailto} href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
        </Reveal>

        <Reveal delay={0.08} y={12}>
          <p className={styles.note}>
            <span className={styles.noteDot} aria-hidden="true" />
            {profile.availability}
          </p>
        </Reveal>

        <Reveal className={styles.channels} delay={0.12} y={20}>
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              className={styles.channel}
              target={social.href.startsWith("http") ? "_blank" : undefined}
              rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              <span className={styles.channelIcon}>
                <img src={social.icon} alt="" aria-hidden="true" />
              </span>
              <span>
                <span className={styles.channelLabel}>{social.label}</span>
                <span className={styles.channelHandle}>{social.handle}</span>
              </span>
              <ArrowUpRight
                className={styles.channelArrow}
                size={18}
                strokeWidth={1.6}
                aria-hidden="true"
              />
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
