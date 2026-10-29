import { useEffect, useRef, useState } from 'react';
import { CinematicStage } from '../components/home/CinematicStage';
import { MobileStory } from '../components/home/MobileStory';
import { QualityInspection } from '../components/home/QualityInspection';
import { useHomeScrollAnimations } from '../components/home/useHomeScrollAnimations';
import { useLang } from '../i18n/LanguageContext';
// Removed from the home page (kept in components/home): the farm programme tool
// import { FarmProgram } from '../components/home/FarmProgram';
// Earlier home sections, now covered by the stage's chapters and the inspection scene:
// import { HomeTrust } from '../components/home/HomeTrust';
// import { ProductCategories } from '../components/home/ProductCategories';
// import { TrustMetrics } from '../components/home/TrustMetrics';
// import { QualityProcess } from '../components/home/QualityProcess';
// import { TrustQualityBridge } from '../components/home/TrustQualityBridge';

// Phones get their own vertical story; the pinned stage needs the width of a tablet or desktop
const PHONE_QUERY = '(max-width: 767px)';

function useIsPhone() {
  const [isPhone, setIsPhone] = useState(() => window.matchMedia(PHONE_QUERY).matches);
  useEffect(() => {
    const query = window.matchMedia(PHONE_QUERY);
    const onChange = () => setIsPhone(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);
  return isPhone;
}

export function Home() {
  const rootRef = useRef<HTMLDivElement>(null);
  const { lang } = useLang();
  const isPhone = useIsPhone();
  // Rebuild on language change (split headings re-render with new words) and when the story switches
  useHomeScrollAnimations(rootRef, `${lang}-${isPhone ? 'phone' : 'stage'}`);

  return (
    // overflow-clip, not hidden: a hidden overflow makes this a scroll container and
    // breaks the sticky inspection scene
    <div ref={rootRef} className="relative overflow-clip">
      {/* Pinned cinematic story on wider screens (intro, growth, product card); a vertical story on phones */}
      {isPhone ? <MobileStory /> : <CinematicStage />}
      {/* The trust pillars, played out on the 3D bag */}
      <QualityInspection />
    </div>
  );
}
