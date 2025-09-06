export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Item {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
}

export interface CartItem {
  id: string;
  userId: string;
  itemId: string;
  quantity: number;
  item?: Item;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}