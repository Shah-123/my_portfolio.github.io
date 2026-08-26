import { useMemo } from "react";
import type { ProjectCategory } from "../../data/site";
import styles from "./ProjectCover.module.css";

interface ProjectCoverProps {
  cover?: string;
  category: ProjectCategory;
  title: string;
  /** Seed for the generated motif — keeps each card stable but distinct. */
  seed: string;
}

/** Deterministic 0–1 sequence so a given project always draws the same motif. */
function makeRandom(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Fallback artwork for projects with no screenshot. Each category gets a
 * motif that reflects what the project actually is — a graph for agent
 * systems, a regression for ML, bars for BI — rather than stock imagery.
 */
function Motif({ category, seed }: { category: ProjectCategory; seed: string }) {
  const rand = useMemo(() => makeRandom(seed), [seed]);

  const shapes = useMemo(() => {
    if (category === "Machine Learning") {
      const points = Array.from({ length: 34 }, () => {
        const x = 24 + rand() * 272;
        const drift = (x - 24) * 0.45 + (rand() - 0.5) * 62;
        return { x, y: 172 - Math.min(Math.max(drift, 8), 156) };
      });
      return (
        <>
          <line x1="24" y1="172" x2="296" y2="172" />
          <line x1="24" y1="172" x2="24" y2="16" />
          <path d="M28 168 L292 46" strokeDasharray="5 5" opacity="0.55" />
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="2.6" fill="currentColor" stroke="none" opacity="0.75" />
          ))}
        </>
      );
    }

    if (category === "Data & BI") {
      const bars = Array.from({ length: 9 }, () => 26 + rand() * 118);
      return (
        <>
          <line x1="24" y1="172" x2="296" y2="172" />
          {bars.map((h, i) => (
            <rect
              key={i}
              x={32 + i * 29}
              y={172 - h}
              width="17"
              height={h}
              fill="currentColor"
              stroke="none"
              opacity={0.22 + (i % 3) * 0.2}
            />
          ))}
        </>
      );
    }

    if (category === "LLM & RAG") {
      // Documents fanning into a single query node.
      return (
        <>
          {[0, 1, 2, 3].map((i) => (
            <g key={i} opacity={0.4 + i * 0.14}>
              <rect x={26 + i * 8} y={40 + i * 26} width="62" height="42" rx="4" />
              <line x1={36 + i * 8} y1={54 + i * 26} x2={70 + i * 8} y2={54 + i * 26} />
              <line x1={36 + i * 8} y1={64 + i * 26} x2={62 + i * 8} y2={64 + i * 26} />
            </g>
          ))}
          {[0, 1, 2, 3].map((i) => (
            <path
              key={`e${i}`}
              d={`M${90 + i * 8} ${61 + i * 26} C 160 ${61 + i * 26}, 176 94, 226 94`}
              opacity="0.4"
            />
          ))}
          <circle cx="240" cy="94" r="22" opacity="0.9" />
          <circle cx="240" cy="94" r="7" fill="currentColor" stroke="none" />
        </>
      );
    }

    // Agentic AI — a directed graph with a feedback edge.
    const nodes = [
      { x: 52, y: 58 },
      { x: 148, y: 34 },
      { x: 152, y: 128 },
      { x: 248, y: 62 },
      { x: 236, y: 148 },
    ];
    const edges: Array<[number, number]> = [
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 4],
      [2, 3],
      [4, 3],
    ];
    return (
      <>
        {edges.map(([a, b], i) => (
          <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} opacity="0.42" />
        ))}
        <path d="M248 62 C 300 110, 288 176, 196 168 C 128 162, 108 150, 152 130" opacity="0.5" strokeDasharray="4 5" />
        {nodes.map((n, i) => (
          <g key={`n${i}`}>
            <circle cx={n.x} cy={n.y} r="15" fill="var(--bg-sunken)" />
            <circle cx={n.x} cy={n.y} r="15" opacity="0.9" />
            <circle cx={n.x} cy={n.y} r="4.5" fill="currentColor" stroke="none" />
          </g>
        ))}
      </>
    );
  }, [category, rand]);

  return (
    <svg
      className={styles.motif}
      viewBox="0 0 320 188"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      {shapes}
    </svg>
  );
}

export function ProjectCover({ cover, category, title, seed }: ProjectCoverProps) {
  return (
    <div className={styles.cover}>
      {cover ? (
        <>
          <img className={styles.image} src={cover} alt={`${title} preview`} loading="lazy" decoding="async" />
          <span className={styles.veil} aria-hidden="true" />
        </>
      ) : (
        <>
          <span className={styles.gridLines} aria-hidden="true" />
          <Motif category={category} seed={seed} />
        </>
      )}
    </div>
  );
}
