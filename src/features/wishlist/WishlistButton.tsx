import { memo } from 'react';
import { HeartIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWishlist } from './WishlistContext';
import { useLang } from '../../i18n/LanguageContext';
import { ui } from '../../i18n/ui';

export interface WishlistButtonProps {
  productId: number;
  productName: string;
  size?: 'sm' | 'md' | 'lg' | 'card';
  variant?: 'floating' | 'action';
  className?: string;
  stopPropagation?: boolean;
}

export const WishlistButton = memo(function WishlistButton({
  productId,
  productName,
  size = 'card',
  variant = 'action',
  className = '',
  stopPropagation = true,
}: WishlistButtonProps) {
  const { toggle, isWishlisted } = useWishlist();
  const { t } = useLang();
  const wishlisted = isWishlisted(productId);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (stopPropagation) {
      e.preventDefault();
      e.stopPropagation();
    }
    toggle(productId, productName);
  };

  const label = wishlisted ? t(ui.wishlist.removeItem) : t(ui.wishlist.title);

  // Sizing variants (using standard Tailwind sizes to guarantee exact rendering)
  const sizeClasses = {
    card: 'h-12 w-12 rounded-2xl shrink-0',
    lg: 'h-14 w-14 rounded-2xl shrink-0',
    md: 'h-11 w-11 rounded-2xl shrink-0',
    sm: 'h-10 w-10 rounded-xl shrink-0',
  }[size];

  const iconSizes = {
    card: 'h-5.5 w-5.5',
    lg: 'h-6 w-6',
    md: 'h-5 w-5',
    sm: 'h-4.5 w-4.5',
  }[size];

  // Visual variants
  let variantClasses = '';
  if (variant === 'floating') {
    variantClasses = wishlisted
      ? 'bg-rose-50/95 backdrop-blur-md border border-rose-200/90 text-rose-500 shadow-xs hover:bg-rose-100/90 hover:border-rose-300 hover:text-rose-600'
      : 'bg-white/85 backdrop-blur-md border border-slate-200/70 text-slate-400 shadow-xs hover:bg-white hover:text-rose-500 hover:border-rose-200/90 hover:shadow-sm';
  } else {
    // Action button variant matching card control aesthetics
    variantClasses = wishlisted
      ? 'border border-slate-200 bg-white text-rose-500 hover:border-slate-300 hover:bg-rose-50/40 shadow-2xs'
      : 'border border-slate-200 bg-white text-slate-400 hover:text-rose-500 hover:border-slate-300 hover:bg-slate-50/80 shadow-2xs';
  }

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      title={label}
      aria-label={label}
      className={`group/wish relative flex items-center justify-center transition-all cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 ${sizeClasses} ${variantClasses} ${className}`}
    >
      <motion.div
        animate={wishlisted ? { scale: [1, 1.25, 1] } : { scale: 1 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
        className="flex items-center justify-center"
      >
        <HeartIcon
          className={`${iconSizes} transition-all duration-200 ${
            wishlisted
              ? 'fill-rose-500 text-rose-500 stroke-rose-500'
              : 'fill-transparent text-slate-400 group-hover/wish:text-rose-500 group-hover/wish:fill-rose-50/50'
          }`}
          strokeWidth={wishlisted ? 0 : 2}
        />
      </motion.div>
    </motion.button>
  );
});
