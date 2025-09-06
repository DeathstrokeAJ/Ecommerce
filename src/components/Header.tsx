import React from 'react';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { getUser, logout } from '../utils/auth';

interface HeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  cartItemsCount: number;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onPageChange, cartItemsCount }) => {
  const user = getUser();

  const handleLogout = () => {
    logout();
    onPageChange('login');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-gray-900">E-Shop</h1>
            <nav className="flex space-x-6">
              <button
                onClick={() => onPageChange('products')}
                className={`px-3 py-2 rounded-md ${
                  currentPage === 'products'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Products
              </button>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onPageChange('cart')}
              className="relative p-2 text-gray-700 hover:text-blue-600"
            >
              <ShoppingCart size={24} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>
            
            <div className="flex items-center space-x-2">
              <User size={20} className="text-gray-700" />
              <span className="text-gray-700">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-700 hover:text-red-600"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};