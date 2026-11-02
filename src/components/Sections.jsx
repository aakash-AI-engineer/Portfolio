import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowUpRight,
  Check,
  Code2,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  X,
} from "lucide-react";
import {
  CHAPTERS,
  EDUCATION,
  EXPERIENCE,
  FOUNDER_SERVICES,
  HERO_CARDS,
  MARQUEE_ITEMS,
  PROFILE,
  PROJECTS,
  SKILL_CATEGORIES,
  STATS,
} from "../lib/data";
import { scrollToTarget } from "../lib/scroll";

const reveal = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.2, 0.7, 0.2, 1] } },
};

export function GrainOverlay() {
  return <div className="grain-overlay" aria-hidden="true" />;
}

export function CustomCursor() {
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return undefined;
    let frame = 0;
    const move = (event) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        document.documentElement.style.setProperty("--cursor-x", `${event.clientX}px`);
        document.documentElement.style.setProperty("--cursor-y", `${event.clientY}px`);
      });
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
    };
  }, []);

  return <div className="custom-cursor" aria-hidden="true" />;
}

export function Navbar() {
  const [active, setActive] = useState("ch-00");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const sections = CHAPTERS.map(({ target }) => document.querySelector(target)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-25% 0px -55% 0px", threshold: [0, 0.15, 0.4] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const navigate = (event, target) => {
    event.preventDefault();
    setOpen(false);
    scrollToTarget(target);
  };

  return (
    <header className="site-header">
      <a className="wordmark" href="#ch-00" onClick={(event) => navigate(event, "#ch-00")}>
        <span className="wordmark-icon">A</span>
        <span>{PROFILE.short}<small>ENGINEERING / 3D</small></span>
      </a>
      <button
        className="menu-toggle"
        type="button"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      <nav className={`site-nav${open ? " is-open" : ""}`} aria-label="Main navigation">
        {CHAPTERS.map(({ id, label, target }) => (
          <a
            key={id}
            href={target}
            className={active === target.slice(1) ? "active" : ""}
            onClick={(event) => navigate(event, target)}
          >
            <span>{id}</span>{label}
          </a>
        ))}
      </nav>
      <a className="header-contact" href={`mailto:${PROFILE.email}`}>
        Let&apos;s talk <ArrowUpRight size={15} />
      </a>
    </header>
  );
}

export function ChapterHUD() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? window.scrollY / scrollable : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div className="page-progress" aria-hidden="true">
      <span style={{ transform: `scaleY(${progress})` }} />
    </div>
  );
}

export function Hero() {
  return (
    <section className="hero section-shell" id="ch-00">
      <div className="hero-copy">
        <motion.p className="eyebrow" initial="hidden" animate="visible" variants={reveal}>
          <span className="live-dot" /> {PROFILE.status}
        </motion.p>
        <motion.h1 initial="hidden" animate="visible" variants={reveal} transition={{ delay: 0.08 }}>
          Building intelligence
          <br />
          <span>with imagination.</span>
        </motion.h1>
        <motion.p className="hero-description" initial="hidden" animate="visible" variants={reveal} transition={{ delay: 0.16 }}>
          I&apos;m {PROFILE.name}, an AI engineer creating practical machine-learning systems and expressive digital experiences.
        </motion.p>
        <motion.div className="hero-actions" initial="hidden" animate="visible" variants={reveal} transition={{ delay: 0.24 }}>
          <a className="button button-primary" href="#ch-03" onClick={(event) => navigateClick(event, "#ch-03")}>
            Explore selected work <ArrowDownRight size={17} />
          </a>
          <a className="button button-quiet" href={`mailto:${PROFILE.email}`}>
            Start a conversation <ArrowUpRight size={16} />
          </a>
        </motion.div>
        <div className="hero-stats">
          {STATS.map((stat) => (
            <div className="hero-stat" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="hero-visual" aria-label="Interactive 3D orbital network illustration">
        <div className="hero-orbit orbit-one" />
        <div className="hero-orbit orbit-two" />
        <div className="hero-core"><span>AI</span><i /></div>
        {HERO_CARDS.map((card) => (
          <motion.span
            className="floating-label"
            key={card.label}
            style={{ "--label-color": card.color, "--label-x": `${card.x}%`, "--label-y": `${card.y}%`, "--label-z": `${card.depth}px` }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: [0, -8, 0] }}
            transition={{ opacity: { delay: card.delay, duration: 0.5 }, y: { delay: card.delay, duration: 4, repeat: Infinity, ease: "easeInOut" } }}
          >
            <span />{card.label}
          </motion.span>
        ))}
        <div className="hero-portrait">
          <img src="/assets/images/profile-portrait.png" alt="" />
          <span className="live-dot" />
        </div>
        <div className="visual-caption"><Code2 size={14} /> ML SYSTEMS / DIGITAL WORLDS</div>
      </div>
      <a className="scroll-cue" href="#ch-01" onClick={(event) => navigateClick(event, "#ch-01")}>
        SCROLL TO EXPLORE <ArrowDown size={14} />
      </a>
    </section>
  );
}

function navigateClick(event, target) {
  event.preventDefault();
  scrollToTarget(target);
}

export function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="marquee-band" aria-label="Areas of expertise">
      <div className="marquee-track">
        {items.map((item, index) => <span key={`${item}-${index}`}>{item}<i /></span>)}
      </div>
    </div>
  );
}

export function Experience() {
  return (
    <section className="content-section section-shell" id="ch-01">
      <SectionHeading number="01" kicker="THE JOURNEY" title={<>Experience built<br /><em>in the real world.</em></>} />
      <div className="experience-list">
        {EXPERIENCE.map((item, index) => (
          <motion.article className="experience-card" key={item.company} variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.18 }} custom={index}>
            <div className="experience-marker" style={{ "--accent": item.accent }}><span /></div>
            <div className="experience-period">{item.period}</div>
            <div className="experience-detail">
              <p className="experience-team">{item.team}</p>
              <h3>{item.role}</h3>
              <h4>{item.company}</h4>
              <p className="body-copy">{item.description}</p>
              <div className="tag-row">{item.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
            </div>
            <span className="experience-index">0{index + 1}</span>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

export function Skills() {
  return (
    <section className="content-section skills-section section-shell" id="ch-02">
      <SectionHeading number="02" kicker="THE TOOLKIT" title={<>Curiosity, backed<br /><em>by capability.</em></>} />
      <div className="skill-grid">
        {SKILL_CATEGORIES.map((category, index) => (
          <motion.article className="skill-card" key={category.name} variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} transition={{ delay: index * 0.08 }}>
            <span className="skill-index" style={{ color: category.color }}>0{index + 1} / DOMAIN</span>
            <h3>{category.name}</h3>
            <div className="tag-row">{category.items.map((skill) => <span className="tag" key={skill}>{skill}</span>)}</div>
          </motion.article>
        ))}
      </div>
      <div className="services-note">
        <span className="eyebrow">INDEPENDENTLY BUILDING</span>
        <div>{FOUNDER_SERVICES.map((service) => <span key={service}><Check size={14} />{service}</span>)}</div>
      </div>
    </section>
  );
}

export function Projects() {
  return (
    <section className="content-section projects-section section-shell" id="ch-03">
      <SectionHeading number="03" kicker="SELECTED WORK" title={<>Ideas turned<br /><em>into working systems.</em></>} />
      <div className="project-grid">
        {PROJECTS.map((project, index) => (
          <motion.article className="project-card" key={project.index} variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.16 }} transition={{ delay: (index % 2) * 0.08 }}>
            <div className="project-image-wrap" style={{ "--accent": project.accent }}>
              <img src={project.image} alt={project.imageAlt} loading="lazy" />
              <span className="project-number">{project.index}</span>
              <span className="project-image-mark"><ArrowUpRight size={19} /></span>
            </div>
            <div className="project-copy">
              <p className="project-subtitle">{project.subtitle}</p>
              <h3>{project.title}</h3>
              <p className="body-copy">{project.description}</p>
              <div className="tag-row">{project.stack.map((item) => <span className="tag" key={item}>{item}</span>)}</div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

export function Education() {
  return (
    <section className="content-section education-section section-shell" id="ch-04">
      <SectionHeading number="04" kicker="RESEARCH & EDUCATION" title={<>Strong foundations.<br /><em>Always learning.</em></>} />
      <div className="education-grid">
        {EDUCATION.map((item) => (
          <article className="education-card" key={item.degree} style={{ "--accent": item.accent }}>
            <span className="education-period">{item.period}</span>
            <h3>{item.degree}</h3>
            <p className="education-school">{item.school}</p>
            <p className="body-copy">{item.note}</p>
          </article>
        ))}
      </div>
      <div className="research-note">
        <span className="research-mark">R</span>
        <div><p className="eyebrow">RESEARCH SPOTLIGHT</p><h3>LSTM–XGBoost Decision Fusion</h3><p className="body-copy">Peer-reviewed smart-farming resource optimization research presented at AGNI-S 2026, NIT Trichy.</p></div>
        <span className="research-venue">NIT TRICHY<br />AGNI-S 2026</span>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section className="contact-section section-shell" id="ch-05">
      <div className="contact-glow" aria-hidden="true" />
      <div className="contact-content">
        <p className="eyebrow"><span className="live-dot" /> OPEN TO WHAT&apos;S NEXT</p>
        <h2>Have a good<br /><em>problem to solve?</em></h2>
        <p className="contact-copy">If you&apos;re building something meaningful with AI—or want a digital experience that feels different—I&apos;d like to hear about it.</p>
        <a className="button button-primary contact-cta" href={`mailto:${PROFILE.email}`}>Let&apos;s make it real <ArrowUpRight size={17} /></a>
      </div>
      <div className="contact-details">
        <a href={`mailto:${PROFILE.email}`}><Mail size={17} /><span><small>EMAIL</small>{PROFILE.email}</span><ArrowUpRight size={15} /></a>
        <a href={PROFILE.whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} /><span><small>WHATSAPP</small>Send a message</span><ArrowUpRight size={15} /></a>
        <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer"><ArrowUpRight size={17} /><span><small>LINKEDIN</small>Professional profile</span><ArrowUpRight size={15} /></a>
        <a href={PROFILE.github} target="_blank" rel="noopener noreferrer"><Code2 size={17} /><span><small>GITHUB</small>Projects & code</span><ArrowUpRight size={15} /></a>
        <div className="contact-location"><MapPin size={16} />{PROFILE.location}</div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="site-footer section-shell">
      <a className="wordmark" href="#ch-00" onClick={(event) => navigateClick(event, "#ch-00")}><span className="wordmark-icon">A</span><span>{PROFILE.short}<small>ENGINEERING / 3D</small></span></a>
      <p>Designed with intent. Built with curiosity.</p>
      <a href="#ch-00" onClick={(event) => navigateClick(event, "#ch-00")}>BACK TO TOP <ArrowUpRight size={14} /></a>
    </footer>
  );
}

function SectionHeading({ number, kicker, title }) {
  return (
    <motion.div className="section-heading" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }}>
      <span className="section-number">{number}</span>
      <div><p className="eyebrow">{kicker}</p><h2>{title}</h2></div>
      <ArrowDownRight className="heading-arrow" size={23} />
    </motion.div>
  );
}
