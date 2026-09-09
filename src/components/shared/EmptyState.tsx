import React from 'react';
import { SearchXIcon } from 'lucide-react';

type EmptyStateProps = {
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ title, body, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="rounded-card border border-dashed border-brand-200 bg-white p-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-50">
        <SearchXIcon className="h-7 w-7 text-brand-500" aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-lg font-extrabold text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-muted">{body}</p>
      {actionLabel && onAction ?
      <button
        type="button"
        onClick={onAction}
        className="focus-ring mt-5 rounded-pill bg-brand-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700">
        
          {actionLabel}
        </button> :
      null}
    </div>);

}