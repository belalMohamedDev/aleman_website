import { motion, MotionValue } from 'framer-motion';
import { useLang } from '../../i18n/LanguageContext';
import { ui } from '../../i18n/ui';

interface HeroBackgroundLayerProps {
  y: MotionValue<string>;
  scale: MotionValue<number>;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  isFallback: boolean;
  reduced: boolean;
}

const CLEAN_BG = '/aleman_parallax_assets/hero-background-clean.png';
const FALLBACK_BG = '/hero_farm_bg.png';

export function HeroBackgroundLayer({
  y,
  scale,
  pointerX,
  pointerY,
  isFallback,
  reduced,
}: HeroBackgroundLayerProps) {
  const { t, dir } = useLang();

  return (
    <>
      {/* Layer 1: Background Landscape / Factory */}
      <motion.div
        className="hero-layer hero-layer-bg"
        style={
          reduced
            ? undefined
            : {
                y,
                scale,
                x: pointerX,
                translateY: pointerY,
              }
        }
      >
        <motion.img
          initial={reduced ? false : { opacity: 0, scale: 1.08 }}
          animate={reduced ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          src={isFallback ? FALLBACK_BG : CLEAN_BG}
          alt={t(ui.home.heroImageAlt)}
          className="hero-bg-img"
          loading="eager"
        />
      </motion.div>

      {/* Layer 2: Vignette and Directional Reading Masks */}
      <div className="hero-layer hero-layer-atmosphere" aria-hidden="true">
        <div className="hero-vignette-ambient" />
        {dir === 'rtl' ? (
          <div className="hero-text-mask-rtl" />
        ) : (
          <div className="hero-text-mask-ltr" />
        )}
      </div>
    </>
  );
}
