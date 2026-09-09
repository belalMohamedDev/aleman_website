import { motion, AnimatePresence } from 'framer-motion';
import { LOGO_URL } from '../../data/navigation';
import { useLang } from '../../i18n/LanguageContext';
import { ui } from '../../i18n/ui';

interface SplashScreenProps {
  isLoading: boolean;
}

export function SplashScreen({ isLoading }: SplashScreenProps) {
  const { t } = useLang();
  
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-brand-950 overflow-hidden"
        >
          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-800/40 via-brand-950 to-brand-950" />

          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center gap-8"
          >
            {/* Logo wrapper with pulsing rings */}
            <div className="relative">
              <motion.img 
                src={LOGO_URL} 
                alt="Aleman Foundation" 
                className="relative z-10 h-28 w-28 rounded-2xl bg-white p-2 shadow-[0_0_40px_rgba(255,255,255,0.1)]"
                animate={{ 
                  y: [0, -8, 0],
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2.5,
                  ease: "easeInOut" 
                }}
              />
              
              {/* Outer pulsing ring */}
              <motion.div
                className="absolute -inset-6 rounded-[2rem] border border-gold-500/20"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0, 0.5]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2.5,
                  ease: "easeInOut" 
                }}
              />
              
              {/* Inner pulsing ring */}
              <motion.div
                className="absolute -inset-2 rounded-[1.5rem] border-2 border-gold-400/40"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.8, 0, 0.8]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2.5,
                  ease: "easeInOut",
                  delay: 0.2
                }}
              />
            </div>
            
            <div className="flex flex-col items-center gap-3 text-center">
              <h1 className="text-3xl font-extrabold tracking-wide text-white drop-shadow-md">{t(ui.brand.name)}</h1>
              <p className="text-sm font-bold text-gold-300 tracking-wider uppercase">{t(ui.brand.tagline)}</p>
            </div>
            
            {/* Loading dots */}
            <div className="mt-4 flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="h-2 w-2 rounded-full bg-gold-400"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.2,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
