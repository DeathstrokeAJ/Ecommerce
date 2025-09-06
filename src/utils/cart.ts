const CART_KEY = 'ecommerce_cart';

export interface LocalCartItem {
  itemId: string;
  quantity: number;
}

export const getLocalCart = (): LocalCartItem[] => {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
};

export const setLocalCart = (cart: LocalCartItem[]): void => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const addToLocalCart = (itemId: string, quantity: number): void => {
  const cart = getLocalCart();
  const existingItem = cart.find(item => item.itemId === itemId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ itemId, quantity });
  }
  
  setLocalCart(cart);
};

export const updateLocalCartItem = (itemId: string, quantity: number): void => {
  const cart = getLocalCart();
  const itemIndex = cart.findIndex(item => item.itemId === itemId);
  
  if (itemIndex !== -1) {
    if (quantity <= 0) {
      cart.splice(itemIndex, 1);
    } else {
      cart[itemIndex].quantity = quantity;
    }
    setLocalCart(cart);
  }
};

export const removeFromLocalCart = (itemId: string): void => {
  const cart = getLocalCart();
  const filteredCart = cart.filter(item => item.itemId !== itemId);
  setLocalCart(filteredCart);
};

export const clearLocalCart = (): void => {
  localStorage.removeItem(CART_KEY);
};