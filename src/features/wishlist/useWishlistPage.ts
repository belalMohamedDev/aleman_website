import { useState, useEffect, useMemo, useCallback } from 'react';
import { wishlistService } from './wishlistService';
import { productService } from '../products/productService';
import { useWishlist } from './WishlistContext';
import { useAuth } from '../auth/AuthContext';
import type { Product, Category } from '../products/types';

export function useWishlistPage() {
  const { wishlistIds, clear } = useWishlist();
  const { isAuthenticated } = useAuth();

  const [rawProducts, setRawProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      setRawProducts([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const [wishlistItems, allProducts, allCategories] = await Promise.all([
        wishlistService.getWishlist(),
        productService.getProducts(),
        productService.getCategories(),
      ]);

      const productsMap = new Map<number, Product>(allProducts.map((p) => [p.id, p]));
      const resolved: Product[] = wishlistItems.map((item) => {
        const found = productsMap.get(item.productId);
        if (found) return found;
        return {
          id: item.productId,
          categoryId: item.categoryId,
          name: item.productName,
          description: '',
          imageUrl: item.productImageUrl,
          isActive: item.isActive,
          packages: item.minPrice
            ? [
                {
                  id: 0,
                  productId: item.productId,
                  weightKg: 25,
                  price: item.minPrice,
                  pricePerTon: item.minPrice * 40,
                  isActive: true,
                },
              ]
            : [],
        };
      });

      setRawProducts(resolved);
      setCategories(allCategories.filter((c) => c.isActive !== false));
    } catch (err: any) {
      setError(err?.message || 'تعذر تحميل قائمة المفضلة');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  // Keep in sync with wishlistIds from context
  const currentWishlistProducts = useMemo(() => {
    return rawProducts.filter((p) => wishlistIds.has(p.id));
  }, [rawProducts, wishlistIds]);

  // Filter by category & search query
  const filteredProducts = useMemo(() => {
    return currentWishlistProducts.filter((product) => {
      const matchesCategory =
        selectedCategoryId === 'all' || product.categoryId === selectedCategoryId;

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        (product.description && product.description.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [currentWishlistProducts, selectedCategoryId, searchQuery]);

  // Categories of the products currently in the wishlist
  const availableCategories = useMemo(() => {
    const usedCategoryIds = new Set(currentWishlistProducts.map((p) => p.categoryId));
    return categories.filter((c) => usedCategoryIds.has(c.id));
  }, [categories, currentWishlistProducts]);

  const handleClear = useCallback(async () => {
    setRawProducts([]);
    await clear();
  }, [clear]);

  return {
    wishlistProducts: currentWishlistProducts,
    products: filteredProducts,
    categories: availableCategories,
    allCategories: categories,
    selectedCategoryId,
    setSelectedCategoryId,
    searchQuery,
    setSearchQuery,
    isLoading,
    error,
    reload: fetch,
    handleClear,
  };
}
