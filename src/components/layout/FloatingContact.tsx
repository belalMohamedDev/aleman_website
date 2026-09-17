import { useEffect, useState } from 'react';
import { ArrowUpIcon } from 'lucide-react';

const WHATSAPP_NUMBER = '201110767100';

export function FloatingContact() {

  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed bottom-5 z-40 flex flex-col gap-3 ltr:right-4 rtl:left-4">
      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="العودة إلى أعلى"
          className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-100 bg-white text-ink shadow-card transition hover:border-brand-300 hover:text-brand-600"
        >
          <ArrowUpIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      )}

      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصل عبر واتساب"
        className="focus-ring relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-white shadow-lift transition hover:bg-brand-700"

      // className="focus-ring inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold-500 text-white shadow-lift transition hover:bg-gold-600"
      >
        <img
          src="/whatsapp.png"
          alt="واتساب"
          loading="lazy"
          decoding="async"
          className="h-6 w-6"
          style={{ filter: 'brightness(0) invert(1)' }}
        />
      </a>
    </div>
  );
}