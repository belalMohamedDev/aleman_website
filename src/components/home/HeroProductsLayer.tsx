import { motion, MotionValue } from 'framer-motion';

interface HeroProductsLayerProps {
  y: MotionValue<string>;
  scale: MotionValue<number>;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  isFallback: boolean;
  reduced: boolean;
}

const PRODUCTS = [
  {
    id: 'bag-1',
    src: '/aleman_parallax_assets/bag-01-ducks.png',
    alt: 'علف بط الإيمان',
    className: 'hero-bag-1',
    delay: 0.1,
    yOffset: 45,
  },
  {
    id: 'bag-2',
    src: '/aleman_parallax_assets/bag-02-cattle.png',
    alt: 'علف ماشية وتسمين الإيمان',
    className: 'hero-bag-2',
    delay: 0.16,
    yOffset: 50,
  },
  {
    id: 'bag-3',
    src: '/aleman_parallax_assets/bag-03-ducks.png',
    alt: 'علف بط بياض ونمو الإيمان',
    className: 'hero-bag-3',
    delay: 0.22,
    yOffset: 55,
  },
  {
    id: 'bag-4',
    src: '/aleman_parallax_assets/bag-04-rabbits.png',
    alt: 'علف أرانب الإيمان',
    className: 'hero-bag-4',
    delay: 0.28,
    yOffset: 50,
  },
  {
    id: 'bag-5',
    src: '/aleman_parallax_assets/bag-05-broiler.png',
    alt: 'علف تسمين دواجن الإيمان سوبر',
    className: 'hero-bag-5',
    delay: 0.34,
    yOffset: 60,
  },
];

export function HeroProductsLayer({
  y,
  scale,
  pointerX,
  pointerY,
  isFallback,
  reduced,
}: HeroProductsLayerProps) {
  // If using composite fallback, products are already in the image
  if (isFallback) {
    return null;
  }

  return (
    <motion.div
      className="hero-layer hero-layer-products"
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
      aria-hidden="true"
    >
      <div className="hero-products-cluster">
        {PRODUCTS.map((prod) => (
          <motion.div
            key={prod.id}
            initial={
              reduced
                ? false
                : {
                    opacity: 0,
                    y: prod.yOffset,
                    scale: 0.94,
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
              duration: 1.15,
              delay: prod.delay,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={`hero-bag-item ${prod.className}`}
          >
            <img
              src={prod.src}
              alt={prod.alt}
              className="w-full h-auto object-contain"
              loading="eager"
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
