import { motion, MotionValue } from 'framer-motion';

interface HeroGreeneryLayerProps {
  y: MotionValue<string>;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  reduced: boolean;
}

const GREEN_ASSET = '/aleman_parallax_assets/green.png';

export function HeroGreeneryLayer({
  y,
  pointerX,
  pointerY,
  reduced,
}: HeroGreeneryLayerProps) {
  return (
    <motion.div
      className="hero-layer hero-layer-greenery"
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
        src={GREEN_ASSET}
        alt=""
        className="hero-greenery-img"
        loading="eager"
      />
    </motion.div>
  );
}
