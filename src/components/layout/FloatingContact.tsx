import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpIcon, MessageCircleIcon, PhoneIcon } from 'lucide-react';
import { useLang } from '../../i18n/LanguageContext';
import { ui } from '../../i18n/ui';

export function FloatingContact() {
  const { t } = useLang();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed bottom-5 z-40 flex flex-col gap-3 ltr:right-4 rtl:left-4">
      {showTop ?
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label={t(ui.floating.top)}
        className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-100 bg-white text-ink shadow-card transition hover:border-brand-300 hover:text-brand-600">
        
          <ArrowUpIcon className="h-5 w-5" aria-hidden="true" />
        </button> :
      null}
      <Link
        to="/contact"
        aria-label={t(ui.floating.call)}
        className="focus-ring inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-white shadow-lift transition hover:bg-brand-700">
        
        <PhoneIcon className="h-5 w-5" aria-hidden="true" />
      </Link>
      <Link
        to="/contact"
        aria-label={t(ui.floating.whatsapp)}
        className="focus-ring inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold-500 text-white shadow-lift transition hover:bg-gold-600">
        
        <MessageCircleIcon className="h-5 w-5" aria-hidden="true" />
      </Link>
    </div>);

}