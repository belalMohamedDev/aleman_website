import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import type { CategoryId } from '../../types/content';
import { categories } from '../../data/products';
import { useLang } from '../../i18n/LanguageContext';
import './product-categories.css';

interface CategoryVisualMeta {
  image: string;
  desc: { ar: string; en: string };
  haloClass: string;
  liftClass: string;
}

const CATEGORY_VISUALS: Record<CategoryId, CategoryVisualMeta> = {
  poultry: {
    image: '/animal_chicken.webp',
    desc: { ar: 'أعلاف تسمين وبياض متوازنة بأعلى معايير الهضم', en: 'Balanced Broiler & Layer Feeds' },
    haloClass: 'halo-poultry',
    liftClass: 'animal-lift-poultry',
  },
  livestock: {
    image: '/animal_cow.webp',
    desc: { ar: 'أعلاف تسمين وحلاب لإنتاجية قصوى وصحة قوية', en: 'Beef & Dairy High Yield Feed' },
    haloClass: 'halo-livestock',
    liftClass: 'animal-lift-livestock',
  },
  rabbit: {
    image: '/animal_rabbit.webp',
    desc: { ar: 'تركيبات متخصصة ومناعية لتربية نموذجية', en: 'Specialized Rabbit Nutrition' },
    haloClass: 'halo-rabbit',
    liftClass: 'animal-lift-rabbit',
  },
  duck: {
    image: '/animal_duck.webp',
    desc: { ar: 'أعلاف تسمين وبياض بط بنسب بروتين دقيقة', en: 'Precision Protein Duck Feed' },
    haloClass: 'halo-duck',
    liftClass: 'animal-lift-duck',
  },
};

export function ProductCategories() {
  const { lang } = useLang();
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  // Scroll Parallax Tracking
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Smooth Parallax Transformations on Scroll
  const animalScrollY = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? [0, 0] : [22, -22]
  );

  const haloScale = useTransform(
    scrollYProgress,
    [0, 0.45, 1],
    reduced ? [1, 1, 1] : [0.8, 1.15, 0.85]
  );

  return (
    <section
      ref={sectionRef}
      className="podium-section mx-auto max-w-site px-4 pt-4 sm:pt-8 pb-16 md:px-6"
      aria-label={lang === 'ar' ? 'تصنيفات الأعلاف والمنتجات' : 'Product categories'}
    >
      <div className="podium-grid">
        {categories.map((category, index) => {
          const meta = CATEGORY_VISUALS[category.id];

          return (
            <motion.div
              key={category.id}
              className="podium-item-wrapper"
              initial={reduced ? false : { opacity: 0, y: 50, scale: 0.9, rotateX: 12 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.75,
                delay: index * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Link
                to={`/products?category=${category.id}`}
                className="podium-item focus-ring group"
              >
                {/* 3D Diorama Stage */}
                <div className="podium-stage">
                  {/* Atmospheric Glow Halo reacting smoothly to scroll */}
                  <motion.div
                    className={`podium-ambient-halo ${meta.haloClass}`}
                    style={{ scale: haloScale }}
                  />

                  {/* 3D Platform Pedestal Base (الطبق) */}
                  <div className="podium-platform-wrapper">
                    {/* 3D Disc Body with Top Surface and Cylinder Edge */}
                    <div className="podium-disc" />

                    {/* Contact Shadow for Animal's Feet on the Platform */}
                    <motion.div
                      className="podium-animal-contact-shadow"
                      animate={
                        reduced
                          ? undefined
                          : {
                            scale: [1, 0.84, 1],
                            opacity: [0.7, 0.45, 0.7],
                          }
                      }
                      transition={{
                        repeat: Infinity,
                        duration: 3.4 + index * 0.35,
                        ease: 'easeInOut',
                        delay: index * 0.2,
                      }}
                    />
                  </div>

                  {/* 3D Animal Avatar with combined Scroll Parallax and Breathing Motion */}
                  <motion.div
                    className={`podium-animal-wrapper ${meta.liftClass}`}
                    style={{ y: animalScrollY }}
                  >
                    <motion.div
                      animate={
                        reduced
                          ? undefined
                          : {
                            y: [0, -8, 0],
                          }
                      }
                      transition={{
                        repeat: Infinity,
                        duration: 3.4 + index * 0.35,
                        ease: 'easeInOut',
                        delay: index * 0.2,
                      }}
                    >
                      <img
                        src={meta.image}
                        alt={lang === 'ar' ? category.ar : category.en}
                        loading="lazy"
                        decoding="async"
                        className="podium-animal-img"
                      />
                    </motion.div>
                  </motion.div>
                </div>

                {/* Info & Typography Section */}
                <div className="podium-info">
                  <h3 className="podium-title">
                    {lang === 'ar' ? category.ar : category.en}
                  </h3>

                  <p className="podium-desc">
                    {lang === 'ar' ? meta.desc.ar : meta.desc.en}
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}