import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CalculatorIcon } from 'lucide-react';
import { useLang } from '../../i18n/LanguageContext';
import { ui } from '../../i18n/ui';
import { Field, controlClass } from '../shared/Field';
import { PlaceholderNotice } from '../shared/PlaceholderNotice';

type Result = {fcr: number;totalGain: number;};

export function FCRCalculator() {
  const { t, lang } = useLang();
  const reduced = useReducedMotion();
  const [flock, setFlock] = useState('');
  const [intake, setIntake] = useState('');
  const [gain, setGain] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [calculating, setCalculating] = useState(false);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const flockValue = Number(flock);
    const intakeValue = Number(intake);
    const gainValue = Number(gain);

    if (!flockValue || !intakeValue || !gainValue || flockValue <= 0 || intakeValue <= 0 || gainValue <= 0) {
      setError(t(ui.tools.invalid));
      setResult(null);
      return;
    }

    setError(null);
    setCalculating(true);
    window.setTimeout(() => {
      const totalGain = flockValue * gainValue;
      setResult({ fcr: intakeValue / totalGain, totalGain });
      setCalculating(false);
    }, 420);
  }

  const status = result ?
  result.fcr < 1.5 ?
  t(ui.tools.statusLow) :
  result.fcr <= 2 ?
  t(ui.tools.statusMid) :
  t(ui.tools.statusHigh) :
  null;

  const numberFormat = new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en-GB', { maximumFractionDigits: 2 });

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      <form onSubmit={onSubmit} className="rounded-card border border-slate-100 bg-white p-6 shadow-card md:p-7" noValidate>
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
            <CalculatorIcon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-lg font-extrabold text-ink">{t(ui.tools.fcrTitle)}</h2>
            <p className="text-xs font-semibold text-ink-muted">{t(ui.tools.fcrIntro)}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          <Field id="flock" label={t(ui.tools.flockSize)} required>
            <input
              id="flock"
              type="number"
              min="1"
              inputMode="numeric"
              value={flock}
              onChange={(e) => setFlock(e.target.value)}
              className={controlClass} />
            
          </Field>
          <Field id="intake" label={t(ui.tools.feedIntake)} required>
            <input
              id="intake"
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              value={intake}
              onChange={(e) => setIntake(e.target.value)}
              className={controlClass} />
            
          </Field>
          <Field id="gain" label={t(ui.tools.weightGain)} required error={error ?? undefined}>
            <input
              id="gain"
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              value={gain}
              onChange={(e) => setGain(e.target.value)}
              className={controlClass} />
            
          </Field>
        </div>

        <button
          type="submit"
          disabled={calculating}
          className="focus-ring mt-6 inline-flex w-full items-center justify-center rounded-pill bg-brand-600 px-6 py-3.5 text-sm font-extrabold text-white transition hover:bg-brand-700 disabled:opacity-60">
          
          {calculating ? t(ui.common.loading) : t(ui.tools.calculate)}
        </button>
      </form>

      <div className="flex flex-col gap-4">
        <motion.div
          key={result ? result.fcr : 'empty'}
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-card border border-gold-200 bg-white p-6 shadow-card">
          
          <p className="text-sm font-bold text-ink-muted">{t(ui.tools.result)}</p>
          <p className="mt-2 text-5xl font-extrabold text-gold-600">
            {result ? numberFormat.format(Number(result.fcr.toFixed(2))) : '—'}
          </p>
          <dl className="mt-5 space-y-3 border-t border-slate-100 pt-4 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="font-bold text-ink">{t(ui.tools.status)}</dt>
              <dd className="text-ink-muted">{status ?? '—'}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="font-bold text-ink">{t(ui.tools.totalGain)}</dt>
              <dd className="text-ink-muted">{result ? `${numberFormat.format(result.totalGain)} kg` : '—'}</dd>
            </div>
          </dl>
        </motion.div>

        <PlaceholderNotice>{t(ui.tools.disclaimer)}</PlaceholderNotice>
      </div>
    </div>);

}