import { useLang } from '../../i18n/LanguageContext';
import { ui } from '../../i18n/ui';
import { Reveal } from '../shared/Reveal';
import { QualityPipelineJourney } from './QualityPipelineJourney';

export function QualityProcess() {
  const { t } = useLang();

  return (
    <section className="quality-process-section relative pt-10 md:pt-16 pb-16 md:pb-24 overflow-hidden" aria-labelledby="quality-title">
      <div className="mx-auto max-w-site px-4 md:px-6">
        <Reveal>
          <div className="quality-header-wrap mb-10 md:mb-12 max-w-3xl">


            {/* Balanced, high-readability Arabic headline */}
            <h2
              id="quality-section-heading"
              className="mt-4 text-3xl font-black text-ink sm:text-4xl lg:text-[2.6rem] leading-[1.45] tracking-tight"
            >
              <span className="text-brand-700">رحلة الجودة الشاملة</span>
              <span className="block mt-1 sm:mt-2 text-ink">من المادة الخام حتى المنتج النهائي.</span>
            </h2>


          </div>
        </Reveal>

        <div id="quality-title" className="sr-only">
          {t(ui.quality.pageTitle)}
        </div>
        <QualityPipelineJourney />
      </div>
    </section>
  );
}