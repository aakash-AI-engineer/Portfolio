import { Component, useEffect } from "react";
import { MotionConfig } from "framer-motion";
import { initScroll, ScrollTrigger, destroyScroll } from "./lib/scroll";
import ChapterHUD from "./components/ChapterHUD";
import SpaceBackground from "./components/SpaceBackground";
import {
  Contact,
  CustomCursor,
  Education,
  Experience,
  Footer,
  GrainOverlay,
  Hero,
  Marquee,
  Navbar,
  Projects,
  Skills,
} from "./components/Sections";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <main className="render-fault" data-testid="error-boundary">
          <p>RENDER FAULT — {String(this.state.error?.message || this.state.error)}</p>
        </main>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  useEffect(() => {
    initScroll();
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    return () => {
      window.removeEventListener("load", refresh);
      destroyScroll();
    };
  }, []);

  return (
    <ErrorBoundary>
      <MotionConfig reducedMotion="user">
        <div className="portfolio-root">
          <SpaceBackground />
          <GrainOverlay />
          <CustomCursor />
          <Navbar />
          <main>
            <Hero />
            <Marquee />
            <Experience />
            <Skills />
            <Projects />
            <Education />
            <Contact />
          </main>
          <Footer />
          <ChapterHUD />
        </div>
      </MotionConfig>
    </ErrorBoundary>
  );
}
