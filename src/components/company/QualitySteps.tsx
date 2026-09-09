import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { BeakerIcon, FactoryIcon, PackageIcon, ShieldCheckIcon, TruckIcon, WheatIcon } from 'lucide-react';
import { useLang } from '../../i18n/LanguageContext';
import { ui } from '../../i18n/ui';
import { qualitySteps, type QualityStepIcon } from '../../data/qualitySteps';

const ICONS: Record<QualityStepIcon, React.ElementType> = {
  wheat: WheatIcon,
  flask: BeakerIcon,
  factory: FactoryIcon,
  shield: ShieldCheckIcon,
  package: PackageIcon,
  truck: TruckIcon
};

export function QualityStepsFlow({ detailed = false }: {detailed?: boolean;}) {
  const { t } = useLang();
  const reduced = useReducedMotion();

  return (
    <ol className={`grid gap-4 ${detailed ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'}`}>
      {qualitySteps.map((step, index) => {
        const Icon = ICONS[step.icon];
        return (
          <motion.li
            key={step.id}
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className={`group relative rounded-card border border-slate-100 bg-white p-5 shadow-card transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift ${
            detailed ? 'md:p-6' : ''}`
            }>
            
            <div className="flex items-center justify-between">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-xs font-extrabold text-gold-600">
                {t(ui.quality.stepLabel)} {String(index + 1).padStart(2, '0')}
              </span>
            </div>
            <h3 className={`mt-4 font-extrabold text-ink ${detailed ? 'text-lg' : 'text-base'}`}>{t(step.title)}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{t(step.description)}</p>
            <span className="mt-4 block h-1 w-10 rounded-full bg-gold-200 transition-all duration-300 group-hover:w-16 group-hover:bg-gold-500" aria-hidden="true" />
          </motion.li>);

      })}
    </ol>);

}