import React from 'react';

export function Skeleton({ className = '' }: {className?: string;}) {
  return <div className={`animate-pulse rounded-xl bg-slate-200/70 ${className}`} aria-hidden="true" />;
}

export function CardSkeleton() {
  return (
    <div className="rounded-card border border-slate-100 bg-white p-4 shadow-card">
      <Skeleton className="h-44 w-full" />
      <Skeleton className="mt-4 h-4 w-24" />
      <Skeleton className="mt-3 h-5 w-3/4" />
      <Skeleton className="mt-3 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-2/3" />
      <Skeleton className="mt-5 h-10 w-full" />
    </div>);

}

export function CardSkeletonGrid({ count = 6 }: {count?: number;}) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
      {Array.from({ length: count }).map((_, i) =>
      <CardSkeleton key={i} />
      )}
    </div>);

}