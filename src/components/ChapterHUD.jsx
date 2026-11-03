import { useEffect, useState } from "react";
import { CHAPTERS } from "../lib/data";
import { scrollToTarget } from "../lib/scroll";

export default function ChapterHUD() {
  const [active, setActive] = useState("00");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
      const max = scrollHeight - clientHeight;
      setProgress(max > 0 ? Math.round((scrollTop / max) * 100) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id.replace("ch-", ""));
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    CHAPTERS.forEach((chapter) => {
      const section = document.querySelector(chapter.target);
      if (section) {
        observer.observe(section);
      }
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-[70] border-t border-white/10 bg-black/70 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl"
      data-testid="chapter-hud"
      aria-label="Chapter navigation"
    >
      <div
        aria-hidden="true"
        className="absolute left-0 top-0 h-[2px] bg-gradient-to-r from-crimson via-cyan to-violet transition-[width] duration-150"
        style={{ width: `${progress}%` }}
      />
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-2 py-2 sm:px-4 md:px-8">
        <span
          className="w-10 shrink-0 font-mono text-[10px] text-cyan"
          data-testid="hud-progress"
        >
          {String(progress).padStart(3, "0")}%
        </span>
        <div className="no-scrollbar flex flex-1 items-center justify-start gap-1 overflow-x-auto sm:justify-center sm:gap-2">
          {CHAPTERS.map((chapter) => {
            const isActive = active === chapter.id;
            return (
              <button
                key={chapter.id}
                type="button"
                onClick={() => scrollToTarget(chapter.target)}
                data-testid={`hud-chapter-${chapter.id}`}
                aria-label={`${chapter.id} ${chapter.label}`}
                aria-current={isActive ? "location" : undefined}
                className={`group flex min-h-11 shrink-0 flex-col items-center justify-center gap-0 rounded-lg px-2 py-1 transition-all duration-300 sm:px-2.5 ${
                  isActive ? "text-white" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <span
                  className={`font-mono text-[9px] transition-colors sm:text-[10px] ${
                    isActive ? "text-crimson" : "text-slate-600 group-hover:text-slate-400"
                  }`}
                >
                  {chapter.id}
                </span>
                <span
                  className={`whitespace-nowrap font-mono text-[6px] uppercase tracking-normal sm:text-[8px] sm:tracking-[0.1em] lg:text-[10px] lg:tracking-[0.18em] ${
                    isActive ? "opacity-100" : "opacity-70"
                  }`}
                >
                  {chapter.label}
                </span>
                {isActive && (
                  <span className="hidden h-1 w-1 rounded-full bg-crimson shadow-[0_0_8px_rgba(255,42,84,0.9)] lg:inline-block" />
                )}
              </button>
            );
          })}
        </div>
        <span className="hidden w-10 shrink-0 text-right font-mono text-[10px] text-slate-500 md:block">
          CH.{active}
        </span>
      </div>
    </nav>
  );
}
