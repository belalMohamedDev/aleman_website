import { useRef, useEffect, useState, useCallback } from 'react';
import {
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useReducedMotion,
} from 'framer-motion';
import { HeroBackgroundLayer } from './HeroBackgroundLayer';
import { HeroGreeneryLayer } from './HeroGreeneryLayer';
import { HeroShowcaseLayer } from './HeroShowcaseLayer';
import { HeroContentLayer } from './HeroContentLayer';
import './hero-parallax.css';

export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();
  const [isTouch, setIsTouch] = useState(false);
  const [isFallback, setIsFallback] = useState(false);

  // Detect touch devices to strictly disable mouse parallax on mobile/touch screens
  useEffect(() => {
    const isTouchDevice =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches;
    setIsTouch(isTouchDevice);
  }, []);

  // Pre-flight check: verify clean background image exists; fallback if unavailable
  useEffect(() => {
    const testImg = new Image();
    testImg.src = '/aleman_parallax_assets/hero-background-clean.png';
    testImg.onerror = () => {
      console.warn('[Aleman Hero] Clean background asset missing, falling back to composite image.');
      setIsFallback(true);
    };
  }, []);

  // --------------------------------------------------------------------------
  // 1. Scroll-Driven Parallax Tracking
  // --------------------------------------------------------------------------
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Background: stays deep with subtle push
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '8%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.03]);

  // Greenery: framing hedges and leaves
  const greenY = useTransform(scrollYProgress, [0, 1], ['0%', '11%']);

  // Content (Right side in RTL): smooth upward exit and clean dissolve
  const contentY = useTransform(scrollYProgress, [0, 0.85], ['0%', '-20%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55, 0.85], [1, 0.7, 0]);

  // --------------------------------------------------------------------------
  // 2. Desktop Pointer-Driven Micro-Parallax
  // --------------------------------------------------------------------------
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);

  const springConfig = { damping: 26, stiffness: 160, mass: 0.5 };
  const smoothMouseX = useSpring(rawMouseX, springConfig);
  const smoothMouseY = useSpring(rawMouseY, springConfig);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (isTouch || reducedMotion) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      // Normalize coordinate offset from center [-1, 1]
      const nx = (clientX / innerWidth - 0.5) * 2;
      const ny = (clientY / innerHeight - 0.5) * 2;
      rawMouseX.set(nx);
      rawMouseY.set(ny);
    },
    [isTouch, reducedMotion, rawMouseX, rawMouseY]
  );

  const handlePointerLeave = useCallback(() => {
    rawMouseX.set(0);
    rawMouseY.set(0);
  }, [rawMouseX, rawMouseY]);

  // Background pointer micro-parallax (±2-3px)
  const bgPointerX = useTransform(smoothMouseX, [-1, 1], [-3, 3]);
  const bgPointerY = useTransform(smoothMouseY, [-1, 1], [-2, 2]);

  // Greenery pointer micro-parallax (±5px)
  const greenPointerX = useTransform(smoothMouseX, [-1, 1], [-5, 5]);
  const greenPointerY = useTransform(smoothMouseY, [-1, 1], [-3, 3]);

  // Content pointer micro-parallax (±2px)
  const contentPointerX = useTransform(smoothMouseX, [-1, 1], [-2, 2]);
  const contentPointerY = useTransform(smoothMouseY, [-1, 1], [-2, 2]);

  // --------------------------------------------------------------------------
  // 3. Scroll Down Action
  // --------------------------------------------------------------------------
  const scrollToNext = useCallback(() => {
    if (!sectionRef.current) {
      window.scrollTo({ top: window.innerHeight - 80, behavior: 'smooth' });
      return;
    }
    const rect = sectionRef.current.getBoundingClientRect();
    const targetScroll = window.scrollY + rect.height - 20;
    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth',
    });
  }, []);

  const reduced = !!reducedMotion;

  return (
    <section
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="hero-parallax-section"
      aria-labelledby="hero-title"
    >
      <div className="hero-parallax-sticky">
        {/* Layer 1 & 2: Background Landscape & Reading Contrast Vignette */}
        <HeroBackgroundLayer
          y={bgY}
          scale={bgScale}
          pointerX={bgPointerX}
          pointerY={bgPointerY}
          isFallback={isFallback}
          reduced={reduced}
        />

        {/* Layer 2.5: Greenery Hedges & Hanging Leaves Frame (green.png) */}
        {!isFallback && (
          <HeroGreeneryLayer
            y={greenY}
            pointerX={greenPointerX}
            pointerY={greenPointerY}
            reduced={reduced}
          />
        )}

        {/* Layer 3-6: Unified Product & Farm Showcase (Bags on Pallet, Cow, Duck, Chicken, Grains) */}
        {!isFallback && (
          <HeroShowcaseLayer
            progress={scrollYProgress}
            smoothMouseX={smoothMouseX}
            smoothMouseY={smoothMouseY}
            reduced={reduced}
          />
        )}

        {/* Layer 7 & 8: Arabic RTL Headline, Copy, CTAs, and Scroll Indicator */}
        <HeroContentLayer
          y={contentY}
          opacity={contentOpacity}
          pointerX={contentPointerX}
          pointerY={contentPointerY}
          onScrollClick={scrollToNext}
          reduced={reduced}
        />
      </div>
    </section>
  );
}