import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowUpRight,
  Check,
  Code2,
  Copy,
  Mail,
  MapPin,
  MessageCircle,
} from "lucide-react";
import {
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
import { gsap, scrollToTarget } from "../lib/scroll";

const reveal = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.2, 0.7, 0.2, 1] } },
};
const HeroScene = lazy(() => import("./ParticleField.jsx"));

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

  return (
    <>
      <div className="custom-cursor-trail" aria-hidden="true" />
      <div className="custom-cursor" aria-hidden="true" />
    </>
  );
}

export function Navbar() {
  return (
    <header className="site-header">
      <a className="wordmark" href="#ch-00" aria-label="Aakash home">
        <span className="wordmark-icon"><Code2 size={22} /></span>
        <span>{PROFILE.short}<small>.AI // PORTFOLIO</small></span>
      </a>
      <span className="header-availability"><span className="live-dot" /> OPEN TO WORK</span>
      <a className="header-contact" href={PROFILE.whatsapp} target="_blank" rel="noopener noreferrer">
        BOOK A 48-HR BUILD
      </a>
    </header>
  );
}

function updateParallax(event) {
  if (window.matchMedia("(pointer: coarse)").matches) return;
  const bounds = event.currentTarget.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width - 0.5;
  const y = (event.clientY - bounds.top) / bounds.height - 0.5;
  event.currentTarget.style.setProperty("--tilt-x", `${-y * 5}deg`);
  event.currentTarget.style.setProperty("--tilt-y", `${x * 7}deg`);
  event.currentTarget.style.setProperty("--spot-x", `${(x + 0.5) * 100}%`);
  event.currentTarget.style.setProperty("--spot-y", `${(y + 0.5) * 100}%`);
  const magnitude = Math.hypot(x, y);
  event.currentTarget.style.setProperty("--tilt-axis-x", magnitude ? `${-y / magnitude}` : "0");
  event.currentTarget.style.setProperty("--tilt-axis-y", magnitude ? `${x / magnitude}` : "0");
  event.currentTarget.style.setProperty("--tilt-angle", `${magnitude * 6}deg`);
}

function resetParallax(event) {
  event.currentTarget.style.setProperty("--tilt-x", "0deg");
  event.currentTarget.style.setProperty("--tilt-y", "0deg");
  event.currentTarget.style.setProperty("--tilt-axis-x", "0");
  event.currentTarget.style.setProperty("--tilt-axis-y", "0");
  event.currentTarget.style.setProperty("--tilt-angle", "0deg");
}

function updateMagnetic(event) {
  const bounds = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--mag-x", `${(event.clientX - bounds.left - bounds.width / 2) * 0.08}px`);
  event.currentTarget.style.setProperty("--mag-y", `${(event.clientY - bounds.top - bounds.height / 2) * 0.08}px`);
}

function resetMagnetic(event) {
  event.currentTarget.style.setProperty("--mag-x", "0px");
  event.currentTarget.style.setProperty("--mag-y", "0px");
}

export function Hero() {
  return (
    <section className="hero" id="ch-00">
      <div className="hero-coordinate" aria-hidden="true">SYS.LOC: 10.79° N, 78.70° E</div>
      <div className="hero-wordmark" aria-hidden="true">
        <span>AAKASH</span>
        <span>AI <i>// PORTFOLIO</i></span>
      </div>
      <div className="hero-grid-floor" aria-hidden="true" />
      <Suspense fallback={<div className="hero-scene hero-scene-fallback" aria-hidden="true" />}>
        <HeroScene />
      </Suspense>
      <div className="hero-portrait" aria-label={`${PROFILE.name}, ${PROFILE.role}`}>
        <div className="portrait-glow" />
        <img src="/assets/images/profile-portrait.png" alt={PROFILE.name} />
      </div>
      <div className="hero-copy">
        <p className="hero-greeting">// HELLO, I&apos;M</p>
        <h1>AAKASH</h1>
        <p className="hero-role"><span className="live-dot" /> AI ENGINEER &amp; CREATIVE DEVELOPER</p>
        <p className="hero-tagline">FULL-STACK &amp; 3D WEB <i>//</i> EX-AMAZON</p>
      </div>
      <div className="hero-stats" aria-label="Career highlights">
        {STATS.map((stat, index) => (
          <div className="hero-stat" key={stat.label}>
            {index === 0 && <strong>3+</strong>}
            <span>{stat.value === "3+" ? stat.label : `${stat.value} ${stat.label}`}</span>
          </div>
        ))}
      </div>
      <div className="hero-actions">
        <a className="button button-primary magnetic-button" href={PROFILE.whatsapp} target="_blank" rel="noopener noreferrer" onPointerMove={updateMagnetic} onPointerLeave={resetMagnetic}>
          BOOK A 48-HR BUILD
        </a>
        <a className="button button-quiet" href={`mailto:${PROFILE.email}`}>
          HIRE ME <ArrowUpRight size={14} />
        </a>
      </div>
      <p className="hero-status"><span className="live-dot" /> {PROFILE.status}</p>
      <div className="hero-tech-cloud" aria-label="Technology stack">
        {HERO_CARDS.map((card) => (
          <span
            className="floating-label"
            key={card.label}
            style={{ "--label-color": card.color, "--label-x": `${card.x}%`, "--label-y": `${card.y}%`, "--label-z": `${card.depth}px`, "--card-delay": `${card.delay}s` }}
            onPointerMove={updateParallax}
            onPointerLeave={resetParallax}
          >
            <span />{card.label}
          </span>
        ))}
      </div>
      <a className="scroll-cue" href="#ch-01" onClick={(event) => navigateClick(event, "#ch-01")}>
        <span /> SCROLL TO EXPLORE <ArrowDown size={14} />
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
    <section className="content-section chapter-section" id="ch-01">
      <SectionHeading number="01" kicker="CH.01 //" title="EXPERIENCE" description="Roles that built the arsenal — production AI systems, high-precision data work and applied machine learning." />
      <div className="experience-list">
        {EXPERIENCE.map((item, index) => (
          <motion.article className="experience-card tilt-card" key={item.company} style={{ "--accent": item.accent }} onPointerMove={updateParallax} onPointerLeave={resetParallax} variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.18 }} custom={index}>
            <div className="experience-card-meta">
              <span className="experience-period">{item.period}</span>
              <span className="experience-team">{item.team}</span>
            </div>
            <h3>{item.company}</h3>
            <p className="experience-role">{item.role}</p>
            <p className="body-copy">{item.description}</p>
            <div className="tag-row">{item.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
            <span className="experience-index">{String(index + 1).padStart(2, "0")}</span>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function SkillOrbit({ selectedCategory, selectedSkill, onSelectCategory, onSelectSkill }) {
  const [hovered, setHovered] = useState(null);
  const [compact, setCompact] = useState(false);
  const active = hovered ?? selectedCategory;
  useEffect(() => {
    const media = window.matchMedia("(max-width: 900px)");
    const updateCompact = () => setCompact(media.matches);
    updateCompact();
    media.addEventListener("change", updateCompact);
    return () => media.removeEventListener("change", updateCompact);
  }, []);
  const nodes = SKILL_CATEGORIES.map((category, categoryIndex) => ({
    category,
    categoryIndex,
    skills: category.items,
  }));
  const ringRadii = compact ? [34, 26, 18] : [44, 33, 22];
  const ringVerticalRadii = compact ? [35, 30, 22] : [35, 27, 19];
  const phaseOffsets = compact ? [0, 15, 0] : [0, 15, 30];

  return (
    <div className="skill-orbit" aria-label="Interactive technology skill map">
      <div className="orbit-cluster-controls" role="group" aria-label="Isolate a skill cluster">
        {nodes.map(({ category }, index) => (
          <button
            key={category.name}
            type="button"
            aria-pressed={selectedCategory === index}
            style={{ "--cluster-color": category.color }}
            onClick={() => onSelectCategory(selectedCategory === index ? null : index)}
          >
            <i />{category.name}
          </button>
        ))}
      </div>
      <svg className="skill-orbit-lines" viewBox="0 0 1000 560" aria-hidden="true">
        {ringRadii.map((radius, index) => (
          <ellipse
            key={radius}
            cx="500"
            cy="280"
            rx={`${radius}%`}
            ry={`${ringVerticalRadii[index]}%`}
            fill="none"
            stroke={nodes[index].category.color}
            strokeOpacity={active === null || active === index ? "0.5" : "0.12"}
            strokeWidth="1"
          />
        ))}
        {nodes.map(({ category }, index) => (
          <line
            key={category.name}
            x1="500"
            y1="280"
            x2={index === 0 ? "130" : index === 1 ? "790" : "500"}
            y2={index === 2 ? "85" : "475"}
            stroke={category.color}
            strokeOpacity={active === null || active === index ? "0.28" : "0.06"}
          />
        ))}
      </svg>
      <div className="orbit-core"><span>AI</span><small>ARSENAL</small></div>
      {nodes.map(({ category, categoryIndex, skills }) => (
        <div
          key={category.name}
          className={`orbit-cluster${active === categoryIndex ? " is-active" : ""}`}
          style={{
            "--cluster-color": category.color,
            "--ring-radius": `${ringRadii[categoryIndex]}%`,
          }}
          onMouseEnter={() => setHovered(categoryIndex)}
          onMouseLeave={() => setHovered(null)}
        >
          <h3 className="orbit-cluster-title">{category.name}</h3>
          {skills.map((skill, index) => {
            const angle =
              (index / skills.length) * Math.PI * 2 -
              Math.PI / 2 +
              (phaseOffsets[categoryIndex] * Math.PI) / 180;
            return (
              <button
                className="orbit-node"
                key={skill}
                type="button"
                style={{
                  "--node-x": `${50 + Math.cos(angle) * ringRadii[categoryIndex]}%`,
                  "--node-y": `${50 + Math.sin(angle) * ringVerticalRadii[categoryIndex]}%`,
                }}
                aria-label={`${skill} — ${category.name}`}
                aria-pressed={selectedCategory === categoryIndex && selectedSkill === skill}
                onClick={() => onSelectSkill(categoryIndex, skill)}
                onFocus={() => setHovered(categoryIndex)}
                onBlur={() => setHovered(null)}
              >
                <i />{skill}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export function Skills() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const selectCategory = (categoryIndex) => {
    setSelectedCategory(categoryIndex);
    setSelectedSkill(null);
  };
  const selectSkill = (categoryIndex, skill) => {
    setSelectedCategory(categoryIndex);
    setSelectedSkill(skill);
  };

  return (
    <section className="content-section skills-section chapter-section" id="ch-02">
      <SectionHeading number="02" kicker="CH.02 //" title="AI & 3D ARSENAL" description="Click an orbital skill to highlight it below, or select a cluster to highlight its full skill set." />
      <div className="orbit-heading"><span /> ORBITAL MAP // 03 CLUSTERS <span>CLICK TO HIGHLIGHT</span></div>
      <SkillOrbit
        selectedCategory={selectedCategory}
        selectedSkill={selectedSkill}
        onSelectCategory={selectCategory}
        onSelectSkill={selectSkill}
      />
      <p className="skill-selection-status" aria-live="polite">
        {selectedSkill
          ? `SELECTED SKILL // ${selectedSkill}`
          : selectedCategory !== null
            ? `SELECTED CLUSTER // ${SKILL_CATEGORIES[selectedCategory].name}`
            : "SELECT A NODE TO HIGHLIGHT ITS SKILL"}
      </p>
      <div className="skill-grid">
        {SKILL_CATEGORIES.map((category, index) => (
          <motion.article
            className={`skill-card tilt-card${selectedCategory === index ? " is-selected" : ""}`}
            key={category.name}
            style={{ "--skill-accent": category.color }}
            onPointerMove={updateParallax}
            onPointerLeave={resetParallax}
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: index * 0.08 }}
          >
            <span className="skill-index" style={{ color: category.color }}>0{index + 1} / DOMAIN</span>
            <h3>{category.name}</h3>
            <div className="tag-row">{category.items.map((skill) => (
              <span
                className={`tag skill-list-item${selectedCategory === index && (!selectedSkill || selectedSkill === skill) ? " is-highlighted" : ""}`}
                key={skill}
              >
                {skill}
              </span>
            ))}</div>
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
  const section = useRef(null);
  const track = useRef(null);

  useEffect(() => {
    const media = gsap.matchMedia();
    media.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      if (!section.current || !track.current) return undefined;
      const getDistance = () => Math.max(0, track.current.scrollWidth - section.current.clientWidth);
      const tween = gsap.to(track.current, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: () => `+=${getDistance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
      return () => tween.scrollTrigger?.kill();
    });
    return () => media.revert();
  }, []);

  return (
    <section className="content-section projects-section" id="ch-03" ref={section}>
      <div className="projects-heading">
        <SectionHeading number="03" kicker="CH.03 //" title="FEATURED BUILDS" description="Selected work — shipped, benchmarked and peer-reviewed." />
        <span className="project-counter">01 <i>/</i> 04</span>
      </div>
      <div className="project-viewport">
        <div className="project-track" ref={track}>
          {PROJECTS.map((project) => (
            <article className="project-card tilt-card" key={project.index} onPointerMove={updateParallax} onPointerLeave={resetParallax}>
              <div className="project-image-wrap" style={{ "--accent": project.accent }}>
                <img src={project.image} alt={project.imageAlt} loading="lazy" />
                <span className="project-number">{project.index} / 04</span>
                <span className="project-image-mark"><ArrowUpRight size={19} /></span>
              </div>
              <div className="project-copy">
                <p className="project-subtitle">{project.subtitle}</p>
                <h3>{project.title}</h3>
                <p className="body-copy">{project.description}</p>
                <div className="tag-row">{project.stack.map((item) => <span className="tag" key={item}>{item}</span>)}</div>
                <div className="project-links">
                  {project.demo ? <a href={project.demo} target="_blank" rel="noopener noreferrer">LIVE DEMO <ArrowUpRight size={14} /></a> : <span aria-disabled="true" title="Demo link not provided">LIVE DEMO <ArrowUpRight size={14} /></span>}
                  {project.repo ? <a href={project.repo} target="_blank" rel="noopener noreferrer">GITHUB <Code2 size={14} /></a> : <span aria-disabled="true" title="Repository link not provided">GITHUB <Code2 size={14} /></span>}
                </div>
              </div>
            </article>
          ))}
          <a className="project-card project-cta-card" href={PROFILE.whatsapp} target="_blank" rel="noopener noreferrer">
            <span>YOUR BUILD</span>
            <strong>HERE?</strong>
            <span className="button button-primary">START A 48-HR BUILD <ArrowUpRight size={15} /></span>
          </a>
        </div>
      </div>
    </section>
  );
}

export function Education() {
  return (
    <section className="content-section education-section chapter-section" id="ch-04">
      <SectionHeading number="04" kicker="CH.04 //" title="RESEARCH & EDUCATION" description="Research at the intersection of predictive intelligence and real-world systems." />
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
  const [selectedService, setSelectedService] = useState(FOUNDER_SERVICES[0]);
  const [copyStatus, setCopyStatus] = useState("");
  const message = `Hi Aakash, I would like to discuss a ${selectedService} project.`;
  const whatsappUrl = new URL(PROFILE.whatsapp);
  whatsappUrl.searchParams.set("text", message);
  const emailUrl = `mailto:${PROFILE.email}?subject=${encodeURIComponent(`Project enquiry: ${selectedService}`)}&body=${encodeURIComponent(message)}`;

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopyStatus("Email copied");
    } catch {
      setCopyStatus("Copy unavailable — use the email link");
    }
  };

  return (
    <section className="contact-section chapter-section" id="ch-05">
      <div className="contact-glow" aria-hidden="true" />
      <SectionHeading number="05" kicker="CH.05 //" title="INITIATE CONTACT" description="Two doors. One inbox — pick your mode and let's ship something." />
      <div className="contact-panels">
      <div className="contact-content founder-terminal">
        <p className="eyebrow"><span className="live-dot" /> OPEN TO WHAT&apos;S NEXT</p>
        <h2>Build something<br /><em>worth shipping.</em></h2>
        <p className="contact-copy">Need a high-converting 3D website, MVP, or custom AI workflow shipped in 48–72 hours? Choose a starting point and let&apos;s talk.</p>
        <p className="terminal-label">$ CONTACT --MODE=FOUNDERS</p>
        <div className="service-pills" role="group" aria-label="Choose a project type">
          {FOUNDER_SERVICES.map((service) => (
            <button key={service} type="button" aria-pressed={selectedService === service} onClick={() => setSelectedService(service)}>
              {service}
            </button>
          ))}
        </div>
        <div className="contact-actions">
          <a className="button button-primary" href={whatsappUrl.href} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} /> WHATSAPP ME</a>
          <a className="button button-quiet" href={emailUrl}><Mail size={16} /> EMAIL THE BRIEF</a>
        </div>
      </div>
      <div className="contact-details recruiter-terminal">
        <p className="terminal-label">$ CONTACT --MODE=RECRUITERS</p>
        <a href={PROFILE.github} target="_blank" rel="noopener noreferrer"><Code2 size={17} /><span><small>GITHUB</small>Projects &amp; code</span><ArrowUpRight size={15} /></a>
        <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer"><ArrowUpRight size={17} /><span><small>LINKEDIN</small>Professional profile</span><ArrowUpRight size={15} /></a>
        <a href={PROFILE.resume} download><ArrowDown size={17} /><span><small>RESUME</small>Download PDF</span><ArrowUpRight size={15} /></a>
        <button className="copy-email" type="button" onClick={copyEmail}><Copy size={16} /><span><small>EMAIL</small><span aria-live="polite">{copyStatus || PROFILE.email}</span></span></button>
        <div className="contact-location"><MapPin size={16} />{PROFILE.location}</div>
      </div>
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

function SectionHeading({ number, kicker, title, description }) {
  return (
    <motion.div className="section-heading" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }}>
      <span className="section-number">{number}</span>
      <div>
        <p className="eyebrow">{kicker}</p>
        <h2>{title}</h2>
        {description && <p className="section-description">{description}</p>}
      </div>
      <ArrowDownRight className="heading-arrow" size={23} />
    </motion.div>
  );
}
