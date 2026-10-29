import { useEffect, useRef, useState, type CSSProperties } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollHomeTo } from './useHomeScrollAnimations';
import { setNavOverDark } from '../layout/navTheme';
import { useLang } from '../../i18n/LanguageContext';
import { ui } from '../../i18n/ui';
import { timeline } from '../../data/timeline';
import './quality-inspection.css';

gsap.registerPlugin(ScrollTrigger);

const BAG = '/aleman_parallax_assets/bag-05-broiler.webp';

// The checkpoints in production order; each chapter does something to the bag (see the CSS for which)
const STEPS = ['raw', 'lab', 'make', 'test', 'pack'] as const;
const MAKE = STEPS.indexOf('make');
const PACK = STEPS.indexOf('pack');

const CHAPTERS = STEPS.length;
const YEARS = 33;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ease = (v: number) => v * v * (3 - 2 * v);

/**
 * "The bag under inspection": the five quality checkpoints as one pinned scroll scene, in production order:
 * raw materials cleaned, lab analysis (the bag is scanned), production with the years of expertise, the
 * finished product tested (it gets its approval stamp), then the sewn seal of the packing line.
 * Scroll progress is written straight to CSS variables and the 3D state, so React only
 * re-renders when the chapter or the shown bag changes.
 */
export function QualityInspection() {
  const { t, isRtl } = useLang();
  const h = ui.home;
  const q = h.inspection;

  const sectionRef = useRef<HTMLElement>(null);
  const yearsRef = useRef<HTMLSpanElement>(null);
  const bagImgRef = useRef<HTMLImageElement>(null);
  const [chapter, setChapter] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const apply = (progress: number) => {
      const raw = clamp01(progress) * CHAPTERS;
      const index = Math.min(CHAPTERS - 1, Math.floor(raw));
      // a short hold at both ends of every chapter so the text can be read
      const local = ease(clamp01((raw - index - 0.08) / 0.84));
      section.style.setProperty('--qi-local', local.toFixed(4));
      section.style.setProperty('--qi-progress', clamp01(progress).toFixed(4));
      setChapter(index);

      // the years count up over the first half of the production chapter, so they are read in full
      const years = index > MAKE ? 1 : index === MAKE ? Math.min(1, local * 2) : 0;
      if (yearsRef.current) yearsRef.current.textContent = String(Math.round(YEARS * years));

      // The flat bag image only leans: a slight turn for production, forward to show the sewn top for packing
      let spin = 0;
      let tilt = 0;
      if (index === MAKE) spin = -0.45 * Math.sin(local * Math.PI);
      if (index === PACK) tilt = 0.34 * Math.sin(local * Math.PI);
      if (bagImgRef.current) {
        bagImgRef.current.style.transform = `rotateY(${(spin * 57.3).toFixed(1)}deg) rotateX(${(tilt * 57.3).toFixed(1)}deg)`;
      }
    };

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      // measured after the pinned stage above it, which is rebuilt on language change
      refreshPriority: -1,
      onUpdate: (self) => apply(self.progress),
    });
    apply(st.progress);

    // Dark section: keep the navbar in its dark style from the moment the scene scrolls in
    // (what is above it then is the stage's dark exit) until it leaves the 72px bar
    const nav = ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'bottom 72px',
      refreshPriority: -1,
      onToggle: (self) => setNavOverDark(self.isActive, 'inspection'),
    });
    if (nav.isActive) setNavOverDark(true, 'inspection');

    return () => {
      st.kill();
      nav.kill();
      setNavOverDark(false, 'inspection');
    };
  }, []);

  // The step rail jumps to the middle of a chapter
  const goTo = (i: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const top = section.getBoundingClientRect().top + window.scrollY;
    const range = section.offsetHeight - window.innerHeight;
    scrollHomeTo(top + range * ((i + 0.5) / CHAPTERS));
  };

  // A checklist that fills in as the chapter plays (each row at its --qi-at mark)
  const readings = (className: string, note: string, rows: [string, string][]) => (
    <div className={`qi-widget ${className}`}>
      <p className="qi-widget-note">{note}</p>
      <dl>
        {rows.map(([label, value], k) => (
          <div key={label} className="qi-reading" style={{ '--qi-at': 0.15 + k * 0.2 } as CSSProperties}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );

  return (
    <section
      ref={sectionRef}
      className="qi"
      data-chapter={chapter}
      dir={isRtl ? 'rtl' : 'ltr'}
      aria-labelledby="qi-title"
    >
      <div className="qi-sticky">
        <div className="qi-stage" aria-hidden="true">
          <div className="qi-glow" />
          <div className="qi-frame">
            <img ref={bagImgRef} src={BAG} alt="" className="qi-bag-img" draggable={false} />
            {/* the lab's scanning beam, and the approval stamp of the product test */}
            <span className="qi-scan" />
            <span className="qi-stamp">{t(q.approved)}</span>
          </div>
        </div>

        <div className="qi-panel">
          <p className="qi-label">{t(h.whyLabel)}</p>
          <h2 id="qi-title" className="qi-title">
            {t(q.title)}
          </h2>

          <ol className="qi-rail" aria-label={t(q.stepsLabel)}>
            {q.short.map((label, i) => (
              <li key={i}>
                <button
                  type="button"
                  className={`qi-rail-step${i === chapter ? ' is-active' : ''}${i < chapter ? ' is-done' : ''}`}
                  aria-current={i === chapter ? 'step' : undefined}
                  onClick={() => goTo(i)}
                >
                  <span className="qi-rail-num">0{i + 1}</span>
                  <span className="qi-rail-text">{t(label)}</span>
                </button>
              </li>
            ))}
          </ol>

          <div className="qi-chapters">
            {STEPS.map((step, i) => (
              <article key={step} className={`qi-chapter${i === chapter ? ' is-active' : ''}`} aria-hidden={i !== chapter}>
                <span className="qi-num">0{i + 1}</span>
                <h3 className="qi-chapter-title">{t(q.steps[step].title)}</h3>
                <p className="qi-chapter-desc">{t(q.steps[step].desc)}</p>

                {step === 'raw' &&
                  readings('qi-raw', t(q.rawNote), [
                    [t(q.corn), t(q.clean)],
                    [t(q.soy), t(q.clean)],
                    [t(q.impurities), t(q.removed)],
                  ])}

                {step === 'lab' &&
                  readings('qi-lab', t(q.sampleNote), [
                    [t(q.protein), t(q.pass)],
                    [t(q.mycotoxins), t(q.notDetected)],
                    [t(q.moistureLevel), t(q.withinLimits)],
                  ])}

                {step === 'make' && (
                  <div className="qi-widget qi-years">
                    <p className="qi-years-count">
                      <span ref={yearsRef}>0</span>
                      <small>{t(q.years)}</small>
                    </p>
                    <ol className="qi-milestones">
                      {timeline.map((stage, k) => (
                        <li
                          key={stage.id}
                          style={{ '--qi-at': (k + 0.5) / timeline.length } as CSSProperties}
                        >
                          {t(stage.title)}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {step === 'test' &&
                  readings('qi-test', t(q.testNote), [
                    [t(q.formula), t(q.pass)],
                    [t(q.uniformity), t(q.pass)],
                    [t(q.hardness), t(q.pass)],
                  ])}

                {step === 'pack' && (
                  <div className="qi-widget qi-seal">
                    <svg className="qi-seam" viewBox="0 0 320 44" preserveAspectRatio="none">
                      <rect x="0" y="6" width="320" height="32" rx="4" />
                      <path className="qi-stitch" d="M8 22 H312" pathLength={100} />
                      <rect className="qi-seam-cover" x="4" y="12" width="312" height="20" />
                    </svg>
                    <p className="qi-seal-line">{t(q.sealed)}</p>
                    <p className="qi-seal-badge">{t(q.moisture)}</p>
                  </div>
                )}

              </article>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
