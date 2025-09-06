import React, { useState, useEffect } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem, Item } from '../types';
import { cartAPI, itemsAPI } from '../services/api';
import { getLocalCart, updateLocalCartItem, removeFromLocalCart } from '../utils/cart';
import { getToken } from '../utils/auth';

interface CartProps {
  onCartUpdate: () => void;
}

export const Cart: React.FC<CartProps> = ({ onCartUpdate }) => {
  const [cartItems, setCartItems] = useState<(CartItem & { item: Item })[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const isAuthenticated = !!getToken();
      
      if (isAuthenticated) {
        const cartData = await cartAPI.get();
        const itemsData = await itemsAPI.getAll();
        
        const enrichedCart = cartData.map((cartItem: CartItem) => {
          const item = itemsData.find((item: Item) => item.id === cartItem.itemId);
          return { ...cartItem, item };
        }).filter((item: any) => item.item);
        
        setCartItems(enrichedCart);
      } else {
        const localCart = getLocalCart();
        const itemsData = await itemsAPI.getAll();
        
        const enrichedCart = localCart.map(cartItem => {
          const item = itemsData.find((item: Item) => item.id === cartItem.itemId);
          return {
            id: cartItem.itemId,
            userId: '',
            itemId: cartItem.itemId,
            quantity: cartItem.quantity,
            item
          };
        }).filter((item: any) => item.item);
        
        setCartItems(enrichedCart);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    try {
      const isAuthenticated = !!getToken();
      
      if (isAuthenticated) {
        const cartItem = cartItems.find(item => item.itemId === itemId);
        if (cartItem) {
          await cartAPI.update(cartItem.id, newQuantity);
        }
      } else {
        updateLocalCartItem(itemId, newQuantity);
      }
      
      await fetchCartItems();
      onCartUpdate();
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      const isAuthenticated = !!getToken();
      
      if (isAuthenticated) {
        const cartItem = cartItems.find(item => item.itemId === itemId);
        if (cartItem) {
          await cartAPI.remove(cartItem.id);
        }
      } else {
        removeFromLocalCart(itemId);
      }
      
      await fetchCartItems();
      onCartUpdate();
    } catch (error) {
      console.error('Error removing cart item:', error);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.item.price * item.quantity), 0).toFixed(2);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading cart...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center text-gray-500 mt-12">
          <p className="text-xl">Your cart is empty</p>
          <p>Add some products to get started</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md">
            {cartItems.map((cartItem, index) => (
              <div key={cartItem.id} className={`p-6 ${index !== cartItems.length - 1 ? 'border-b border-gray-200' : ''}`}>
                <div className="flex items-center space-x-4">
                  <img
                    src={cartItem.item.image || `https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg?auto=compress&cs=tinysrgb&w=150`}
                    alt={cartItem.item.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{cartItem.item.name}</h3>
                    <p className="text-gray-600 text-sm">{cartItem.item.description}</p>
                    <p className="text-lg font-bold text-blue-600">${cartItem.item.price}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(cartItem.itemId, cartItem.quantity - 1)}
                      className="p-1 rounded-md border border-gray-300 hover:bg-gray-50"
                    >
                      <Minus size={16} />
                    </button>
                    
                    <span className="w-12 text-center font-semibold">{cartItem.quantity}</span>
                    
                    <button
                      onClick={() => handleQuantityChange(cartItem.itemId, cartItem.quantity + 1)}
                      className="p-1 rounded-md border border-gray-300 hover:bg-gray-50"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold">${(cartItem.item.price * cartItem.quantity).toFixed(2)}</p>
                    <button
                      onClick={() => handleRemoveItem(cartItem.itemId)}
                      className="text-red-500 hover:text-red-700 mt-2"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total Items: {getTotalItems()}</span>
              <span className="text-2xl font-bold text-blue-600">Total: ${getTotalPrice()}</span>
            </div>
            
            <button className="w-full bg-green-500 text-white py-3 px-6 rounded-md hover:bg-green-600 text-lg font-semibold">
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};