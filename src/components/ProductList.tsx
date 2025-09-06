import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Item } from '../types';
import { itemsAPI, cartAPI } from '../services/api';
import { addToLocalCart } from '../utils/cart';
import { getToken } from '../utils/auth';

interface ProductListProps {
  onCartUpdate: () => void;
}

export const ProductList: React.FC<ProductListProps> = ({ onCartUpdate }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'name'
  });

  const categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports'];

  const fetchItems = async () => {
    try {
      setLoading(true);
      const filterObj: any = {};
      if (filters.category) filterObj.category = filters.category;
      if (filters.minPrice) filterObj.minPrice = parseFloat(filters.minPrice);
      if (filters.maxPrice) filterObj.maxPrice = parseFloat(filters.maxPrice);
      if (filters.sortBy) filterObj.sortBy = filters.sortBy;

      const data = await itemsAPI.getAll(filterObj);
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [filters]);

  const handleAddToCart = async (itemId: string) => {
    try {
      const isAuthenticated = !!getToken();
      
      if (isAuthenticated) {
        await cartAPI.add(itemId, 1);
      } else {
        addToLocalCart(itemId, 1);
      }
      
      onCartUpdate();
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Min Price</label>
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Max Price</label>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              placeholder="1000"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Sort By</label>
            <select
              name="sortBy"
              value={filters.sortBy}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            >
              <option value="name">Name</option>
              <option value="price">Price</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <img
              src={item.image || `https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg?auto=compress&cs=tinysrgb&w=300`}
              alt={item.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{item.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-blue-600">₹{item.price}</span>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{item.category}</span>
              </div>
              <button
                onClick={() => handleAddToCart(item.id)}
                className="w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 flex items-center justify-center space-x-2"
              >
                <Plus size={20} />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center text-gray-500 mt-12">
          <p className="text-xl">No products found</p>
          <p>Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
};