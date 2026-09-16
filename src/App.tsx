import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { LanguageProvider, useLang } from './i18n/LanguageContext';
import { AuthProvider } from './features/auth/AuthContext';
import { CartProvider } from './features/cart/CartContext';
import { CartDrawer } from './features/cart/CartDrawer';
import { AuthModal } from './features/auth/AuthModal';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { FloatingContact } from './components/layout/FloatingContact';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Quality } from './pages/Quality';
import { Products } from './pages/Products';
import { ProductDetail } from './pages/ProductDetail';
import { Checkout } from './pages/Checkout';
import { OrderSuccess } from './pages/OrderSuccess';
import { Articles } from './pages/Articles';
import { ArticleDetail } from './pages/ArticleDetail';
import { Careers } from './pages/Careers';
import { Tools } from './pages/Tools';
import { FeedPrices } from './pages/FeedPrices';
import { Distributors } from './pages/Distributors';
import { Contact } from './pages/Contact';
import { Profile } from './pages/Profile';

function Shell() {
  const { dir } = useLang();
  const location = useLocation();
  const hasDarkHero = location.pathname === '/' || location.pathname === '/about';

  useEffect(() => {
    if (hasDarkHero) {
      document.documentElement.classList.add('is-home');
    } else {
      document.documentElement.classList.remove('is-home');
    }
    return () => {
      document.documentElement.classList.remove('is-home');
    };
  }, [hasDarkHero]);

  return (
    <div dir={dir} className="relative flex min-h-screen w-full flex-col bg-canvas overflow-x-hidden">
      <Navbar />
      <CartDrawer />
      <AuthModal />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/quality" element={<Quality />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success/:orderNumber" element={<OrderSuccess />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:slug" element={<ArticleDetail />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/prices" element={<FeedPrices />} />
          {/* <Route path="/distributors" element={<Distributors />} /> */}
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
      <FloatingContact />
      <Toaster position="top-center" richColors closeButton />
    </div>
  );
}

export function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Shell />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}