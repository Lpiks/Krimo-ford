import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ClientLayout from './pages/ClientLayout';
import AdminLayout from './pages/AdminLayout';
import HomePage from './pages/client/HomePage';
import CatalogPage from './pages/client/CatalogPage';
import CartPage from './pages/client/CartPage';

import CheckoutPage from './pages/client/CheckoutPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import InventoryManager from './pages/admin/InventoryManager';
import ProductFormPage from './pages/admin/ProductFormPage';
import OrderManager from './pages/admin/OrderManager';
import AdminOrderDetailsPage from './pages/admin/AdminOrderDetailsPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';

import { useTranslation } from 'react-i18next';

import { Toaster } from 'react-hot-toast';

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.body.dir = i18n.dir();
  }, [i18n.language]);

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Client Routes */}
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<HomePage />} />
          <Route path="catalog" element={<CatalogPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
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
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
