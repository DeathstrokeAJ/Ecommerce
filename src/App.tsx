import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LoginForm } from './components/LoginForm';
import { SignupForm } from './components/SignupForm';
import { ProductList } from './components/ProductList';
import { Cart } from './components/Cart';
import { getToken, getUser } from './utils/auth';
import { getLocalCart } from './utils/cart';
import { cartAPI } from './services/api';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [isLogin, setIsLogin] = useState(true);
  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    const token = getToken();
    const user = getUser();
    
    if (token && user) {
      setCurrentPage('products');
    }
    
    updateCartCount();
  }, []);

  const updateCartCount = async () => {
    try {
      const isAuthenticated = !!getToken();
      
      if (isAuthenticated) {
        const cartData = await cartAPI.get();
        const totalItems = cartData.reduce((sum: number, item: any) => sum + item.quantity, 0);
        setCartItemsCount(totalItems);
      } else {
        const localCart = getLocalCart();
        const totalItems = localCart.reduce((sum, item) => sum + item.quantity, 0);
        setCartItemsCount(totalItems);
      }
    } catch (error) {
      console.error('Error updating cart count:', error);
    }
  };

  const handleAuthSuccess = () => {
    setCurrentPage('products');
    updateCartCount();
  };

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    if (page === 'login') {
      setCartItemsCount(0);
    }
  };

  const renderPage = () => {
    if (currentPage === 'login') {
      return isLogin ? (
        <LoginForm
          onSuccess={handleAuthSuccess}
          onToggleMode={() => setIsLogin(false)}
        />
      ) : (
        <SignupForm
          onSuccess={handleAuthSuccess}
          onToggleMode={() => setIsLogin(true)}
        />
      );
    }

    if (currentPage === 'products') {
      return <ProductList onCartUpdate={updateCartCount} />;
    }

    if (currentPage === 'cart') {
      return <Cart onCartUpdate={updateCartCount} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage !== 'login' && (
        <Header
          currentPage={currentPage}
          onPageChange={handlePageChange}
          cartItemsCount={cartItemsCount}
        />
      )}
      
      <main className={currentPage === 'login' ? 'flex items-center justify-center min-h-screen' : ''}>
        {renderPage()}
      </main>
    </div>
  );
}

export default App;