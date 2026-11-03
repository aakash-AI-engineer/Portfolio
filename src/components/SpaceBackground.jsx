import { useEffect, useRef } from "react";

const STAR_COUNT = 150;

export default function SpaceBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stars = Array.from({ length: STAR_COUNT }, (_, index) => ({
      x: Math.random(),
      y: Math.random(),
      size: 0.5 + Math.random() * 1.5,
      speed: 0.0007 + Math.random() * 0.0015,
      phase: Math.random() * Math.PI * 2,
      color: ["#e7eaff", "#00f0ff", "#ff2a54", "#b879ff"][index % 4],
    }));
    const pointer = { x: 0.5, y: 0.45, targetX: 0.5, targetY: 0.45 };
    const positions = [];
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let frame = 0;
    let startTime = performance.now();

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const draw = (time) => {
      const elapsed = reducedMotion.matches ? 0 : time - startTime;
      pointer.x += (pointer.targetX - pointer.x) * 0.045;
      pointer.y += (pointer.targetY - pointer.y) * 0.045;
      context.clearRect(0, 0, width, height);
      positions.length = 0;

      for (const [index, star] of stars.entries()) {
        const drift = elapsed * star.speed;
        const baseX = ((star.x * width + Math.sin(drift + star.phase) * 18) % width + width) % width;
        const baseY = ((star.y * height + drift * (18 + star.size * 12)) % height + height) % height;
        const dx = pointer.x * width - baseX;
        const dy = pointer.y * height - baseY;
        const distance = Math.hypot(dx, dy);
        const influence = Math.max(0, 1 - distance / 190);
        const x = baseX - dx * influence * 0.075 + (pointer.x - 0.5) * star.size * 13;
        const y = baseY - dy * influence * 0.075 + (pointer.y - 0.5) * star.size * 13;
        const twinkle = 0.5 + Math.sin(elapsed * 0.0015 + star.phase) * 0.28;
        positions.push({ x, y, color: star.color, index });

        context.globalAlpha = Math.min(1, twinkle + influence * 0.35);
        context.fillStyle = star.color;
        context.beginPath();
        context.arc(x, y, star.size + influence * 0.8, 0, Math.PI * 2);
        context.fill();
      }

      context.lineWidth = 0.7;
      for (let index = 0; index < positions.length; index += 1) {
        const first = positions[index];
        for (let nextIndex = index + 1; nextIndex < positions.length; nextIndex += 1) {
          const second = positions[nextIndex];
          const distance = Math.hypot(first.x - second.x, first.y - second.y);
          if (distance > 92) continue;
          context.globalAlpha = (1 - distance / 92) * 0.13;
          context.strokeStyle = first.color;
          context.beginPath();
          context.moveTo(first.x, first.y);
          context.lineTo(second.x, second.y);
          context.stroke();
        }
      }
      context.globalAlpha = 1;

      if (!reducedMotion.matches && !document.hidden) {
        frame = window.requestAnimationFrame(draw);
      }
    };

    const onPointerMove = (event) => {
      pointer.targetX = event.clientX / window.innerWidth;
      pointer.targetY = event.clientY / window.innerHeight;
      if (reducedMotion.matches) draw(performance.now());
    };
    const onVisibilityChange = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(frame);
      } else if (!reducedMotion.matches) {
        startTime = performance.now();
        frame = window.requestAnimationFrame(draw);
      }
    };
    const onMotionChange = () => {
      window.cancelAnimationFrame(frame);
      startTime = performance.now();
      if (reducedMotion.matches) draw(startTime);
      else frame = window.requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    reducedMotion.addEventListener("change", onMotionChange);
    if (reducedMotion.matches) draw(startTime);
    else frame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      reducedMotion.removeEventListener("change", onMotionChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="space-backdrop" aria-hidden="true" />;
}
