import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { categories, getProduct } from '../../data/products';
import { useLang } from '../../i18n/LanguageContext';
import { ui } from '../../i18n/ui';
import { setNavOverDark } from '../layout/navTheme';
import { ASSETS, BAGS, BIRD_STAGES, BirdImage, CATEGORY_DESC, COMPANION, FEED_STAGES } from './stageData';
import './mobile-story.css';

gsap.registerPlugin(ScrollTrigger);

// The phone version of the home story. A phone shows only a narrow strip of the wide farm scene, so instead
// of the pinned desktop stage it tells the same story as a plain vertical scroll: the mill at golden hour
// with the day-old flock, the growth timeline (one step per feeding stage), the mill photo the bag rises into,
// and the feeds as swipeable cards. Motion stays light for phones: an entrance, a little parallax while the
// photos scroll by, each part coming in as it is reached, and small idle movements.

// The animals the mill feeds, standing on the opening copy: one on each title line and the lead line, the
// rabbits on the button (placed in CSS, sized in em so each keeps its spot at any text size)
const PERCHED = {
  poultry: `${ASSETS}/chicken.webp`,
  livestock: `${ASSETS}/cow.webp`,
  duck: `${ASSETS}/duck.webp`,
  rabbit: '/animals/rabbits.webp',
} as const;

function Perch({ id }: { id: keyof typeof PERCHED }) {
  return <img className={`ms-perch ms-perch-${id}`} src={PERCHED[id]} alt="" aria-hidden="true" />;
}

// The mill scene shows a group of feeds, not one: poultry in front, livestock and ducks behind it either side
const MILL_BAGS = [
  { bag: BAGS[1], className: 'ms-mill-bag-side ms-mill-bag-start' },
  { bag: BAGS[2], className: 'ms-mill-bag-side ms-mill-bag-end' },
  { bag: BAGS[0], className: 'ms-mill-bag-main' },
];

// Sections with a dark photo or background: the navbar takes its dark style while one of them is under it
const DARK_SECTIONS = ['.ms-hero', '.ms-mill', '.ms-products'];

// Day-old chicks on the ground of the opening screen (placed in CSS)
const HERO_CHICKS = 5;

// One timeline step per feeding stage, shown with the bird at the end of that stage
const GROWTH_STEPS = FEED_STAGES.map((feed) => ({
  ...feed,
  photo: [...BIRD_STAGES].reverse().find((stage) => stage.day <= feed.to) ?? BIRD_STAGES[0],
}));

export function MobileStory() {
  const { t, lang, isRtl } = useLang();
  const s = ui.home.stage;
  const rootRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLOListElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const kg = lang === 'ar' ? 'كجم' : 'kg';

  // Reveal each block as it scrolls into view (all at once when motion is reduced)
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const blocks = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      blocks.forEach((el) => el.setAttribute('data-in', ''));
      root.querySelectorAll('.ms-step').forEach((el) => el.setAttribute('data-in', ''));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute('data-in', '');
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' }
    );
    blocks.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [lang]);

  // The navbar follows the section under it (always, motion or not)
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const triggers = DARK_SECTIONS.map((selector, i) =>
      ScrollTrigger.create({
        trigger: root.querySelector(selector),
        start: 'top 64px',
        end: 'bottom 64px',
        onToggle: (self) => setNavOverDark(self.isActive, `phone-${i}`),
      })
    );
    triggers.forEach((st, i) => st.isActive && setNavOverDark(true, `phone-${i}`));
    return () => {
      triggers.forEach((st, i) => {
        st.kill();
        setNavOverDark(false, `phone-${i}`);
      });
    };
  }, [lang]);

  // Motion (skipped entirely when the visitor prefers reduced motion)
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const mm = gsap.matchMedia(root);
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const fromEnd = isRtl ? -1 : 1;

      // Opening: the mill settles in, the copy rises line by line, the animals hop onto it, the flock lands
      gsap
        .timeline({ delay: 0.1 })
        .from('.ms-hero-bg', { scale: 1.14, duration: 2.2, ease: 'power2.out' }, 0)
        .from('.ms-title-line', { yPercent: 55, autoAlpha: 0, duration: 0.8, stagger: 0.14, ease: 'expo.out' }, 0.2)
        .from('.ms-lead', { y: 18, autoAlpha: 0, duration: 0.6, ease: 'power2.out' }, 0.5)
        .from('.ms-actions', { y: 16, autoAlpha: 0, duration: 0.5, ease: 'power2.out' }, 0.65)
        .from('.ms-perch', { y: -46, autoAlpha: 0, duration: 0.75, stagger: 0.13, ease: 'bounce.out' }, 0.85)
        .from('.ms-chick', { y: -36, autoAlpha: 0, duration: 0.6, stagger: 0.08, ease: 'bounce.out' }, 1.05)
        .from('.ms-goat', { x: 40 * fromEnd, autoAlpha: 0, duration: 0.9, ease: 'power2.out' }, 1.2);

      // Opening, while it scrolls away: the mill drifts slower than the page, the flock a little faster
      const heroScroll = { trigger: '.ms-hero', start: 'top top', end: 'bottom top', scrub: true };
      gsap.to('.ms-hero-bg', { yPercent: 16, ease: 'none', scrollTrigger: heroScroll });
      gsap.to('.ms-hero-copy', { y: -60, autoAlpha: 0.3, ease: 'none', scrollTrigger: heroScroll });
      gsap.to('.ms-chicks', { y: -50, ease: 'none', scrollTrigger: heroScroll });

      // Growth: each step's card slides in, its bird pops up and the details follow; its dot lights up
      gsap.utils.toArray<HTMLElement>('.ms-step').forEach((step) => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: step,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
              onEnter: () => step.setAttribute('data-in', ''),
              onLeaveBack: () => step.removeAttribute('data-in'),
            },
          })
          .from(step.querySelector('.ms-step-card'), { x: 50 * fromEnd, autoAlpha: 0, duration: 0.6, ease: 'power3.out' })
          .from(step.querySelector('.ms-step-bird'), { scale: 0.5, yPercent: 20, autoAlpha: 0, duration: 0.7, ease: 'back.out(1.8)' }, 0.15)
          .from(step.querySelectorAll('.ms-step-info > *'), { y: 12, autoAlpha: 0, duration: 0.4, stagger: 0.06 }, 0.25);
      });

      // The mill: the photo drifts as it passes, and the feed bag drops in and bounces onto the ground
      gsap.fromTo(
        '.ms-mill-bg',
        { yPercent: -10 },
        { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.ms-mill', start: 'top bottom', end: 'bottom top', scrub: true } }
      );
      gsap
        .timeline({ scrollTrigger: { trigger: '.ms-mill', start: 'top 40%', toggleActions: 'play none none reverse' } })
        .from('.ms-mill-bag-side', { y: -300, autoAlpha: 0, duration: 1, stagger: 0.14, ease: 'bounce.out' })
        .from('.ms-mill-bag-main', { y: -360, rotate: 12, autoAlpha: 0, duration: 1.1, ease: 'bounce.out' }, 0.35)
        .from('.ms-mill-shadow', { scaleX: 0.2, autoAlpha: 0, duration: 1.1, ease: 'bounce.out' }, 0);

      // Feeds: the cards slide in one after another the first time they are reached
      gsap.from('.ms-card', {
        x: 80 * fromEnd,
        autoAlpha: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'all',
        scrollTrigger: { trigger: '.ms-cards', start: 'top 85%', once: true },
      });
    });
    return () => mm.revert();
  }, [lang, isRtl]);

  // The timeline's line fills as the visitor scrolls through it
  useEffect(() => {
    const list = timelineRef.current;
    if (!list) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = list.getBoundingClientRect();
      const progress = (window.innerHeight * 0.6 - rect.top) / rect.height;
      list.style.setProperty('--ms-progress', String(Math.min(1, Math.max(0, progress))));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // Which card the swipe rests on (scrollLeft runs negative in right-to-left layouts)
  const onCardsScroll = () => {
    const track = cardsRef.current;
    const card = track?.firstElementChild as HTMLElement | null;
    if (!track || !card) return;
    const step = card.offsetWidth + parseFloat(getComputedStyle(track).columnGap || '0');
    setActive(Math.min(BAGS.length - 1, Math.round(Math.abs(track.scrollLeft) / step)));
  };

  const goToCard = (index: number) => {
    const card = cardsRef.current?.children[index] as HTMLElement | undefined;
    card?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  };

  return (
    <div ref={rootRef} className="ms" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* 1. Opening: the mill at golden hour and the day-old flock */}
      <section className="ms-hero" aria-label={t(s.ariaLabel)}>
        <img className="ms-hero-bg" src={`${ASSETS}/farm-bg.webp`} alt="" />
        <div className="ms-hero-shade" aria-hidden="true" />
        <div className="ms-hero-copy">
          <h1 className="ms-title">
            <span className="ms-title-line">
              {t(s.introTitleLine1)}
              <Perch id="poultry" />
            </span>
            <span className="ms-title-line ms-title-accent">
              {t(s.introTitleLine2)}
              <Perch id="livestock" />
            </span>
          </h1>
          <p className="ms-lead">
            {t(s.sectorsLead)}
            <Perch id="duck" />
          </p>
          <div className="ms-actions">
            <Link to="/products" className="ms-btn ms-btn-light">
              {t(ui.home.ctaPrimary)}
              {isRtl ? <ArrowLeft aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
              <Perch id="rabbit" />
            </Link>
          </div>
        </div>
        <div className="ms-chicks" aria-hidden="true">
          {Array.from({ length: HERO_CHICKS }, (_, i) => (
            <img key={i} className="ms-chick" src={`/growth/${BIRD_STAGES[0].file}`} alt="" />
          ))}
          {/* a goat grazing behind the flock */}
          <img className="ms-goat" src="/animals/goat.webp" alt="" />
        </div>
      </section>

      {/* 2. Growth: one step per feeding stage, the bird at the end of each */}
      <section className="ms-growth">
        <header className="ms-head" data-reveal>
          <h2>{t(s.growthTitle)}</h2>
          <p>{t(s.growthLead)}</p>
        </header>
        <ol ref={timelineRef} className="ms-timeline">
          {GROWTH_STEPS.map((step, i) => {
            const product = getProduct(step.slug);
            return (
              <li key={step.slug} className="ms-step">
                <span className="ms-step-dot" aria-hidden="true" />
                <div className="ms-step-card">
                  <div className="ms-step-media">
                    <span className="ms-step-index" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="ms-step-bird-wrap">
                      <BirdImage file={step.photo.file} className="ms-step-bird" />
                    </span>
                  </div>
                  <div className="ms-step-info">
                    {/* the range is isolated left to right, so it reads 1–10 inside Arabic text */}
                    <p className="ms-step-day">
                      {t(s.dayLabel)} <bdi dir="ltr">{step.from}–{step.to}</bdi>
                    </p>
                    <p className="ms-step-eyebrow">{t(s.stageFeed)}</p>
                    <h3 className="ms-step-name">{product ? t(product.stage) : ''}</h3>
                    <Link to={`/products/${step.slug}`} className="ms-step-link">
                      {t(s.feedDetails)}
                      {isRtl ? <ArrowLeft aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* 3. From our mill to your farm: the real mill, the bag rising into frame */}
      <section className="ms-mill">
        <img className="ms-mill-bg" src={`${ASSETS}/farm-bg.webp`} alt="" />
        <div className="ms-mill-shade" aria-hidden="true" />
        <div className="ms-mill-copy" data-reveal>
          <h2>{t(s.farmTitle)}</h2>
          <p>{t(s.farmLead)}</p>
        </div>
        <div className="ms-mill-drop">
          {MILL_BAGS.map(({ bag, className }) => (
            <img key={bag.key} className={`ms-mill-bag ${className}`} src={bag.src} alt="" />
          ))}
          <span className="ms-mill-shadow" aria-hidden="true" />
        </div>
      </section>

      {/* 4. The feeds, one swipeable card each */}
      <section className="ms-products">
        <header className="ms-head ms-head-dark" data-reveal>
          <h2>{t(s.cardEyebrow)}</h2>
          <p>{t(s.swipeHint)}</p>
        </header>
        <div ref={cardsRef} className="ms-cards" onScroll={onCardsScroll}>
          {BAGS.map((bag, i) => {
            const category = categories.find((c) => c.id === bag.category);
            const categoryName = category ? (lang === 'ar' ? category.ar : category.en) : '';
            return (
              <article key={bag.key} className="ms-card" data-active={i === active ? '' : undefined}>
                <div className="ms-card-media">
                  <img className="ms-card-bag" src={bag.src} alt={t(ui.home.heroBags[bag.key])} loading="lazy" />
                  <img className="ms-card-animal" src={COMPANION[bag.category]} alt="" loading="lazy" />
                </div>
                <h3 className="ms-card-title">{t(ui.home.heroBags[bag.key])}</h3>
                <div className="ms-chips">
                  <span>{categoryName}</span>
                  <span>
                    {t(s.weight)}: {bag.kg} {kg}
                  </span>
                </div>
                <p className="ms-card-desc">{t(ui.home[CATEGORY_DESC[bag.category]])}</p>
                <div className="ms-card-actions">
                  <Link to={`/products?category=${bag.category}`} className="ms-btn ms-btn-primary">
                    {t(s.detailsCta)}
                  </Link>
                  <Link to="/contact" className="ms-btn ms-btn-ghost">
                    {t(s.orderCta)}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
        <div className="ms-dots" role="group" aria-label={t(s.switcherLabel)}>
          {BAGS.map((bag, i) => (
            <button
              key={bag.key}
              type="button"
              className="ms-dot"
              aria-pressed={i === active}
              aria-label={t(ui.home.heroBags[bag.key])}
              onClick={() => goToCard(i)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
