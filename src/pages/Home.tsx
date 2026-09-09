import React from 'react';
import { Hero } from '../components/home/Hero';
import { ProductCategories } from '../components/home/ProductCategories';
import { TrustMetrics } from '../components/home/TrustMetrics';
import { AboutPreview } from '../components/home/AboutPreview';
import { QualityProcess } from '../components/home/QualityProcess';
import { FeaturedProducts } from '../components/home/FeaturedProducts';
import { ArticlesPreview } from '../components/home/ArticlesPreview';
import { ContactCTA } from '../components/home/ContactCTA';

export function Home() {
  return (
    <>
      <Hero />
      <div className="pt-10">
        <ProductCategories />
      </div>
      <TrustMetrics />
      <AboutPreview />
      <QualityProcess />
      <FeaturedProducts />
      <ArticlesPreview />
      <ContactCTA />
    </>);

}