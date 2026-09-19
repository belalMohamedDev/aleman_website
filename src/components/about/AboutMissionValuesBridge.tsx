import { useEffect, useRef, useState } from 'react';
import './about-journey.css';

export function AboutMissionValuesBridge() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pathData, setPathData] = useState<string>('');

  useEffect(() => {
    const updatePath = () => {
      const el1 = document.getElementById('about-mission-track');
      const el2 = document.getElementById('about-values-track');
      const container = containerRef.current;

      if (!el1 || !el2 || !container) {
        setPathData('');
        return;
      }

      const r1 = el1.getBoundingClientRect();
      const r2 = el2.getBoundingClientRect();
      const cr = container.getBoundingClientRect();

      // If either track is hidden on small mobile screens (< 640px)
      if (r1.width === 0 || r2.width === 0 || r1.height === 0 || r2.height === 0) {
        setPathData('');
        return;
      }

      // Exact pixel coordinates relative to this container
      const startX = r1.left + r1.width / 2 - cr.left;
      const startY = r1.bottom - cr.top;
      const endX = r2.left + r2.width / 2 - cr.left;
      const endY = r2.top - cr.top;

      const deltaY = endY - startY;
      if (deltaY <= 0) {
        setPathData('');
        return;
      }

      // Check heading element position to guarantee the curve stays comfortably above it
      const headingEl = document.getElementById('about-values-heading');
      let targetMidY = startY + deltaY * 0.35;

      if (headingEl) {
        const hr = headingEl.getBoundingClientRect();
        const headingTop = hr.top - cr.top;
        if (headingTop - 28 < targetMidY) {
          targetMidY = Math.max(startY + 24, headingTop - 28);
        }
      }

      const midX = (startX + endX) / 2;
      const midY = targetMidY;
      const cpLen = Math.max(25, (midY - startY) * 0.7);
      const endCpLen = Math.max(35, (endY - midY) * 0.38);
      const horizontalSpread = Math.min(90, Math.abs(startX - endX) * 0.16);

      // C1 Continuous Bezier Curve:
      // Starts strictly vertical downwards at Mission track bottom (startX, startY)
      // Sweeps smoothly horizontally across in the safe channel above the Values heading
      // Enters strictly vertical downwards at Values track top (endX, endY)
      const cp1x = startX;
      const cp1y = startY + cpLen;
      const cp2x = midX + horizontalSpread;
      const cp2y = midY;

      const cp3x = midX - horizontalSpread;
      const cp3y = midY;
      const cp4x = endX;
      const cp4y = endY - endCpLen;

      const d = `M ${startX.toFixed(2)},${startY.toFixed(2)} C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${midX.toFixed(2)},${midY.toFixed(2)} C ${cp3x.toFixed(2)},${cp3y.toFixed(2)} ${cp4x.toFixed(2)},${cp4y.toFixed(2)} ${endX.toFixed(2)},${endY.toFixed(2)}`;

      setPathData(d);
    };

    updatePath();

    window.addEventListener('resize', updatePath);

    const ro = new ResizeObserver(() => {
      updatePath();
    });

    ro.observe(document.body);

    const t1 = setTimeout(updatePath, 80);
    const t2 = setTimeout(updatePath, 350);

    return () => {
      window.removeEventListener('resize', updatePath);
      ro.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (!pathData) return null;

  return (
    <div ref={containerRef} className="about-bridge-container" aria-hidden="true">
      <svg className="about-bridge-svg">
        {/* Soft Ambient Background Guide Line */}
        <path
          d={pathData}
          stroke="#e2e8f0"
          strokeWidth="6"
          strokeOpacity="0.8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Seamless Continuous Gray Strand */}
        <path
          d={pathData}
          stroke="#94a3b8"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
          className="about-mission-main-strand"
        />
      </svg>
    </div>
  );
}
