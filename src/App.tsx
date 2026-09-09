import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { LanguageProvider, useLang } from './i18n/LanguageContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { FloatingContact } from './components/layout/FloatingContact';
import { ParallaxAnimals } from './components/shared/ParallaxAnimals';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Quality } from './pages/Quality';
import { Products } from './pages/Products';
import { ProductDetail } from './pages/ProductDetail';
import { Articles } from './pages/Articles';
import { ArticleDetail } from './pages/ArticleDetail';
import { Careers } from './pages/Careers';
import { Tools } from './pages/Tools';
import { FeedPrices } from './pages/FeedPrices';
import { Distributors } from './pages/Distributors';
import { Contact } from './pages/Contact';

function Shell() {
  const { dir } = useLang();

  return (
    <div dir={dir} className="relative flex min-h-screen w-full flex-col bg-canvas overflow-x-hidden">
      <ParallaxAnimals />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/quality" element={<Quality />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:slug" element={<ArticleDetail />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/prices" element={<FeedPrices />} />
          <Route path="/distributors" element={<Distributors />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
      <FloatingContact />
      <Toaster position="top-center" richColors closeButton />
    </div>);

}

export function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Shell />
      </BrowserRouter>
    </LanguageProvider>);

}