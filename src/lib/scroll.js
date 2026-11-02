import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenis = null;
let ticker = null;

export function initScroll() {
  if (lenis || typeof window === "undefined") return lenis;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;

  lenis = new Lenis({
    lerp: 0.09,
    smoothWheel: true,
    wheelMultiplier: 1,
  });
  lenis.on("scroll", ScrollTrigger.update);
  ticker = (time) => lenis?.raf(time * 1000);
  gsap.ticker.add(ticker);
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export function scrollToTarget(target) {
  if (!target) return;
  window.history.replaceState(null, "", target);
  if (lenis) {
    lenis.scrollTo(target, { offset: -72, duration: 1.25 });
  } else {
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth";
    document.querySelector(target)?.scrollIntoView({ behavior });
  }
}

export function destroyScroll() {
  if (ticker) gsap.ticker.remove(ticker);
  lenis?.destroy();
  ticker = null;
  lenis = null;
}

export function getLenis() {
  return lenis;
}

export { gsap, ScrollTrigger };
