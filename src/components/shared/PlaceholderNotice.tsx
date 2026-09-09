import React from 'react';
import { InfoIcon } from 'lucide-react';

type PlaceholderNoticeProps = {
  title?: string;
  children: React.ReactNode;
  compact?: boolean;
};

export function PlaceholderNotice({ title, children, compact = false }: PlaceholderNoticeProps) {
  return (
    <div
      role="note"
      className={`flex items-start gap-3 rounded-card border border-gold-200 bg-gold-50/70 text-ink-soft ${compact ? 'p-3' : 'p-4 md:p-5'}`}>
      
      <InfoIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" aria-hidden="true" />
      <div className="text-sm leading-relaxed">
        {title ? <p className="font-bold text-gold-700">{title}</p> : null}
        <p className={title ? 'mt-1' : ''}>{children}</p>
      </div>
    </div>);

}