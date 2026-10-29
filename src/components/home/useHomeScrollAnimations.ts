import { useLayoutEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import './home-scroll.css';

gsap.registerPlugin(ScrollTrigger);

// The live Lenis instance on the home page, so in-page links can scroll through it
let activeLenis: Lenis | null = null;

export function scrollHomeTo(y: number) {
  if (activeLenis) activeLenis.scrollTo(y, { duration: 2.2 });
  else window.scrollTo({ top: y, behavior: 'smooth' });
}

const MOTION_OK = '(prefers-reduced-motion: no-preference)';

export function useHomeScrollAnimations(rootRef: RefObject<HTMLElement>, rebuildKey: string) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ------------------------------------------------------------------------
    // Smooth inertial scrolling, driven by GSAP's ticker so every ScrollTrigger
    // reads the same frame.
    // ------------------------------------------------------------------------
    let lenis: Lenis | null = null;
    const tick = (time: number) => lenis?.raf(time * 1000);
    if (!reduced) {
      lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 });
      activeLenis = lenis;
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      // Lets browser-automation checks jump through the page in dev
      if (import.meta.env.DEV) (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    }

    const mm = gsap.matchMedia(root);

    mm.add(MOTION_OK, () => {
      // Masked word-by-word heading reveals
      gsap.utils.toArray<HTMLElement>('[data-split-heading]').forEach((heading) => {
        gsap.from(heading.querySelectorAll('.split-word'), {
          yPercent: 115,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.06,
          ease: 'expo.out',
          scrollTrigger: { trigger: heading, start: 'top 85%', toggleActions: 'play none none reverse' },
        });
      });

      gsap.utils.toArray<HTMLElement>('[data-ht-fade]').forEach((el) => {
        gsap.from(el, {
          autoAlpha: 0,
          y: 24,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' },
        });
      });

      // Product shots settle onto the shelf one after another (HomeTrust, when rendered)
      if (root.querySelector('[data-ht-bag]')) {
        gsap.from('[data-ht-bag]', {
          y: 90,
          autoAlpha: 0,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.ht-visual', start: 'top 90%', end: 'top 45%', scrub: 1 },
        });
      }

      // Farm programme: heading and the sentence card rise in
      if (root.querySelector('.fp')) {
        gsap.from('.fp-head, .fp-card', {
          autoAlpha: 0,
          y: 28,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.fp', start: 'top 75%', toggleActions: 'play none none reverse' },
        });
      }

      // Each trust point: its rule draws across, then the text rises
      const points = gsap.utils.toArray<HTMLElement>('[data-ht-point]');
      if (points.length) {
        gsap
          .timeline({ scrollTrigger: { trigger: points[0].parentElement, start: 'top 85%', toggleActions: 'play none none reverse' } })
          .from('[data-ht-rule]', { scaleX: 0, duration: 0.8, stagger: 0.12, ease: 'power3.inOut' })
          .from(
            points.map((p) => p.querySelectorAll('.ht-num, .ht-point-title, .ht-point-desc')),
            { autoAlpha: 0, y: 16, duration: 0.6, stagger: 0.05, ease: 'power2.out' },
            0.3
          );
      }
    });

    // Lazy images change section heights; keep trigger positions accurate
    let refreshTimer = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 150);
    });
    ro.observe(root);

    return () => {
      ro.disconnect();
      window.clearTimeout(refreshTimer);
      mm.revert();
      gsap.ticker.remove(tick);
      lenis?.destroy();
      activeLenis = null;
    };
  }, [rootRef, rebuildKey]);
}
