import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Toaster } from 'react-hot-toast';

// Layouts
import ClientLayout from './pages/ClientLayout';
import AdminLayout from './pages/AdminLayout';

// Lazy Load Pages
const HomePage = lazy(() => import('./pages/client/HomePage'));
const CatalogPage = lazy(() => import('./pages/client/CatalogPage'));
const ContactPage = lazy(() => import('./pages/client/ContactPage'));
const CartPage = lazy(() => import('./pages/client/CartPage'));
const CheckoutPage = lazy(() => import('./pages/client/CheckoutPage'));
const ProductDetailPage = lazy(() => import('./pages/client/ProductDetailPage'));

const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const InventoryManager = lazy(() => import('./pages/admin/InventoryManager'));
const ProductFormPage = lazy(() => import('./pages/admin/ProductFormPage'));
const OrderManager = lazy(() => import('./pages/admin/OrderManager'));
const AdminOrderDetailsPage = lazy(() => import('./pages/admin/AdminOrderDetailsPage'));
const AdminInboxPage = lazy(() => import('./pages/admin/AdminInboxPage'));
const CategoryManager = lazy(() => import('./pages/admin/CategoryManager'));
const CarModelManager = lazy(() => import('./pages/admin/CarModelManager'));

// Loading Component
const LoadingFallback = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--ford-blue)' }}>
    Loading...
  </div>
);

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.body.dir = i18n.dir();
  }, [i18n.language]);

  return (
    <Router>
      <Toaster position="top-right" />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Client Routes */}
          <Route path="/" element={<ClientLayout />}>
            <Route index element={<HomePage />} />
            <Route path="catalog" element={<CatalogPage />} />
            <Route path="product/:id" element={<ProductDetailPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="contact" element={<ContactPage />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<InventoryManager />} />
            <Route path="product/new" element={<ProductFormPage />} />
            <Route path="product/:id/edit" element={<ProductFormPage />} />
            <Route path="orders" element={<OrderManager />} />
            <Route path="orders/:id" element={<AdminOrderDetailsPage />} />
            <Route path="inbox" element={<AdminInboxPage />} />
            <Route path="categories" element={<CategoryManager />} />
            <Route path="carmodels" element={<CarModelManager />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
