import React from 'react';

type BadgeProps = {
  children: React.ReactNode;
  tone?: 'green' | 'gold' | 'neutral' | 'outline';
  icon?: React.ReactNode;
};

const TONES: Record<NonNullable<BadgeProps['tone']>, string> = {
  green: 'bg-brand-50 text-brand-600',
  gold: 'bg-gold-50 text-gold-700',
  neutral: 'bg-slate-100 text-ink-soft',
  outline: 'border border-brand-100 text-ink-muted'
};

export function Badge({ children, tone = 'neutral', icon }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-pill px-3 py-1 text-xs font-bold ${TONES[tone]}`}>
      {icon}
      {children}
    </span>);

}