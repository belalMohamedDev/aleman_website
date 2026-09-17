import { motion, MotionValue, useTransform } from 'framer-motion';

interface HeroShowcaseLayerProps {
  progress: MotionValue<number>;
  smoothMouseX: MotionValue<number>;
  smoothMouseY: MotionValue<number>;
  reduced: boolean;
}

const BAGS = [
  {
    id: 'bag-1',
    name: 'علف دواجن منزلي 25 كجم',
    src: '/aleman_parallax_assets/bag-01-ducks.webp',
    className: 'hero-bag-slot-1',
    delay: 0.55,
  },
  {
    id: 'bag-2',
    name: 'علف تسمين ماشية 50 كجم',
    src: '/aleman_parallax_assets/bag-02-cattle.webp',
    className: 'hero-bag-slot-2',
    delay: 0.72,
  },
  {
    id: 'bag-3',
    name: 'علف بط بياض 50 كجم',
    src: '/aleman_parallax_assets/bag-03-ducks.webp',
    className: 'hero-bag-slot-3',
    delay: 0.89,
  },
  {
    id: 'bag-4',
    name: 'علف أرانب مرضعات 50 كجم',
    src: '/aleman_parallax_assets/bag-04-rabbits.webp',
    className: 'hero-bag-slot-4',
    delay: 1.06,
  },
  {
    id: 'bag-5',
    name: 'علف دواجن بادي نامي سوبر 50 كجم',
    src: '/aleman_parallax_assets/bag-05-broiler.webp',
    className: 'hero-bag-slot-5',
    delay: 1.23,
  },
];

export function HeroShowcaseLayer({
  progress,
  smoothMouseX,
  smoothMouseY,
  reduced,
}: HeroShowcaseLayerProps) {
  // --------------------------------------------------------------------------
  // Camera Push-In & Depth Calibration
  // --------------------------------------------------------------------------

  // Depth 1: Cow (Mid-Back, left of scene - stays deeper)
  const cowScrollY = useTransform(progress, [0, 1], ['0%', '12%']);
  const cowMouseX = useTransform(smoothMouseX, [-1, 1], [-7, 7]);
  const cowMouseY = useTransform(smoothMouseY, [-1, 1], [-5, 5]);

  // Depth 2: Pallet & Bags (Hero Commercial Focus: Approaches camera with scale)
  const bagsScrollY = useTransform(progress, [0, 0.85], ['0%', '16%']);
  const bagsScrollScale = useTransform(progress, [0, 0.85], [1, 1.12]);
  const bagsMouseX = useTransform(smoothMouseX, [-1, 1], [-12, 12]);
  const bagsMouseY = useTransform(smoothMouseY, [-1, 1], [-8, 8]);

  // Depth 3: Duck (Right foreground of bags)
  const duckScrollY = useTransform(progress, [0, 0.85], ['0%', '24%']);
  const duckMouseX = useTransform(smoothMouseX, [-1, 1], [-15, 15]);
  const duckMouseY = useTransform(smoothMouseY, [-1, 1], [-10, 10]);

  // Depth 4: Chicken (Left foreground, perched on grain sacks)
  const chickenScrollY = useTransform(progress, [0, 0.85], ['0%', '28%']);
  const chickenMouseX = useTransform(smoothMouseX, [-1, 1], [-16, 16]);
  const chickenMouseY = useTransform(smoothMouseY, [-1, 1], [-11, 11]);

  // Depth 5: Foreground Grains & Burlap Sacks (Passes camera lens quickly)
  const grainsScrollY = useTransform(progress, [0, 0.85], ['0%', '42%']);
  const grainsMouseX = useTransform(smoothMouseX, [-1, 1], [-20, 20]);
  const grainsMouseY = useTransform(smoothMouseY, [-1, 1], [-14, 14]);

  return (
    <div className="hero-showcase-stage" aria-hidden="true">
      {/* ==================================================================
          1. COW - Left Edge, Steps into frame behind the bags
          ================================================================== */}
      <motion.div
        className="hero-cow-anchor"
        style={
          reduced
            ? undefined
            : {
                y: cowScrollY,
                x: cowMouseX,
                translateY: cowMouseY,
              }
        }
      >
        <motion.img
          initial={reduced ? false : { opacity: 0, x: -70 }}
          animate={reduced ? undefined : { opacity: 1, x: 0 }}
          transition={{ duration: 1.15, delay: 1.38, ease: [0.16, 1, 0.3, 1] }}
          src="/aleman_parallax_assets/cow.webp"
          alt="أبقار الإيمان"
          className="hero-cow-img"
          loading="eager"
          decoding="async"
        />
      </motion.div>

      {/* ==================================================================
          2. WOODEN PALLET & 5 FEED BAGS - Staged Product Commercial Reveal
          ================================================================== */}
      <motion.div
        className="hero-bags-platform-anchor"
        style={
          reduced
            ? undefined
            : {
                y: bagsScrollY,
                scale: bagsScrollScale,
                x: bagsMouseX,
                translateY: bagsMouseY,
              }
        }
      >
        {/* Realistic Wooden Pallet Base (Grounds itself first) */}
        <motion.div
          className="hero-pallet-base"
          initial={reduced ? false : { opacity: 0, y: 40 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.95, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero-pallet-top-deck">
            <div className="hero-pallet-slat" />
            <div className="hero-pallet-slat" />
            <div className="hero-pallet-slat" />
            <div className="hero-pallet-slat" />
            <div className="hero-pallet-slat" />
          </div>
          <div className="hero-pallet-stringers">
            <div className="hero-pallet-block" />
            <div className="hero-pallet-block" />
            <div className="hero-pallet-block" />
          </div>
          <div className="hero-pallet-bottom-deck" />
        </motion.div>

        {/* The 5 Feed Bags Landing Sequentially with Spring Easing */}
        <div className="hero-bags-row">
          {BAGS.map((bag) => (
            <motion.div
              key={bag.id}
              className={`hero-bag-slot ${bag.className}`}
              initial={
                reduced
                  ? false
                  : {
                      opacity: 0,
                      y: 65,
                      scale: 0.9,
                    }
              }
              animate={
                reduced
                  ? undefined
                  : {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }
              }
              transition={{
                duration: 0.85,
                delay: bag.delay,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <img
                src={bag.src}
                alt={bag.name}
                className="hero-bag-img"
                loading="eager"
                decoding="async"
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ==================================================================
          3. DUCK - Right Edge of Bag 5, Looking inward
          ================================================================== */}
      <motion.div
        className="hero-duck-anchor"
        style={
          reduced
            ? undefined
            : {
                y: duckScrollY,
                x: duckMouseX,
                translateY: duckMouseY,
              }
        }
      >
        <motion.img
          initial={reduced ? false : { opacity: 0, scale: 0.8, y: 25 }}
          animate={reduced ? undefined : { opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.58, ease: [0.16, 1, 0.3, 1] }}
          src="/aleman_parallax_assets/duck.webp"
          alt="بط الإيمان"
          className="hero-duck-img"
          loading="eager"
          decoding="async"
        />
      </motion.div>

      {/* ==================================================================
          4. FOREGROUND GRAIN SACKS & SCOOP - Spills into position
          ================================================================== */}
      <motion.div
        className="hero-grains-anchor"
        style={
          reduced
            ? undefined
            : {
                y: grainsScrollY,
                x: grainsMouseX,
                translateY: grainsMouseY,
              }
        }
      >
        <motion.img
          initial={reduced ? false : { opacity: 0, y: 35 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 1.48, ease: [0.16, 1, 0.3, 1] }}
          src="/aleman_parallax_assets/foreground-grains-plants.webp"
          alt="حبوب وأعلاف الإيمان"
          className="hero-grains-img"
          loading="eager"
          decoding="async"
        />
      </motion.div>

      {/* ==================================================================
          5. CHICKEN - Lands on the Grain Sacks
          ================================================================== */}
      <motion.div
        className="hero-chicken-anchor"
        style={
          reduced
            ? undefined
            : {
                y: chickenScrollY,
                x: chickenMouseX,
                translateY: chickenMouseY,
              }
        }
      >
        <motion.img
          initial={reduced ? false : { opacity: 0, scale: 0.8, y: 20 }}
          animate={reduced ? undefined : { opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.65, ease: [0.16, 1, 0.3, 1] }}
          src="/aleman_parallax_assets/chicken.webp"
          alt="دواجن الإيمان"
          className="hero-chicken-img"
          loading="eager"
          decoding="async"
        />
      </motion.div>
    </div>
  );
}
