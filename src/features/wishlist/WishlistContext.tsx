import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { wishlistService } from './wishlistService';
import { useAuth } from '../auth/AuthContext';
import { toast } from 'sonner';

interface WishlistContextValue {
  /** Set of product IDs currently in the wishlist */
  wishlistIds: Set<number>;
  /** Total count */
  count: number;
  isLoading: boolean;
  /** Toggle a product — adds if not present, removes if present */
  toggle: (productId: number, productName?: string) => Promise<void>;
  /** True if the given productId is in the wishlist */
  isWishlisted: (productId: number) => boolean;
  /** Clear entire wishlist */
  clear: () => Promise<void>;
  /** Refresh from server */
  refresh: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within a WishlistProvider');
  return ctx;
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [wishlistIds, setWishlistIds] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlistIds(new Set());
      return;
    }
    try {
      setIsLoading(true);
      const ids = await wishlistService.getIds();
      setWishlistIds(new Set(ids));
    } catch {
      // silently fail — wishlist is non-critical
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const toggle = useCallback(
    async (productId: number, productName?: string) => {
      if (!isAuthenticated) {
        toast.info('يرجى تسجيل الدخول أولاً لإضافة المنتجات إلى المفضلة');
        return;
      }

      // Optimistic update
      const wasWishlisted = wishlistIds.has(productId);
      setWishlistIds((prev) => {
        const next = new Set(prev);
        if (wasWishlisted) next.delete(productId);
        else next.add(productId);
        return next;
      });

      try {
        await wishlistService.toggle(productId);
        if (wasWishlisted) {
          toast.info(productName ? `تمت إزالة "${productName}" من المفضلة` : 'تمت الإزالة من المفضلة');
        } else {
          toast.success(productName ? `تمت إضافة "${productName}" إلى المفضلة ❤️` : 'تمت الإضافة إلى المفضلة');
        }
      } catch (err: any) {
        // Rollback on failure
        setWishlistIds((prev) => {
          const next = new Set(prev);
          if (wasWishlisted) next.add(productId);
          else next.delete(productId);
          return next;
        });
        toast.error(err?.message || 'تعذر تحديث المفضلة');
      }
    },
    [isAuthenticated, wishlistIds]
  );

  const isWishlisted = useCallback(
    (productId: number) => wishlistIds.has(productId),
    [wishlistIds]
  );

  const clear = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      await wishlistService.clear();
      setWishlistIds(new Set());
      toast.info('تم تفريغ قائمة المفضلة بالكامل');
    } catch (err: any) {
      toast.error(err?.message || 'تعذر مسح المفضلة');
    }
  }, [isAuthenticated]);

  const value: WishlistContextValue = {
    wishlistIds,
    count: wishlistIds.size,
    isLoading,
    toggle,
    isWishlisted,
    clear,
    refresh,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}
