import React from 'react';
import { Reveal } from './Reveal';

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'start' | 'center';
  tone?: 'light' | 'dark';
  action?: React.ReactNode;
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'start',
  tone = 'light',
  action
}: SectionHeadingProps) {
  const isDark = tone === 'dark';
  return (
    <Reveal className={`mb-10 flex flex-col gap-5 md:flex-row md:items-end ${align === 'center' ? 'md:justify-center' : 'md:justify-between'}`}>
      <div className={align === 'center' ? 'text-center mx-auto max-w-2xl' : 'max-w-2xl'}>
        {eyebrow ?
        <span className={`inline-flex items-center gap-2 rounded-pill px-3 py-1 text-xs font-bold tracking-wide ${isDark ? 'bg-white/10 text-gold-200' : 'bg-brand-50 text-brand-600'}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-gold-500" aria-hidden="true" />
            {eyebrow}
          </span> :
        null}
        <h2 className={`mt-3 text-3xl font-extrabold leading-[1.25] md:text-4xl ${isDark ? 'text-white' : 'text-ink'}`}>{title}</h2>
        {subtitle ?
        <p className={`mt-3 text-base leading-relaxed ${isDark ? 'text-white/70' : 'text-ink-muted'}`}>{subtitle}</p> :
        null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </Reveal>);

}