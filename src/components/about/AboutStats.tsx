import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useMotionValue, animate } from 'framer-motion';

interface StatItem {
  id: string;
  targetValue: number;
  prefix?: string;
  label: string;
  subtext: string;
  image: string;
}

const STATS_DATA: StatItem[] = [
  {
    id: 'years',
    targetValue: 33,
    prefix: '+',
    label: 'سنة من الخبرة والريادة',
    subtext: 'تأسست عام 1990',
    image: '/years.webp',
  },
  {
    id: 'factories',
    targetValue: 3,
    prefix: '',
    label: 'مجمعات صناعية عملاقة',
    subtext: 'طاقة إنتاجية وفورية ضخمة',
    image: '/factory.webp',
  },
  {
    id: 'engineers',
    targetValue: 3200,
    prefix: '+',
    label: 'مهندس وفني واستشاري',
    subtext: 'كوادر علمية بأعلى المستويات',
    image: '/workers.webp',
  },
  {
    id: 'capacity',
    targetValue: 1000,
    prefix: '+',
    label: 'طن طاقة إنتاجية يومياً',
    subtext: 'تغطي كبرى مزارع الجمهورية',
    image: '/production.webp',
  },
];

function AnimatedCounter({ value, prefix = '' }: { value: number; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20px' });
  const count = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    if (!inView) return;

    const controls = animate(count, value, {
      duration: 2.2,
      ease: [0.16, 1, 0.3, 1], // snappy easeOutExpo
      onUpdate: (latest) => {
        setDisplayValue(Math.floor(latest).toString());
      },
    });

    return () => controls.stop();
  }, [inView, value, count]);

  return (
    <span ref={ref} className="inline-flex items-baseline tabular-nums dir-ltr">
      {prefix && (
        <span className="text-brand-600/90 font-black mr-0.5 select-none">{prefix}</span>
      )}
      <span>{displayValue}</span>
    </span>
  );
}

export function AboutStats() {
  return (
    <section className="relative -mt-12 mx-auto max-w-[1400px] px-4 md:px-8 z-20" dir="rtl">
      {/* Floating Glass Container */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-3xl bg-white/95 backdrop-blur-md border border-slate-200/90 p-6 md:p-8 lg:p-10 shadow-lift"
      >
        {/* Subtle Decorative Ambient Lighting */}
        <div
          className="pointer-events-none absolute -top-24 left-1/4 h-48 w-96 rounded-full bg-brand-500/5 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-24 right-1/4 h-48 w-96 rounded-full bg-gold-400/5 blur-3xl"
          aria-hidden="true"
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative z-10">
          {STATS_DATA.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: idx * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative flex flex-col items-center text-center p-4 sm:p-5 rounded-2xl transition-all duration-500 hover:bg-gradient-to-b hover:from-brand-50/40 hover:via-white hover:to-brand-50/20 hover:shadow-lg hover:-translate-y-1.5"
            >
              {/* Subtle Aura Behind the Image on Hover */}
              <div
                className="pointer-events-none absolute top-4 h-28 w-28 rounded-full bg-brand-500/10 blur-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                aria-hidden="true"
              />

              {/* 3D Circular Floating Image with Micro-Bounce */}
              <motion.div
                animate={{
                  y: [0, -6, 0],
                }}
                transition={{
                  duration: 3.2 + idx * 0.3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: idx * 0.2,
                }}
                className="relative h-24 w-24 sm:h-28 sm:w-28 lg:h-32 lg:w-32 xl:h-36 xl:w-36 mb-2 flex items-end justify-center transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-2"
              >
                <img
                  src={item.image}
                  alt={item.label}
                  loading="lazy"
                  decoding="async"
                  className="max-h-full max-w-full object-contain object-bottom select-none drop-shadow-md transition-all duration-500 group-hover:drop-shadow-2xl"
                />
              </motion.div>

              {/* Animated Stat Value */}
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-brand-700 tracking-tight leading-none mt-1 transition-colors duration-300 group-hover:text-brand-800">
                <AnimatedCounter value={item.targetValue} prefix={item.prefix} />
              </div>

              {/* Title & Subtext with Staggered Visual Rhythm */}
              <span className="text-sm sm:text-base font-black text-ink mt-2 transition-colors duration-300 group-hover:text-brand-900">
                {item.label}
              </span>

              <span className="text-xs font-semibold text-slate-400 mt-1 transition-colors duration-300 group-hover:text-slate-500">
                {item.subtext}
              </span>

              {/* Bottom decorative subtle indicator */}
              <div
                className="mt-3 h-1 w-0 rounded-full bg-brand-500 transition-all duration-500 group-hover:w-10 opacity-75"
                aria-hidden="true"
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
