export const PROFILE = {
  name: "Aakash Karthikairaja",
  short: "AAKASH AI",
  role: "AI Engineer & Creative Developer",
  tagline: "AI & Machine Learning Engineer | Ex-Amazon | Full-Stack & 3D Web Developer",
  email: "aakashkarthi66@gmail.com",
  github: "https://github.com/aakash-AI-engineer",
  linkedin: "https://www.linkedin.com/in/aakashkarthikairaja06",
  resume: "/resume.pdf",
  whatsapp:
    "https://wa.me/919597604885?text=Hi%20Aakash,%20I%20saw%20your%203D%20portfolio%20and%20want%20to%20discuss%20a%20project",
  status: "Available for Freelance & Full-Time Roles",
  location: "Chennai, Tamil Nadu, India",
};

export const CHAPTERS = [
  { id: "00", label: "THE PROTAGONIST", target: "#ch-00" },
  { id: "01", label: "EXPERIENCE", target: "#ch-01" },
  { id: "02", label: "AI & 3D ARSENAL", target: "#ch-02" },
  { id: "03", label: "FEATURED BUILDS", target: "#ch-03" },
  { id: "04", label: "RESEARCH & EDUCATION", target: "#ch-04" },
  { id: "05", label: "INITIATE CONTACT", target: "#ch-05" },
];

export const HERO_CARDS = [
  { label: "Python", color: "#ff2a54", depth: 30, x: 4, y: 36, delay: 0 },
  { label: "PyTorch", color: "#ff2a54", depth: 46, x: 16, y: 72, delay: 0.6 },
  { label: "LangChain", color: "#7928ca", depth: 22, x: 15, y: 44, delay: 1.1 },
  { label: "FastAPI", color: "#00f0ff", depth: 36, x: 80, y: 30, delay: 0.3 },
  { label: "Claude", color: "#ff2a54", depth: 26, x: 84, y: 62, delay: 0.9 },
  { label: "Docker", color: "#00f0ff", depth: 42, x: 74, y: 82, delay: 1.4 },
  { label: "React", color: "#00f0ff", depth: 20, x: 66, y: 12, delay: 0.5 },
];

export const STATS = [
  { value: "3+", label: "Production AI systems" },
  { value: "Ex-Amazon", label: "AGI Data Services" },
  { value: "IEEE / NIT", label: "Published research" },
];

export const EXPERIENCE = [
  {
    company: "Amazon Development Centre",
    role: "Machine Learning Data Associate II",
    team: "AGI Data Services",
    period: "MAR 2025 — NOV 2025",
    description:
      "Engineered RAG pipelines, LLM evaluation workflows, and high-precision AI data systems for production use.",
    tags: ["RAG Pipelines", "LLM Evaluation", "AI Data Systems"],
    accent: "#ff2a54",
  },
  {
    company: "Snorkel AI",
    role: "Expert Contributor",
    team: "Project Otter",
    period: "CONTRIBUTOR",
    description:
      "Authored and solved complex machine-learning benchmark tasks inside isolated Docker sandboxes.",
    tags: ["ML Benchmarks", "Docker", "Task Authoring"],
    accent: "#7928ca",
  },
  {
    company: "Brainvoice.ai",
    role: "AI & Software Engineering Collaborator",
    team: "Early-stage startup",
    period: "2023 — 2025",
    description:
      "Worked alongside senior developers on backend architecture, conversational intelligence, and AI product features.",
    tags: ["Backend Architecture", "AI Features", "Speech Analytics"],
    accent: "#00f0ff",
  },
];

export const SKILL_CATEGORIES = [
  {
    name: "Generative AI & LLMs",
    color: "#ff2a54",
    items: [
      "RAG Architecture",
      "LangChain",
      "LangGraph",
      "LlamaIndex",
      "MCP",
      "Claude 3.5 / 3.7",
      "Llama 3",
      "GPT-4o",
      "Ragas",
      "DeepEval",
    ],
  },
  {
    name: "Full-Stack & 3D Web",
    color: "#00f0ff",
    items: [
      "React",
      "Three.js",
      "GSAP",
      "FastAPI",
      "Flask",
      "Tailwind CSS",
      "Playwright",
      "PostgreSQL",
      "Docker",
      "AWS",
    ],
  },
  {
    name: "Deep Learning & ML",
    color: "#7928ca",
    items: [
      "PyTorch",
      "TensorFlow",
      "Scikit-Learn",
      "XGBoost",
      "LSTM",
      "Time-Series Forecasting",
    ],
  },
];

export const PROJECTS = [
  {
    index: "01",
    title: "VARYNT AI",
    subtitle: "Lead Qualification & Smart Response SaaS",
    description:
      "AI lead scoring and smart-response backend built with Python, Flask, Pydantic, and SQLite.",
    stack: ["Python", "Flask", "Pydantic", "SQLite"],
    accent: "#ff2a54",
    image: "/assets/images/engineering-platform.webp",
    imageAlt: "AI product dashboard representing Varynt AI",
  },
  {
    index: "02",
    title: "JOB APPLICATION AGENT",
    subtitle: "Autonomous Browser Agent",
    description:
      "Local automation agent using Playwright and structured validation to extract and populate complex web forms.",
    stack: ["Python", "Playwright", "Pydantic v2", "SQLite"],
    accent: "#7928ca",
    image: "/assets/images/project-8.jpg",
    imageAlt: "Predictive application interface",
  },
  {
    index: "03",
    title: "FIRST500DAYS",
    subtitle: "Open-Source LLM Application",
    description:
      "Interactive conversational platform combining Streamlit with language-model experiences.",
    stack: ["Python", "Streamlit", "LLM"],
    accent: "#00f0ff",
    image: "/assets/images/healthcare-chatbot.jpg",
    imageAlt: "Healthcare conversational AI interface",
  },
  {
    index: "04",
    title: "LSTM-XGBOOST FUSION",
    subtitle: "Smart Farming Decision-Fusion Engine",
    description:
      "Predictive resource-optimization system, peer-reviewed and presented at AGNI-S 2026 at NIT Trichy.",
    stack: ["LSTM", "XGBoost", "Decision Fusion"],
    accent: "#10b981",
    image: "/assets/images/research-dashboard.01jpg.jpeg",
    imageAlt: "Research visualization for the LSTM-XGBoost project",
  },
];

export const EDUCATION = [
  {
    degree: "M.Tech in Artificial Intelligence",
    school: "SRM Institute of Science and Technology",
    period: "2023 — 2026",
    note: "Applied AI research and large-scale machine-learning systems.",
    accent: "#ff2a54",
  },
  {
    degree: "B.E. in Mechanical Engineering",
    school: "Sri Krishna College of Technology",
    period: "GRADUATED",
    note: "Engineering fundamentals, analytical thinking, and system design.",
    accent: "#7928ca",
  },
];

export const MARQUEE_ITEMS = [
  "RAG ARCHITECTURE",
  "LLM EVALUATION",
  "3D WEB EXPERIENCES",
  "FASTAPI BACKENDS",
  "PYTORCH",
  "GSAP MOTION",
  "LANGCHAIN",
  "DOCKER",
  "MULTIMODAL AI",
  "THREE.JS",
];

export const FOUNDER_SERVICES = [
  "3D Landing Page",
  "AI Chatbot / RAG",
  "Full-Stack MVP",
];
