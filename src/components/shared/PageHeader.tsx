import React from 'react';
import { Reveal } from './Reveal';

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
};

export function PageHeader({ eyebrow, title, subtitle, children }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden border-b border-brand-100 bg-white">
      <div className="pattern-field pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="relative mx-auto max-w-site px-4 py-12 md:px-6 md:py-16">
        <Reveal>
          {eyebrow ?
          <span className="inline-flex items-center gap-2 rounded-pill bg-brand-50 px-3 py-1 text-xs font-bold text-brand-600">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-500" aria-hidden="true" />
              {eyebrow}
            </span> :
          null}
          <h1 className="mt-3 text-3xl font-extrabold leading-[1.25] text-ink md:text-5xl">{title}</h1>
          {subtitle ? <p className="mt-4 max-w-2xl text-base leading-loose text-ink-muted">{subtitle}</p> : null}
          {children ? <div className="mt-6">{children}</div> : null}
        </Reveal>
      </div>
    </section>);

}