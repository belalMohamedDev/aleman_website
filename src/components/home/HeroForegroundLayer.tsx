import { motion, MotionValue } from 'framer-motion';

interface HeroForegroundLayerProps {
  y: MotionValue<string>;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  reduced: boolean;
}

const FOREGROUND_ASSET = '/aleman_parallax_assets/foreground-grains-plants.png';

export function HeroForegroundLayer({
  y,
  pointerX,
  pointerY,
  reduced,
}: HeroForegroundLayerProps) {
  return (
    <motion.div
      className="hero-layer hero-layer-foreground"
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
      <img
        src={FOREGROUND_ASSET}
        alt=""
        className="hero-foreground-strip"
        loading="eager"
      />
      <div className="hero-bottom-fade" />
    </motion.div>
  );
}
