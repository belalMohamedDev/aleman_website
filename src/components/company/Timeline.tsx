import { motion, useReducedMotion } from 'framer-motion';
import { timeline } from '../../data/timeline';
import { useLang } from '../../i18n/LanguageContext';
import { ui } from '../../i18n/ui';

export function Timeline() {
  const { t } = useLang();
  const reduced = useReducedMotion();

  return (
    <ol className="relative space-y-6 ltr:border-l rtl:border-r border-brand-100 ltr:pl-6 rtl:pr-6">
      {timeline.map((stage, index) =>
      <motion.li
        key={stage.id}
        initial={reduced ? false : { opacity: 0, x: 16 }}
        whileInView={reduced ? undefined : { opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.45, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-card border border-slate-100 bg-white p-5 shadow-card">
        
          <span
          className="absolute top-6 inline-flex h-3.5 w-3.5 rounded-full border-2 border-white bg-brand-500 ltr:-left-[31px] rtl:-right-[31px]"
          aria-hidden="true" />
        
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-pill bg-brand-50 px-3 py-1 text-xs font-extrabold text-brand-600">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className="text-lg font-extrabold text-ink">{t(stage.title)}</h3>
            <span className="rounded-pill bg-slate-100 px-3 py-1 text-[11px] font-bold text-ink-muted">
              {stage.year ?? t(ui.common.notPublished)}
            </span>
          </div>
          <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">{t(stage.description)}</p>
        </motion.li>
      )}
    </ol>);

}