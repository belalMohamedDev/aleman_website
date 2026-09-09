import React from 'react';
import type { Product } from '../../types/content';
import { ProductCard } from './ProductCard';
import { CardSkeletonGrid } from '../shared/Skeleton';
import { EmptyState } from '../shared/EmptyState';
import { useLang } from '../../i18n/LanguageContext';
import { ui } from '../../i18n/ui';

type ProductGridProps = {
  products: Product[];
  loading?: boolean;
  onReset?: () => void;
};

export function ProductGrid({ products, loading = false, onReset }: ProductGridProps) {
  const { t } = useLang();

  if (loading) return <CardSkeletonGrid count={6} />;

  if (products.length === 0) {
    return (
      <EmptyState
        title={t(ui.common.noResultsTitle)}
        body={t(ui.common.noResultsBody)}
        actionLabel={onReset ? t(ui.common.reset) : undefined}
        onAction={onReset} />);


  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product, index) =>
      <ProductCard key={product.slug} product={product} index={index} />
      )}
    </div>);

}