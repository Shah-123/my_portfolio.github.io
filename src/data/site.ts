/**
 * Single source of truth for every piece of copy on the site.
 * Components stay presentational; content lives here.
 */

export type ProjectCategory = "Agentic AI" | "LLM & RAG" | "Machine Learning" | "Data & BI";

export interface ProjectLink {
  label: string;
  href: string;
  primary?: boolean;
}

export interface Project {
  id: string;
  title: string;
  year: string;
  category: ProjectCategory;
  /** Short line shown in the index row and on the card. */
  summary: string;
  /** Longer description revealed on the expanded card. */
  description: string;
  /** Two or three hard facts — what makes this project non-trivial. */
  highlights: string[];
  stack: string[];
  links: ProjectLink[];
  /** Optional cover art in /public/assets. Falls back to a generated motif. */
  cover?: string;
  featured?: boolean;
}

export interface Capability {
  id: string;
  title: string;
  summary: string;
  items: string[];
}

export const profile = {
  name: "Shahkar Ahmad",
  initials: "SA",
  wordmark: "Shahkar Ahmad",
  role: "Machine Learning & Agentic AI Engineer",
  location: "Peshawar, Pakistan",
  availability: "Open to internships & research collaborations",
  email: "shahkarahmad342@gmail.com",
  resume: "./assets/MyResume.pdf",
  portrait: "./assets/optimized/IMG-20240410-WA0023_Nero-AI_Face_x2.webp",
  /** Hero headline, split so the last fragment can be styled separately. */
  headline: ["I build systems", "that reason,", "retrieve"],
  headlineAccent: "and act.",
  intro:
    "Computer Science student at the University of Peshawar, working at the intersection of LLM engineering and applied machine learning — multi-agent architectures, corrective RAG pipelines, and deep learning models that ship.",
  about: [
    "I started with pandas and matplotlib, and kept following the problem upward: from exploratory analysis, into predictive models, and eventually into language models that can plan, retrieve and correct their own work.",
    "Most of what I build is end-to-end. A model on its own is a notebook; what interests me is the pipeline around it — the retrieval layer that grounds it, the graph that orchestrates it, the evaluation loop that keeps it honest, and the interface that makes it usable by someone who has never seen the code.",
    "Right now my focus is agentic systems: LangGraph state machines, tool-using agents, and retrieval architectures that know when their own context is not good enough.",
  ],
} as const;

export const socials = [
  {
    label: "GitHub",
    handle: "Shah-123",
    href: "https://github.com/Shah-123",
    icon: "./assets/github.png",
  },
  {
    label: "LinkedIn",
    handle: "shahkar-ahmad",
    href: "https://www.linkedin.com/in/shahkar-ahmad-730b41279/",
    icon: "./assets/linkedin.png",
  },
  {
    label: "Email",
    handle: profile.email,
    href: `mailto:${profile.email}`,
    icon: "./assets/email.png",
  },
] as const;

export const stats = [
  { value: "12+", label: "Projects shipped", detail: "ML · RAG · Agents" },
  { value: "1+", label: "Years building", detail: "Python · ML · GenAI" },
  { value: "B.Sc.", label: "Computer Science", detail: "Univ. of Peshawar" },
  { value: "LLMs", label: "Primary focus", detail: "Agentic AI & RAG" },
];

export const capabilities: Capability[] = [
  {
    id: "genai",
    title: "Generative AI & LLM Systems",
    summary:
      "Designing retrieval and orchestration layers around language models so their output is grounded, traceable and repeatable.",
    items: [
      "Retrieval-augmented generation",
      "Corrective & self-evaluating RAG",
      "LangChain · LangGraph",
      "Multi-agent orchestration",
      "Prompt & context engineering",
      "Vector stores · embeddings",
    ],
  },
  {
    id: "ml",
    title: "Machine Learning & Deep Learning",
    summary:
      "Classical and neural models taken from raw data through feature work, evaluation and deployment.",
    items: [
      "scikit-learn · ensemble methods",
      "TensorFlow · Keras",
      "CNNs · RNNs · transfer learning",
      "Feature engineering",
      "Model evaluation & tuning",
      "Regression · classification",
    ],
  },
  {
    id: "engineering",
    title: "Python Engineering & Data",
    summary:
      "The plumbing that turns a model into a product — APIs, dashboards, and analysis someone can actually act on.",
    items: [
      "pandas · numpy",
      "FastAPI · Streamlit",
      "matplotlib · seaborn",
      "Exploratory data analysis",
      "Power BI dashboards",
      "Git · reproducible workflows",
    ],
  },
];

/** Rendered as a slow marquee under the capabilities grid. */
export const toolkit = [
  "Python",
  "LangGraph",
  "LangChain",
  "PyTorch",
  "TensorFlow",
  "scikit-learn",
  "FastAPI",
  "Streamlit",
  "pandas",
  "NumPy",
  "OpenAI API",
  "Vector DBs",
  "Power BI",
  "Keras",
  "Matplotlib",
  "Git",
];

export const projects: Project[] = [
  {
    id: "multi-agent-blog",
    title: "Multi-Agent Blog Generator",
    year: "2025",
    category: "Agentic AI",
    summary:
      "Final Year Project — a five-agent LangGraph system that researches, drafts and edits long-form articles autonomously.",
    description:
      "A directed graph of specialised agents — researcher, outliner, writer, critic and editor — passing state through LangGraph. Each agent owns one responsibility and the critic node can send work back upstream, so drafts are revised rather than accepted on the first pass. Retrieval grounds the research step in real sources instead of model memory.",
    highlights: ["5 cooperating agents", "LangGraph state machine", "Retrieval-grounded research"],
    stack: ["LangGraph", "LangChain", "LLM", "RAG", "Python"],
    links: [
      {
        label: "View source",
        href: "https://github.com/Shah-123/Multi_Agent_Blog_generator_FYP",
        primary: true,
      },
    ],
    cover: "./assets/optimized/multi_agent_bg_1775804293319.webp",
    featured: true,
  },
  {
    id: "live-agent-hub",
    title: "Live-Agent-Hub",
    year: "2025",
    category: "Agentic AI",
    summary:
      "Real-time platform where AI personas join live Twitch streams — reacting, chatting and replying in character.",
    description:
      "A FastAPI backend drives a pool of persona-conditioned agents that consume a live stream's chat, decide when a response is warranted, and reply in a consistent voice. The hard part is not generation but pacing: keeping several agents in one room without them talking over each other or the humans.",
    highlights: ["Real-time event loop", "Persona-conditioned agents", "Concurrent agent pool"],
    stack: ["Agentic AI", "FastAPI", "WebSockets", "Python"],
    links: [
      { label: "View source", href: "https://github.com/Shah-123/Live-Agent-Hub-", primary: true },
    ],
    cover: "./assets/optimized/live_agent_bg_1775804274771.webp",
    featured: true,
  },
  {
    id: "corrective-rag",
    title: "Corrective RAG",
    year: "2025",
    category: "LLM & RAG",
    summary:
      "A retrieval pipeline that grades its own context and re-queries when the evidence is too weak to answer from.",
    description:
      "Standard RAG answers from whatever it retrieves. This pipeline adds a relevance-grading step between retrieval and generation: documents are scored, weak sets trigger a rewritten query or a web fallback, and only sufficiently grounded context reaches the model. The result is fewer confident answers built on the wrong passage.",
    highlights: ["Self-grading retrieval", "Query rewriting fallback", "Vector store backed"],
    stack: ["RAG", "LangChain", "Vector DB", "Python"],
    links: [
      { label: "View source", href: "https://github.com/Shah-123/Corrective-RAG-", primary: true },
    ],
    cover: "./assets/optimized/corrective_rag_bg_1775804209725.webp",
    featured: true,
  },
  {
    id: "chess-mastermind",
    title: "ChessMastermind",
    year: "2024",
    category: "Agentic AI",
    summary:
      "An LLM agent wired to a chess engine — it evaluates positions, proposes moves, and explains the reasoning in plain language.",
    description:
      "The engine supplies ground truth; the language model supplies the explanation. The agent reads the board state, queries the engine for candidate lines, and turns the evaluation into coaching a beginner can follow — why a move is strong, not just that it is.",
    highlights: ["Engine-grounded reasoning", "Move explanation", "Interactive board"],
    stack: ["Streamlit", "FastAPI", "Chess Engine", "LLM"],
    links: [{ label: "View source", href: "https://github.com/Shah-123/chessAgent", primary: true }],
    cover: "./assets/optimized/chess_agent_bg_1775804192303.webp",
  },
  {
    id: "yt-summarizer",
    title: "YouTube Video Summarizer",
    year: "2024",
    category: "LLM & RAG",
    summary:
      "Pulls a video transcript and returns a structured summary with key takeaways and timestamps.",
    description:
      "Transcripts are chunked and summarised hierarchically so hour-long videos stay within context, then recombined into a structured brief. Built as a Streamlit tool so it is usable by anyone with a link.",
    highlights: ["Hierarchical summarisation", "Transcript chunking", "Structured output"],
    stack: ["LLM", "Streamlit", "NLP", "Python"],
    links: [
      {
        label: "View source",
        href: "https://github.com/Shah-123/YouTubeVideoSummarizer",
        primary: true,
      },
    ],
    cover: "./assets/optimized/yt_summarizer_bg_1775804307459.webp",
  },
  {
    id: "deep-learning",
    title: "Deep Learning Studies",
    year: "2024",
    category: "Machine Learning",
    summary:
      "A worked collection of CNN, RNN and transfer-learning models built from the fundamentals up.",
    description:
      "Image classifiers, sequence models and fine-tuned pretrained backbones, each written to understand the mechanics rather than to reach a leaderboard — architecture choices, augmentation, and where each model breaks down.",
    highlights: ["CNN & RNN architectures", "Transfer learning", "TensorFlow / Keras"],
    stack: ["TensorFlow", "Keras", "CNN", "Transfer Learning"],
    links: [
      { label: "View source", href: "https://github.com/Shah-123/DL-mini-projects", primary: true },
    ],
    cover: "./assets/optimized/dl_mini_bg_1775804229050.webp",
  },
  {
    id: "cricket-predictor",
    title: "ODI Cricket Runs Predictor",
    year: "2024",
    category: "Machine Learning",
    summary:
      "Regression model forecasting ODI innings totals from live match state, served as an interactive dashboard.",
    description:
      "Trained on historical match data with features for overs remaining, wickets in hand, venue and run rate. Deployed on Streamlit so a prediction updates as the match situation is adjusted.",
    highlights: ["Live demo deployed", "Feature-engineered match state", "Regression ensemble"],
    stack: ["scikit-learn", "Streamlit", "pandas", "EDA"],
    links: [
      {
        label: "Live demo",
        href: "https://datascience-yfalmubuxo9fmqyzrnkfly.streamlit.app/",
        primary: true,
      },
      {
        label: "Source",
        href: "https://github.com/Shah-123/datascience/tree/main/Cricket_APP",
      },
    ],
  },
  {
    id: "heart-failure",
    title: "Heart Failure Prediction",
    year: "2024",
    category: "Machine Learning",
    summary:
      "Clinical risk classifier trained on patient records, with the trade-off tuned toward recall rather than raw accuracy.",
    description:
      "A screening model where a missed positive costs far more than a false alarm, so evaluation is centred on recall and the precision-recall curve instead of accuracy. Deployed behind a simple Streamlit form for clinicians to try.",
    highlights: ["Recall-weighted evaluation", "Live demo deployed", "Clinical tabular data"],
    stack: ["scikit-learn", "Healthcare AI", "Streamlit"],
    links: [
      {
        label: "Live demo",
        href: "https://datascience-pvtjmcl3qbqlhryriupybu.streamlit.app/",
        primary: true,
      },
      { label: "Source", href: "https://github.com/Shah-123/datascience" },
    ],
  },
  {
    id: "house-price",
    title: "House Price Prediction",
    year: "2024",
    category: "Machine Learning",
    summary:
      "Ensemble regression over location, size and amenity features, with residual analysis on the failure cases.",
    description:
      "Gradient-boosted and bagged regressors compared against a linear baseline, with attention paid to skewed target distributions and to the neighbourhoods where the model consistently under-predicts.",
    highlights: ["Ensemble methods", "Residual analysis", "Feature engineering"],
    stack: ["Regression", "Ensemble", "scikit-learn"],
    links: [
      {
        label: "View source",
        href: "https://github.com/Shah-123/datascience/tree/main/Houses_price%20prediction",
        primary: true,
      },
    ],
  },
  {
    id: "powerbi",
    title: "Power BI Dashboards",
    year: "2024",
    category: "Data & BI",
    summary:
      "Business intelligence dashboards built around the decisions they support, not the charts available.",
    description:
      "KPI dashboards with drill-through, DAX measures and a deliberate visual hierarchy — the headline number first, the breakdown second, the raw table last.",
    highlights: ["DAX measures", "KPI hierarchy", "Drill-through reports"],
    stack: ["Power BI", "DAX", "Data Viz"],
    links: [
      {
        label: "View source",
        href: "https://github.com/Shah-123/PowerBI_projects",
        primary: true,
      },
    ],
    cover: "./assets/optimized/powerBI.webp",
  },
  {
    id: "netflix-eda",
    title: "Netflix Catalogue Analysis",
    year: "2023",
    category: "Data & BI",
    summary:
      "Exploratory analysis of 8k+ titles — how the catalogue shifted across genres, regions and release years.",
    description:
      "Cleaning inconsistent country and genre fields, then tracing how the library's composition changed over a decade: the pivot from film to series, and the growth of non-English originals.",
    highlights: ["8,000+ titles", "Time-series composition", "Data cleaning pipeline"],
    stack: ["pandas", "EDA", "Streamlit"],
    links: [
      {
        label: "Live demo",
        href: "https://datascience-yfalmubuxo9fmqyzrnkfly.streamlit.app/",
        primary: true,
      },
      { label: "Source", href: "https://github.com/Shah-123/datascience" },
    ],
  },
  {
    id: "playstore-eda",
    title: "Google Play Store Analysis",
    year: "2023",
    category: "Data & BI",
    summary:
      "10k+ apps analysed for what actually correlates with installs — category, price model, rating and review volume.",
    description:
      "A study of monetisation patterns across the Play Store: where free-with-ads outperforms paid, how rating distributions differ by category, and the weak relationship between rating and install count.",
    highlights: ["10,000+ apps", "Monetisation patterns", "Correlation analysis"],
    stack: ["pandas", "EDA", "Visualization"],
    links: [
      {
        label: "View source",
        href: "https://github.com/Shah-123/playstore_data_analysis",
        primary: true,
      },
    ],
    cover: "./assets/optimized/download.webp",
  },
];

export const projectCategories: Array<ProjectCategory | "All"> = [
  "All",
  "Agentic AI",
  "LLM & RAG",
  "Machine Learning",
  "Data & BI",
];

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Expertise", href: "#expertise" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

/** Rendered in the hero as a syntax-highlighted panel. */
export type CodeKind = "kw" | "str" | "fn" | "comment" | "op" | "cls";
export interface CodeToken {
  text: string;
  kind?: CodeKind;
}

export const codeFileName = "research_graph.py";

export const codeSnippet: CodeToken[][] = [
  [{ text: "# Multi-agent research pipeline — FYP", kind: "comment" }],
  [
    { text: "from", kind: "kw" },
    { text: " langgraph.graph " },
    { text: "import", kind: "kw" },
    { text: " StateGraph, END" },
  ],
  [],
  [
    { text: "graph " },
    { text: "=", kind: "op" },
    { text: " " },
    { text: "StateGraph", kind: "cls" },
    { text: "(ResearchState)" },
  ],
  [
    { text: "graph." },
    { text: "add_node", kind: "fn" },
    { text: "(" },
    { text: '"researcher"', kind: "str" },
    { text: ", research_agent)" },
  ],
  [
    { text: "graph." },
    { text: "add_node", kind: "fn" },
    { text: "(" },
    { text: '"critic"', kind: "str" },
    { text: ", critique_agent)" },
  ],
  [],
  [
    { text: "graph." },
    { text: "add_conditional_edges", kind: "fn" },
    { text: "(" },
  ],
  [
    { text: "    " },
    { text: '"critic"', kind: "str" },
    { text: ", needs_revision," },
  ],
  [
    { text: "    {" },
    { text: "True", kind: "kw" },
    { text: ": " },
    { text: '"researcher"', kind: "str" },
    { text: ", " },
    { text: "False", kind: "kw" },
    { text: ": END}," },
  ],
  [{ text: ")" }],
  [],
  [{ text: "# ✓ compiled — 5 agents, 1 feedback loop", kind: "comment" }],
  [
    { text: "chain " },
    { text: "=", kind: "op" },
    { text: " graph." },
    { text: "compile", kind: "fn" },
    { text: "()" },
  ],
];
