import React from 'react';
import { AlertCircleIcon } from 'lucide-react';

type BaseProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
};

export function Field({ id, label, error, hint, required, children }: BaseProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-bold text-ink">
        {label}
        {required ? <span className="mx-1 text-gold-600">*</span> : null}
      </label>
      {children}
      {hint && !error ? <p className="text-xs text-ink-muted">{hint}</p> : null}
      {error ?
      <p id={`${id}-error`} role="alert" className="flex items-center gap-1.5 text-xs font-semibold text-red-600">
          <AlertCircleIcon className="h-4 w-4" aria-hidden="true" />
          {error}
        </p> :
      null}
    </div>);

}

export const controlClass =
'focus-ring w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink placeholder:text-slate-400 transition focus:border-brand-400 focus:outline-none';