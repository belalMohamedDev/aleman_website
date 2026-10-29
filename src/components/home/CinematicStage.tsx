import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Volume2, VolumeX } from 'lucide-react';
import { categories, getProduct } from '../../data/products';
import { useLang } from '../../i18n/LanguageContext';
import { ui } from '../../i18n/ui';
import { setNavOverDark } from '../layout/navTheme';
import { scrollHomeTo } from './useHomeScrollAnimations';
import { StageMotes } from './StageMotes';
import { StageAudio } from './stageAudio';
import { ASSETS, BAGS, BIRD_STAGES, BirdImage, CATEGORY_DESC, COMPANION, FEED_STAGES, LAST_DAY } from './stageData';
import './cinematic-stage.css';

gsap.registerPlugin(ScrollTrigger);

// The golden-hour farm in three depth layers, all cut to the same 1800x873 canvas so they share one
// crop on every screen: the real mill and river, the cows at the trough, and the sacks and leaves in front.
// Phones show only a narrow strip of the canvas, so they get their own cows layer: the same cows, smaller and
// further back, leaving open ground in front for the hen and the other animals
const FARM_LAYERS: { src: string; phoneSrc?: string; className: string }[] = [
  { src: `${ASSETS}/farm-bg.webp`, className: 'cs-farm-bg' },
  { src: `${ASSETS}/farm-mid.webp`, phoneSrc: `${ASSETS}/farm-mid-mobile.webp`, className: 'cs-farm-mid' },
  { src: `${ASSETS}/farm-front.webp`, className: 'cs-farm-front' },
];

// The other animals the mill feeds stand on the open ground right of the trough (the cows are part of
// the farm artwork). Each can get a real-motion clip: a WebM with a transparent background (VP9 alpha)
// at public/animals/clips/<name>.webm, made with scripts/animal-clips (see docs/animal-clips.md).
// Flip `clip` to true once the file is there. Without a clip (or on Safari, which can't show a
// transparent WebM, or with reduced motion) the still image plays with the idle motion below.
type AnimalName = 'sheep' | 'goat' | 'duck' | 'rabbit';
const ANIMALS: { name: AnimalName; src: string; clip: boolean }[] = [
  { name: 'sheep', src: '/animals/sheep.webp', clip: false },
  { name: 'goat', src: '/animals/goat.webp', clip: false },
  { name: 'rabbit', src: '/animals/rabbits.webp', clip: false },
  { name: 'duck', src: `${ASSETS}/duck.webp`, clip: false },
];

const canPlayAlphaClips = () =>
  typeof window !== 'undefined' &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
  // Safari plays WebM but drops the alpha channel (the animal would sit on a black box)
  !/^((?!chrome|android).)*safari/i.test(navigator.userAgent);

function AnimalMedia({ name, src, clip }: { name: AnimalName; src: string; clip: boolean }) {
  const [useClip] = useState(() => clip && canPlayAlphaClips());
  if (!useClip) return <img className="cs-animal-media" src={src} alt="" />;
  return (
    <video
      className="cs-animal-media cs-animal-clip"
      src={`/animals/clips/${name}.webm`}
      poster={src}
      muted
      loop
      playsInline
      autoPlay
      preload="metadata"
    />
  );
}

// The rest of the flock: day-old chicks on the ground around the hero chick (placed in CSS). They belong to the
// intro only; when the farm lights up they scatter, and the growth story follows the hero bird alone
const FLOCK_SIZE = 10;

const SOUND_KEY = 'aleman-stage-sound';

const GRAINS = Array.from({ length: 16 }, (_, i) => i);
const CHAPTERS = ['intro', 'growth', 'product'] as const;

export function CinematicStage() {
  const { t, lang, isRtl } = useLang();
  const s = ui.home.stage;
  const rootRef = useRef<HTMLElement>(null);
  // Scroll-driven values the 3D bag reads every frame; tweened by the stage timeline
  // The feed bag is a plain image; GSAP flips and leans it in 3D with CSS transforms
  const bagImgRef = useRef<HTMLImageElement>(null);
  // Ambient dust intensity, tweened per chapter
  const fx = useRef({ motes: 0.25 }).current;
  const audio = useRef(new StageAudio()).current;
  // Browsers only allow audio after a gesture, so "on" starts at the first click or key press
  const [sound, setSound] = useState<'pending' | 'on' | 'off'>(() => {
    try {
      return window.localStorage.getItem(SOUND_KEY) === 'off' ? 'off' : 'pending';
    } catch {
      return 'pending';
    }
  });
  const companionImgRef = useRef<HTMLImageElement>(null);
  const [active, setActive] = useState(0);
  const bag = BAGS[active];
  const category = categories.find((c) => c.id === bag.category);

  const remember = (value: 'on' | 'off') => {
    try {
      if (value === 'off') window.localStorage.setItem(SOUND_KEY, 'off');
      else window.localStorage.removeItem(SOUND_KEY);
    } catch {
      /* storage unavailable: the choice just lasts for this visit */
    }
  };

  const toggleSound = async () => {
    if (audio.enabled) {
      audio.disable();
      setSound('off');
      remember('off');
    } else {
      await audio.enable();
      setSound(audio.enabled ? 'on' : 'pending');
      if (audio.enabled) remember('on');
    }
  };

  // First click / key press anywhere starts the sound, unless the visitor muted it before
  useEffect(() => {
    if (sound !== 'pending') return;
    const start = (e: Event) => {
      if ((e.target as Element | null)?.closest?.('.cs-sound')) return;
      cleanup();
      void audio.enable().then(() => setSound(audio.enabled ? 'on' : 'pending'));
    };
    const events = ['pointerdown', 'keydown'] as const;
    const cleanup = () => events.forEach((name) => window.removeEventListener(name, start));
    events.forEach((name) => window.addEventListener(name, start));
    return cleanup;
  }, [sound, audio]);

  // Jump to where the chick steps onto the farm (start of the growth chapter)
  const startJourney = () => {
    const root = rootRef.current;
    if (!root) return;
    scrollHomeTo(root.getBoundingClientRect().top + window.scrollY + window.innerHeight * 1.1);
  };

  // Flip the bag image edge-on, swap the artwork, then flip it back to face the front
  const selectBag = (index: number) => {
    if (index === active) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setActive(index);
      return;
    }
    audio.whoosh();
    gsap
      .timeline()
      .to(bagImgRef.current, { rotationY: 90, duration: 0.24, ease: 'power2.in' })
      .to(companionImgRef.current, { scale: 0.4, autoAlpha: 0, duration: 0.2, ease: 'power2.in' }, 0)
      .add(() => setActive(index))
      .fromTo(bagImgRef.current, { rotationY: -90 }, { rotationY: 0, duration: 0.6, ease: 'power3.out' })
      .fromTo(
        companionImgRef.current,
        { scale: 0.4, autoAlpha: 0, y: 30 },
        { scale: 1, autoAlpha: 1, y: 0, duration: 0.5, ease: 'back.out(2)' },
        '<0.1'
      );
  };

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const mm = gsap.matchMedia(root);

    mm.add(
      {
        motion: '(prefers-reduced-motion: no-preference)',
        desktop: '(min-width: 768px)',
      },
      (ctx) => {
        const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean };
        if (!motion) return;

        const vw = () => window.innerWidth;
        const vh = () => window.innerHeight;
        // Physical offset that puts the bag opposite the card (card sits on the reading side)
        const bagSideX = () => (desktop ? vw() * 0.22 * (isRtl ? -1 : 1) : 0);
        const counterNum = root.querySelector<HTMLElement>('[data-counter-num]');
        const counterName = root.querySelector<HTMLElement>('[data-counter-name]');
        const counterFill = root.querySelector<HTMLElement>('[data-counter-fill]');
        const dayNum = root.querySelector<HTMLElement>('[data-day]');
        const dayFill = root.querySelector<HTMLElement>('[data-day-fill]');
        const chapterNames = CHAPTERS.map((c) => t(s.chapters[c]));
        let chapter = 0;
        // Progress at which the stage starts dissolving into the cream section (set once the timeline is built)

        // Where the feed bag lands on day 35: standing on the ground right beside the grown hen, about its
        // height, on the side it moves to for the product card (so the hand-over is a short slide).
        // Worked out from the untransformed layout, so it holds whatever the bird or bag is doing when it runs.
        // On phones the hen stands right of centre, so the bag always lands on its left there
        const DROP_SCALE = desktop ? 0.75 : 0.62;
        const dropSpot = () => {
          const bird = root.querySelector<HTMLElement>('.cs-bird');
          const bagEl = root.querySelector<HTMLElement>('.cs-bag');
          if (!bird || !bagEl) return { x: bagSideX(), y: vh() * 0.12, scale: DROP_SCALE };
          const side = desktop ? Math.sign(bagSideX()) || 1 : -1;
          const gap = bird.offsetWidth / 2 + (bagEl.offsetWidth * DROP_SCALE) / 2 + 8;
          // The bag is centred on its top edge (yPercent -50) and scales around 60% of its height; solve for the y
          // that puts its scaled base on the hen's feet line, sunk a little so the idle float never lifts it off
          const h = bagEl.offsetHeight;
          const feet = bird.offsetTop + bird.offsetHeight;
          const y = feet - bagEl.offsetTop - 0.1 * h - 0.4 * DROP_SCALE * h + 10;
          // offsetLeft is the hen's centre (it is shifted back by half its width); the bag is offset from the middle
          return { x: bird.offsetLeft - vw() / 2 + side * gap, y, scale: DROP_SCALE };
        };

        // Phones, product scene: the card covers the lower part, so the bag (and its animal) is centred in
        // the room between the navbar and the card's top and shrunk to fit it. Measured live, so a
        // two-line product name or a short screen never hides the bag behind the card.
        const phoneBagSpot = () => {
          const bagEl = root.querySelector<HTMLElement>('.cs-bag');
          const card = root.querySelector<HTMLElement>('.cs-card');
          if (!bagEl || !card) return { y: -vh() * 0.14, scale: 0.8 };
          const navBottom = 84;
          const cardTop = vh() - 12 - card.offsetHeight;
          const room = Math.max(120, cardTop - navBottom - 24);
          const scale = Math.min(1.05, room / bagEl.offsetHeight);
          const centre = navBottom + (cardTop - navBottom) / 2;
          return { y: centre - vh() * 0.56, scale };
        };

        // In the intro the chick sits centred in the gap between the buttons and the
        // facts row, measured from the live layout so text size never makes them collide
        const BIRD_INTRO_SCALE = desktop ? 0.48 : 0.45;
        const introLift = () => {
          const viewport = root.querySelector<HTMLElement>('.cs-viewport');
          const lift = root.querySelector<HTMLElement>('.cs-bird-lift');
          const bird = root.querySelector<HTMLElement>('.cs-bird');
          const actions = root.querySelector<HTMLElement>('.cs-intro-actions');
          if (!viewport || !lift || !bird || !actions) return 0;
          const top = viewport.getBoundingClientRect().top;
          const restBottom = bird.getBoundingClientRect().bottom - top - Number(gsap.getProperty(lift, 'y'));
          const birdH = bird.offsetHeight * BIRD_INTRO_SCALE;
          const gapTop = actions.getBoundingClientRect().bottom - top + 32;
          const gapBottom = viewport.offsetHeight * 0.9;
          if (!desktop) {
            // Phones: the chick stands at the front of the farm, below the copy (it rises back to its
            // resting spot for the growth chapter)
            return lift.offsetHeight * 0.965 - restBottom;
          }
          const bottom = Math.max(gapTop + birdH, (gapTop + gapBottom + birdH) / 2);
          return Math.min(0, bottom - restBottom);
        };

        // Growth runs over a fixed stretch of the timeline; days map linearly onto it
        const GROW_AT = 1.8;
        const GROW_FOR = 4;
        const timeForDay = (day: number) => GROW_AT + (GROW_FOR * (day - 1)) / (LAST_DAY - 1);

        const tl = gsap.timeline({
          defaults: { ease: 'power2.inOut' },
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: () => `+=${vh() * 6.5}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onToggle: (self) => {
              if (!self.isActive) setNavOverDark(false);
            },
            onUpdate: (self) => {
              // the whole stage is dark now (it dissolves into the dark inspection scene).
              // isActive, not true: scrub keeps calling onUpdate while it catches up after
              // the stage has already been left, which would switch the navbar back to dark
              setNavOverDark(self.isActive);
              const idx = Math.min(CHAPTERS.length - 1, Math.floor(self.progress * CHAPTERS.length * 0.999));
              if (counterFill) counterFill.style.transform = `scaleX(${self.progress})`;
              if (idx === chapter) return;
              chapter = idx;
              if (counterNum) counterNum.textContent = `0${idx + 1}`;
              if (counterName) counterName.textContent = chapterNames[idx];
              audio.setChapter(idx);
            },
          },
        });

        // Initial states (GSAP owns these transforms, so centring lives here too)
        gsap.set('.cs-bag', { yPercent: -50, x: bagSideX, y: () => -vh(), autoAlpha: 0 });
        gsap.set('.cs-card', { yPercent: desktop ? -50 : 0 });
        gsap.set('.cs-growth-panel', { yPercent: desktop ? -50 : 0, autoAlpha: 0 });
        // In the intro the chick stands centred under the title; it walks to its own spot on the farm in scene 2
        const birdIntroX = () => vw() / 2 - (root.querySelector<HTMLElement>('.cs-bird')?.offsetLeft ?? vw() / 2);
        gsap.set('.cs-bird', { xPercent: -50, x: birdIntroX, scale: BIRD_INTRO_SCALE });
        gsap.set('.cs-bird-stage:not(:first-child)', { autoAlpha: 0 });
        gsap.set('.cs-feed:not(:first-child)', { autoAlpha: 0 });
        gsap.set('.cs-shade', { autoAlpha: 0 });
        gsap.set(['.cs-farm-copy', '.cs-growth-head', '.cs-card'], { autoAlpha: 0 });
        gsap.set('.cs-grain', { autoAlpha: 0, xPercent: -50, yPercent: -50 });
        gsap.set('.cs-companion', { autoAlpha: 0, scale: 0.5 });
        gsap.set('.cs-sweep', { skewX: -14, xPercent: -160, autoAlpha: 0 });
        gsap.set(['.cs-flash', '.cs-exit', '.cs-callout'], { autoAlpha: 0 });
        gsap.set('.cs-rays', { autoAlpha: 0 });
        // The cows stay off stage behind the intro title and walk up to the trough when the farm lights up
        gsap.set('.cs-farm-mid', { autoAlpha: 0, y: 40 });
        gsap.set('.cs-animal', { autoAlpha: 0, y: 34, scale: 0.93 });
        // Time-of-day grade of the farm photo. GSAP tweens a plain object; its value is written to
        // CSS variables by hand (tweening an unset CSS variable directly starts from 0, a black farm)
        const farmEl = root.querySelector<HTMLElement>('.cs-viewport');
        const grade = { sepia: 0.12, bright: 0.86 };
        const applyGrade = () => {
          farmEl?.style.setProperty('--cs-sepia', grade.sepia.toFixed(3));
          farmEl?.style.setProperty('--cs-bright', grade.bright.toFixed(3));
        };
        applyGrade();

        // ---- Scene 1: a day-old chick under the title; the title zooms past
        tl.addLabel('intro')
          .to('.cs-intro-title', { scale: 2.6, autoAlpha: 0, duration: 1.4, ease: 'power2.in' }, 0)
          .to(['.cs-intro-lead', '.cs-intro-actions'], { autoAlpha: 0, y: -40, duration: 0.6 }, 0)

          // ---- Scene 2: lights on the farm, the chick grows day by day
          .addLabel('growth', 1.3)
          // the dark veil over the farm lifts as the story moves out into the open
          .to('.cs-intro-veil', { autoAlpha: 0, duration: 1.4, ease: 'power1.out' }, 'growth')
          .to('.cs-farm-mid', { autoAlpha: 1, y: 0, duration: 1.2, ease: 'power2.out' }, 'growth+=0.1')
          .to('.cs-animal', { autoAlpha: 1, y: 0, scale: 1, duration: 0.9, stagger: 0.14, ease: 'back.out(1.4)' }, 'growth+=0.4')
          // light and life: dust and sun rays come up, and the golden-hour farm opens up to full light
          .to(fx, { motes: 0.55, duration: 1.2 }, 'growth')
          .to('.cs-rays', { autoAlpha: 0.55, duration: 1.4 }, 'growth+=0.2')
          .fromTo(
            grade,
            { sepia: 0.12, bright: 0.86 },
            { sepia: 0, bright: 1, duration: GROW_AT + GROW_FOR - 1.3, ease: 'none', onUpdate: applyGrade, immediateRender: false },
            'growth'
          )
          // The chick steps down from its spotlight onto the farm ground
          .fromTo('.cs-bird-lift', { y: introLift }, { y: 0, duration: 1.2 }, 'growth')
          .fromTo('.cs-bird', { x: birdIntroX }, { x: 0, duration: 1.2, immediateRender: false }, 'growth')
          .fromTo('.cs-growth-head', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 'growth+=0.1')
          .fromTo(
            '.cs-growth-panel',
            { autoAlpha: 0, x: () => (desktop ? vw() * 0.08 * (isRtl ? 1 : -1) : 0) },
            { autoAlpha: 1, x: 0, duration: 0.4, ease: 'power3.out' },
            'growth+=0.1'
          )
          .to('.cs-bird', { scale: desktop ? 0.92 : 0.8, duration: GROW_FOR, ease: 'none' }, GROW_AT)
          .fromTo(
            { day: 1 },
            { day: 1 },
            {
              day: LAST_DAY,
              duration: GROW_FOR,
              ease: 'none',
              onUpdate(this: gsap.core.Tween) {
                const day = Math.round((this.targets()[0] as { day: number }).day);
                if (dayNum) dayNum.textContent = String(day);
                if (dayFill) dayFill.style.transform = `scaleX(${(day - 1) / (LAST_DAY - 1)})`;
              },
            },
            GROW_AT
          );

        // The flock scatters as the farm lights up, leaving the ground to the hero bird and the other animals
        tl.to('.cs-flock-bird', { autoAlpha: 0, scale: 0.85, duration: 0.6, stagger: { each: 0.04, from: 'random' }, ease: 'power1.in' }, 'growth');

        // Swap bird photos midway between their ages: the older photo fades in on top and only then is the younger
        // one hidden (fading both at once leaves each half transparent, a see-through bird mid-scroll)
        BIRD_STAGES.slice(1).forEach((stage, i) => {
          const at = timeForDay((BIRD_STAGES[i].day + stage.day) / 2);
          tl.to(`.cs-bird-stage:nth-child(${i + 2})`, { autoAlpha: 1, duration: 0.3 }, at)
            .to(`.cs-bird-stage:nth-child(${i + 1})`, { autoAlpha: 0, duration: 0.05 }, at + 0.3);
        });
        // Swap the feed card where one feeding stage hands over to the next
        FEED_STAGES.slice(1).forEach((stage, i) => {
          const at = timeForDay(stage.from - 0.5);
          tl.to(`.cs-feed:nth-child(${i + 1})`, { autoAlpha: 0, y: -16, duration: 0.25 }, at)
            .fromTo(`.cs-feed:nth-child(${i + 2})`, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.25 }, at + 0.1);
        });

        // ---- Day 35: the feed behind it all drops in beside the grown bird
        tl.addLabel('drop', GROW_AT + GROW_FOR + 0.3)
          .to(['.cs-growth-head', '.cs-growth-panel'], { autoAlpha: 0, y: -30, duration: 0.5 }, 'drop')
          .to('.cs-animal', { autoAlpha: desktop ? 1 : 0, y: desktop ? 0 : 20, duration: 0.4, stagger: 0.05 }, 'drop')
          // Visibility is its own zero-length step: as part of the fromTo below it would not come back after the
          // visitor scrolls up past the drop and down again, leaving an invisible bag
          .set('.cs-bag', { autoAlpha: 1 }, 'drop+=0.2')
          .fromTo(
            '.cs-bag',
            { x: () => dropSpot().x, y: () => -vh(), scale: 0.5, rotate: 8 },
            { x: () => dropSpot().x, y: () => dropSpot().y, scale: () => dropSpot().scale, rotate: -2, duration: 1.1, ease: 'bounce.out', immediateRender: false },
            'drop+=0.2'
          )
          .set('.cs-sweep', { autoAlpha: 1 }, 'drop')
          .fromTo('.cs-sweep', { xPercent: -160 }, { xPercent: 330, duration: 1.1, ease: 'power2.inOut', immediateRender: false }, 'drop')
          .call(() => audio.thud(), [], 'drop+=0.95')
          .to('.cs-bird-stage:last-child img', { y: -50, rotate: -10, duration: 0.22, yoyo: true, repeat: 1, ease: 'power2.out' }, 'drop+=0.95')
          .to('.cs-grain', { autoAlpha: 1, duration: 0.05 }, 'drop+=0.95')
          .to('.cs-grain', {
            x: (i) => Math.cos((i / GRAINS.length) * Math.PI * 2) * (90 + (i % 4) * 45),
            y: (i) => Math.sin((i / GRAINS.length) * Math.PI) * -120 - (i % 3) * 30,
            rotate: (i) => i * 47,
            autoAlpha: 0,
            duration: 0.9,
            ease: 'power2.out',
          }, 'drop+=0.97')
          .fromTo('.cs-farm-copy', { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 'drop+=1.1')

          // ---- Scene 3: the scene dims, the bird steps back for the product card
          .addLabel('product', '+=0.8')
          .to('.cs-farm-copy', { autoAlpha: 0, y: -30, duration: 0.5 }, 'product')
          .to('.cs-shade', { autoAlpha: 0.82, duration: 0.8 }, 'product')
          .to('.cs-bird', { autoAlpha: 0, scale: desktop ? 0.85 : 0.7, duration: 0.6 }, 'product')
          .to('.cs-animal', { x: () => vw() * 0.3, autoAlpha: 0, duration: 0.8, stagger: 0.05, ease: 'power2.in' }, 'product')
          .to('.cs-companion', { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'back.out(1.8)' }, 'product+=0.6')
          .to('.cs-farm', { filter: 'blur(6px)', duration: 0.9 }, 'product')
          .to(grade, { sepia: 0.3, bright: 0.62, duration: 0.9, onUpdate: applyGrade }, 'product')
          .to(fx, { motes: 0.85, duration: 0.8 }, 'product')
          .to('.cs-rays', { autoAlpha: 0.75, duration: 0.9 }, 'product')
          .fromTo('.cs-sweep', { xPercent: -160 }, { xPercent: 330, duration: 1.1, ease: 'power2.inOut', immediateRender: false }, 'product-=0.15')
          .fromTo('.cs-flash', { autoAlpha: 0 }, { autoAlpha: 0.45, duration: 0.3, yoyo: true, repeat: 1, ease: 'power1.out', immediateRender: false }, 'product')
          .fromTo('.cs-callout', { autoAlpha: 0, x: isRtl ? 16 : -16 }, { autoAlpha: 1, x: 0, stagger: 0.14, duration: 0.5, ease: 'power2.out', immediateRender: false }, 'product+=0.9')
          .to('.cs-bag', {
            x: bagSideX,
            y: () => (desktop ? 0 : phoneBagSpot().y),
            scale: () => (desktop ? 1.15 : phoneBagSpot().scale),
            rotate: 0,
            duration: 0.9,
          }, 'product')
          .fromTo(
            '.cs-card',
            { autoAlpha: 0, x: () => (desktop ? vw() * 0.12 * (isRtl ? 1 : -1) : 0), y: desktop ? 0 : 60 },
            { autoAlpha: 1, x: 0, y: 0, duration: 0.8, ease: 'power3.out' },
            'product+=0.3'
          )
          .from('.cs-card-anim', { autoAlpha: 0, y: 24, stagger: 0.08, duration: 0.5 }, 'product+=0.5')

          // ---- Exit: hold on the product, then dissolve into the dark inspection scene below
          .to({}, { duration: 1.4 })
          .addLabel('exit')
          .to(['.cs-card', '.cs-callout'], { autoAlpha: 0, y: -30, duration: 0.5 }, 'exit')
          .to('.cs-companion', { autoAlpha: 0, scale: 0.5, duration: 0.4 }, 'exit')
          .to('.cs-shade', { autoAlpha: 0.94, duration: 0.6 }, 'exit')
          .to('.cs-bag', { y: () => vh() * 0.7, scale: 0.4, autoAlpha: 0, duration: 0.8, ease: 'power2.in' }, 'exit')
          .to(fx, { motes: 0, duration: 0.6 }, 'exit')
          .to('.cs-rays', { autoAlpha: 0, duration: 0.6 }, 'exit')
          .to('.cs-exit', { autoAlpha: 1, duration: 0.9, ease: 'power2.in' }, 'exit+=0.15');


        // ---- Camera: one slow push-in through the whole story, each layer at its own speed
        const total = tl.duration() - GROW_AT + 0.5;
        tl.to('.cs-farm-bg', { scale: 1.14, ease: 'none', duration: total }, 1.3)
          .to('.cs-farm-mid', { scale: 1.26, ease: 'none', duration: total }, 1.3)
          .to('.cs-farm-front', { scale: 1.3, ease: 'none', duration: total }, 1.3)
          .to('.cs-animals', { scale: 1.1, ease: 'none', duration: total }, 1.3);

        // ---- Pointer look: layers and the bag shift with the cursor, deeper layers more
        let removePointer: (() => void) | null = null;
        if (desktop && window.matchMedia('(pointer: fine)').matches) {
          const layer = (sel: string, amount: number) => {
            const to = gsap.quickTo(sel, 'x', { duration: 1.4, ease: 'power3.out' });
            return (n: number) => to(n * amount);
          };
          const moves = [
            layer('.cs-farm-bg', 10),
            layer('.cs-farm-mid', 24),
            layer('.cs-farm-front', 42),
            layer('.cs-animals', 30),
            layer('.cs-bird-lift', 26),
          ];
          // the bag leans toward the cursor: a light 3D tilt on the flat image
          const lookX = gsap.quickTo(bagImgRef.current, 'rotationY', { duration: 0.9, ease: 'power3.out' });
          const lookY = gsap.quickTo(bagImgRef.current, 'rotationX', { duration: 0.9, ease: 'power3.out' });
          const onMove = (e: PointerEvent) => {
            const nx = (e.clientX / window.innerWidth - 0.5) * 2;
            const ny = (e.clientY / window.innerHeight - 0.5) * 2;
            moves.forEach((m) => m(nx));
            lookX(nx * 14);
            lookY(-ny * 8);
          };
          root.addEventListener('pointermove', onMove);
          removePointer = () => root.removeEventListener('pointermove', onMove);
        }

        // ---- Entrance on page load (independent of scroll)
        const chick = root.querySelector('.cs-bird .cs-bird-stage:first-child img');
        const introAnim = gsap
          .timeline({ delay: 0.15 })
          // the farm settles in from a slight zoom while the veil keeps the title readable
          .from('.cs-farm', { scale: 1.12, duration: 2.2, ease: 'power2.out' }, 0)
          .from('.cs-farm-front', { yPercent: 14, duration: 1.8, ease: 'power3.out' }, 0.1)
          .from('.cs-word', { yPercent: 110, autoAlpha: 0, duration: 0.9, stagger: 0.08, ease: 'expo.out' }, 0.5)
          .from('.cs-in', { autoAlpha: 0, y: 14, duration: 0.6, ease: 'power2.out' }, 1.0)
          .from('.cs-intro-actions > *', { autoAlpha: 0, y: 16, duration: 0.5, stagger: 0.08, ease: 'power2.out' }, 1.15);

        // the chick hops down into the light, then the rest of the farm settles in around it
        if (chick) {
          introAnim.from(chick, { y: -90, autoAlpha: 0, duration: 0.8, ease: 'bounce.out' }, 0.9);
        }

        introAnim
          .from('.cs-flock-bird', { y: -60, autoAlpha: 0, duration: 0.7, stagger: 0.07, ease: 'bounce.out' }, 1.05)
          .from('.cs-counter', { autoAlpha: 0, duration: 0.6 }, 1.5);

        // Idle life: each animal does its own small thing every few seconds (random, so they never sync)
        const calls: gsap.core.Tween[] = [];
        let alive = true;
        const every = (min: number, max: number, run: () => gsap.core.Timeline | gsap.core.Tween) => {
          const go = () => {
            if (!alive) return;
            run().eventCallback('onComplete', () => {
              if (alive) calls.push(gsap.delayedCall(gsap.utils.random(min, max), go));
            });
          };
          calls.push(gsap.delayedCall(gsap.utils.random(min, max), go));
        };
        // A real clip already moves: the made-up idle motion is only for still images
        const from = (sel: string, origin: string) => {
          const el = root.querySelector<HTMLElement>(sel);
          if (!el || el.tagName === 'VIDEO') return null;
          gsap.set(el, { transformOrigin: origin });
          return el;
        };

        // Duck: a short waddle, then it stands still for a bit
        const duckImg = from('.cs-animal-duck .cs-animal-media', '50% 100%');
        if (duckImg) {
          every(2.5, 5, () => {
            const tw = gsap.timeline();
            for (let i = 0; i < 6; i++) {
              tw.to(duckImg, { rotate: i % 2 ? 4.5 : -4.5, y: -5, duration: 0.14, ease: 'sine.out' })
                .to(duckImg, { y: 0, duration: 0.14, ease: 'sine.in' });
            }
            return tw.to(duckImg, { rotate: 0, duration: 0.25 }).to(duckImg, { x: gsap.utils.random(-20, 20), duration: 0.9, ease: 'sine.inOut' }, 0);
          });
        }
        // Rabbits: a quick hop (sometimes two), squashing on landing
        const rabbitImg = from('.cs-animal-rabbit .cs-animal-media', '50% 100%');
        if (rabbitImg) {
          every(2.2, 4.8, () => {
            const hops = Math.random() < 0.4 ? 2 : 1;
            const tw = gsap.timeline();
            for (let i = 0; i < hops; i++) {
              tw.to(rabbitImg, { y: -34, scaleY: 1.05, scaleX: 0.97, duration: 0.2, ease: 'power2.out' })
                .to(rabbitImg, { y: 0, scaleY: 0.93, scaleX: 1.04, duration: 0.18, ease: 'power2.in' })
                .to(rabbitImg, { scaleY: 1, scaleX: 1, duration: 0.18, ease: 'back.out(2)' });
            }
            return tw;
          });
        }
        // Goat: lowers its head to graze now and then
        const goatImg = from('.cs-animal-goat .cs-animal-media', '50% 100%');
        if (goatImg) {
          every(3.5, 6.5, () =>
            gsap
              .timeline()
              .to(goatImg, { rotate: -3, duration: 0.6, ease: 'sine.inOut' })
              .to(goatImg, { rotate: 0, duration: 0.8, ease: 'sine.inOut' }, '+=0.5')
          );
        }
        // Sheep: breathes, and nods now and then as if grazing
        const sheepImg = from('.cs-animal-sheep .cs-animal-media', '50% 100%');
        if (sheepImg) {
          gsap.to(sheepImg, { scaleY: 1.012, duration: 2.8, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 3.2 });
          every(3, 6, () =>
            gsap
              .timeline()
              .to(sheepImg, { rotate: -2.2, duration: 0.5, ease: 'sine.inOut' })
              .to(sheepImg, { rotate: 0, duration: 0.7, ease: 'sine.inOut' })
          );
        }

        // The flock pecks at the ground: one random bird at a time, so the ground always feels busy
        const flock = gsap.utils.toArray<HTMLElement>('.cs-flock-bird', root);
        if (flock.length) {
          gsap.set(flock, { transformOrigin: '50% 95%' });
          every(0.5, 1.4, () => {
            const bird = flock[Math.floor(Math.random() * flock.length)];
            return gsap
              .timeline()
              .to(bird, { rotate: 16, y: 4, duration: 0.13, ease: 'power2.in' })
              .to(bird, { rotate: 0, y: 0, duration: 0.17, ease: 'power2.out' })
              .to(bird, { rotate: 13, y: 3, duration: 0.11, ease: 'power2.in' }, '+=0.1')
              .to(bird, { rotate: 0, y: 0, duration: 0.18, ease: 'power2.out' });
          });
        }

        // The bird stays alive at every age: a quick peck every few seconds (on each age's photo, so the
        // chick, the young bird and the grown hen all do it)
        const birdImgs = gsap.utils.toArray<HTMLElement>('.cs-bird .cs-bird-stage img', root);
        if (birdImgs.length) {
          gsap
            .timeline({ repeat: -1, repeatDelay: 2.6, delay: 2.4 })
            .call(() => audio.chirp())
            .to(birdImgs, { rotate: 14, y: 6, transformOrigin: '50% 90%', duration: 0.14, ease: 'power2.in' })
            .to(birdImgs, { rotate: 0, y: 0, duration: 0.18, ease: 'power2.out' })
            .to(birdImgs, { rotate: 12, y: 5, duration: 0.12, ease: 'power2.in' }, '+=0.12')
            .to(birdImgs, { rotate: 0, y: 0, duration: 0.2, ease: 'power2.out' });
        }

        // ...and wanders: a few steps to one side, turning to face the way it walks, with a small bob per
        // step. Moves the age photos' wrappers, so the scroll-driven position of the bird is left alone.
        const birdStages = gsap.utils.toArray<HTMLElement>('.cs-bird .cs-bird-stage', root);
        if (birdStages.length) {
          const reach = desktop ? 55 : 22;
          let at = 0;
          every(2.2, 4.2, () => {
            const to = gsap.utils.random(-reach, reach);
            const dir = to < at ? -1 : 1;
            const steps = 4;
            at = to;
            return gsap
              .timeline()
              .set(birdStages, { scaleX: dir, transformOrigin: '50% 100%' })
              .to(birdStages, { x: to, duration: 0.24 * steps, ease: 'sine.inOut' }, 0)
              .to(birdStages, { y: -5, duration: 0.12, ease: 'sine.out', yoyo: true, repeat: steps * 2 - 1 }, 0);
          });
        }

        // Idle float on the bag image (separate element from the scrubbed wrapper)
        gsap.to('.cs-bag-float', { y: -14, duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1 });

        return () => {
          alive = false;
          calls.forEach((c) => c.kill());
          removePointer?.();
        };
      }
    );

    return () => {
      mm.revert();
      setNavOverDark(false);
    };
  }, [isRtl, lang]);

  useEffect(() => () => audio.dispose(), [audio]);

  // Animal clips only play while the stage is on screen
  useEffect(() => {
    const root = rootRef.current;
    const clips = root ? Array.from(root.querySelectorAll<HTMLVideoElement>('.cs-animal-clip')) : [];
    if (!root || clips.length === 0) return;
    const io = new IntersectionObserver(([entry]) => {
      clips.forEach((v) => (entry.isIntersecting ? v.play().catch(() => {}) : v.pause()));
    });
    io.observe(root);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={rootRef} className="cs-root" aria-label={t(s.ariaLabel)} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="cs-viewport">
        <div className="cs-backdrop" aria-hidden="true" />

        {/* Farm layers that light up in scene 2 */}
        <div className="cs-farm" aria-hidden="true">
          {FARM_LAYERS.map((layer) => (
            <picture key={layer.className}>
              {layer.phoneSrc && <source media="(max-width: 767px)" srcSet={layer.phoneSrc} />}
              <img src={layer.src} alt="" className={layer.className} />
            </picture>
          ))}
        </div>
        <div className="cs-shade" aria-hidden="true" />
        {/* Dark veil over the farm for the intro copy; lifts at the growth chapter */}
        <div className="cs-intro-veil" aria-hidden="true" />
        {/* Keeps the transparent navbar and headings readable over the bright sky */}
        <div className="cs-top-scrim" aria-hidden="true" />
        {/* Sun rays + golden dust: the atmosphere that follows the chapters */}
        <div className="cs-rays" aria-hidden="true" />
        <StageMotes fx={fx} />

        <div className="cs-animals" aria-hidden="true">
          {ANIMALS.map((animal) => (
            <div key={animal.name} className={`cs-animal cs-animal-${animal.name}`}>
              <AnimalMedia {...animal} />
            </div>
          ))}
          <div className="cs-flock">
            {Array.from({ length: FLOCK_SIZE }, (_, i) => (
              <div key={i} className="cs-flock-bird">
                <div className="cs-flock-flip">
                  <BirdImage file={BIRD_STAGES[0].file} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="cs-bird-lift" aria-hidden="true">
          <div className="cs-bird">
            {BIRD_STAGES.map((stage) => (
              <div key={stage.file} className="cs-bird-stage">
                <BirdImage file={stage.file} />
              </div>
            ))}
            <div className="cs-bird-shadow" />
          </div>
        </div>

        {/* Scene 1 copy */}
        <div className="cs-intro">
          <h1 className="cs-intro-title">
            {[s.introTitleLine1, s.introTitleLine2].map((line, i) => (
              <span key={i} className={`cs-title-line${i === 1 ? ' cs-title-accent' : ''}`}>
                {t(line)
                  .split(' ')
                  .map((word, j, words) => (
                    // the space sits outside the inline-block mask, where it is not collapsed
                    <Fragment key={j}>
                      <span className="cs-word-mask">
                        <span className="cs-word">{word}</span>
                      </span>
                      {j < words.length - 1 ? ' ' : null}
                    </Fragment>
                  ))}
              </span>
            ))}
          </h1>
          <p className="cs-intro-lead">
            <span className="cs-in">{t(s.introLead)}</span>
          </p>
          <div className="cs-intro-actions">
            <Link to="/products" className="cs-btn cs-btn-light">
              {t(ui.home.ctaPrimary)}
            </Link>
            <button type="button" className="cs-btn cs-btn-outline-light" onClick={startJourney}>
              {t(s.startJourney)}
            </button>
          </div>
        </div>

        {/* Scene 2 copy + day counter with the matching feed */}
        <div className="cs-growth-head">
          <h2>{t(s.growthTitle)}</h2>
          <p>{t(s.growthLead)}</p>
        </div>
        <div className="cs-growth-panel">
          <p className="cs-day-label">{t(s.dayLabel)}</p>
          <p className="cs-day-num" data-day>
            1
          </p>
          <div className="cs-day-bar" aria-hidden="true">
            <span data-day-fill />
          </div>
          <div className="cs-feed-stack">
            {FEED_STAGES.map((stage) => {
              const product = getProduct(stage.slug);
              return (
                <div key={stage.slug} className="cs-feed">
                  <span className="cs-feed-eyebrow">{t(s.stageFeed)}</span>
                  <h3 className="cs-feed-name">{product ? t(product.stage) : ''}</h3>
                  <p className="cs-feed-range">
                    {t(s.dayRange).replace('{from}', String(stage.from)).replace('{to}', String(stage.to))}
                  </p>
                  <Link to={`/products/${stage.slug}`} className="cs-feed-link">
                    {t(s.feedDetails)}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Day 35 copy */}
        <div className="cs-farm-copy">
          <h2>{t(s.farmTitle)}</h2>
          <p>{t(s.farmLead)}</p>
        </div>

        {/* The feed bag: drops in on day 35, then carries the product scene */}
        <div className="cs-bag" aria-hidden="true">
          <div className="cs-bag-glow" />
          <div className="cs-bag-float">
            <img ref={bagImgRef} src={bag.src} alt="" className="cs-bag-img" draggable={false} />
          </div>
          <div className="cs-bag-shadow" />
          <ul className="cs-callouts" aria-hidden="true">
            {[
              `${t(s.weight)}: ${bag.kg} ${lang === 'ar' ? 'كجم' : 'kg'}`,
              category ? (lang === 'ar' ? category.ar : category.en) : '',
              t(s.callPack),
            ].map((label) => (
              <li key={label} className="cs-callout">
                <span className="cs-callout-dot" />
                <span className="cs-callout-line" />
                <span className="cs-callout-label">{label}</span>
              </li>
            ))}
          </ul>
          <div className="cs-companion">
            <img ref={companionImgRef} src={COMPANION[bag.category]} alt="" />
          </div>
          {GRAINS.map((g) => (
            <span key={g} className="cs-grain" />
          ))}
        </div>

        {/* Scene 3 product card */}
        <div className="cs-card">
          <p className="cs-card-anim cs-card-eyebrow">{t(s.cardEyebrow)}</p>
          <h2 className="cs-card-anim cs-card-title">{t(ui.home.heroBags[bag.key])}</h2>
          <div className="cs-card-anim cs-card-chips">
            <span className="cs-chip">{category ? (lang === 'ar' ? category.ar : category.en) : ''}</span>
            <span className="cs-chip">
              {t(s.weight)}: {bag.kg} {lang === 'ar' ? 'كجم' : 'kg'}
            </span>
          </div>
          <p className="cs-card-anim cs-card-desc">{t(ui.home[CATEGORY_DESC[bag.category]])}</p>
          <div className="cs-card-anim cs-card-actions">
            <Link to={`/products?category=${bag.category}`} className="cs-btn cs-btn-primary">
              {t(s.detailsCta)}
            </Link>
            <Link to="/contact" className="cs-btn cs-btn-ghost">
              {t(s.orderCta)}
            </Link>
          </div>
          <div className="cs-card-anim cs-switcher" role="group" aria-label={t(s.switcherLabel)}>
            {BAGS.map((b, i) => (
              <button
                key={b.key}
                type="button"
                className="cs-thumb"
                aria-pressed={i === active}
                aria-label={t(ui.home.heroBags[b.key])}
                onClick={() => selectBag(i)}
              >
                <img src={b.src} alt="" />
              </button>
            ))}
          </div>
        </div>

        {/* Scene-change light, and the cream the stage dissolves into at the end */}
        <div className="cs-sweep" aria-hidden="true" />
        <div className="cs-flash" aria-hidden="true" />
        <div className="cs-exit" aria-hidden="true" />

        <button
          type="button"
          className="cs-sound"
          data-pending={sound === 'pending' ? '' : undefined}
          aria-pressed={sound === 'on'}
          aria-label={t(s.soundToggle)}
          onClick={toggleSound}
        >
          {sound === 'on' ? <Volume2 aria-hidden="true" /> : <VolumeX aria-hidden="true" />}
          <span>{t(sound === 'on' ? s.soundOn : sound === 'off' ? s.soundOff : s.soundPending)}</span>
        </button>

        {/* Chapter counter */}
        <div className="cs-counter" aria-hidden="true">
          <span className="cs-counter-num" data-counter-num>01</span>
          <span>/ 0{CHAPTERS.length}</span>
          <span className="cs-counter-name" data-counter-name>{t(s.chapters.intro)}</span>
          <span className="cs-counter-bar">
            <span data-counter-fill />
          </span>
        </div>
      </div>
    </section>
  );
}
