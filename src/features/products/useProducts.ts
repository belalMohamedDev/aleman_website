import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from './productService';
import type { Category, Product } from './types';

const SLUG_TO_KEYWORDS: Record<string, string[]> = {
  poultry: ['دواجن', 'داجن', 'فراخ', 'دجاج', 'بياض', 'تسمين', 'poultry'],
  livestock: ['ماشية', 'مواشي', 'ابقار', 'أبقار', 'حلاب', 'عجول', 'livestock', 'cattle'],
  rabbit: ['ارانب', 'أرانب', 'ارنب', 'أرنب', 'rabbit'],
  duck: ['بط', 'بطة', 'duck'],
};

export function useProducts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategoryId, setSelectedCategoryIdState] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [cats, prods] = await Promise.all([
        productService.getCategories(),
        productService.getProducts(),
      ]);
      setCategories(cats.filter((c) => c.isActive !== false));
      setProducts(prods.filter((p) => p.isActive !== false));
    } catch (err: any) {
      setError(err?.message || 'تعذر تحميل المنتجات من السيرفر');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Synchronize category with URL param whenever categories are loaded or categoryParam changes
  useEffect(() => {
    if (!categoryParam) {
      setSelectedCategoryIdState('all');
      return;
    }

    if (categories.length === 0) return;

    // 1. Direct numeric ID match
    const byId = categories.find((c) => String(c.id) === categoryParam);
    if (byId) {
      setSelectedCategoryIdState(byId.id);
      return;
    }

    // 2. Slug keywords match
    const paramLower = categoryParam.toLowerCase().trim();
    const keywords = SLUG_TO_KEYWORDS[paramLower] || [paramLower];

    const matched = categories.find((c) => {
      const name = c.name.toLowerCase();
      return keywords.some((kw) => name.includes(kw));
    });

    if (matched) {
      setSelectedCategoryIdState(matched.id);
    } else {
      setSelectedCategoryIdState('all');
    }
  }, [categoryParam, categories]);

  const setSelectedCategoryId = useCallback(
    (id: number | 'all') => {
      setSelectedCategoryIdState(id);
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (id === 'all') {
            next.delete('category');
          } else {
            next.set('category', String(id));
          }
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategoryId === 'all' || product.categoryId === selectedCategoryId;

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        (product.description && product.description.toLowerCase().includes(query)) ||
        (product.ingredients && product.ingredients.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategoryId, searchQuery]);

  return {
    categories,
    products: filteredProducts,
    allProducts: products,
    selectedCategoryId,
    setSelectedCategoryId,
    searchQuery,
    setSearchQuery,
    isLoading,
    error,
    reload: fetchData,
  };
}

export function useProductDetail(id: number) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setError(null);

    productService.getProductById(id)
      .then((data) => {
        if (mounted) setProduct(data);
      })
      .catch((err) => {
        if (mounted) setError(err?.message || 'تعذر تحميل بيانات المنتج');
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  return { product, isLoading, error };
}
