import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import type { Project, ProjectCategory } from "../data/site";
import { projectCategories, projects } from "../data/site";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { ProjectCover } from "./ui/ProjectCover";
import { SectionHeading } from "./ui/SectionHeading";
import styles from "./Work.module.css";

type Filter = ProjectCategory | "All";

function ProjectCard({ project }: { project: Project }) {
  const featured = Boolean(project.featured);

  return (
    <div className={`${styles.card} card-hover-root`}>
      <div className={styles.inner}>
        <div className={styles.coverHost}>
          {featured && (
            <span className={styles.badge}>
              <Sparkles size={11} strokeWidth={2} aria-hidden="true" />
              Featured
            </span>
          )}
          <ProjectCover
            cover={project.cover}
            category={project.category}
            title={project.title}
            seed={project.id}
          />
        </div>

        <div className={styles.body}>
          <p className={styles.meta}>
            <span>{project.category}</span>
            <span className={styles.metaDot} aria-hidden="true" />
            <span>{project.year}</span>
          </p>

          <h3 className={styles.title}>{project.title}</h3>
          <p className={styles.summary}>{project.summary}</p>

          {featured && (
            <>
              <p className={styles.description}>{project.description}</p>
              <ul className={styles.highlights}>
                {project.highlights.map((highlight) => (
                  <li key={highlight} className={styles.highlight}>
                    <ArrowUpRight size={12} strokeWidth={2} aria-hidden="true" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </>
          )}

          <div className={styles.stack}>
            {project.stack.map((tech) => (
              <span key={tech} className={styles.chip}>
                {tech}
              </span>
            ))}
          </div>

          <div className={styles.links}>
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.link} ${link.primary ? styles.linkPrimary : ""}`}
              >
                {link.label}
                <span className="visually-hidden"> — {project.title}</span>
                <ArrowUpRight size={14} strokeWidth={1.8} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Work() {
  const [filter, setFilter] = useState<Filter>("All");
  const reduced = useReducedMotion();

  const visible = useMemo(
    () => (filter === "All" ? projects : projects.filter((p) => p.category === filter)),
    [filter],
  );

  return (
    <section id="work" className={`section ${styles.section}`}>
      <div className="shell">
        <SectionHeading
          index="03"
          label="Selected work"
          title={
            <>
              Things I built, and <em>why</em> they were hard.
            </>
          }
          description="Twelve projects across agentic systems, retrieval, machine learning and analytics. The three featured ones are where most of the engineering went."
        />

        <div className={styles.toolbar}>
          <div className={styles.filters} role="group" aria-label="Filter projects by category">
            {projectCategories.map((category) => {
              const isActive = filter === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setFilter(category)}
                  className={`${styles.filter} ${isActive ? styles.filterActive : ""}`}
                  aria-pressed={isActive}
                >
                  {isActive && (
                    <motion.span
                      layoutId="filter-pill"
                      className={styles.filterPill}
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    />
                  )}
                  {category}
                </button>
              );
            })}
          </div>
          <span className={styles.count} aria-live="polite">
            {visible.length} {visible.length === 1 ? "project" : "projects"}
          </span>
        </div>

        {/* The grid itself is plain CSS. Animating a grid container's layout
            fights with `grid-auto-flow: dense` and leaves cards stuck mid
            projection, so only the entering cards animate. */}
        <div className={styles.grid} key={filter}>
          {visible.map((project, index) => (
            <motion.article
              key={project.id}
              initial={reduced ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                delay: Math.min(index * 0.05, 0.35),
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`${styles.item} ${project.featured ? styles.featured : ""}`}
            >
              <ProjectCard project={project} />
            </motion.article>
          ))}
        </div>

        {visible.length === 0 && <p className={styles.empty}>Nothing in this category yet.</p>}
      </div>
    </section>
  );
}
