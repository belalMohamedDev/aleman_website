import { Hero } from '../components/home/Hero';
import { ProductCategories } from '../components/home/ProductCategories';
import { TrustMetrics } from '../components/home/TrustMetrics';
import { QualityProcess } from '../components/home/QualityProcess';
import { TrustQualityBridge } from '../components/home/TrustQualityBridge';
import { FeaturedProducts } from '../components/home/FeaturedProducts';
// import { ArticlesPreview } from '../components/home/ArticlesPreview';
// import { ContactCTA } from '../components/home/ContactCTA';

export function Home() {
  return (
    <div className="relative overflow-hidden">
      <Hero />
      <div className="relative z-10 -mt-4 sm:-mt-6">
        <ProductCategories />
      </div>
      {/* Connected Continuous Trust & Quality Journey */}
      <div className="relative">
        <TrustMetrics />
        {/* <AboutPreview /> */}
        <QualityProcess />
        <TrustQualityBridge />
      </div>
      {/* <FeaturedProducts /> */}
      {/* <ArticlesPreview /> */}
      {/* <ContactCTA /> */}
    </div>
  );
}