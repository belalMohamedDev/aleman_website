import { useEffect, useRef } from 'react';

/** Slow golden dust over the scene; its visibility follows `fx.motes`, tweened per chapter. */
export function StageMotes({ fx }: { fx: { motes: number } }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const COUNT = 64;
    const motes = Array.from({ length: COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.6 + Math.random() * 1.8,
      vy: 0.00006 + Math.random() * 0.00016,
      vx: (Math.random() - 0.5) * 0.00005,
      phase: Math.random() * Math.PI * 2,
    }));

    let w = 0;
    let h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(canvas);

    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const dt = Math.min(48, now - last);
      last = now;
      ctx.clearRect(0, 0, w, h);
      if (fx.motes < 0.01) return;
      for (const m of motes) {
        m.y -= m.vy * dt;
        m.x += m.vx * dt;
        if (m.y < -0.02) {
          m.y = 1.02;
          m.x = Math.random();
        }
        const twinkle = 0.5 + 0.5 * Math.sin(now * 0.0012 + m.phase);
        ctx.globalAlpha = fx.motes * (0.25 + twinkle * 0.55);
        ctx.fillStyle = '#e8d6a2';
        ctx.beginPath();
        ctx.arc(m.x * w, m.y * h, m.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [fx]);

  return <canvas ref={ref} className="cs-motes" aria-hidden="true" />;
}
