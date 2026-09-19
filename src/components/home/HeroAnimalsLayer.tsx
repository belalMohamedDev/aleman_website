import { motion, MotionValue } from 'framer-motion';

interface HeroAnimalsLayerProps {
  y: MotionValue<string>;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  isFallback: boolean;
  reduced: boolean;
}

const COW_ASSET = '/aleman_parallax_assets/cow.webp';
const DUCK_ASSET = '/aleman_parallax_assets/duck.webp';
const CHICKEN_ASSET = '/aleman_parallax_assets/chicken.webp';

export function HeroAnimalsLayer({
  y,
  pointerX,
  pointerY,
  isFallback,
  reduced,
}: HeroAnimalsLayerProps) {
  // If using composite fallback, animals are already part of the composite image
  if (isFallback) {
    return null;
  }

  return (
    <motion.div
      className="hero-layer hero-layer-animals"
      style={
        reduced
          ? undefined
          : {
              y,
              x: pointerX,
              translateY: pointerY,
            }
      }
      aria-hidden="true"
    >
      {/* Cow - Left background edge */}
      <motion.div
        initial={reduced ? false : { opacity: 0, x: -35 }}
        animate={reduced ? undefined : { opacity: 1, x: 0 }}
        transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="hero-animal-item hero-animal-cow"
      >
        <img
          src={COW_ASSET}
          alt=""
          className="w-full h-auto object-contain"
          loading="eager"
        />
      </motion.div>

      {/* Duck - Ground level center */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 25 }}
        animate={reduced ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 1.0, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="hero-animal-item hero-animal-duck"
      >
        <img
          src={DUCK_ASSET}
          alt=""
          className="w-full h-auto object-contain"
          loading="eager"
        />
      </motion.div>

      {/* Chicken - Right of bag cluster */}
      <motion.div
        initial={reduced ? false : { opacity: 0, x: 25 }}
        animate={reduced ? undefined : { opacity: 1, x: 0 }}
        transition={{ duration: 1.0, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="hero-animal-item hero-animal-chicken"
      >
        <img
          src={CHICKEN_ASSET}
          alt=""
          className="w-full h-auto object-contain"
          loading="eager"
        />
      </motion.div>
    </motion.div>
  );
}
