import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Admin/Dashboard';
import authService from './api/authService';
import toast from 'react-hot-toast';

function App() {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('sexshop_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('sexshop_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast.success(`${product.name} añadido al carrito`);
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = (item.quantity || 1) + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
    toast.error('Producto eliminado del carrito');
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <Router>
      <Toaster position="top-right" />
      <Navbar
        user={user}
        logout={handleLogout}
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
      />
      <main style={{ minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={authService.isAdmin() ? <Navigate to="/admin" /> : <Home addToCart={addToCart} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={authService.isAdmin() ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <footer className="py-5 mt-5 border-top border-secondary text-center text-muted small">
        <p>© 2024 SexShop Premium. Todos los derechos reservados.</p>
      </footer>
    </Router>
  );
}

export default App;
