import { createContext, useContext, useState, useEffect, useMemo, useCallback, type ReactNode } from 'react';
import { cartService } from './cartService';
import { useAuth } from '../auth/AuthContext';
import type { CartItem, CartSummary } from './types';
import type { Product, ProductPackage } from '../products/types';
import { toast } from 'sonner';

interface CartContextValue extends CartSummary {
  isCartOpen: boolean;
  isLoading: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, pkg: ProductPackage, quantity: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }
    try {
      setIsLoading(true);
      const summary = await cartService.getBackendCart();
      setItems(summary.items);
    } catch (err: any) {
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const summary = useMemo(() => cartService.calculateSummary(items), [items]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const addItem = useCallback(
    async (product: Product, pkg: ProductPackage, quantity: number) => {
      if (quantity <= 0) return;

      if (!isAuthenticated) {
        toast.info('يرجى تسجيل الدخول أولاً لإضافة منتجات إلى السلة');
        return;
      }

      try {
        const updatedSummary = await cartService.addItemToBackend(product, pkg, quantity);
        setItems(updatedSummary.items);
        toast.success(`تمت إضافة ${quantity} شكارة من ${product.name} إلى السلة`);
      } catch (err: any) {
        toast.error(err?.message || 'تعذر إضافة المنتج إلى السلة');
      }
    },
    [isAuthenticated]
  );

  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      if (quantity <= 0) {
        try {
          await cartService.removeItemFromBackend(itemId);
          setItems((prev) => prev.filter((i) => i.id !== itemId));
        } catch (err: any) {
          toast.error(err?.message || 'تعذر حذف المنتج');
        }
        return;
      }

      try {
        const updatedSummary = await cartService.updateQuantityInBackend(itemId, quantity);
        setItems(updatedSummary.items);
      } catch (err: any) {
        toast.error(err?.message || 'تعذر تحديث الكمية');
      }
    },
    []
  );

  const removeItem = useCallback(async (itemId: string) => {
    try {
      await cartService.removeItemFromBackend(itemId);
      setItems((prev) => prev.filter((i) => i.id !== itemId));
      toast.info('تمت إزالة المنتج من السلة');
    } catch (err: any) {
      toast.error(err?.message || 'تعذر حذف المنتج من السلة');
    }
  }, []);

  const clearCart = useCallback(async () => {
    try {
      await cartService.clearBackendCart();
      setItems([]);
      toast.info('تم تفريغ سلة المشتريات بنجاح');
    } catch (err: any) {
      toast.error(err?.message || 'تعذر إفراغ السلة');
    }
  }, []);

  const value: CartContextValue = {
    ...summary,
    isCartOpen,
    isLoading,
    openCart,
    closeCart,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
