import { useState, useEffect, useRef, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XIcon,
  MailIcon,
  SmartphoneIcon,
  RefreshCwIcon,
  EyeIcon,
  EyeOffIcon,
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { ui } from '../../i18n/ui';

type AuthMode = 'phone' | 'email';
type PhoneStep = 'input' | 'otp';

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, sendLoginOtp, verifyLoginOtp } = useAuth();
  const { t, isRtl } = useLanguage();

  // Mode Toggle: Phone OTP vs Email & Password
  const [authMode, setAuthMode] = useState<AuthMode>('phone');

  // Phone OTP Flow State
  const [phoneStep, setPhoneStep] = useState<PhoneStep>('input');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [countdown, setCountdown] = useState(60);
  const otpInputRef = useRef<HTMLInputElement>(null);

  // Email Flow State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Submitting Status
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval: any;
    if (phoneStep === 'otp' && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [phoneStep, countdown]);

  // Focus OTP input on step switch
  useEffect(() => {
    if (phoneStep === 'otp') {
      setTimeout(() => {
        otpInputRef.current?.focus();
      }, 150);
    }
  }, [phoneStep]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isAuthModalOpen) {
      setPhoneStep('input');
      setPhoneNumber('');
      setOtpCode('');
      setCountdown(60);
      setEmail('');
      setPassword('');
      setIsSubmitting(false);
    }
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  // Handle Send OTP
  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault();
    const cleanPhone = phoneNumber.trim();
    if (!cleanPhone) return;

    setIsSubmitting(true);
    try {
      await sendLoginOtp(cleanPhone);
      setPhoneStep('otp');
      setCountdown(60);
    } catch {
      // Toast handled by AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Resend OTP
  const handleResendOtp = async () => {
    if (countdown > 0 || isSubmitting) return;
    const cleanPhone = phoneNumber.trim();
    if (!cleanPhone) return;

    setIsSubmitting(true);
    try {
      await sendLoginOtp(cleanPhone);
      setCountdown(60);
    } catch {
      // Toast handled
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Verify OTP
  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    const cleanCode = otpCode.trim();
    if (cleanCode.length < 6) return;

    setIsSubmitting(true);
    try {
      await verifyLoginOtp({
        phoneNumber: phoneNumber.trim(),
        code: cleanCode,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Email + Password Login
  const handleEmailLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login({ email, password });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="absolute inset-0 bg-black/65 backdrop-blur-sm"
        />

        {/* Modal Window - Noon Inspired Architecture */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-10 w-full max-w-[420px] overflow-hidden rounded-[32px] bg-white shadow-2xl"
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          {/* ================= Noon-Style Yellow Visual Header ================= */}
          <div className="relative h-60 sm:h-64 w-full overflow-hidden bg-[#FED700] select-none">
            {/* Close Button - Floating White Pill */}
            <button
              type="button"
              onClick={closeAuthModal}
              className={`absolute top-3.5 ${isRtl ? 'left-3.5' : 'right-3.5'} z-30 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-md hover:bg-white hover:scale-110 active:scale-95 transition-all`}
              aria-label={t(ui.common.close)}
            >
              <XIcon className="h-4 w-4 stroke-[2.5]" />
            </button>

            {/* Background Decorative Rings & Warm Depth */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-10 -right-10 h-44 w-44 rounded-full bg-yellow-400/40 blur-xs" />
              <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-amber-500/25 blur-xs" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-56 w-56 rounded-full bg-yellow-300/30" />
            </div>

            {/* Floating Cutouts Collage (Aleman Feed Bag & Animals) */}

            {/* Center Main Circle: Official Aleman Poultry Feed Bag */}
            <div className="absolute left-1/2 top-4 -translate-x-1/2 z-20 flex items-center justify-center">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
                className="relative flex items-center justify-center"
              >
                {/* Golden Circle Base */}
                <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-full bg-[#E5BE00] border-2 border-yellow-300/80 shadow-inner" />
                {/* 3D Feed Bag Popping Out */}
                <img
                  src="/aleman_parallax_assets/bag-03-ducks.webp"
                  alt={t(ui.auth.altPoultryBag)}
                  className="absolute -top-3 h-32 sm:h-36 w-auto object-contain drop-shadow-xl -rotate-3"
                />
              </motion.div>
            </div>

            {/* Top Right Circle: Dairy / Livestock Cow */}
            <motion.div
              animate={{ y: [0, -3.5, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
              className="absolute right-3.5 sm:right-5 top-3.5 z-10 flex items-center justify-center"
            >
              <div className="h-20 w-20 sm:h-22 sm:w-22 rounded-full bg-[#E5BE00] border border-yellow-300/70 flex items-center justify-center shadow-inner overflow-hidden p-2">
                <img
                  src="/animal_cow.webp"
                  alt={t(ui.auth.altLivestockCow)}
                  className="max-h-full max-w-full object-contain drop-shadow-md"
                />
              </div>
            </motion.div>

            {/* Top Left Circle: Poultry Broiler / Layer */}
            <motion.div
              animate={{ y: [0, -3.5, 0] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute left-14 sm:left-16 top-3.5 z-10 flex items-center justify-center"
            >
              <div className="h-20 w-20 sm:h-22 sm:w-22 rounded-full bg-[#E5BE00] border border-yellow-300/70 flex items-center justify-center shadow-inner overflow-hidden p-2">
                <img
                  src="/animal_chicken.webp"
                  alt={t(ui.auth.altPoultryChicken)}
                  className="max-h-full max-w-full object-contain drop-shadow-md"
                />
              </div>
            </motion.div>

            {/* Bottom Left Circle: Ducks / Waterfowl */}
            <motion.div
              animate={{ y: [0, -2.5, 0] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
              className="absolute left-3.5 sm:left-5 bottom-3 z-10 flex items-center justify-center"
            >
              <div className="h-18 w-18 sm:h-20 sm:w-20 rounded-full bg-[#E5BE00] border border-yellow-300/70 flex items-center justify-center shadow-inner overflow-hidden p-2">
                <img
                  src="/animal_duck.webp"
                  alt={t(ui.auth.altDuck)}
                  className="max-h-full max-w-full object-contain drop-shadow-sm"
                />
              </div>
            </motion.div>

            {/* Bottom Center Circle: Golden Feed Pellets */}
            <motion.div
              animate={{ y: [0, -2.5, 0] }}
              transition={{ duration: 4.0, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
              className="absolute left-1/2 -translate-x-1/2 bottom-2 z-25 flex items-center justify-center"
            >
              <div className="h-16 w-16 sm:h-18 sm:w-18 rounded-full bg-[#E5BE00] border-2 border-yellow-300/80 flex items-center justify-center shadow-md overflow-hidden p-1">
                <img
                  src="/feed_pellets_3d.webp"
                  alt={t(ui.auth.altFeedPellets)}
                  className="max-h-full max-w-full object-contain drop-shadow-md scale-105"
                />
              </div>
            </motion.div>

            {/* Bottom Right Circle: Rabbit Nutrition */}
            <motion.div
              animate={{ y: [0, -2.5, 0] }}
              transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
              className="absolute right-3.5 sm:right-5 bottom-3 z-10 flex items-center justify-center"
            >
              <div className="h-18 w-18 sm:h-20 sm:w-20 rounded-full bg-[#E5BE00] border border-yellow-300/70 flex items-center justify-center shadow-inner overflow-hidden p-2">
                <img
                  src="/animal_rabbit.webp"
                  alt={t(ui.auth.altRabbit)}
                  className="max-h-full max-w-full object-contain drop-shadow-md"
                />
              </div>
            </motion.div>
          </div>

          {/* ================= Modal Body ================= */}
          <div className="px-6 sm:px-7 pt-5 pb-6">
            {/* Greeting Header */}
            <div className="text-center mb-5">
              <h2 className="text-2xl sm:text-[26px] font-black text-[#112D1C] tracking-tight">
                {t(ui.auth.greetingTitle)}
              </h2>
              <p className="text-xs font-semibold text-slate-500 mt-1">
                {t(ui.auth.greetingSubtitle)}
              </p>
            </div>

            {/* Modern Refined Tab Switcher */}
            <div className="relative mb-5 flex rounded-2xl bg-slate-100/90 p-1 border border-slate-200/80">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('phone');
                  setPhoneStep('input');
                }}
                className={`relative z-10 flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-black transition-all ${authMode === 'phone' ? 'text-brand-900' : 'text-slate-500 hover:text-slate-800'
                  }`}
              >
                <SmartphoneIcon className="h-3.5 w-3.5" />
                <span>{t(ui.auth.phoneTab)}</span>
                {authMode === 'phone' && (
                  <motion.div
                    layoutId="auth-tab-pill"
                    className="absolute inset-0 rounded-xl bg-white shadow-xs border border-slate-200/60"
                    style={{ zIndex: -1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </button>

              <button
                type="button"
                onClick={() => setAuthMode('email')}
                className={`relative z-10 flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-black transition-all ${authMode === 'email' ? 'text-brand-900' : 'text-slate-500 hover:text-slate-800'
                  }`}
              >
                <MailIcon className="h-3.5 w-3.5" />
                <span>{t(ui.auth.emailTab)}</span>
                {authMode === 'email' && (
                  <motion.div
                    layoutId="auth-tab-pill"
                    className="absolute inset-0 rounded-xl bg-white shadow-xs border border-slate-200/60"
                    style={{ zIndex: -1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </button>
            </div>

            {/* Tab Form Views */}
            <AnimatePresence mode="wait">
              {authMode === 'phone' ? (
                /* ================= Phone Mode ================= */
                <motion.div
                  key={phoneStep}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                >
                  {phoneStep === 'input' ? (
                    /* Step 1: Input Phone */
                    <form onSubmit={handleSendOtp} className="space-y-4">
                      <div className="relative">
                        <input
                          type="tel"
                          required
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder={t(ui.auth.phoneInputPlaceholder)}
                          dir={isRtl ? 'rtl' : 'ltr'}
                          className={`w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3.5 ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none transition shadow-2xs`}
                        />
                        <div className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-3.5' : 'left-3.5'} text-slate-400 pointer-events-none`}>
                          <SmartphoneIcon className="h-4 w-4" />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting || !phoneNumber.trim()}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-700 to-brand-600 hover:from-brand-600 hover:to-brand-500 active:scale-[0.99] disabled:opacity-50 text-white font-black text-sm shadow-md shadow-brand-900/20 transition-all mt-3 cursor-pointer"
                      >
                        {isSubmitting ? t(ui.auth.sendingOtp) : t(ui.auth.continueBtn)}
                      </button>
                    </form>
                  ) : (
                    /* Step 2: Input OTP */
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                      <div className="rounded-xl bg-brand-50/80 p-3 border border-brand-100 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-slate-500">{t(ui.auth.otpSentTo)} </span>
                          <span className="font-bold text-brand-900 dir-ltr inline-block mx-1">{phoneNumber}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPhoneStep('input')}
                          className="font-bold text-brand-700 hover:underline cursor-pointer"
                        >
                          {t(ui.auth.editPhoneBtn)}
                        </button>
                      </div>

                      <div>
                        <input
                          ref={otpInputRef}
                          type="text"
                          required
                          maxLength={6}
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                          placeholder="------"
                          dir="ltr"
                          className="w-full tracking-[0.55em] text-center text-2xl font-black rounded-xl border border-slate-200 bg-slate-50/70 py-3.5 text-ink placeholder:text-slate-300 focus:border-brand-600 focus:bg-white focus:outline-none transition shadow-2xs"
                        />
                      </div>

                      {/* Resend OTP Timer & Button */}
                      <div className="flex items-center justify-between text-xs pt-0.5">
                        {countdown > 0 ? (
                          <span className="text-slate-400 font-medium">
                            {t(ui.auth.resendCountdown).replace('{count}', String(countdown))}
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleResendOtp}
                            disabled={isSubmitting}
                            className="inline-flex items-center gap-1.5 font-bold text-brand-700 hover:underline cursor-pointer"
                          >
                            <RefreshCwIcon className={`h-3.5 w-3.5 ${isSubmitting ? 'animate-spin' : ''}`} />
                            <span>{t(ui.auth.resendCode)}</span>
                          </button>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting || otpCode.trim().length < 6}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-700 to-brand-600 hover:from-brand-600 hover:to-brand-500 active:scale-[0.99] disabled:opacity-50 text-white font-black text-sm shadow-md shadow-brand-900/20 transition-all mt-3 cursor-pointer"
                      >
                        {isSubmitting ? t(ui.auth.verifyingOtp) : t(ui.auth.confirmAndEnter)}
                      </button>
                    </form>
                  )}
                </motion.div>
              ) : (
                /* ================= Email Mode ================= */
                <motion.form
                  key="email-form"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  onSubmit={handleEmailLogin}
                  className="space-y-3.5"
                >
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t(ui.auth.emailPlaceholder)}
                      dir={isRtl ? 'rtl' : 'ltr'}
                      className={`w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3.5 ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none transition shadow-2xs`}
                    />
                    <div className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-3.5' : 'left-3.5'} text-slate-400 pointer-events-none`}>
                      <MailIcon className="h-4 w-4" />
                    </div>
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t(ui.auth.passwordPlaceholder)}
                      dir={isRtl ? 'rtl' : 'ltr'}
                      className={`w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3.5 ${isRtl ? 'pr-4 pl-10' : 'pl-4 pr-10'} text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none transition shadow-2xs`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'left-3.5' : 'right-3.5'} text-slate-400 hover:text-slate-600 p-1 cursor-pointer`}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !email || !password}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-700 to-brand-600 hover:from-brand-600 hover:to-brand-500 active:scale-[0.99] disabled:opacity-50 text-white font-black text-sm shadow-md shadow-brand-900/20 transition-all mt-3 cursor-pointer"
                  >
                    {isSubmitting ? t(ui.auth.processing) : t(ui.auth.continueBtn)}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

